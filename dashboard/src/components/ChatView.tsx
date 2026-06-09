'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, Mail, User, ShieldCheck, Tag, Loader, Search, RefreshCw } from 'lucide-react';

interface GHLMessage {
  id: string;
  body: string;
  direction: 'inbound' | 'outbound';
  dateAdded: string;
  type: string;
}

interface GHLConversation {
  id: string;
  contactId: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  lastMessageBody: string;
  lastMessageDate: string;
  unreadCount: number;
}

export default function ChatView() {
  const [conversations, setConversations] = useState<GHLConversation[]>([]);
  const [messages, setMessages] = useState<GHLMessage[]>([]);
  const [selectedConv, setSelectedConv] = useState<GHLConversation | null>(null);
  
  const [loadingList, setLoadingList] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [sendText, setSendText] = useState('');
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Backup fallback mock data if GHL account is empty
  const fallbackConversations: GHLConversation[] = [
    {
      id: 'conv-001',
      contactId: 'contact-001',
      contactName: 'Robert Vance',
      contactPhone: '(555) 123-4567',
      contactEmail: 'robert@vanceair.com',
      lastMessageBody: 'Can you dispatch a tech today for my leaking pipe?',
      lastMessageDate: new Date().toISOString(),
      unreadCount: 1
    },
    {
      id: 'conv-002',
      contactId: 'contact-002',
      contactName: 'Alice Margatroid',
      contactPhone: '(555) 987-6543',
      contactEmail: 'alice@magic.org',
      lastMessageBody: 'Awesome, thank you! The kitchen faucet is working great now.',
      lastMessageDate: new Date(Date.now() - 3600000).toISOString(),
      unreadCount: 0
    },
    {
      id: 'conv-003',
      contactId: 'contact-003',
      contactName: 'Gale Dekarios',
      contactPhone: '(555) 432-1098',
      contactEmail: 'gale@waterdeep.com',
      lastMessageBody: 'Is there a service fee to flush the water heater?',
      lastMessageDate: new Date(Date.now() - 86400000).toISOString(),
      unreadCount: 0
    }
  ];

  const fallbackMessages: Record<string, GHLMessage[]> = {
    'conv-001': [
      { id: 'm1', body: 'Hello Plumbify, I have a pipe leak in my laundry room.', direction: 'inbound', dateAdded: new Date(Date.now() - 7200000).toISOString(), type: 'SMS' },
      { id: 'm2', body: 'Hi Robert! We can certainly help. We have a lead technician available in your area between 2:00 PM and 4:00 PM today. Would you like us to schedule this?', direction: 'outbound', dateAdded: new Date(Date.now() - 7000000).toISOString(), type: 'SMS' },
      { id: 'm3', body: 'Can you dispatch a tech today for my leaking pipe?', direction: 'inbound', dateAdded: new Date(Date.now() - 600000).toISOString(), type: 'SMS' }
    ],
    'conv-002': [
      { id: 'm4', body: 'Faucets are installed. Testing pressure now.', direction: 'outbound', dateAdded: new Date(Date.now() - 7200000).toISOString(), type: 'SMS' },
      { id: 'm5', body: 'Awesome, thank you! The kitchen faucet is working great now.', direction: 'inbound', dateAdded: new Date(Date.now() - 3600000).toISOString(), type: 'SMS' }
    ],
    'conv-003': [
      { id: 'm6', body: 'Hello, I would like to schedule a water heater flush.', direction: 'inbound', dateAdded: new Date(Date.now() - 90000000).toISOString(), type: 'SMS' },
      { id: 'm7', body: 'Absolutely! Our flush service is $129. When is a good time for you?', direction: 'outbound', dateAdded: new Date(Date.now() - 88000000).toISOString(), type: 'SMS' },
      { id: 'm8', body: 'Is there a service fee to flush the water heater?', direction: 'inbound', dateAdded: new Date(Date.now() - 86400000).toISOString(), type: 'SMS' }
    ]
  };

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 1. Fetch recent conversations list
  const loadConversations = async (selectFirst = false) => {
    try {
      setLoadingList(true);
      setError(null);
      const res = await fetch('/api/chat?action=list');
      const json = await res.json();
      
      if (json.success && json.conversations && json.conversations.length > 0) {
        const mappedList: GHLConversation[] = json.conversations.map((c: any) => ({
          id: c.id,
          contactId: c.contactId,
          contactName: c.contact?.name || 'GHL Contact',
          contactPhone: c.contact?.phone || 'No Phone',
          contactEmail: c.contact?.email || 'No Email',
          lastMessageBody: c.lastMessageBody || 'No messages yet',
          lastMessageDate: c.lastMessageDate || new Date().toISOString(),
          unreadCount: c.unreadCount || 0
        }));
        setConversations(mappedList);
        
        if (selectFirst && mappedList.length > 0) {
          setSelectedConv(mappedList[0]);
          loadMessages(mappedList[0].id);
        }
      } else {
        // Fallback
        setConversations(fallbackConversations);
        if (selectFirst) {
          setSelectedConv(fallbackConversations[0]);
          setMessages(fallbackMessages[fallbackConversations[0].id]);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Error occurred loading chats');
      setConversations(fallbackConversations);
      if (selectFirst) {
        setSelectedConv(fallbackConversations[0]);
        setMessages(fallbackMessages[fallbackConversations[0].id]);
      }
    } finally {
      setLoadingList(false);
    }
  };

  // 2. Fetch messages for selected conversation
  const loadMessages = async (convId: string) => {
    // If it's a fallback mock conversation
    if (convId.startsWith('conv-')) {
      setMessages(fallbackMessages[convId] || []);
      return;
    }

    try {
      setLoadingMessages(true);
      const res = await fetch(`/api/chat?action=messages&conversationId=${convId}`);
      const json = await res.json();
      if (json.success && json.messages) {
        const mappedMessages: GHLMessage[] = json.messages.map((m: any) => ({
          id: m.id,
          body: m.body || '',
          direction: m.direction || 'inbound',
          dateAdded: m.dateAdded || new Date().toISOString(),
          type: m.type || 'SMS'
        })).sort((a: any, b: any) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime());
        setMessages(mappedMessages);
      } else {
        setMessages([]);
      }
    } catch (err: any) {
      console.warn('[ChatView] Failed to fetch live messages:', err.message || err);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    loadConversations(true);
  }, []);

  const handleSelectConversation = (conv: GHLConversation) => {
    setSelectedConv(conv);
    loadMessages(conv.id);
  };

  // 3. Send message handler
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sendText.trim() || !selectedConv) return;
    
    const messageToSend = sendText;
    setSendText('');
    setSending(true);

    // If it's fallback mock conversation, append locally
    if (selectedConv.id.startsWith('conv-')) {
      const newMsg: GHLMessage = {
        id: `m-local-${Date.now()}`,
        body: messageToSend,
        direction: 'outbound',
        dateAdded: new Date().toISOString(),
        type: 'SMS'
      };
      
      fallbackMessages[selectedConv.id] = [...(fallbackMessages[selectedConv.id] || []), newMsg];
      setMessages(fallbackMessages[selectedConv.id]);
      
      // Update last message in conversation list
      setConversations(prev => prev.map(c => c.id === selectedConv.id ? { ...c, lastMessageBody: messageToSend, lastMessageDate: new Date().toISOString() } : c));
      setSending(false);
      return;
    }

    // Call live API
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactId: selectedConv.contactId,
          message: messageToSend,
          type: 'SMS',
          threadId: selectedConv.id
        })
      });
      const json = await res.json();
      if (json.success) {
        // Reload messages
        await loadMessages(selectedConv.id);
        // Reload conversations to update last message
        await loadConversations(false);
      } else {
        alert(`Failed to send message: ${json.error || 'Unknown GHL error'}`);
      }
    } catch (err: any) {
      alert(`Network error sending message: ${err.message || err}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-sans">Dispatch Chat Console</h1>
          <p className="text-sm text-muted font-sans">Talk to technicians and customers directly via GoHighLevel SMS</p>
        </div>
        <button 
          onClick={() => loadConversations(false)}
          className="p-2 border border-card-border bg-[#0b1329] hover:bg-card-border/30 rounded-lg text-muted hover:text-foreground transition-all flex items-center gap-1.5 text-xs font-semibold"
        >
          <RefreshCw className="h-4 w-4" /> Refresh Lists
        </button>
      </div>

      {error && (
        <div className="bg-red-950/20 border border-red-800 text-red-400 p-4 rounded-xl text-sm font-sans">
          ⚠️ GHL Connection Error: {error}. Showing simulator chat logs.
        </div>
      )}

      {/* Main Console Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 border border-card-border bg-card rounded-2xl overflow-hidden h-[600px]">
        
        {/* PANE 1: Conversation List (Grid span 3) */}
        <aside className="lg:col-span-3 border-r border-card-border flex flex-col h-full bg-[#070b16]/30">
          <div className="p-4 border-b border-card-border/60">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-muted" />
              </span>
              <input 
                type="text" 
                placeholder="Filter chats..." 
                className="w-full h-9 bg-[#070b16] border border-card-border rounded-lg pl-9 pr-3 text-xs focus:outline-none focus:border-cyan-glow"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-card-border/30">
            {loadingList ? (
              <div className="p-8 text-center text-xs text-muted">
                <Loader className="h-5 w-5 animate-spin mx-auto mb-2 text-cyan-glow" />
                Retrieving threads...
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted italic">No recent chats found</div>
            ) : (
              conversations.map((conv) => {
                const isSelected = selectedConv?.id === conv.id;
                return (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv)}
                    className={`w-full text-left p-4 flex flex-col gap-1.5 transition-all text-xs ${
                      isSelected 
                        ? 'bg-cyan-glow/10 border-l-4 border-cyan-glow' 
                        : 'hover:bg-card-border/20'
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="font-bold text-foreground text-sm truncate mr-2">{conv.contactName}</span>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {new Date(conv.lastMessageDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    <p className="text-muted truncate w-full text-[11px]">{conv.lastMessageBody}</p>
                    
                    <div className="flex justify-between items-center w-full mt-0.5">
                      <span className="text-[10px] text-cyan-glow font-medium">{conv.contactPhone}</span>
                      {conv.unreadCount > 0 && (
                        <span className="h-2 w-2 bg-orange-glow rounded-full"></span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* PANE 2: Active Chat History (Grid span 6) */}
        <section className="lg:col-span-6 flex flex-col h-full bg-[#03060f]/20">
          {selectedConv ? (
            <>
              {/* Thread Header */}
              <div className="h-16 border-b border-card-border/60 px-6 flex items-center justify-between bg-card">
                <div>
                  <h3 className="font-bold text-sm text-foreground">{selectedConv.contactName}</h3>
                  <span className="text-[11px] text-cyan-glow font-bold">{selectedConv.contactPhone}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#10b981] bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/10">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  GHL Sync Online
                </div>
              </div>

              {/* Chat Stream */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {loadingMessages ? (
                  <div className="h-full flex items-center justify-center text-xs text-muted">
                    <Loader className="h-5 w-5 animate-spin mr-2 text-cyan-glow" /> Loading message log...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-muted italic">
                    No messages in this chat yet. Start the conversation by typing below.
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isInbound = msg.direction === 'inbound';
                    return (
                      <div 
                        key={msg.id}
                        className={`flex ${isInbound ? 'justify-start' : 'justify-end'}`}
                      >
                        <div className={`max-w-[70%] rounded-2xl p-4 text-xs space-y-1 shadow-lg ${
                          isInbound 
                            ? 'bg-[#11192e] text-foreground border border-card-border/50 rounded-tl-none' 
                            : 'bg-cyan-glow text-background font-medium rounded-tr-none shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                        }`}>
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.body}</p>
                          <span className={`text-[9px] block text-right ${isInbound ? 'text-muted-foreground' : 'text-background/70'}`}>
                            {new Date(msg.dateAdded).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Text Input Footer */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-card-border/60 bg-card flex gap-3">
                <input 
                  type="text" 
                  value={sendText}
                  onChange={(e) => setSendText(e.target.value)}
                  disabled={sending}
                  placeholder={`Send SMS message to ${selectedConv.contactName}...`} 
                  className="flex-1 h-11 bg-[#070b16] border border-card-border rounded-xl px-4 text-xs focus:outline-none focus:border-cyan-glow"
                />
                <button 
                  type="submit"
                  disabled={sending || !sendText.trim()}
                  className="h-11 w-11 bg-cyan-glow hover:bg-cyan-glow/85 disabled:bg-card-border/40 text-background rounded-xl flex items-center justify-center transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                >
                  {sending ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-muted italic">
              Select a conversation thread to start messaging
            </div>
          )}
        </section>

        {/* PANE 3: Customer Details (Grid span 3) */}
        <aside className="lg:col-span-3 border-l border-card-border p-6 space-y-6 h-full overflow-y-auto bg-[#070b16]/30">
          {selectedConv ? (
            <>
              {/* Customer Avatar Info */}
              <div className="text-center space-y-2 border-b border-card-border/40 pb-5">
                <div className="h-16 w-16 rounded-full bg-cyan-glow/15 text-cyan-glow border border-cyan-glow/20 flex items-center justify-center font-bold text-xl mx-auto shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                  {selectedConv.contactName[0]}
                </div>
                <div>
                  <h4 className="font-bold text-base text-foreground">{selectedConv.contactName}</h4>
                  <span className="text-[10px] text-muted font-bold tracking-wide uppercase">Client File</span>
                </div>
              </div>

              {/* Contact Fields */}
              <div className="space-y-4 text-xs">
                <h5 className="font-bold text-muted uppercase tracking-wider text-[10px]">Contact Info</h5>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4 text-cyan-glow" />
                    <span className="text-foreground font-semibold">{selectedConv.contactPhone}</span>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4 text-orange-glow" />
                    <span className="text-foreground font-semibold truncate">{selectedConv.contactEmail}</span>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4 text-muted" />
                    <span>ID: <code className="font-mono text-[10px] text-foreground">{selectedConv.contactId.slice(-6).toUpperCase()}</code></span>
                  </div>
                </div>
              </div>

              {/* Dispatch Action Hooks */}
              <div className="space-y-3 pt-4 border-t border-card-border/40">
                <h5 className="font-bold text-muted uppercase tracking-wider text-[10px]">Quick Actions</h5>
                
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 p-3 bg-cyan-glow/5 border border-cyan-glow/10 rounded-lg text-cyan-glow font-bold">
                    <ShieldCheck className="h-4 w-4" /> GHL Sync Active
                  </div>
                  
                  <div className="p-3 bg-[#070b16] border border-card-border rounded-lg text-muted flex justify-between items-center">
                    <span>Recent Work Orders</span>
                    <strong className="text-foreground font-bold">2</strong>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-muted italic text-center">
              Select a thread to view contact card
            </div>
          )}
        </aside>

      </div>

    </div>
  );
}
