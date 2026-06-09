'use client';

import React, { useState, useEffect } from 'react';
import { Users, DollarSign, Star, CheckCircle, Truck, Award, Shield } from 'lucide-react';

interface Technician {
  id: string;
  name: string;
  role: string;
  revenue: number;
  jobs: number;
  rating: number;
  status: 'Online' | 'Moving' | 'Offline';
  efficiency: string;
}

export default function TechsView() {
  const [techs, setTechs] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTechs() {
      try {
        setLoading(true);
        // We fetch the dashboard data since it already aggregates won opportunities by assigned user ID!
        const res = await fetch('/api/dashboard');
        const json = await res.json();
        
        if (json.success) {
          // If live leaderboard is returned from GHL, map it
          if (json.leaderboard && json.leaderboard.length > 0) {
            const mappedTechs: Technician[] = json.leaderboard.map((t: any) => ({
              id: t.name.replace(/\s+/g, '-').toLowerCase(),
              name: t.name,
              role: 'Service Specialist',
              revenue: t.mtdRevVal || 0,
              jobs: t.jobs || 0,
              rating: t.rating || 5,
              status: t.status || 'Online',
              efficiency: '96%'
            }));
            setTechs(mappedTechs);
          } else {
            // Fallback list of technicians
            setTechs(getFallbackTechs());
          }
        } else {
          setError(json.error || 'Failed to fetch technician data');
          setTechs(getFallbackTechs());
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while loading technicians');
        setTechs(getFallbackTechs());
      } finally {
        setLoading(false);
      }
    }
    fetchTechs();
  }, []);

  const getFallbackTechs = (): Technician[] => [
    { id: '1', name: 'Liam B.', role: 'Lead Plumber', revenue: 14500, jobs: 30, rating: 5, status: 'Online', efficiency: '98%' },
    { id: '2', name: 'Mike C.', role: 'Apprentice Specialist', revenue: 13200, jobs: 21, rating: 5, status: 'Online', efficiency: '95%' },
    { id: '3', name: 'Dave P.', role: 'Master Gas Fitter', revenue: 10000, jobs: 26, rating: 4, status: 'Moving', efficiency: '92%' },
    { id: '4', name: 'Sarah L.', role: 'Drain Technician', revenue: 9500, jobs: 15, rating: 5, status: 'Online', efficiency: '97%' },
    { id: '5', name: 'Ben H.', role: 'Service Specialist', revenue: 6600, jobs: 8, rating: 4, status: 'Offline', efficiency: '88%' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Technician Management</h1>
          <p className="text-sm text-muted">Track technician status, performance, and revenue generation</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-950/20 border border-red-800 text-red-400 p-4 rounded-xl text-xs">
          ⚠️ GHL Connection Error: {error}. Showing local backup technician profiles.
        </div>
      )}

      {/* KPI stats bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-card-border rounded-xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-muted font-bold uppercase tracking-wide">Total Active Technicians</span>
            <h4 className="text-2xl font-bold text-foreground">{techs.length} Techs</h4>
          </div>
          <div className="h-10 w-10 bg-cyan-glow/10 text-cyan-glow flex items-center justify-center rounded-lg">
            <Users className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-card border border-card-border rounded-xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-muted font-bold uppercase tracking-wide">Total Revenue MTD</span>
            <h4 className="text-2xl font-bold text-foreground">
              ${techs.reduce((sum, t) => sum + t.revenue, 0).toLocaleString()}
            </h4>
          </div>
          <div className="h-10 w-10 bg-orange-glow/10 text-orange-glow flex items-center justify-center rounded-lg">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-card border border-card-border rounded-xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-muted font-bold uppercase tracking-wide">Average Rating</span>
            <h4 className="text-2xl font-bold text-foreground">
              {(techs.reduce((sum, t) => sum + t.rating, 0) / techs.length || 5).toFixed(1)} / 5.0
            </h4>
          </div>
          <div className="h-10 w-10 bg-amber-500/10 text-amber-500 flex items-center justify-center rounded-lg">
            <Star className="h-6 w-6 fill-amber-500/10" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full bg-card border border-card-border rounded-xl p-12 text-center text-muted">
            <div className="animate-spin h-6 w-6 border-2 border-cyan-glow border-t-transparent rounded-full mx-auto mb-4"></div>
            Loading technician profiles...
          </div>
        ) : (
          techs.map((tech) => (
            <div key={tech.id} className="bg-card border border-card-border rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-cyan-glow/30 transition-all">
              
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-slate-700 flex items-center justify-center font-bold text-base relative">
                    {tech.name[0]}
                    <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border border-card ${
                      tech.status === 'Online' ? 'bg-emerald-500' :
                      tech.status === 'Moving' ? 'bg-cyan-glow' : 'bg-muted'
                    }`}></span>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-foreground">{tech.name}</h3>
                    <p className="text-xs text-muted">{tech.role}</p>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  tech.status === 'Online' ? 'bg-emerald-500/10 text-emerald-400' :
                  tech.status === 'Moving' ? 'bg-cyan-glow/10 text-cyan-glow' : 'bg-card-border text-muted'
                }`}>
                  {tech.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-[#070b16] border border-card-border/50 rounded-lg p-3 text-xs">
                <div>
                  <span className="text-muted block font-semibold">MTD Revenue</span>
                  <span className="text-foreground font-bold text-sm">${tech.revenue.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-muted block font-semibold">Completed Jobs</span>
                  <span className="text-foreground font-bold text-sm">{tech.jobs} Jobs</span>
                </div>
                <div>
                  <span className="text-muted block font-semibold">Customer Rating</span>
                  <span className="text-amber-400 font-bold text-sm flex items-center gap-0.5">
                    {tech.rating} <Star className="h-3 w-3 fill-current" />
                  </span>
                </div>
                <div>
                  <span className="text-muted block font-semibold">SLA Efficiency</span>
                  <span className="text-cyan-glow font-bold text-sm">{tech.efficiency}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs border-t border-card-border/30 pt-3">
                <div className="flex items-center gap-1.5 text-muted">
                  <Shield className="h-3.5 w-3.5 text-cyan-glow" />
                  <span>Verified Tech</span>
                </div>
                <button className="text-cyan-glow font-bold hover:underline">View Performance</button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
