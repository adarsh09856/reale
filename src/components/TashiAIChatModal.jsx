import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BhutanKnot } from './BhutanKnot';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  Home, 
  Car, 
  Calculator, 
  ShieldCheck, 
  Phone,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const TashiAIChatModal = () => {
  const { 
    tashiAIOpen, 
    setTashiAIOpen, 
    properties, 
    vehicles, 
    openDetail, 
    formatCurrency, 
    setLoanCalculatorOpen 
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      sender: 'bot',
      text: 'Kuzuzangpo La! 🙏 I am Tashi, your AI Real Estate & Automotive Concierge for the Kingdom of Bhutan. I can help you find verified properties, inspect 4x4 vehicles, or calculate Bank of Bhutan mortgage EMIs.',
      chips: [
        '🏡 3BHK Villas in Thimphu',
        '🚗 Toyota 4x4 under Nu. 30 Lakh',
        '📑 eSakor Lagthram Verification',
        '🧮 Bank of Bhutan Loan Calculator'
      ]
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg = { id: `user-${Date.now()}`, sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = {};
      const q = query.toLowerCase();

      if (q.includes('3bhk') || q.includes('villa') || q.includes('thimphu')) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: 'Here are the top Lagthram-verified villas in Thimphu matching your request:',
          recommendedItems: properties.filter(p => p.location.includes('Thimphu')).slice(0, 2),
          type: 'property'
        };
      } else if (q.includes('toyota') || q.includes('hilux') || q.includes('prado') || q.includes('vehicle') || q.includes('car')) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: 'Found quality 4x4 vehicles with authenticated RSTA fitness records:',
          recommendedItems: vehicles.slice(0, 2),
          type: 'vehicle'
        };
      } else if (q.includes('loan') || q.includes('emi') || q.includes('bank') || q.includes('mortgage') || q.includes('bob')) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: 'Bank of Bhutan (BoB) offers housing loans starting at 8.5% p.a. for up to 20-30 years tenure. Would you like to open the Multi-Bank Loan Calculator to check exact monthly EMIs?',
          actionBtn: {
            label: '🧮 Open Bank of Bhutan Loan Calculator',
            action: () => setLoanCalculatorOpen(true)
          }
        };
      } else if (q.includes('lagthram') || q.includes('esakor') || q.includes('legal') || q.includes('verify')) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: 'Every listing on Jigme Real Estate undergoes 3-step legal title verification with the National Land Commission (eSakor database), ensuring clear boundaries, single ownership thram, and zero encumbrances.'
        };
      } else {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `I have searched our Bhutan marketplace for "${query}". You can browse our verified listings or contact our licensed brokers for personalized site tours.`,
          recommendedItems: properties.slice(0, 2),
          type: 'property'
        };
      }

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <>
      {/* Floating Tashi AI Circular Bubble Trigger */}
      <button
        onClick={() => setTashiAIOpen(true)}
        className="fixed bottom-5 sm:bottom-6 left-5 sm:left-6 z-40 group w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#0f172a] via-slate-900 to-[#1e293b] text-amber-400 p-2.5 shadow-2xl shadow-black/40 border-2 border-amber-400/80 hover:border-amber-300 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer animate-in fade-in"
        aria-label="Ask Tashi AI Concierge"
        title="Ask Tashi AI Concierge"
      >
        <div className="w-full h-full flex items-center justify-center group-hover:rotate-12 transition-transform">
          <BhutanKnot className="w-full h-full" color="#f59e0b" secondaryColor="#ef4444" />
        </div>
        
        {/* Pulsing Online Indicator Dot */}
        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900 shadow-sm flex items-center justify-center">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
        </span>

        {/* Hover Tooltip */}
        <span className="hidden sm:group-hover:flex items-center gap-1.5 absolute left-full ml-3 px-3 py-1.5 bg-slate-900/95 text-amber-300 font-bold text-xs rounded-xl shadow-xl whitespace-nowrap border border-amber-400/40 backdrop-blur-md animate-in fade-in slide-in-from-left-2 pointer-events-none">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Ask Tashi AI</span>
        </span>
      </button>

      {/* AI Chat Modal Dialog */}
      {tashiAIOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-3xl max-w-lg w-full h-[600px] max-h-[92vh] shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Top AI Bar */}
            <div className="bg-[#0f172a] text-white p-4 flex items-center justify-between border-b border-amber-500/30 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center p-1.5">
                  <BhutanKnot className="w-full h-full" color="#f59e0b" secondaryColor="#ef4444" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-base text-white">Tashi AI Concierge</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      Online 🇧🇹
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-400">Kingdom of Bhutan Real Estate & Vehicle Advisory</p>
                </div>
              </div>

              <button
                onClick={() => setTashiAIOpen(false)}
                className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-stone-50 text-xs">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-3.5 space-y-2.5 ${
                    msg.sender === 'user' 
                      ? 'bg-[#9e1b27] text-white rounded-br-none shadow-md' 
                      : 'bg-white text-slate-800 border border-stone-200/90 rounded-bl-none shadow-sm'
                  }`}>
                    <div className="leading-relaxed whitespace-pre-wrap">{msg.text}</div>

                    {/* Chips if present */}
                    {msg.chips && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.chips.map((chip, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(chip.replace(/^[^\w\s]+/, '').trim())}
                            className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-rose-50 hover:text-[#9e1b27] text-[11px] font-bold text-slate-700 transition-colors border border-stone-200 cursor-pointer"
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Recommended Cards if present */}
                    {msg.recommendedItems && (
                      <div className="space-y-2 pt-1">
                        {msg.recommendedItems.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => {
                              setTashiAIOpen(false);
                              openDetail(item, msg.type);
                            }}
                            className="p-2.5 rounded-xl bg-stone-50 hover:bg-rose-50/70 border border-stone-200 flex items-center justify-between cursor-pointer transition-all"
                          >
                            <div className="flex items-center gap-2.5">
                              <img src={item.image} alt="" className="w-12 h-10 rounded-lg object-cover" />
                              <div>
                                <h6 className="font-bold text-slate-900 text-xs truncate max-w-[150px]">{item.title}</h6>
                                <span className="text-[#9e1b27] font-extrabold text-[11px]">{formatCurrency(item.priceNu)}</span>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-400" />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action Button */}
                    {msg.actionBtn && (
                      <button
                        onClick={msg.actionBtn.action}
                        className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow transition-all cursor-pointer"
                      >
                        {msg.actionBtn.label}
                      </button>
                    )}

                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-stone-200 rounded-2xl p-3 text-slate-500 text-xs flex items-center gap-2 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-[#9e1b27] animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]"></span>
                    <span>Tashi is analyzing Bhutan listings...</span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-white border-t border-stone-200 flex items-center gap-2 flex-shrink-0"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about properties, vehicles, loan EMIs..."
                className="flex-1 px-4 py-2.5 rounded-full bg-stone-100 border border-stone-200 text-xs focus:outline-none focus:border-[#9e1b27] focus:bg-white transition-all"
              />
              <button
                type="submit"
                className="p-2.5 rounded-full bg-[#9e1b27] hover:bg-[#80131d] text-white shadow-md transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
        </div>
      )}
    </>
  );
};
