import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, RefreshCw, ShieldCheck, Copy, Check, Download } from 'lucide-react';
import type { FullReconciliationOutput } from '../../engine/reconciler';
import type { FinancialDataset } from '../../types/finance';

interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  category?: 'BUNDLE' | 'CASH' | 'EXCEPTIONS' | 'TAX' | 'LOOKUP' | 'GENERAL';
  ledgerCitations?: string[];
}

interface SettlementQAViewProps {
  output: FullReconciliationOutput;
  activeDataset: FinancialDataset;
}

export const SettlementQAView: React.FC<SettlementQAViewProps> = ({ output, activeDataset }) => {
  const { metrics, allMatches, exceptionMatches } = output;
  const [query, setQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialMessages: Message[] = [
    {
      id: 'msg-init-1',
      sender: 'agent',
      text: `Welcome to OmniSettle AI. I am your autonomous Settlement & Reconciliation Assistant.
I have completed 3-way ledger cross-verification for **${metrics.totalRecords} synthetic records** from the **${activeDataset.name}** batch.

• **Reconciliation Match Rate:** ${metrics.reconciliationRate}% (${metrics.fastPathCount + metrics.agenticCount}/${metrics.totalRecords} matched)
• **Measured Accuracy:** ${metrics.classificationAccuracy}% against ground truth
• **Honest Exceptions:** ${metrics.exceptionCount} unresolvable records isolated
• **Verified Cash Position:** ₹${metrics.totalReconciledINR.toLocaleString('en-IN', { minimumFractionDigits: 2 })}

Select a preset question below or ask me any custom query regarding settlement bundles, net math, tax lines, or specific transaction IDs.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: 'GENERAL',
      ledgerCitations: ['SYS_INIT', activeDataset.id, `BATCH_SIZE_${metrics.totalRecords}`],
    },
  ];

  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const quickPrompts = [
    {
      label: '1-to-N Bundle Math Breakdown',
      prompt: 'Explain the settlement calculation for bundle #SET-BUNDLE-88412 and how zero delta was proved.',
    },
    {
      label: 'Honest Exception List',
      prompt: 'List all unresolved exceptions from this batch and the reason each could not be matched.',
    },
    {
      label: 'Verified Cash & Liquidity',
      prompt: 'What is our current verified bank cash position and pending gateway settlement float?',
    },
    {
      label: 'Tax-Line GST Matching',
      prompt: 'How does the 18% GST tax-line matcher verify Razorpay MDR fee deductions?',
    },
    {
      label: 'Lookup Specific Transaction',
      prompt: 'Look up the status and reasoning for transaction INV-SET-01 and BANK-SETTLE-88412.',
    },
    {
      label: 'Throughput & Match Rate',
      prompt: 'Report the engine throughput, execution division, and overall measured accuracy.',
    },
  ];

  const answerQuery = (userText: string): { responseText: string; citations: string[]; category: Message['category'] } => {
    const q = userText.toLowerCase().trim();
    const { bankTxns, gatewayRecords, erpInvoices } = activeDataset;

    // 1. Entity Search: Look for specific IDs
    const idRegex = /(INV-|RZP-|BANK-|ORD-|SET-)[A-Z0-9-]+/gi;
    const foundIds = userText.match(idRegex);

    if (foundIds && foundIds.length > 0) {
      const targetId = foundIds[0].toUpperCase();
      
      const match = allMatches.find(m => 
        m.id.includes(targetId) || 
        (m.bankRecordId && m.bankRecordId.includes(targetId)) ||
        m.gatewayRecordIds.some(g => g.includes(targetId)) ||
        m.erpInvoiceIds.some(e => e.includes(targetId))
      );

      if (match) {
        const gwStr = match.gatewayRecordIds.length > 0 ? match.gatewayRecordIds.map(id => '`' + id + '`').join(', ') : 'None';
        const erpStr = match.erpInvoiceIds.length > 0 ? match.erpInvoiceIds.map(id => '`' + id + '`').join(', ') : 'None';
        const traceStr = match.reasoningTrace.map(s => '> ' + s).join('\n');
        return {
          category: 'LOOKUP',
          citations: [match.id, match.bankRecordId || 'NO_BANK', ...match.erpInvoiceIds.slice(0, 3)],
          responseText: `### Ledger Lookup Result for \`${targetId}\`\n\n• **Match Vector ID:** \`${match.id}\`\n• **Reconciliation Status:** **${match.status}**\n• **Execution Handler:** \`${match.matchType}\`\n• **Reconciled Amount:** **₹${match.reconciledAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} INR**\n• **Discrepancy / Delta:** ₹${match.discrepancyAmount.toFixed(2)}\n• **Linked Bank Ref:** \`${match.bankRecordId || 'ABSENT_IN_BANK'}\`\n• **Linked Gateway Records:** ${gwStr}\n• **Linked ERP Invoices:** ${erpStr}\n\n**AI Reasoning Trace:**\n${traceStr}`,
        };
      }

      // If not in matches, look in raw data
      const bank = bankTxns.find(b => b.id.toUpperCase() === targetId);
      if (bank) {
        return { category: 'LOOKUP', citations: [bank.id], responseText: `Found Bank Transaction \`${bank.id}\` with amount ₹${bank.amount}. Type: ${bank.type}.` };
      }
      const gw = gatewayRecords.find(g => g.id.toUpperCase() === targetId);
      if (gw) {
        return { category: 'LOOKUP', citations: [gw.id], responseText: `Found Gateway Record \`${gw.id}\` with net amount ₹${gw.netAmount}. Status: ${gw.status}.` };
      }
      const erp = erpInvoices.find(e => e.id.toUpperCase() === targetId);
      if (erp) {
        return { category: 'LOOKUP', citations: [erp.id], responseText: `Found ERP Invoice \`${erp.id}\` with amount ₹${erp.amount}. Status: ${erp.status}.` };
      }
    }

    // 2. Bundle questions
    if (q.includes('bundle') || q.includes('1-to-n')) {
      const bundles = allMatches.filter(m => m.status === 'AGENTIC_BUNDLE_MATCHED');
      if (bundles.length > 0) {
        const bundle = bundles[0];
        const erpsInBundle = erpInvoices.filter(e => bundle.erpInvoiceIds.includes(e.id));
        const grossErp = erpsInBundle.reduce((sum, e) => sum + e.amount, 0);
        return {
          category: 'BUNDLE',
          citations: [bundle.id, bundle.bankRecordId || '', ...bundle.erpInvoiceIds],
          responseText: `### 1-to-N Bundled Settlement\n\nFound bundle **${bundle.id}** matching 1 Bank Payout against **${bundle.erpInvoiceIds.length}** ERP Invoices.\n\n1. **Gross ERP Volume:** ₹${grossErp.toLocaleString('en-IN', { minimumFractionDigits: 2 })}\n2. **Bank Credit:** ₹${bundle.reconciledAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}\n3. **Delta:** ₹${bundle.discrepancyAmount.toFixed(2)}\n\n**Reasoning:**\n${bundle.reasoningTrace.map(r => `> ${r}`).join('\n')}`
        };
      } else {
        return { category: 'BUNDLE', citations: [], responseText: 'No agentic bundles found in the current dataset.' };
      }
    }

    // 3. Exception questions
    if (q.includes('exception') || q.includes('unresolved') || q.includes('error')) {
      if (exceptionMatches.length === 0) {
        return { category: 'EXCEPTIONS', citations: [], responseText: 'No exceptions found! All records matched perfectly.' };
      }
      const formattedList = exceptionMatches
        .slice(0, 10)
        .map((exc, idx) => `**${idx + 1}. [${exc.status}] ID: \`${exc.id}\`**\n   • Discrepancy Amount: **₹${exc.discrepancyAmount.toFixed(2)}**\n   • Trace: *${exc.reasoningTrace[0] || 'Unknown'}*`)
        .join('\n\n');

      return {
        category: 'EXCEPTIONS',
        citations: exceptionMatches.map(e => e.id).slice(0, 5),
        responseText: `### Exception Report (${exceptionMatches.length} Unresolved Records)\n\n${formattedList}${exceptionMatches.length > 10 ? '\n\n*...and more.*' : ''}`
      };
    }

    // 4. Aggregate queries
    if (q.includes('how many') || q.includes('total') || q.includes('count')) {
      if (q.includes('cash') || q.includes('reconciled')) {
        return { category: 'CASH', citations: [], responseText: `Total reconciled cash is ₹${metrics.totalReconciledINR.toLocaleString('en-IN', { minimumFractionDigits: 2 })}.` };
      }
      if (q.includes('gst') || q.includes('tax')) {
        return { category: 'TAX', citations: [], responseText: `Total GST/Tax deducted is ₹${metrics.totalTaxDeductedINR.toLocaleString('en-IN', { minimumFractionDigits: 2 })}.` };
      }
      if (q.includes('fee') || q.includes('mdr')) {
        return { category: 'TAX', citations: [], responseText: `Total Gateway Fees (MDR) is ₹${metrics.totalGatewayFeesINR.toLocaleString('en-IN', { minimumFractionDigits: 2 })}.` };
      }
      return { category: 'GENERAL', citations: [], responseText: `I see ${bankTxns.length} bank transactions, ${gatewayRecords.length} gateway records, and ${erpInvoices.length} ERP invoices in this dataset. Total matches processed: ${allMatches.length}.` };
    }

    if (q.includes('reconciliation rate') || q.includes('match rate') || q.includes('throughput')) {
      return { category: 'GENERAL', citations: [], responseText: `The current reconciliation match rate is ${metrics.reconciliationRate}%.` };
    }
    
    if (q.includes('cash') || q.includes('liquidity') || q.includes('float')) {
       return { category: 'CASH', citations: [], responseText: `Total reconciled cash is ₹${metrics.totalReconciledINR.toLocaleString('en-IN', { minimumFractionDigits: 2 })}.` };
    }

    if (q.includes('gst') || q.includes('tax') || q.includes('fee') || q.includes('mdr')) {
       return { category: 'TAX', citations: [], responseText: `Total Gateway Fees (MDR) is ₹${metrics.totalGatewayFeesINR.toLocaleString('en-IN', { minimumFractionDigits: 2 })}, and Total Tax (GST) is ₹${metrics.totalTaxDeductedINR.toLocaleString('en-IN', { minimumFractionDigits: 2 })}.` };
    }

    // 5. Fallback
    return {
      category: 'GENERAL',
      citations: [],
      responseText: `I am not sure how to answer that specifically. You can ask me about:\n- **Specific IDs** (e.g., INV-001, BANK-123)\n- **Bundles** (e.g., "explain bundle math")\n- **Exceptions** (e.g., "list exceptions")\n- **Aggregates** (e.g., "total cash", "how many records", "match rate", "total tax")\n\nCurrent dataset has ${bankTxns.length} bank txns, ${gatewayRecords.length} gateway txns, and ${erpInvoices.length} ERP invoices.`
    };
  };

  const messageCounter = useRef(1);

  const handleSend = (textToSend?: string) => {
    const messageText = textToSend || query;
    if (!messageText.trim() || isThinking) return;

    messageCounter.current += 1;
    const userMsg: Message = {
      id: `usr-${messageCounter.current}`,
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setIsThinking(true);

    fetch('http://localhost:3001/api/resolve/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: messageText,
        context: {
          datasetName: activeDataset.name,
          totalRecords: metrics.totalRecords,
          reconciliationRate: metrics.reconciliationRate,
          totalReconciledINR: metrics.totalReconciledINR,
          totalGrossProcessedINR: metrics.totalGrossProcessedINR,
          totalTaxDeductedINR: metrics.totalTaxDeductedINR,
          totalGatewayFeesINR: metrics.totalGatewayFeesINR,
          exceptionCount: metrics.exceptionCount,
          humanReviewCount: metrics.humanReviewCount,
        },
      }),
    })
      .then(res => {
        if (!res.ok) throw new Error('API_FALLBACK');
        return res.json();
      })
      .then(data => {
        if (!data.responseText) throw new Error('EMPTY_RESPONSE');
        messageCounter.current += 1;
        const agentMsg: Message = {
          id: `agt-${messageCounter.current}`,
          sender: 'agent',
          text: data.responseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          category: 'GENERAL',
          ledgerCitations: [data.modelProvider || 'Gemini 1.5 Flash'],
        };
        setMessages(prev => [...prev, agentMsg]);
        setIsThinking(false);
      })
      .catch(() => {
        // Fallback to dynamic local ledger search
        const { responseText, citations, category } = answerQuery(messageText);
        messageCounter.current += 1;
        const agentMsg: Message = {
          id: `agt-${messageCounter.current}`,
          sender: 'agent',
          text: responseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          category,
          ledgerCitations: citations,
        };
        setMessages(prev => [...prev, agentMsg]);
        setIsThinking(false);
      });
  };

  const handleCopyMessage = (msg: Message) => {
    navigator.clipboard.writeText(msg.text);
    setCopiedMsgId(msg.id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleExportChat = () => {
    const transcript = messages.map(m => `[${m.timestamp}] ${m.sender.toUpperCase()}:\n${m.text}\n\n`).join('---\n\n');
    const blob = new Blob([transcript], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OmniSettle_QA_Transcript_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: 'calc(100vh - 6rem)' }}>
      {/* Header Bar */}
      <div
        className="terminal-panel"
        style={{
          padding: '1.15rem 1.5rem',
          background: 'linear-gradient(135deg, rgba(19, 26, 48, 0.75) 0%, rgba(8, 11, 22, 0.85) 100%)',
          border: '1px solid rgba(245, 208, 97, 0.25)',
          borderLeft: '4px solid #F5D061',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: 'rgba(245, 208, 97, 0.12)',
                border: '1px solid rgba(245, 208, 97, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#F5D061',
                boxShadow: '0 0 14px rgba(245, 208, 97, 0.25)',
              }}
            >
              <Bot size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.02em' }}>
                  SETTLEMENT Q&A AGENT
                </h2>
                <span
                  className="badge"
                  style={{
                    background: 'rgba(12, 140, 233, 0.1)',
                    border: '1px solid rgba(12, 140, 233, 0.35)',
                    color: '#38BDF8',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                  }}
                >
                  <ShieldCheck size={11} style={{ marginRight: '0.25rem' }} />
                  AUTONOMOUS AGENT
                </span>
              </div>
              <p style={{ color: '#94A3B8', fontSize: '0.82rem', marginTop: '0.2rem' }}>
                Natural language query assistant powered by live 3-way reconciliation ledger intelligence • Active: {activeDataset.name}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleExportChat}
              className="btn-terminal"
              style={{ fontSize: '0.76rem', padding: '0.4rem 0.85rem' }}
            >
              <Download size={13} /> EXPORT TRANSCRIPT
            </button>
            <button
              onClick={() => setMessages(initialMessages)}
              className="btn-terminal"
              style={{ fontSize: '0.76rem', padding: '0.4rem 0.85rem' }}
            >
              <RefreshCw size={13} /> RESET CHAT
            </button>
            <div
              className="font-mono"
              style={{
                fontSize: '0.76rem',
                color: '#CBD5E1',
                background: 'rgba(5, 7, 15, 0.85)',
                padding: '0.45rem 0.9rem',
                border: '1px solid rgba(229, 184, 105, 0.25)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <ShieldCheck size={13} color="#F5D061" />
              <span>RECORDS MOUNTED:</span>
              <strong style={{ color: '#F5D061' }}>{metrics.totalRecords}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Conversation Stream */}
      <div
        className="terminal-panel"
        style={{
          flex: 1,
          padding: '1.5rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          background: 'linear-gradient(180deg, rgba(12, 16, 30, 0.85) 0%, rgba(5, 7, 15, 0.94) 100%)',
          border: '1px solid rgba(229, 184, 105, 0.2)',
          borderRadius: '8px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
        }}
      >
        {messages.map(msg => {
          const isUser = msg.sender === 'user';
          const isCopied = copiedMsgId === msg.id;

          return (
            <div
              key={msg.id}
              style={{
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                maxWidth: isUser ? '75%' : '88%',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', alignSelf: isUser ? 'flex-end' : 'flex-start' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: isUser ? '#38BDF8' : '#F5D061', fontWeight: 800 }}>
                  {isUser ? 'CHIEF_CONTROLLER' : 'OMNISETTLE_AI_PROOFER'}
                </span>
                <span style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.2)' }}>•</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#64748B' }}>
                  {msg.timestamp}
                </span>
                {msg.category && (
                  <span
                    className="badge"
                    style={{
                      fontSize: '0.62rem',
                      padding: '0.1rem 0.4rem',
                      background: 'rgba(245, 208, 97, 0.1)',
                      border: '1px solid rgba(245, 208, 97, 0.3)',
                      color: '#F5D061',
                    }}
                  >
                    {msg.category}
                  </span>
                )}
                {!isUser && (
                  <button
                    onClick={() => handleCopyMessage(msg)}
                    title="Copy Answer"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: isCopied ? '#10B981' : '#64748B',
                      cursor: 'pointer',
                      padding: '0.1rem',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {isCopied ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                  </button>
                )}
              </div>

              <div
                style={{
                  background: isUser
                    ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.16) 0%, rgba(12, 16, 30, 0.9) 100%)'
                    : 'linear-gradient(135deg, rgba(245, 208, 97, 0.06) 0%, rgba(5, 7, 15, 0.95) 100%)',
                  border: isUser
                    ? '1px solid rgba(56, 189, 248, 0.4)'
                    : '1px solid rgba(245, 208, 97, 0.22)',
                  borderRadius: isUser ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
                  padding: '1.15rem 1.4rem',
                  fontSize: '0.88rem',
                  lineHeight: '1.65',
                  color: '#F8FAFC',
                  whiteSpace: 'pre-wrap',
                  boxShadow: '0 4px 18px rgba(0, 0, 0, 0.35)',
                }}
              >
                {msg.text}
              </div>

              {msg.ledgerCitations && msg.ledgerCitations.length > 0 && (
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.15rem' }}>
                  {msg.ledgerCitations.map((cite, i) => (
                    <span
                      key={i}
                      className="font-mono"
                      style={{
                        fontSize: '0.65rem',
                        color: '#94A3B8',
                        background: 'rgba(5, 7, 15, 0.8)',
                        border: '1px solid rgba(229, 184, 105, 0.18)',
                        padding: '0.12rem 0.45rem',
                        borderRadius: '3px',
                      }}
                    >
                      REF: {cite}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {isThinking && (
          <div
            style={{
              alignSelf: 'flex-start',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.85rem 1.25rem',
              background: 'rgba(5, 7, 15, 0.9)',
              border: '1px solid rgba(245, 208, 97, 0.25)',
              borderRadius: '8px',
            }}
          >
            <div style={{ width: '14px', height: '14px', border: '2px solid #F5D061', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <span className="font-mono" style={{ fontSize: '0.78rem', color: '#E5B869', fontWeight: 700 }}>
              INSPECTING_3WAY_LEDGER_VECTORS...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Query Chips */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp.prompt)}
            disabled={isThinking}
            className="btn-terminal"
            style={{
              fontSize: '0.76rem',
              whiteSpace: 'nowrap',
              padding: '0.45rem 0.85rem',
              background: 'rgba(12, 16, 30, 0.8)',
              borderColor: 'rgba(229, 184, 105, 0.2)',
              color: '#CBD5E1',
            }}
          >
            <Sparkles size={12} color="#F5D061" /> {qp.label}
          </button>
        ))}
      </div>

      {/* Interactive Input Box */}
      <div
        className="terminal-panel"
        style={{
          padding: '0.75rem 1rem',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'center',
          background: 'linear-gradient(135deg, rgba(12, 16, 30, 0.9) 0%, rgba(5, 7, 15, 0.95) 100%)',
          border: '1px solid rgba(245, 208, 97, 0.25)',
          borderRadius: '8px',
        }}
      >
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder="Ask anything about settlements, bundles, tax lines, or lookup transaction IDs..."
          style={{
            flex: 1,
            background: 'rgba(5, 7, 15, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
            color: '#FFFFFF',
            padding: '0.7rem 1.15rem',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.88rem',
            outline: 'none',
          }}
        />
        <button
          onClick={() => handleSend()}
          disabled={!query.trim() || isThinking}
          className="btn-terminal primary"
          style={{ padding: '0.7rem 1.35rem', fontSize: '0.82rem', fontWeight: 800 }}
        >
          <Send size={14} /> SEND QUERY
        </button>
      </div>
    </div>
  );
};
