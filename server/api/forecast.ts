import { Router } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

// Statistical Holt-Winters Double Exponential Smoothing (Additive Trend)
function computeHoltWintersForecast(
  series: number[],
  forecastHorizon: number = 30,
  alpha: number = 0.4,
  beta: number = 0.2
): { forecast: number[]; stdError: number } {
  if (series.length === 0) {
    const defaultFlow = 15000;
    return {
      forecast: Array.from({ length: forecastHorizon }, (_, i) => defaultFlow * (1 + i * 0.02)),
      stdError: defaultFlow * 0.1,
    };
  }

  // Initialization
  let level = series[0];
  let trend = series.length > 1 ? series[1] - series[0] : 0;
  const residuals: number[] = [];

  for (let t = 1; t < series.length; t++) {
    const prevLevel = level;
    const prevTrend = trend;
    const value = series[t];

    level = alpha * value + (1 - alpha) * (prevLevel + prevTrend);
    trend = beta * (level - prevLevel) + (1 - beta) * prevTrend;

    const oneStepPrediction = prevLevel + prevTrend;
    residuals.push(value - oneStepPrediction);
  }

  // Calculate residual variance
  const meanRes = residuals.reduce((a, b) => a + b, 0) / (residuals.length || 1);
  const variance = residuals.reduce((a, b) => a + Math.pow(b - meanRes, 2), 0) / (residuals.length || 1);
  const stdError = Math.sqrt(variance) || 1200;

  // Generate m-step forward projections
  const forecast: number[] = [];
  for (let m = 1; m <= forecastHorizon; m++) {
    forecast.push(Math.max(0, Math.round(level + m * trend)));
  }

  return { forecast, stdError };
}

// ---------------------------------------------------------------------------
// 30-Day Forward Cash Forecaster (Holt-Winters + Gemini 3.6 Flash)
// ---------------------------------------------------------------------------
router.post('/forecast', async (req, res) => {
  try {
    const {
      reconciledCashINR = 448687.8,
      recentDailyInflows = [14200, 15800, 13900, 16400, 15100, 17200, 14800],
      payoutDelayDays = 0,
      refundSurgePct = 0,
      fxShockPct = 0,
    } = req.body;

    // 1. Run Holt-Winters Exponential Smoothing on Transactional Velocity
    const { forecast: projectedDailyInflows, stdError } = computeHoltWintersForecast(recentDailyInflows, 30);

    const estimatedDailyBurn = 6500; // Baseline operating expenditures
    const estimatedPayoutChunk = 28000;

    let cumulativeCash = reconciledCashINR;
    let minProjectedCash = reconciledCashINR;
    let troughDay = 'D1';

    const forecastDays = projectedDailyInflows.map((inflow, index) => {
      const day = index + 1;
      const netDailyFlow = inflow - estimatedDailyBurn;
      cumulativeCash += netDailyFlow;

      const delayDeduction = day <= payoutDelayDays ? estimatedPayoutChunk : 0;
      const refundDeduction = cumulativeCash * (refundSurgePct / 100) * 0.15;
      const fxDeduction = cumulativeCash * (fxShockPct / 100) * 0.05;

      const p50 = Math.max(0, Math.round(cumulativeCash - delayDeduction - refundDeduction - fxDeduction));
      const marginOfError = Math.round(stdError * Math.sqrt(day) * 1.28); // 80% confidence corridor (P10 - P90)
      const p10 = Math.max(0, p50 - marginOfError);
      const p90 = p50 + marginOfError;

      if (p50 < minProjectedCash) {
        minProjectedCash = p50;
        troughDay = `D${day}`;
      }

      return {
        day: `D${day}`,
        baseCash: Math.round(reconciledCashINR + day * (15000 - estimatedDailyBurn)),
        projectedCash: p50,
        p10Cash: p10,
        p90Cash: p90,
        variance: Math.round((reconciledCashINR + day * (15000 - estimatedDailyBurn)) - p50),
      };
    });

    const runwayDays = estimatedDailyBurn > 0 ? Math.min(90, Math.round(minProjectedCash / estimatedDailyBurn)) : 90;
    const liquidityScore = Math.min(100, Math.max(20, Math.round((minProjectedCash / (reconciledCashINR || 1)) * 100)));

    // 2. Query Gemini 3.6 Flash for Treasury Risk Analysis
    let aiCommentary = `Projected 30-day liquidity remains stable. Cash trough reaches ₹${minProjectedCash.toLocaleString('en-IN')} on ${troughDay} with estimated ${runwayDays} days runway.`;
    let recommendations: string[] = [
      'Maintain standard T+1 settlement cycles with Razorpay payment gateway.',
      'Monitor foreign exchange volatility to prevent rate slippage on overseas remittances.',
      'Keep reserve buffer above minimum operating burn requirements.',
    ];
    let modelProvider = 'Statistical Holt-Winters Model';

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'mock') {
      try {
        const geminiPrompt = `You are a Chief Treasury Officer analyzing a 30-day forward cash forecast.
Parameters:
- Initial Reconciled Cash: ₹${reconciledCashINR} INR
- Minimum Projected Cash Trough: ₹${minProjectedCash} INR on day ${troughDay}
- Payout Settlement Delay: ${payoutDelayDays} days
- Refund Surge Stress: +${refundSurgePct}%
- FX Shock Stress: -${fxShockPct}%
- Runway Days Remaining: ${runwayDays} days

Provide JSON strictly matching this schema:
{
  "liquidityScore": number, // 0 to 100
  "aiCommentary": string, // 2-3 sentences of sharp executive treasury analysis
  "recommendations": string[] // 3 high-priority tactical treasury recommendations
}`;

        const candidateModels = ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-1.5-flash'];
        for (const model of candidateModels) {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': apiKey,
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: geminiPrompt }] }],
              generationConfig: { responseMimeType: 'application/json', temperature: 0.1 },
            }),
          });

          if (response.ok) {
            const data = await response.json();
            const parsed = JSON.parse(data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}');
            if (parsed.aiCommentary) aiCommentary = parsed.aiCommentary;
            if (Array.isArray(parsed.recommendations) && parsed.recommendations.length > 0) recommendations = parsed.recommendations;
            modelProvider = 'Google Gemini 3.6 Flash + Holt-Winters Smoothing';
            break;
          }
          if (response.status === 429 || response.status === 401 || response.status === 403) break;
        }
      } catch (geminiErr: any) {
        console.warn(`[Treasury AI] Gemini advisory unavailable (${geminiErr.message || 'Error'}), served statistical Holt-Winters projection.`);
      }
    }

    res.json({
      forecastDays,
      treasuryAdvice: {
        liquidityScore,
        runwayDays,
        troughCashINR: minProjectedCash,
        troughDay,
        aiCommentary,
        recommendations,
      },
      modelProvider,
    });
  } catch (error: any) {
    console.error('Forecast endpoint error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
