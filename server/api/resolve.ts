import { Router } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'MISSING_KEY',
});

const SYSTEM_PROMPT = `You are an expert AI financial controller responsible for 3-way reconciliation (Bank ↔ Gateway ↔ ERP).
You must output STRICTLY valid JSON. Do not include markdown formatting like \`\`\`json.
Your goal is to parse the input data, perform the required financial reasoning, and return the structured JSON schema requested.`;

// Bundle Decomposition Endpoint
router.post('/resolve/bundle', async (req, res) => {
  try {
    const { unmatchedInvoices, bankCredit, gatewaySettlement } = req.body;

    if (process.env.ANTHROPIC_API_KEY === 'mock' || !process.env.ANTHROPIC_API_KEY) {
      // Fallback for demo purposes if no API key is provided
      console.warn("ANTHROPIC_API_KEY not found. Using mock response.");
      return res.json({
        matchedInvoiceIds: ['INV-BUN-01', 'INV-BUN-02', 'INV-BUN-03', 'INV-BUN-04', 'INV-BUN-05', 'INV-BUN-06', 'INV-BUN-07', 'INV-BUN-08'],
        reconstructedAmount: 48272.8,
        steps: [
          '[MOCK FALLBACK] Computed Gross Volume.',
          'Math successfully verified by LLM fallback.'
        ],
        confidence: 99,
        withinTolerance: true,
        isMockMode: true
      });
    }

    const prompt = `
Task: Bundle Decomposition
Bank Credit: ${JSON.stringify(bankCredit)}
Gateway Settlement (if any): ${JSON.stringify(gatewaySettlement)}
Available Unmatched ERP Invoices: ${JSON.stringify(unmatchedInvoices)}

Instructions:
1. Identify which subset of ERP invoices sum together to form the gross amount before fees.
2. Apply standard fees (2% gateway fee, 18% GST on fee) and factor in any refunds mentioned.
3. Compare the reconstructed net amount to the Bank Credit amount.
4. Output JSON strictly matching this schema:
{
  "matchedInvoiceIds": string[], // array of ERP invoice IDs that make up the bundle
  "reconstructedAmount": number, // the final calculated net amount
  "steps": string[], // step-by-step reasoning trace
  "confidence": number, // 0-100 self-reported confidence
  "withinTolerance": boolean // true if reconstructedAmount matches bank amount within 1 INR
}
`;

    let resultJson = null;
    let attempts = 0;
    const conversation: any[] = [{ role: 'user', content: prompt }];

    while (attempts < 2 && !resultJson) {
      attempts++;
      try {
        const response = await anthropic.messages.create({
          model: 'claude-3-5-sonnet-20240620',
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: conversation,
          temperature: 0.1,
        });

        // @ts-ignore
        const text = response.content[0].text;
        
        // Strip markdown if the model included it despite instructions
        const cleanText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        resultJson = JSON.parse(cleanText);
      } catch (e: any) {
        console.error(`Attempt ${attempts} failed:`, e.message);
        if (attempts === 2) throw e;
        
        // Feed the failure back to the model
        conversation.push({ role: 'assistant', content: 'Here is the JSON:' }); // We don't have the raw text easily if it failed before text extraction, but let's assume it failed at JSON.parse
        conversation.push({ role: 'user', content: `Your previous response contained invalid JSON. Error: ${e.message}. Please correct it and return STRICTLY valid JSON matching the schema.` });
      }
    }

    res.json(resultJson);
  } catch (error: any) {
    console.error('Bundle resolution error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// FX / Fee Judgment Endpoint
router.post('/resolve/fx', async (req, res) => {
  try {
    const { bankTxn, gatewayRecord, erpInvoice } = req.body;

    if (process.env.ANTHROPIC_API_KEY === 'mock' || !process.env.ANTHROPIC_API_KEY) {
      return res.json({
        isMatch: true,
        steps: ['[MOCK FALLBACK] Calculated FX slippage is within acceptable ±0.5% tolerance band.'],
        confidence: 90,
        isMockMode: true
      });
    }

    const prompt = `
Task: FX / Fee Variance Judgment
Bank Credit: ${JSON.stringify(bankTxn)}
Gateway Settlement: ${JSON.stringify(gatewayRecord)}
ERP Invoice: ${JSON.stringify(erpInvoice)}

Instructions:
1. Determine if the variance between the expected amount and actual bank credit is due to acceptable FX float (±0.5% tolerance) or acceptable fee rounding.
2. If the variance is >0.5% or fee charge is >2.1% (base 2.0% + tolerance), it is NOT a match (exception).
3. Output JSON strictly matching this schema:
{
  "isMatch": boolean, // true if acceptable float, false if exception
  "steps": string[], // step-by-step reasoning trace explaining the variance
  "confidence": number // 0-100 self-reported confidence
}
`;

    let resultJson = null;
    let attempts = 0;
    const conversation: any[] = [{ role: 'user', content: prompt }];

    while (attempts < 2 && !resultJson) {
      attempts++;
      try {
        const response = await anthropic.messages.create({
          model: 'claude-3-5-sonnet-20240620',
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: conversation,
          temperature: 0.1,
        });

        // @ts-ignore
        const text = response.content[0].text;
        const cleanText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        resultJson = JSON.parse(cleanText);
      } catch (e: any) {
        console.error(`Attempt ${attempts} failed:`, e.message);
        if (attempts === 2) throw e;
        
        conversation.push({ role: 'assistant', content: '...' }); 
        conversation.push({ role: 'user', content: `Your previous response contained invalid JSON. Error: ${e.message}. Please correct it and return STRICTLY valid JSON.` });
      }
    }

    res.json(resultJson);
  } catch (error: any) {
    console.error('FX resolution error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
