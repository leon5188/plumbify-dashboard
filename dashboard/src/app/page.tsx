'use client';

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  MessageSquare,
  Users, 
  FileText, 
  TrendingUp, 
  Settings as SettingsIcon, 
  Search, 
  Bell,
  Wrench,
  Bot
} from 'lucide-react';

// Import sub-views
import DashboardView from '../components/DashboardView';
import ScheduleView from '../components/ScheduleView';
import ChatView from '../components/ChatView';
import TechsView from '../components/TechsView';
import CustomersView from '../components/CustomersView';
import InvoicesView from '../components/InvoicesView';
import ReportsView from '../components/ReportsView';
import SettingsView from '../components/SettingsView';
import AIAgentView from '../components/AIAgentView';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch central Dashboard Overview data once on mount
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch('/api/dashboard');
        const json = await res.json();
        if (json.success) {
          setData(json);
          setError(null);
        } else {
          setError(json.error || 'Failed to load GHL data');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching GHL data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Map tab name to component view
  const renderActiveView = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <DashboardView data={data} loading={loading} error={error} />;
      case 'Schedule':
        return <ScheduleView />;
      case 'Chat':
        return <ChatView />;
      case 'Techs':
        return <TechsView />;
      case 'Customers':
        return <CustomersView />;
      case 'Invoices':
        return <InvoicesView />;
      case 'Reports':
        return <ReportsView />;
      case 'AI Agent':
        return <AIAgentView />;
      case 'Settings':
        return <SettingsView />;
      default:
        return <DashboardView data={data} loading={loading} error={error} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      
      {/* 1. SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-card border-r border-card-border flex flex-col">
        {/* Brand Header */}
        <div className="h-20 flex items-center px-6 gap-3 border-b border-card-border">
          <div className="h-10 w-10 rounded-lg bg-cyan-glow flex items-center justify-center text-background shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Wrench className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-wider text-cyan-glow drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">PLUMBIFY</span>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {[
            { name: 'Dashboard', icon: LayoutDashboard },
            { name: 'Schedule', icon: Calendar },
            { name: 'Chat', icon: MessageSquare },
            { name: 'Techs', icon: Users },
            { name: 'Customers', icon: Users },
            { name: 'Invoices', icon: FileText },
            { name: 'Reports', icon: TrendingUp },
            { name: 'AI Agent', icon: Bot },
            { name: 'Settings', icon: SettingsIcon },
          ].map((tab, idx) => {
            const Icon = tab.icon;
            // Prevent duplicate key if tabs share same icons
            const uniqueKey = `${tab.name}-${idx}`;
            const isActive = activeTab === tab.name;
            return (
              <button
                key={uniqueKey}
                onClick={() => setActiveTab(tab.name)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-cyan-glow/15 text-cyan-glow border-l-4 border-cyan-glow shadow-[0_0_10px_rgba(6,182,212,0.05)]' 
                    : 'text-muted hover:bg-card-border/30 hover:text-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        
        {/* 2. TOP HEADER */}
        <header className="h-20 border-b border-card-border flex items-center justify-between px-8 bg-card">
          <div className="relative w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-muted" />
            </span>
            <input 
              type="text" 
              placeholder="Search bookings, invoices, chats..." 
              className="w-full h-10 bg-[#070b16] border border-card-border rounded-lg pl-10 pr-4 text-sm text-foreground placeholder-muted focus:outline-none focus:border-cyan-glow"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-muted hover:text-foreground">
              <Bell className="h-6 w-6" />
              <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-orange-glow rounded-full"></span>
            </button>
            
            <div className="flex items-center gap-3 border-l border-card-border pl-6">
              <div className="h-10 w-10 rounded-full bg-slate-700 overflow-hidden">
                <div className="h-full w-full bg-gradient-to-tr from-[#1A365D] to-cyan-glow flex items-center justify-center font-bold">
                  ST
                </div>
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold">Steve Thompson</p>
                <p className="text-xs text-muted">Owner / CEO</p>
              </div>
            </div>
          </div>
        </header>

        {/* 3. MAIN TAB CONTENT */}
        <div className="p-8">
          {renderActiveView()}
        </div>

      </main>
    </div>
  );
}
