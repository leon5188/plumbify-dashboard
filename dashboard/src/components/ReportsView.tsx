'use client';

import React from 'react';
import { TrendingUp, BarChart2, PieChart, Calendar, DollarSign, Percent, Wrench } from 'lucide-react';

export default function ReportsView() {
  // Mock data for weekly distribution
  const revenueHistory = [
    { month: 'Jan', value: 65000 },
    { month: 'Feb', value: 72000 },
    { month: 'Mar', value: 81000 },
    { month: 'Apr', value: 78000 },
    { month: 'May', value: 89000 },
    { month: 'Jun', value: 94000 }
  ];

  const categoryShare = [
    { name: 'Pipe Repair & Sewer', share: 45, color: '#06b6d4', glow: 'shadow-[0_0_8px_rgba(6,182,212,0.4)]' },
    { name: 'Water Heaters', share: 25, color: '#f97316', glow: 'shadow-[0_0_8px_rgba(249,115,22,0.4)]' },
    { name: 'Faucets & Fixtures', share: 18, color: '#10b981', glow: 'shadow-[0_0_8px_rgba(16,185,129,0.4)]' },
    { name: 'Emergency Dispatch', share: 12, color: '#ef4444', glow: 'shadow-[0_0_8px_rgba(239,68,68,0.4)]' }
  ];

  const maxRevenue = Math.max(...revenueHistory.map(r => r.value));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Business Reports & Analytics</h1>
          <p className="text-sm text-muted">Analyze month-to-date revenue growth, jobs, and conversion efficiency</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border border-card-border rounded-xl p-5 space-y-2">
          <span className="text-[10px] text-muted font-bold uppercase tracking-wider block">Lead-to-Job Rate</span>
          <div className="flex justify-between items-end">
            <h4 className="text-2xl font-extrabold">34.8%</h4>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">+2.4%</span>
          </div>
          <p className="text-[10px] text-muted">Conversion from GHL opportunities</p>
        </div>

        <div className="bg-card border border-card-border rounded-xl p-5 space-y-2">
          <span className="text-[10px] text-muted font-bold uppercase tracking-wider block">Avg Ticket Rev</span>
          <div className="flex justify-between items-end">
            <h4 className="text-2xl font-extrabold">$485</h4>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">+4.2%</span>
          </div>
          <p className="text-[10px] text-muted">Excluding recurring maintenance</p>
        </div>

        <div className="bg-card border border-card-border rounded-xl p-5 space-y-2">
          <span className="text-[10px] text-muted font-bold uppercase tracking-wider block">First-Time Fix Rate</span>
          <div className="flex justify-between items-end">
            <h4 className="text-2xl font-extrabold">92.4%</h4>
            <span className="text-xs font-semibold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">-0.8%</span>
          </div>
          <p className="text-[10px] text-muted">Target operational goal is 95%</p>
        </div>

        <div className="bg-card border border-card-border rounded-xl p-5 space-y-2">
          <span className="text-[10px] text-muted font-bold uppercase tracking-wider block">SLA Compliance</span>
          <div className="flex justify-between items-end">
            <h4 className="text-2xl font-extrabold">96.5%</h4>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">+1.1%</span>
          </div>
          <p className="text-[10px] text-muted">Within 2-hour dispatch window</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Growth chart (Grid Span 2) */}
        <div className="bg-card border border-card-border rounded-xl p-6 lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-base flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-cyan-glow" /> Monthly Revenue Trend (2026)
            </h3>
            <span className="text-xs text-muted">Last 6 Months</span>
          </div>

          <div className="h-64 flex items-end justify-between gap-4 pt-6 px-2">
            {revenueHistory.map((h, i) => {
              const heightPct = (h.value / maxRevenue) * 80;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-3 h-full justify-end">
                  <div className="w-full relative group flex flex-col items-center justify-end h-full">
                    {/* Tooltip on hover */}
                    <span className="absolute -top-6 bg-card-border px-2 py-0.5 rounded text-[10px] font-bold text-foreground opacity-0 group-hover:opacity-100 transition-opacity border border-card-border">
                      ${h.value.toLocaleString()}
                    </span>
                    <div 
                      style={{ height: `${heightPct}%` }}
                      className="w-full bg-cyan-glow rounded-t-lg transition-all duration-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:brightness-110"
                    ></div>
                  </div>
                  <span className="text-xs font-bold text-muted">{h.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Share Distribution */}
        <div className="bg-card border border-card-border rounded-xl p-6 space-y-6">
          <h3 className="font-bold text-base flex items-center gap-2">
            <PieChart className="h-5 w-5 text-orange-glow" /> Category Revenue Share
          </h3>

          <div className="space-y-4 pt-2">
            {categoryShare.map((cat, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-muted flex items-center gap-2">
                    <span 
                      style={{ backgroundColor: cat.color }} 
                      className={`h-2.5 w-2.5 rounded-full ${cat.glow}`}
                    ></span>
                    {cat.name}
                  </span>
                  <span className="text-foreground">{cat.share}%</span>
                </div>
                <div className="h-2 w-full bg-[#070b16] rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${cat.share}%`, backgroundColor: cat.color }} 
                    className="h-full rounded-full"
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-card-border/40 pt-4 text-[10px] text-muted space-y-1">
            <p><strong>Note:</strong> Data is synchronized directly from GoHighLevel closed-won opportunities and tagged customer classifications.</p>
          </div>
        </div>

      </div>

    </div>
  );
}
