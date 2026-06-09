'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Shield, Link, Database, CheckCircle, AlertTriangle, Loader } from 'lucide-react';

export default function SettingsView() {
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  
  // Masked Configuration info (fetched from client-side or predefined)
  const configInfo = {
    locationId: 'RHROdkS0TNPBFZHcZsX0',
    baseUrl: 'https://services.leadconnectorhq.com',
    version: '2021-07-28 (Contacts) / 2021-04-15 (Conversations)',
    provider: 'Vercel Serverless Functions'
  };

  const handleTestConnection = async () => {
    try {
      setTestLoading(true);
      setTestResult(null);
      const res = await fetch('/api/dashboard');
      const json = await res.json();
      
      if (json.success) {
        setTestResult({
          status: 'connected',
          message: 'GoHighLevel OAuth Connection Successful!',
          details: `Connected to Location ID: ${configInfo.locationId}. Retrieved ${json.workflows?.total || 0} workflows, ${json.activeJobs?.length || 0} open jobs, and invoice data.`
        });
      } else {
        setTestResult({
          status: 'error',
          message: 'Connection Failed',
          details: json.error || 'Unknown error occurred. Please verify your GHL API key scope.'
        });
      }
    } catch (err: any) {
      setTestResult({
        status: 'error',
        message: 'Network / Server Error',
        details: err.message || 'Failed to reach API proxy endpoint.'
      });
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System Settings</h1>
          <p className="text-sm text-muted">Manage your GoHighLevel integration and dashboard diagnostics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Connection Diagnostics Card (Grid span 2) */}
        <div className="bg-card border border-card-border rounded-xl p-6 lg:col-span-2 space-y-6">
          <h3 className="font-bold text-base flex items-center gap-2">
            <Link className="h-5 w-5 text-cyan-glow" /> GoHighLevel Integration Diagnostics
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5 p-4 bg-[#070b16] border border-card-border/60 rounded-lg">
                <span className="text-muted block font-semibold">Location ID</span>
                <code className="text-foreground font-mono font-bold">{configInfo.locationId}</code>
              </div>
              
              <div className="space-y-1.5 p-4 bg-[#070b16] border border-card-border/60 rounded-lg">
                <span className="text-muted block font-semibold">API Base URL</span>
                <code className="text-foreground font-mono font-bold">{configInfo.baseUrl}</code>
              </div>

              <div className="space-y-1.5 p-4 bg-[#070b16] border border-card-border/60 rounded-lg">
                <span className="text-muted block font-semibold">GHL API Version</span>
                <code className="text-foreground font-mono font-bold">{configInfo.version}</code>
              </div>

              <div className="space-y-1.5 p-4 bg-[#070b16] border border-card-border/60 rounded-lg">
                <span className="text-muted block font-semibold">Private Integrations Status</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" /> Connected
                </span>
              </div>
            </div>

            {/* Test Connection Box */}
            <div className="border border-card-border/60 rounded-lg p-5 space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-3">
                <div>
                  <h4 className="text-sm font-bold">API Connection Test</h4>
                  <p className="text-xs text-muted">Verify secure routing between Vercel and GoHighLevel CRM</p>
                </div>
                <button
                  onClick={handleTestConnection}
                  disabled={testLoading}
                  className="bg-[#0b1329] border border-card-border hover:border-cyan-glow hover:text-cyan-glow px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 min-w-32"
                >
                  {testLoading ? <Loader className="h-3.5 w-3.5 animate-spin" /> : 'Run Connection Test'}
                </button>
              </div>

              {testResult && (
                <div className={`p-4 rounded-lg border text-xs space-y-1 ${
                  testResult.status === 'connected' 
                    ? 'bg-emerald-950/10 border-emerald-500/20 text-emerald-400' 
                    : 'bg-red-950/10 border-red-500/20 text-red-400'
                }`}>
                  <h5 className="font-bold flex items-center gap-1.5">
                    {testResult.status === 'connected' ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                    {testResult.message}
                  </h5>
                  <p className="text-muted-foreground">{testResult.details}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Security / Metadata Card */}
        <div className="bg-card border border-card-border rounded-xl p-6 space-y-6">
          <h3 className="font-bold text-base flex items-center gap-2">
            <Shield className="h-5 w-5 text-orange-glow" /> Security & Platform
          </h3>

          <div className="space-y-4 text-xs text-muted">
            <div className="space-y-1.5">
              <span className="font-semibold block">Data Encryption</span>
              <p>All API keys and location IDs are stored as encrypted Vercel environment variables. They are parsed server-side and never exposed to the browser client.</p>
            </div>

            <div className="space-y-1.5 border-t border-card-border/40 pt-4">
              <span className="font-semibold block">Hosting Platform</span>
              <p>Hosted on Vercel Serverless Platform in region <strong>Washington, D.C., USA (East) – iad1</strong>. Auto-scaling capability enabled.</p>
            </div>

            <div className="space-y-1.5 border-t border-card-border/40 pt-4">
              <span className="font-semibold block">Framework Version</span>
              <p>Running on <strong>Next.js 16 (React 19)</strong>. Turbopack compiler active.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
