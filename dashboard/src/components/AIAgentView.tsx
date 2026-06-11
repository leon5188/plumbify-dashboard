'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Languages, 
  Volume2, 
  Send, 
  Database, 
  Sparkles, 
  PhoneCall, 
  TrendingUp, 
  Check, 
  Clock, 
  UploadCloud,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

interface Message {
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
}

export default function AIAgentView() {
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'es' | 'zh' | 'fr'>('en');
  const [activeVoice, setActiveVoice] = useState('dave');
  const [isTyping, setIsTyping] = useState(false);
  const [inputText, setInputText] = useState('');
  const [knowledgeText, setKnowledgeText] = useState(
    `Plumbify Services Pricing Sheet 2026:\n- Drain Cleaning: $149 (includes free camera inspection)\n- Water Heater Replacement: $1,200 - $3,500 (flat-rate quotes based on tank size)\n- Emergency Callout Fee: $99 (waived if work is performed)\n- Leak Detection: $199\n- Operating Area: Los Angeles County, Orange County, San Diego County.\n- Warranty: 1-year parts and labor on all service calls.`
  );
  const [isSaved, setIsSaved] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'agent',
      text: "Hi! I'm Plumbify's AI Sales Agent. I represent your shop 24/7, answer customer inquiries in multiple languages, and book calls directly into your calendar. Type a question below to test how I handle leads!",
      timestamp: 'Just now'
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Mock response mapping based on keywords and selected language
  const getMockResponse = (input: string, lang: 'en' | 'es' | 'zh' | 'fr'): string => {
    const text = input.toLowerCase();
    
    if (lang === 'es') {
      if (text.includes('agua') || text.includes('calentador') || text.includes('termo')) {
        return "Hola, sí. Realizamos reemplazos de calentadores de agua en su área. Los precios van desde $1,200 según el tamaño del tanque. ¿Tiene algún goteo actualmente o le gustaría agendar una inspección para mañana?";
      }
      if (text.includes('precio') || text.includes('costo') || text.includes('cuanto')) {
        return "Nuestros precios son fijos y transparentes. Por ejemplo, la limpieza de drenajes cuesta $149 e incluye inspección con cámara. La tarifa de llamada de emergencia es de $99. ¿Qué servicio necesita cotizar?";
      }
      if (text.includes('disponible') || text.includes('hora') || text.includes('agendar')) {
        return "Tengo horarios disponibles para mañana por la mañana de 9 AM a 12 PM, o por la tarde de 2 PM a 5 PM. ¿Cuál prefiere para que lo agende en nuestro calendario?";
      }
      return "Entendido. Para ayudarle mejor con su problema de plomería, ¿podría decirme en qué ciudad se encuentra y cuál es la emergencia?";
    }

    if (lang === 'zh') {
      if (text.includes('热水器') || text.includes('漏水') || text.includes('没有热水')) {
        return "您好！我们提供热水器维修与更换服务。水箱更换费用一般在 $1,200 起（包含上门）。请问您现在的热水器是漏水还是完全不制热了？我可以帮您安排师傅明天上门检测。";
      }
      if (text.includes('价格') || text.includes('多少钱') || text.includes('收费')) {
        return "我们的收费是公开透明的。例如：下水道疏通收费 $149（附赠免费管道内窥镜检测），紧急上门服务费为 $99。请问您需要解决什么类型的管道问题？";
      }
      if (text.includes('预约') || text.includes('明天') || text.includes('时间')) {
        return "明天我们还有空档！上午 9:00 - 中午 12:00，或者下午 2:00 - 5:00。请问哪个时间段更方便您？我可以直接在系统里帮您登记。";
      }
      return "收到。为了更好地帮您派单，请问您所在的区域（城市）是哪里？遇到了什么管道故障？";
    }

    if (lang === 'fr') {
      if (text.includes('chauffe-eau') || text.includes('fuite')) {
        return "Bonjour ! Nous remplaçons les chauffe-eau à partir de 1 200 $ selon la capacité du réservoir. Rencontrez-vous une fuite d'eau chaude actuellement ? Je peux planifier un technicien pour demain.";
      }
      return "Bonjour ! Plumbify vous propose des tarifs transparents : débouchage de canalisation à 149 $ (inspection caméra incluse). Dans quelle ville êtes-vous situé pour que je vérifie la disponibilité d'un technicien ?";
    }

    // Default English Responses
    if (text.includes('water heater') || text.includes('leak') || text.includes('hot water')) {
      return "We definitely handle water heater replacements and repairs. Our flat-rate replacements typically start around $1,200 depending on the tank size. Are you experiencing an active leak right now, or would you like me to book a tech to take a look tomorrow?";
    }
    if (text.includes('price') || text.includes('cost') || text.includes('how much')) {
      return "We believe in total transparency. For instance, our drain cleaning is a flat rate of $149 (which includes a free camera scan), and our emergency callout fee is $99. What kind of plumbing issue are we dealing with?";
    }
    if (text.includes('available') || text.includes('schedule') || text.includes('book') || text.includes('tomorrow')) {
      return "I have open slots tomorrow between 9 AM and 12 PM, or in the afternoon between 2 PM and 5 PM. Which slot works best for your schedule to lock this in?";
    }
    
    return "Got it. To help get this sorted out, what city is your property located in, and could you describe the plumbing issue you're experiencing?";
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: Message = {
      sender: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const responseText = getMockResponse(userMsg.text, selectedLanguage);
      const agentMsg: Message = {
        sender: 'agent',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, agentMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleSaveKnowledge = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-card-border pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Bot className="h-8 w-8 text-cyan-glow drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
            AI Sales Agent Command Center
          </h1>
          <p className="text-muted text-sm mt-1">
            Configure, train, and test your 24/7 multilingual sales and booking agent.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="h-3.5 w-3.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Agent Status: Active & Listening</span>
        </div>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Conversations Handled', value: '1,482', icon: PhoneCall, change: '+18% this month', color: 'text-cyan-glow' },
          { label: 'Demos Conducted', value: '412', icon: Sparkles, change: '+24.5% conversion', color: 'text-purple-glow' },
          { label: 'Booking Conversion', value: '25.8%', icon: TrendingUp, change: 'Industry Avg: 11%', color: 'text-emerald-400' },
          { label: 'Estimated Revenue Saved', value: '$18,540', icon: Database, change: 'From missed calls', color: 'text-orange-glow' }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-card border border-card-border p-6 rounded-2xl flex items-center justify-between hover:border-cyan-glow/30 transition-all">
              <div>
                <p className="text-xs text-muted font-medium uppercase tracking-wider">{item.label}</p>
                <h3 className={`text-2xl font-bold mt-2 ${item.color}`}>{item.value}</h3>
                <p className="text-xs text-muted-dark mt-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {item.change}
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-card-border/50 border border-card-border flex items-center justify-center">
                <Icon className={`h-6 w-6 ${item.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* COMMAND CENTER LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: CONFIGURATION & TRAINING (5 cols) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* 1. Language Selector */}
          <div className="bg-card border border-card-border p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Languages className="h-5 w-5 text-cyan-glow" />
              Multilingual Demo Setup
            </h3>
            <p className="text-xs text-muted">
              Select languages your AI Agent should handle during the product demo.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { id: 'en', name: 'English (US)', flag: '🇺🇸' },
                { id: 'es', name: 'Spanish (ES)', flag: '🇪🇸' },
                { id: 'zh', name: 'Chinese (CN)', flag: '🇨🇳' },
                { id: 'fr', name: 'French (FR)', flag: '🇫🇷' },
              ].map((lang) => {
                const isActive = selectedLanguage === lang.id;
                return (
                  <button
                    key={lang.id}
                    onClick={() => setSelectedLanguage(lang.id as any)}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-semibold transition-all ${
                      isActive 
                        ? 'bg-cyan-glow/10 border-cyan-glow text-cyan-glow shadow-[0_0_10px_rgba(6,182,212,0.1)]' 
                        : 'bg-card border-card-border text-muted hover:text-white hover:border-muted'
                    }`}
                  >
                    <span className="text-base">{lang.flag}</span>
                    {lang.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Voice Selector */}
          <div className="bg-card border border-card-border p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Volume2 className="h-5 w-5 text-purple-glow" />
              Agent Voice Personality
            </h3>
            <p className="text-xs text-muted">
              Select the audio voice for incoming telephony presentations.
            </p>
            <div className="space-y-3 pt-2">
              {[
                { id: 'dave', name: 'Dave (Technician Tone - US English)', desc: 'Friendly, expert plumber voice.' },
                { id: 'sofia', name: 'Sofia (Office Manager - US Spanish)', desc: 'Professional, welcoming receptionist.' },
                { id: 'emma', name: 'Emma (Polite Assistant - UK English)', desc: 'Clear, direct, and structured tone.' }
              ].map((voice) => {
                const isActive = activeVoice === voice.id;
                return (
                  <button
                    key={voice.id}
                    onClick={() => setActiveVoice(voice.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                      isActive 
                        ? 'bg-purple-glow/10 border-purple-glow text-purple-glow shadow-[0_0_10px_rgba(168,85,247,0.1)]' 
                        : 'bg-card border-card-border text-muted hover:text-white'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold">{voice.name}</h4>
                      <p className="text-[10px] text-muted-dark mt-1">{voice.desc}</p>
                    </div>
                    {isActive ? (
                      <div className="h-6 w-6 rounded-full bg-purple-glow flex items-center justify-center text-white">
                        <Check className="h-4.5 w-4.5" />
                      </div>
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-card-border"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Knowledge Base Trainer */}
          <div className="bg-card border border-card-border p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="h-5 w-5 text-orange-glow" />
              AI Agent Knowledge Training
            </h3>
            <p className="text-xs text-muted">
              Paste your plumbing pricing, locations, and warranties so the AI can reference them.
            </p>
            <div className="space-y-3 pt-2">
              <textarea
                value={knowledgeText}
                onChange={(e) => setKnowledgeText(e.target.value)}
                className="w-full h-32 bg-[#070b16] border border-card-border rounded-xl p-3 text-xs text-slate-300 font-mono focus:outline-none focus:border-orange-glow"
              />
              <div className="flex gap-3">
                <button 
                  onClick={handleSaveKnowledge}
                  className="flex-1 py-3 bg-orange-glow text-background font-bold text-xs rounded-xl hover:bg-orange-glow/90 transition-all flex items-center justify-center gap-2"
                >
                  {isSaved ? (
                    <>
                      <Check className="h-4 w-4" /> Trained successfully!
                    </>
                  ) : (
                    <>
                      <UploadCloud className="h-4 w-4" /> Save & Train Agent
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: INTERACTIVE SIMULATOR (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-card border border-card-border rounded-2xl overflow-hidden h-[620px] shadow-lg">
          {/* Chat Header */}
          <div className="h-16 border-b border-card-border px-6 flex items-center justify-between bg-card-border/25">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-cyan-glow/15 flex items-center justify-center text-cyan-glow border border-cyan-glow/20">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Live AI Agent Sandbox</h4>
                <p className="text-[10px] text-muted">Real-time chat testing sandbox</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-[#070b16] border border-card-border rounded-lg px-3 py-1.5 text-[10px] font-semibold text-slate-300">
              <Languages className="h-3.5 w-3.5 text-cyan-glow" />
              Language: <span className="uppercase text-cyan-glow">{selectedLanguage}</span>
            </div>
          </div>

          {/* Chat Messages viewport */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 font-sans bg-[#070b16]/30">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex flex-col max-w-[80%] ${
                  msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                }`}
              >
                <div 
                  className={`p-4 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-cyan-glow text-background font-medium rounded-tr-none' 
                      : 'bg-card border border-card-border text-slate-200 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-muted-dark mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 rounded-xl bg-card border border-card-border w-16 mr-auto rounded-tl-none">
                <div className="h-1.5 w-1.5 rounded-full bg-cyan-glow animate-bounce"></div>
                <div className="h-1.5 w-1.5 rounded-full bg-cyan-glow animate-bounce [animation-delay:0.2s]"></div>
                <div className="h-1.5 w-1.5 rounded-full bg-cyan-glow animate-bounce [animation-delay:0.4s]"></div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Warning notice about mock data */}
          <div className="px-6 py-2 border-t border-card-border bg-[#070b16]/50 flex items-center gap-2 text-[10px] text-muted">
            <AlertCircle className="h-3.5 w-3.5 text-orange-glow shrink-0" />
            <span>This simulator shows the AI answering based on your custom trained knowledge sheet.</span>
          </div>

          {/* Chat Input form */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-card-border bg-card flex gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                selectedLanguage === 'es' ? 'Pregúntame sobre fugas, precios o reservas...' :
                selectedLanguage === 'zh' ? '询问热水器、价格或预约时间...' :
                selectedLanguage === 'fr' ? 'Posez vos questions sur les fuites...' :
                'Ask me about leaks, hot water, pricing, or bookings...'
              }
              className="flex-1 h-12 bg-[#070b16] border border-card-border rounded-xl px-4 text-xs text-white placeholder-muted focus:outline-none focus:border-cyan-glow"
            />
            <button
              type="submit"
              className="h-12 w-12 rounded-xl bg-cyan-glow hover:bg-cyan-glow/90 transition-all flex items-center justify-center text-background shadow-[0_0_15px_rgba(6,182,212,0.2)]"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
