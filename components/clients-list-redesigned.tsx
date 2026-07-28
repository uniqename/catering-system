'use client';

import { useState, useMemo } from 'react';
import { Search, Plus, Filter, Download, ChevronLeft, ChevronRight, Mail, Phone, MapPin, Edit, Send, Calendar, MoreVertical, CheckCircle, Circle, DollarSign, TrendingUp, Users } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  status?: 'active' | 'inactive' | 'lead';
  tags?: string[];
  eventCount: number;
  totalSpent: number;
  lastEventDate: string;
  createdAt: string;
  clientType?: 'VIP' | 'Regular' | 'Referral';
}

const CardBorder = { boxShadow: '0 0 0 0.5px rgba(215, 168, 89, 0.08)' };

const STATUS_COLORS = {
  active: '#10b981',
  inactive: '#6b7280',
  lead: '#fbbf24'
};

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function getAvatarColor(index: number): string {
  const colors = ['#14b8a6', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#10b981', '#ec4899'];
  return colors[index % colors.length];
}

export default function ClientsList({
  clients,
  onAddClient
}: {
  clients: Client[];
  onAddClient: () => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Client['status']>('all');
  const [clientTypeFilter, setClientTypeFilter] = useState<'all' | string>('all');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'invoices' | 'payments' | 'notes' | 'files'>('overview');
  const itemsPerPage = 8;

  const selectedClient = clients.find(c => c.id === selectedClientId);

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      if (statusFilter !== 'all' && client.status !== statusFilter) return false;
      if (clientTypeFilter !== 'all' && client.clientType !== clientTypeFilter) return false;
      return (
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm)
      );
    });
  }, [searchTerm, statusFilter, clientTypeFilter, clients]);

  const paginatedClients = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredClients.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredClients, currentPage]);

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  return (
    <div style={{ backgroundColor: '#0a1911', minHeight: '100vh' }} className="p-8">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 style={{ color: '#d7a859' }} className="text-4xl font-bold mb-1">Clients</h1>
            <p style={{ color: '#a8d5ca' }} className="text-sm">Manage your clients and their history.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4" style={{ color: '#d7a859' }} />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                style={{ backgroundColor: '#0f2416', borderColor: 'rgba(215, 168, 89, 0.2)', color: '#ffffff' }}
                className="w-56 pl-9 pr-3 py-1.5 rounded-lg border text-sm focus:outline-none"
              />
            </div>
            <button onClick={onAddClient} style={{ backgroundColor: '#d7a859', color: '#0a1911' }} className="px-3 py-1.5 font-bold rounded-lg text-sm hover:opacity-90 flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Add Client
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { icon: Users, label: 'Total Clients', value: clients.length.toString(), desc: '+5 this month ↑', descColor: '#10b981' },
            { icon: Plus, label: 'New This Month', value: clients.filter(c => { const d = new Date(c.createdAt); const now = new Date(); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }).length.toString(), desc: '+25% vs last month ↑', descColor: '#fbbf24' },
            { icon: TrendingUp, label: 'Repeat Clients', value: clients.filter(c => c.eventCount > 1).length.toString(), desc: '67% of total clients', descColor: '#a8d5ca' },
            { icon: DollarSign, label: 'Total Revenue', value: '$' + clients.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString(), desc: '+18% vs last month ↑', descColor: '#10b981' },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <div key={i} style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-2">
                  <div style={{ backgroundColor: '#102418' }} className="p-1.5 rounded">
                    <Icon className="w-4 h-4" style={{ color: '#d7a859' }} strokeWidth={1.5} />
                  </div>
                  <p style={{ color: '#a8d5ca' }} className="text-xs font-semibold">{card.label}</p>
                </div>
                <p style={{ color: card.label === 'Total Revenue' ? '#d7a859' : '#ffffff' }} className="text-3xl font-bold mb-1">{card.value}</p>
                <p style={{ color: card.descColor }} className="text-xs">{card.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          {/* Table Section - 3 columns */}
          <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="lg:col-span-3 rounded-lg p-6 border">
            {/* Filters */}
            <div style={{ borderBottomColor: 'rgba(215, 168, 89, 0.1)' }} className="mb-4 flex items-center gap-3 pb-4 border-b">
              <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as any); setCurrentPage(1); }} style={{ backgroundColor: '#0a1911', borderColor: 'rgba(215, 168, 89, 0.2)', color: '#ffffff' }} className="px-2 py-1 rounded text-xs border focus:outline-none">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="lead">Lead</option>
              </select>
              <select value={clientTypeFilter} onChange={(e) => { setClientTypeFilter(e.target.value); setCurrentPage(1); }} style={{ backgroundColor: '#0a1911', borderColor: 'rgba(215, 168, 89, 0.2)', color: '#ffffff' }} className="px-2 py-1 rounded text-xs border focus:outline-none">
                <option value="all">All Client Types</option>
                <option value="VIP">VIP</option>
                <option value="Regular">Regular</option>
              </select>
              <select style={{ backgroundColor: '#0a1911', borderColor: 'rgba(215, 168, 89, 0.2)', color: '#ffffff' }} className="px-2 py-1 rounded text-xs border focus:outline-none">
                <option>All Tags</option>
              </select>
              <div className="ml-auto flex gap-2">
                <button onClick={() => alert('Advanced filters: Coming soon')} style={{ borderColor: 'rgba(215, 168, 89, 0.3)', color: '#d7a859' }} className="px-2 py-1 rounded border text-xs font-semibold hover:opacity-80 flex items-center gap-1">
                  <Filter className="w-3 h-3" /> Filters
                </button>
                <button onClick={() => { const csv = 'Client Name,Email,Phone,Status\n' + paginatedClients.map(c => `${c.name},${c.email},${c.phone},${c.status}`).join('\n'); const blob = new Blob([csv], {type: 'text/csv'}); const url = window.URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'clients.csv'; a.click(); }} style={{ borderColor: 'rgba(215, 168, 89, 0.3)', color: '#d7a859' }} className="px-2 py-1 rounded border text-xs font-semibold hover:opacity-80 flex items-center gap-1">
                  <Download className="w-3 h-3" /> Export
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottomColor: 'rgba(215, 168, 89, 0.1)' }} className="border-b">
                    <th style={{ color: '#d7a859' }} className="text-left py-2 px-2 font-semibold">Client</th>
                    <th style={{ color: '#d7a859' }} className="text-left py-2 px-2 font-semibold">Contact</th>
                    <th style={{ color: '#d7a859' }} className="text-left py-2 px-2 font-semibold">Events</th>
                    <th style={{ color: '#d7a859' }} className="text-left py-2 px-2 font-semibold">Total Spent</th>
                    <th style={{ color: '#d7a859' }} className="text-left py-2 px-2 font-semibold">Last Event</th>
                    <th style={{ color: '#d7a859' }} className="text-left py-2 px-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedClients.map((client, idx) => (
                    <tr key={client.id} onClick={() => setSelectedClientId(client.id)} style={{ borderBottomColor: 'rgba(215, 168, 89, 0.05)', backgroundColor: selectedClientId === client.id ? 'rgba(215, 168, 89, 0.08)' : 'transparent' }} className="border-b hover:bg-[#102418] transition cursor-pointer">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <div style={{ backgroundColor: getAvatarColor(idx) }} className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xs">
                            {getInitials(client.name)}
                          </div>
                          <div>
                            <p style={{ color: '#ffffff' }} className="font-semibold text-xs">{client.name}</p>
                            {client.company && <p style={{ color: '#a8d5ca' }} className="text-xs">{client.company}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-xs">
                        <p style={{ color: '#ffffff' }}>{client.phone}</p>
                        <p style={{ color: '#a8d5ca' }}>{client.email}</p>
                      </td>
                      <td style={{ color: '#ffffff' }} className="py-3 px-2 text-xs">{client.eventCount}</td>
                      <td style={{ color: '#d7a859' }} className="py-3 px-2 text-xs font-bold">${client.totalSpent.toLocaleString()}</td>
                      <td style={{ color: '#ffffff' }} className="py-3 px-2 text-xs">{new Date(client.lastEventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                      <td className="py-3 px-2">
                        <span style={{ backgroundColor: STATUS_COLORS[client.status || 'active'], color: '#0a1911' }} className="px-2 py-0.5 rounded text-xs font-bold">
                          {(client.status || 'active').charAt(0).toUpperCase() + (client.status || 'active').slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ borderTopColor: 'rgba(215, 168, 89, 0.1)' }} className="mt-4 pt-4 border-t flex items-center justify-between">
                <p style={{ color: '#a8d5ca' }} className="text-xs">
                  Showing {paginatedClients.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredClients.length)} of {filteredClients.length}
                </p>
                <div className="flex gap-1">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ borderColor: 'rgba(215, 168, 89, 0.3)', color: currentPage === 1 ? '#666' : '#d7a859' }} className="px-2 py-1 rounded border text-xs disabled:opacity-50">
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(page => (
                    <button key={page} onClick={() => setCurrentPage(page)} style={{ backgroundColor: currentPage === page ? '#d7a859' : '#0a1911', borderColor: 'rgba(215, 168, 89, 0.3)', color: currentPage === page ? '#0a1911' : '#d7a859' }} className="px-2 py-1 rounded border text-xs font-semibold">
                      {page}
                    </button>
                  ))}
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ borderColor: 'rgba(215, 168, 89, 0.3)', color: currentPage === totalPages ? '#666' : '#d7a859' }} className="px-2 py-1 rounded border text-xs disabled:opacity-50">
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Client Details Sidebar - 2 columns */}
          {selectedClient && (
            <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="lg:col-span-2 rounded-lg border overflow-y-auto max-h-[calc(100vh-200px)]">
              <div className="p-5 space-y-4">
                {/* Header */}
                <div style={{ borderBottomColor: 'rgba(215, 168, 89, 0.1)' }} className="flex items-start gap-3 pb-4 border-b">
                  <div style={{ backgroundColor: getAvatarColor(clients.indexOf(selectedClient)) }} className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {getInitials(selectedClient.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 style={{ color: '#ffffff' }} className="font-bold text-sm">{selectedClient.name}</h3>
                    {selectedClient.company && <p style={{ color: '#a8d5ca' }} className="text-xs">{selectedClient.company}</p>}
                    <span style={{ backgroundColor: STATUS_COLORS[selectedClient.status || 'active'], color: '#0a1911' }} className="inline-block px-2 py-0.5 rounded text-xs font-bold mt-1">
                      {(selectedClient.status || 'active').charAt(0).toUpperCase() + (selectedClient.status || 'active').slice(1)}
                    </span>
                  </div>
                </div>

                {/* Contact Info */}
                <div style={{ borderBottomColor: 'rgba(215, 168, 89, 0.1)' }} className="space-y-2 text-xs pb-4 border-b">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3" style={{ color: '#d7a859' }} strokeWidth={2} />
                    <p style={{ color: '#ffffff' }}>{selectedClient.phone}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3 h-3" style={{ color: '#d7a859' }} strokeWidth={2} />
                    <p style={{ color: '#ffffff' }}>{selectedClient.email}</p>
                  </div>
                  {selectedClient.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: '#d7a859' }} strokeWidth={2} />
                      <p style={{ color: '#ffffff' }}>{selectedClient.address}<br/>{selectedClient.city}, {selectedClient.state} {selectedClient.zipCode}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div style={{ borderBottomColor: 'rgba(215, 168, 89, 0.1)' }} className="grid grid-cols-4 gap-1.5 pb-4 border-b">
                  <button onClick={() => alert('Edit Client: Coming soon')} style={{ backgroundColor: '#102418', borderColor: 'rgba(215, 168, 89, 0.3)', color: '#d7a859' }} className="px-2 py-1.5 rounded border text-xs hover:opacity-80 flex items-center justify-center" title="Edit">
                    <Edit className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </button>
                  <button onClick={() => alert('New Event: Coming soon')} style={{ backgroundColor: '#102418', borderColor: 'rgba(215, 168, 89, 0.3)', color: '#d7a859' }} className="px-2 py-1.5 rounded border text-xs hover:opacity-80 flex items-center justify-center" title="New Event">
                    <Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </button>
                  <button onClick={() => alert('Send Email: Coming soon')} style={{ backgroundColor: '#102418', borderColor: 'rgba(215, 168, 89, 0.3)', color: '#d7a859' }} className="px-2 py-1.5 rounded border text-xs hover:opacity-80 flex items-center justify-center" title="Send Email">
                    <Send className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </button>
                  <button onClick={() => alert('More options: Coming soon')} style={{ backgroundColor: '#102418', borderColor: 'rgba(215, 168, 89, 0.3)', color: '#d7a859' }} className="px-2 py-1.5 rounded border text-xs hover:opacity-80 flex items-center justify-center" title="More">
                    <MoreVertical className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </button>
                </div>

                {/* Tabs */}
                <div style={{ borderBottomColor: 'rgba(215, 168, 89, 0.1)' }} className="border-b pb-2 flex gap-3 overflow-x-auto">
                  {(['overview', 'events', 'invoices', 'payments', 'notes', 'files'] as const).map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} style={{ borderBottomColor: activeTab === tab ? '#d7a859' : 'transparent', color: activeTab === tab ? '#d7a859' : '#a8d5ca' }} className="py-2 px-0.5 text-xs font-semibold border-b-2 whitespace-nowrap">
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                  <div className="space-y-4 text-xs">
                    {/* Summary Cards */}
                    <div>
                      <h4 style={{ color: '#d7a859' }} className="font-bold mb-2 text-xs">Client Summary</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { icon: Calendar, label: 'Total Events', value: selectedClient.eventCount.toString() },
                          { icon: DollarSign, label: 'Total Spent', value: '$' + selectedClient.totalSpent.toLocaleString() },
                          { icon: TrendingUp, label: 'Since First Event', value: '2.8 yrs' },
                          { icon: Users, label: 'Client Type', value: selectedClient.clientType || 'Regular' },
                        ].map((item, i) => {
                          const Icon = item.icon;
                          return (
                            <div key={i} style={{ backgroundColor: '#0a1911', borderColor: 'rgba(215, 168, 89, 0.1)' }} className="rounded p-2 border">
                              <Icon className="w-3 h-3 mb-1" style={{ color: '#d7a859' }} strokeWidth={1.5} />
                              <p style={{ color: '#a8d5ca' }} className="text-xs mb-0.5">{ item.label}</p>
                              <p style={{ color: item.label === 'Total Spent' ? '#d7a859' : '#ffffff' }} className="font-bold text-xs">{item.value}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Preferences & Tags */}
                    <div style={{ borderTopColor: 'rgba(215, 168, 89, 0.1)' }} className="grid grid-cols-2 gap-3 border-t pt-3">
                      <div>
                        <h4 style={{ color: '#d7a859' }} className="font-bold mb-2 text-xs">Preferences</h4>
                        <div className="space-y-1.5">
                          {['Prefers local/organic dishes', 'No shellfish (allergy)', 'Loves jollof rice & grilled chicken'].map((pref, i) => (
                            <label key={i} className="flex items-start gap-2 cursor-pointer">
                              <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#10b981' }} strokeWidth={2} />
                              <span style={{ color: '#ffffff' }} className="text-xs">{pref}</span>
                            </label>
                          ))}
                          <label className="flex items-start gap-2 cursor-pointer">
                            <Circle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#6b7280' }} strokeWidth={2} />
                            <span style={{ color: '#a8d5ca' }} className="text-xs">Prefers afternoon events</span>
                          </label>
                        </div>
                        <button style={{ color: '#d7a859' }} className="text-xs font-semibold mt-2 hover:opacity-80">View all →</button>
                      </div>

                      <div>
                        <h4 style={{ color: '#d7a859' }} className="font-bold mb-2 text-xs">Tags</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedClient.tags?.map((tag, i) => (
                            <span key={i} style={{ backgroundColor: 'rgba(215, 168, 89, 0.2)', color: '#d7a859' }} className="px-2 py-0.5 rounded text-xs font-semibold">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <button style={{ backgroundColor: 'rgba(215, 168, 89, 0.1)', color: '#d7a859', borderColor: 'rgba(215, 168, 89, 0.3)' }} className="px-2 py-0.5 rounded border text-xs font-semibold mt-2 hover:opacity-80">+ Add</button>
                      </div>
                    </div>

                    {/* Recent Activity & Notes */}
                    <div style={{ borderTopColor: 'rgba(215, 168, 89, 0.1)' }} className="grid grid-cols-2 gap-3 border-t pt-3">
                      <div>
                        <h4 style={{ color: '#d7a859' }} className="font-bold mb-2 text-xs">Recent Activity</h4>
                        <div className="space-y-2">
                          {[
                            { icon: '#10b981', title: 'Wedding completed', date: 'Jun 15...' },
                            { icon: '#fbbf24', title: 'Payment received', date: 'Jun 16, 2025' },
                            { icon: '#d7a859', title: 'Proposal sent', date: 'May 20, 2025' },
                          ].map((item, i) => (
                            <div key={i} className="flex gap-2">
                              <div style={{ backgroundColor: item.icon }} className="w-2 h-2 rounded-full mt-1 flex-shrink-0"></div>
                              <div>
                                <p style={{ color: '#ffffff' }} className="text-xs font-semibold">{item.title}</p>
                                <p style={{ color: '#a8d5ca' }} className="text-xs">{item.date}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <button style={{ color: '#d7a859' }} className="text-xs font-semibold mt-2 hover:opacity-80">View all →</button>
                      </div>

                      <div>
                        <h4 style={{ color: '#d7a859' }} className="font-bold mb-2 text-xs">Notes</h4>
                        <p style={{ color: '#a8d5ca' }} className="text-xs leading-relaxed">Amazing couple! Very organized and easy to work with.</p>
                        <p style={{ color: '#a8d5ca' }} className="text-xs mt-2">Next follow-up: Consider anniversary proposal in Dec 2025</p>
                        <button style={{ color: '#d7a859' }} className="text-xs font-semibold mt-2 hover:opacity-80">View all →</button>
                      </div>
                    </div>

                    {/* Upcoming Event */}
                    <div style={{ borderTopColor: 'rgba(215, 168, 89, 0.1)' }} className="border-t pt-3">
                      <h4 style={{ color: '#d7a859' }} className="font-bold mb-2 text-xs">Upcoming Event</h4>
                      <div className="grid grid-cols-3 gap-2">
                        <div style={{ backgroundColor: '#0a1911', borderColor: 'rgba(215, 168, 89, 0.1)' }} className="rounded p-2 border h-16 flex items-center justify-center">
                          📷
                        </div>
                        <div style={{ backgroundColor: '#0a1911', borderColor: 'rgba(215, 168, 89, 0.1)' }} className="rounded p-2 border">
                          <p style={{ color: '#ffffff' }} className="font-bold text-xs mb-1">Anniversary</p>
                          <p style={{ color: '#d7a859' }} className="text-xs">Jun 15, 2026</p>
                          <p style={{ color: '#a8d5ca' }} className="text-xs">Grand Pavilion</p>
                        </div>
                        <div style={{ backgroundColor: '#0a1911', borderColor: 'rgba(215, 168, 89, 0.1)' }} className="rounded p-2 border">
                          <p style={{ color: '#a8d5ca' }} className="text-xs mb-1">Estimated</p>
                          <p style={{ color: '#d7a859' }} className="font-bold text-sm">$3,250</p>
                          <button style={{ color: '#d7a859' }} className="text-xs font-semibold mt-1 hover:opacity-80">View</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {['events', 'invoices', 'payments', 'notes', 'files'].includes(activeTab) && (
                  <p style={{ color: '#a8d5ca' }} className="text-xs">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} coming soon</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
