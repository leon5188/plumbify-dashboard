'use client';

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  FileText, 
  TrendingUp, 
  Settings, 
  Search, 
  Bell, 
  DollarSign, 
  MapPin, 
  Truck, 
  Star, 
  Clock, 
  CheckCircle,
  Wrench
} from 'lucide-react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch('/api/dashboard');
        const json = await res.json();
        if (json.success) {
          setData(json);
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

  // Mock data for technician leaderboard
  const technicians = [
    { rank: 1, name: 'Liam B.', mtdRev: '$14,500', jobs: 30, rating: 5, status: 'Online' },
    { rank: 2, name: 'Mike C.', mtdRev: '$13,200', jobs: 21, rating: 5, status: 'Online' },
    { rank: 3, name: 'Dave P.', mtdRev: '$10,000', jobs: 26, rating: 5, status: 'Online' },
    { rank: 4, name: 'Sarah L.', mtdRev: '$9,500', jobs: 15, rating: 5, status: 'Online' },
    { rank: 5, name: 'Ben H.', mtdRev: '$6,600', jobs: 8, rating: 5, status: 'Online' }
  ];

  // Mock data for active jobs table
  const activeJobs = [
    { id: 'T-04', customer: 'Anco Mand St, Plombng, CA 23323', status: 'Online' },
    { id: 'T-06', customer: 'Cexxe Conner St Address, NA 30503', status: 'Online' },
    { id: 'T-07', customer: '150 Balitens St, Mordonr, IL 33033', status: 'Moving' },
    { id: 'T-11', customer: '168 Semebno Br, Onoricn, IL 25001', status: 'Moving' }
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      
      {/* 1. SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-card border-r border-card-border flex flex-col">
        {/* Brand Header */}
        <div className="h-20 flex items-center px-6 gap-3 border-b border-card-border">
          <div className="h-10 w-10 rounded-lg bg-cyan-glow flex items-center justify-center text-background">
            <Wrench className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-wider text-cyan-glow">PLUMBIFY</span>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {[
            { name: 'Dashboard', icon: LayoutDashboard },
            { name: 'Schedule', icon: Calendar },
            { name: 'Techs', icon: Users },
            { name: 'Customers', icon: Users },
            { name: 'Invoices', icon: FileText },
            { name: 'Reports', icon: TrendingUp },
            { name: 'Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.name;
            return (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-cyan-glow/15 text-cyan-glow border-l-4 border-cyan-glow' 
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
              placeholder="Search..." 
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

        {/* 3. MAIN DASHBOARD CONTENT */}
        <div className="p-8 space-y-6">
          
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted">Real-time Operations & Financial Overview</p>
          </div>

          {/* TIER 1: FINANCIAL KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* KPI Card A: MTD Revenue */}
            <div className="bg-card border border-card-border rounded-xl p-6 relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-muted tracking-wider uppercase">MTD Revenue</span>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">+12%</span>
              </div>
              <h3 className="text-3xl font-extrabold text-foreground mb-4">
                {loading ? '...' : (data?.financials?.mtdRevenue || '$84,200')}
              </h3>
              {/* glowing line graph vector */}
              <div className="h-14 w-full">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 300 60" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="cyan-glow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path 
                    d="M 0 45 Q 30 25 60 38 T 120 20 T 180 35 T 240 10 T 300 25 L 300 60 L 0 60 Z" 
                    fill="url(#cyan-glow)"
                  />
                  <path 
                    d="M 0 45 Q 30 25 60 38 T 120 20 T 180 35 T 240 10 T 300 25" 
                    fill="none" 
                    stroke="#06b6d4" 
                    strokeWidth="3"
                    className="drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                  />
                </svg>
              </div>
            </div>

            {/* KPI Card B: Average Ticket Size */}
            <div className="bg-card border border-card-border rounded-xl p-6 relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-muted tracking-wider uppercase">Average Ticket Size</span>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">+8%</span>
              </div>
              <h3 className="text-3xl font-extrabold text-foreground mb-4">
                {loading ? '...' : (data?.financials?.avgTicket || '$425')}
              </h3>
              {/* glowing bar graph vector */}
              <div className="h-14 w-full flex items-end justify-between gap-1.5 pt-2">
                {[20, 35, 25, 45, 30, 50, 40, 58, 48, 62, 52, 70].map((h, i) => (
                  <div 
                    key={i} 
                    style={{ height: `${h}%` }}
                    className="flex-1 bg-orange-glow rounded-t-sm shadow-[0_0_8px_rgba(249,115,22,0.4)]"
                  ></div>
                ))}
              </div>
            </div>

            {/* KPI Card C: Unpaid Invoices */}
            <div className="bg-card border border-card-border rounded-xl p-6 flex justify-between items-center relative overflow-hidden">
              <div className="space-y-1">
                <span className="text-xs font-bold text-muted tracking-wider uppercase">Unpaid Invoices</span>
                <h3 className="text-2xl font-extrabold text-foreground">
                  {loading ? '...' : `${data?.financials?.unpaidInvoices?.count || 34} Total`}
                </h3>
                <p className="text-sm text-red-glow font-semibold mt-2">
                  {loading ? '...' : (data?.financials?.unpaidInvoices?.overdue || '$18,750 overdue')}
                </p>
              </div>
              {/* Circular SVG Donut Chart */}
              <div className="h-20 w-20 relative">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#15233c]"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-cyan-glow"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeDasharray="60, 100"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-orange-glow"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeDasharray="25, 100"
                    strokeDashoffset="-60"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-muted">
                  75%
                </div>
              </div>
            </div>

          </div>

          {/* TIER 2: MIDDLE ROW - OPERATIONS & SIDEBAR METRICS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Dispatch Map Column (Grid Span 2) */}
            <div className="bg-card border border-card-border rounded-xl p-6 lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">Active Jobs</h2>
                <div className="flex items-center gap-4 text-xs font-semibold text-muted">
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 bg-cyan-glow rounded-full"></span>Techs on map</span>
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 bg-orange-glow rounded-full"></span>24 technicians tracked</span>
                </div>
              </div>

              {/* Stylized Vector Map Component */}
              <div className="h-80 w-full bg-[#070b16] rounded-lg border border-card-border overflow-hidden relative">
                {/* Simulated Street Grid Map Grid */}
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.05)_1px,_transparent_1px)] bg-[size:30px_30px]"></div>
                
                {/* Simulated routes */}
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 100 80 L 150 150 L 220 180" fill="none" stroke="#06b6d4" strokeWidth="2" strokeDasharray="5, 5" />
                  <path d="M 350 120 L 300 200 L 320 260" fill="none" stroke="#f97316" strokeWidth="2" strokeDasharray="5, 5" />
                </svg>

                {/* Map Markers & Pins */}
                <div className="absolute top-[80px] left-[100px] flex flex-col items-center">
                  <MapPin className="h-6 w-6 text-orange-glow fill-orange-glow/20" />
                  <span className="text-[10px] bg-card px-1.5 py-0.5 rounded border border-card-border mt-0.5 font-bold">Job site</span>
                </div>

                <div className="absolute top-[180px] left-[220px] flex flex-col items-center">
                  <Truck className="h-7 w-7 text-cyan-glow drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                  <span className="text-[10px] bg-card px-1.5 py-0.5 rounded border border-card-border mt-0.5 font-bold">Liam B. (Moving)</span>
                </div>

                <div className="absolute top-[200px] left-[300px] flex flex-col items-center">
                  <MapPin className="h-6 w-6 text-cyan-glow fill-cyan-glow/20" />
                  <span className="text-[10px] bg-card px-1.5 py-0.5 rounded border border-card-border mt-0.5 font-bold">Job site</span>
                </div>

                <div className="absolute top-[260px] left-[320px] flex flex-col items-center">
                  <Truck className="h-7 w-7 text-orange-glow drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                  <span className="text-[10px] bg-card px-1.5 py-0.5 rounded border border-card-border mt-0.5 font-bold">Dave P. (Active)</span>
                </div>

                {/* Left floating Overlay Job List */}
                <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-md border border-card-border rounded-lg p-4 w-72 max-h-48 overflow-y-auto shadow-2xl">
                  <p className="text-xs font-bold tracking-wider text-muted uppercase mb-2">Active Jobs status</p>
                  <div className="space-y-2 text-xs">
                    {(data?.activeJobs || activeJobs).map((job: any) => (
                      <div key={job.id} className="flex justify-between items-center border-b border-card-border/50 pb-1.5">
                        <div className="truncate pr-2">
                          <span className="font-bold text-cyan-glow mr-1">{job.id}</span>
                          <span className="text-muted">{job.customer}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          job.status === 'Online' 
                            ? 'bg-emerald-500/10 text-emerald-400' 
                            : 'bg-orange-500/10 text-orange-400'
                        }`}>{job.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Operational Metrics Column */}
            <div className="space-y-6">
              
              {/* Metric 1: Speed to Lead Gauge */}
              <div className="bg-card border border-card-border rounded-xl p-6 space-y-4">
                <h2 className="text-sm font-bold text-muted uppercase tracking-wider">Operational Metrics</h2>
                <div className="flex flex-col items-center py-2 relative">
                  
                  {/* Gauge Ring */}
                  <div className="h-28 w-28 relative flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-180" viewBox="0 0 36 36">
                      <path
                        className="text-[#15233c]"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeDasharray="50, 100"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-cyan-glow drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeDasharray="45, 100"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    
                    <div className="absolute bottom-2 flex flex-col items-center">
                      <span className="text-lg font-extrabold">1.5 MIN</span>
                      <span className="text-[9px] font-bold text-[#10b981] bg-emerald-500/10 px-1.5 py-0.5 rounded-full mt-1">EXCELLENT</span>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-center mt-3 text-muted">SPEED-TO-LEAD</p>
                  <p className="text-[10px] text-muted">98% leads contacted within 5 mins</p>
                </div>

                {/* Sparkline mini-bar representation */}
                <div className="flex items-end justify-between h-8 gap-1 pt-1">
                  {[2, 3, 1, 1.5, 2.5, 1.2, 1.8].map((v, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div 
                        style={{ height: `${(v / 3) * 100}%` }}
                        className="w-full bg-cyan-glow rounded-t-sm"
                      ></div>
                      <span className="text-[8px] text-muted mt-1 uppercase">{'MTWTFSS'[i]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metric 2: Capacity Summary & GHL Sync */}
              <div className="bg-card border border-card-border rounded-xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-muted uppercase tracking-wider">Team & GHL Sync</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>Techs Available</span>
                      <span className="text-cyan-glow">18 / 24</span>
                    </div>
                    <div className="h-2 w-full bg-[#070b16] rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-glow rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>Live GHL Workflows</span>
                      <span className="text-orange-glow font-bold">
                        {loading ? 'Syncing...' : error ? 'Sync Error' : `${data?.workflows?.total || 0} Total`}
                      </span>
                    </div>
                    {data?.workflows && (
                      <div className="text-[11px] text-muted flex justify-between mt-1">
                        <span>Published: {data.workflows.published}</span>
                        <span>Drafts: {data.workflows.draft}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* TIER 3: TECHNICIAN LEADERBOARD */}
          <div className="bg-card border border-card-border rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4">Technician Leaderboard</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-card-border text-xs font-bold text-muted uppercase tracking-wider">
                    <th className="py-3 px-4 w-16">Rank</th>
                    <th className="py-3 px-4">Technician</th>
                    <th className="py-3 px-4">Revenue MTD</th>
                    <th className="py-3 px-4">Jobs Completed</th>
                    <th className="py-3 px-4">Star Rating</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border text-sm">
                  {(data?.leaderboard || technicians).map((tech: any) => (
                    <tr key={tech.rank} className="hover:bg-card-border/10 transition-colors">
                      <td className="py-3.5 px-4 font-bold">
                        <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${
                          tech.rank === 1 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          tech.rank === 2 ? 'bg-slate-400/20 text-slate-300 border border-slate-400/30' :
                          tech.rank === 3 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                          'bg-card-border text-muted'
                        }`}>
                          {tech.rank}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs relative">
                          {tech.name.split(' ')[0][0]}
                          <span className="absolute bottom-0 right-0 h-2 w-2 bg-emerald-500 rounded-full border border-card"></span>
                        </div>
                        <span className="font-semibold">{tech.name}</span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold">{tech.mtdRev}</td>
                      <td className="py-3.5 px-4 font-semibold">{tech.jobs}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex gap-0.5 text-amber-400">
                          {[...Array(tech.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-current" />
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                          {tech.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
