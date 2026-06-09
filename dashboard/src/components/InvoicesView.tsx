'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Search, Filter, ArrowUpRight, DollarSign, Calendar, AlertCircle } from 'lucide-react';

export default function InvoicesView() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'paid' | 'sent' | 'overdue'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/invoices');
      const json = await res.json();
      if (json.success) {
        setInvoices(json.invoices || []);
        setError(null);
      } else {
        setError(json.error || 'Failed to fetch invoices');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while loading invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Backups / Fallbacks if GHL is empty
  const fallbackInvoices = [
    { id: 'INV-1004', contactName: 'Robert Vance', amount: 1450, status: 'paid', date: new Date().setDate(new Date().getDate() - 2), dueDate: new Date().setDate(new Date().getDate() + 10) },
    { id: 'INV-1005', contactName: 'Alice Margatroid', amount: 890, status: 'paid', date: new Date().setDate(new Date().getDate() - 3), dueDate: new Date().setDate(new Date().getDate() + 7) },
    { id: 'INV-1006', contactName: 'Gale Dekarios', amount: 1200, status: 'sent', date: new Date().setDate(new Date().getDate() - 5), dueDate: new Date().setDate(new Date().getDate() + 5) },
    { id: 'INV-1007', contactName: 'Shadowheart H.', amount: 3200, status: 'overdue', date: new Date().setDate(new Date().getDate() - 20), dueDate: new Date().setDate(new Date().getDate() - 5) },
    { id: 'INV-1008', contactName: 'Laezel of Kli', amount: 450, status: 'sent', date: new Date().setDate(new Date().getDate() - 1), dueDate: new Date().setDate(new Date().getDate() + 14) },
    { id: 'INV-1009', contactName: 'Astarion Anc', amount: 2400, status: 'overdue', date: new Date().setDate(new Date().getDate() - 25), dueDate: new Date().setDate(new Date().getDate() - 10) }
  ];

  const processedInvoices = invoices.length > 0 
    ? invoices.map(inv => ({
        id: inv.invoiceNumber || `INV-${inv.id.slice(-4).toUpperCase()}`,
        contactName: inv.contactName || inv.liveMode ? 'GHL Client' : 'Customer Account',
        amount: Number(inv.amount) || 0,
        status: inv.status?.toLowerCase() || 'draft',
        date: new Date(inv.dateCreated || Date.now()).getTime(),
        dueDate: new Date(inv.dueDate || Date.now()).getTime()
      }))
    : fallbackInvoices;

  // Compute stat totals
  const totalInvoiced = processedInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalPaid = processedInvoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
  const totalUnpaid = processedInvoices.filter(inv => inv.status === 'sent' || inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0);

  // Apply filters and search
  const filteredInvoices = processedInvoices
    .filter(inv => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'paid') return inv.status === 'paid';
      if (activeFilter === 'sent') return inv.status === 'sent';
      if (activeFilter === 'overdue') return inv.status === 'overdue';
      return true;
    })
    .filter(inv => {
      const search = searchQuery.toLowerCase();
      return inv.id.toLowerCase().includes(search) || inv.contactName.toLowerCase().includes(search);
    });

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'sent':
        return 'bg-cyan-glow/10 text-cyan-glow border-cyan-glow/20';
      case 'overdue':
        return 'bg-red-glow/10 text-red-glow border-red-glow/20';
      default:
        return 'bg-card-border text-muted border-card-border/50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Invoice Center</h1>
          <p className="text-sm text-muted">Review balances, unpaid receivables, and payment receipts</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-950/20 border border-red-800 text-red-400 p-4 rounded-xl text-sm">
          ⚠️ GHL Connection Error: {error}. Displaying fallback billing records.
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-card-border rounded-xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-muted font-bold uppercase tracking-wide">Total Billings MTD</span>
            <h4 className="text-2xl font-bold text-foreground">${totalInvoiced.toLocaleString()}</h4>
          </div>
          <div className="h-10 w-10 bg-card-border text-muted flex items-center justify-center rounded-lg">
            <FileText className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-card border border-card-border rounded-xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-muted font-bold uppercase tracking-wide">Collected Revenue</span>
            <h4 className="text-2xl font-bold text-emerald-400">${totalPaid.toLocaleString()}</h4>
          </div>
          <div className="h-10 w-10 bg-emerald-500/10 text-emerald-400 flex items-center justify-center rounded-lg">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-card border border-card-border rounded-xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-muted font-bold uppercase tracking-wide">Pending/Outstanding</span>
            <h4 className="text-2xl font-bold text-orange-glow">${totalUnpaid.toLocaleString()}</h4>
          </div>
          <div className="h-10 w-10 bg-orange-glow/10 text-orange-glow flex items-center justify-center rounded-lg">
            <AlertCircle className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-card border border-card-border rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-muted" />
          </span>
          <input 
            type="text" 
            placeholder="Search by invoice number or client..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 bg-[#070b16] border border-card-border rounded-lg pl-9 pr-4 text-xs placeholder-muted focus:outline-none focus:border-cyan-glow"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex gap-1 bg-[#070b16] border border-card-border rounded-lg p-1 w-full md:w-auto">
          {(['all', 'paid', 'sent', 'overdue'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex-1 md:flex-initial px-4 py-1.5 rounded text-xs font-bold capitalize transition-all ${
                activeFilter === filter 
                  ? 'bg-card text-foreground' 
                  : 'text-muted hover:text-foreground'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Invoice Table Listing */}
      <div className="bg-card border border-card-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-muted">
              <div className="animate-spin h-6 w-6 border-2 border-cyan-glow border-t-transparent rounded-full mx-auto mb-4"></div>
              Fetching invoices from GoHighLevel CRM...
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="p-12 text-center text-muted">
              No invoices found matching the current filters.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-card-border text-xs font-bold text-muted uppercase tracking-wider bg-[#070b16]/10">
                  <th className="py-3 px-6">Invoice ID</th>
                  <th className="py-3 px-6">Customer Name</th>
                  <th className="py-3 px-6">Amount</th>
                  <th className="py-3 px-6">Date Created</th>
                  <th className="py-3 px-6">Due Date</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border/60 text-sm">
                {filteredInvoices.map((inv, idx) => (
                  <tr key={idx} className="hover:bg-card-border/10 transition-colors">
                    <td className="py-4 px-6 font-bold text-cyan-glow">{inv.id}</td>
                    <td className="py-4 px-6 font-semibold text-foreground">{inv.contactName}</td>
                    <td className="py-4 px-6 font-bold text-foreground">${inv.amount.toLocaleString()}</td>
                    <td className="py-4 px-6 text-muted">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(inv.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-muted">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(inv.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadgeClass(inv.status)}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-cyan-glow font-bold text-xs hover:underline inline-flex items-center gap-1">
                        View Invoice <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
}
