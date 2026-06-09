'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, User, Mail, Phone, Calendar, Tag, ShieldAlert, Loader } from 'lucide-react';

export default function CustomersView() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Create Contact Form States
  const [showAddModal, setShowAddModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    city: '',
    state: '',
    postalCode: ''
  });

  const fetchContacts = async (query = '') => {
    try {
      setLoading(true);
      const res = await fetch(`/api/customers?query=${encodeURIComponent(query)}`);
      const json = await res.json();
      if (json.success) {
        setContacts(json.contacts || []);
        setTotal(json.total || 0);
        setError(null);
      } else {
        setError(json.error || 'Failed to search contacts');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while loading contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchContacts(searchQuery);
  };

  const handleCreateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName) {
      setFormError('First and Last name are required');
      return;
    }
    
    try {
      setFormLoading(true);
      setFormError(null);
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const json = await res.json();
      if (json.success) {
        setShowAddModal(false);
        // Reset Form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address1: '',
          city: '',
          state: '',
          postalCode: ''
        });
        // Reload contacts list
        fetchContacts(searchQuery);
      } else {
        setFormError(json.error || 'Failed to create contact');
      }
    } catch (err: any) {
      setFormError(err.message || 'Error occurred while saving contact');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customer Database</h1>
          <p className="text-sm text-muted">Manage your client contacts, contact info, and booking profiles</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-cyan-glow hover:bg-cyan-glow/85 text-background px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
        >
          <Plus className="h-4 w-4" /> Add Customer
        </button>
      </div>

      {error && (
        <div className="bg-red-950/20 border border-red-800 text-red-400 p-4 rounded-xl text-sm">
          ⚠️ GHL Connection Error: {error}. Please verify configuration settings.
        </div>
      )}

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="bg-card border border-card-border rounded-xl p-4 flex gap-3">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-muted" />
          </span>
          <input 
            type="text" 
            placeholder="Search by first name, last name, email, or phone number..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 bg-[#070b16] border border-card-border rounded-lg pl-10 pr-4 text-sm focus:outline-none focus:border-cyan-glow"
          />
        </div>
        <button 
          type="submit" 
          className="bg-[#0b1329] border border-card-border hover:border-cyan-glow hover:text-cyan-glow px-6 py-2.5 rounded-lg text-sm font-bold transition-all"
        >
          Search
        </button>
      </form>

      {/* Customer Listing */}
      <div className="bg-card border border-card-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-card-border flex justify-between items-center bg-[#070b16]/30">
          <h2 className="font-bold text-base">Customers List</h2>
          <span className="text-xs bg-[#0b1329] text-muted px-2.5 py-1 rounded-full border border-card-border">
            Total GHL Records: {total || contacts.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-muted">
              <div className="animate-spin h-6 w-6 border-2 border-cyan-glow border-t-transparent rounded-full mx-auto mb-4"></div>
              Querying GoHighLevel database...
            </div>
          ) : contacts.length === 0 ? (
            <div className="p-12 text-center text-muted space-y-2">
              <ShieldAlert className="h-8 w-8 text-muted/30 mx-auto" />
              <p>No customers found matching your search.</p>
              <button onClick={() => fetchContacts('')} className="text-cyan-glow underline text-xs font-bold">Clear Filters</button>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-card-border text-xs font-bold text-muted uppercase tracking-wider bg-[#070b16]/10">
                  <th className="py-3 px-6">Name</th>
                  <th className="py-3 px-6">Email Address</th>
                  <th className="py-3 px-6">Phone Number</th>
                  <th className="py-3 px-6">Date Created</th>
                  <th className="py-3 px-6">Tags</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border/60 text-sm">
                {contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-card-border/10 transition-colors">
                    <td className="py-4 px-6 font-semibold flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-cyan-glow/10 text-cyan-glow flex items-center justify-center font-bold text-xs">
                        {contact.firstName?.[0] || contact.lastName?.[0] || 'U'}
                      </div>
                      <span className="text-foreground">{contact.contactName || `${contact.firstName || ''} ${contact.lastName || ''}`}</span>
                    </td>
                    <td className="py-4 px-6 text-muted font-medium">
                      {contact.email ? (
                        <span className="flex items-center gap-1.5"><Mail className="h-4 w-4 text-cyan-glow" />{contact.email}</span>
                      ) : (
                        <span className="italic text-muted/50">No email</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-muted font-medium">
                      {contact.phone ? (
                        <span className="flex items-center gap-1.5"><Phone className="h-4 w-4 text-orange-glow" />{contact.phone}</span>
                      ) : (
                        <span className="italic text-muted/50">No phone</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-muted">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-muted/60" />
                        {new Date(contact.dateAdded || contact.dateCreated || Date.now()).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1 max-w-[240px]">
                        {contact.tags && contact.tags.length > 0 ? (
                          contact.tags.map((tag: string, i: number) => (
                            <span 
                              key={i} 
                              className="bg-cyan-glow/10 text-cyan-glow text-[10px] font-bold px-2 py-0.5 rounded border border-cyan-glow/20 flex items-center gap-0.5"
                            >
                              <Tag className="h-2.5 w-2.5" />
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-muted/40 text-[10px] italic">No tags</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-card-border rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-foreground">Create New GHL Contact</h3>
                <p className="text-xs text-muted">Add customer profile directly into your GoHighLevel CRM</p>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-muted hover:text-foreground font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="bg-red-950/20 border border-red-800 text-red-400 p-3 rounded-lg text-xs">
                ⚠️ {formError}
              </div>
            )}

            <form onSubmit={handleCreateContact} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-muted font-semibold">First Name *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full h-10 bg-[#070b16] border border-card-border rounded-lg px-3 focus:outline-none focus:border-cyan-glow"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-muted font-semibold">Last Name *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full h-10 bg-[#070b16] border border-card-border rounded-lg px-3 focus:outline-none focus:border-cyan-glow"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-muted font-semibold">Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-10 bg-[#070b16] border border-card-border rounded-lg px-3 focus:outline-none focus:border-cyan-glow"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-muted font-semibold">Phone Number</label>
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full h-10 bg-[#070b16] border border-card-border rounded-lg px-3 focus:outline-none focus:border-cyan-glow"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-muted font-semibold">Street Address</label>
                <input 
                  type="text" 
                  value={formData.address1}
                  onChange={(e) => setFormData({ ...formData, address1: e.target.value })}
                  className="w-full h-10 bg-[#070b16] border border-card-border rounded-lg px-3 focus:outline-none focus:border-cyan-glow"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-muted font-semibold">City</label>
                  <input 
                    type="text" 
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full h-10 bg-[#070b16] border border-card-border rounded-lg px-3 focus:outline-none focus:border-cyan-glow"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-muted font-semibold">State</label>
                  <input 
                    type="text" 
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full h-10 bg-[#070b16] border border-card-border rounded-lg px-3 focus:outline-none focus:border-cyan-glow"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-muted font-semibold">Postal Code</label>
                  <input 
                    type="text" 
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full h-10 bg-[#070b16] border border-card-border rounded-lg px-3 focus:outline-none focus:border-cyan-glow"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-card-border/40">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="bg-card-border/30 hover:bg-card-border/60 px-5 py-2.5 rounded-lg font-semibold transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={formLoading}
                  className="bg-cyan-glow hover:bg-cyan-glow/85 text-background px-6 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all min-w-32"
                >
                  {formLoading ? <Loader className="h-4 w-4 animate-spin" /> : 'Save Customer'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
