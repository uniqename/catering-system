'use client';

import { useState, useMemo } from 'react';
import { Search, Plus, Filter, Download, ChevronLeft, ChevronRight, Mail, Phone, MapPin, Edit, Send, MessageSquare, MoreVertical, CheckCircle, Circle, Calendar, DollarSign, TrendingUp, Users, FileText, Image as ImageIcon } from 'lucide-react';

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
  preferences?: string[];
  notes?: string;
  clientType?: 'VIP' | 'Regular' | 'Referral';
}

const CardBorder = { boxShadow: '0 0 0 0.5px rgba(215, 168, 89, 0.08)' };

const STATUS_COLORS = {
  active: '#10b981',
  inactive: '#6b7280',
  lead: '#fbbf24'
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(index: number): string {
  const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#14b8a6', '#ec4899'];
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 style={{ color: '#d7a859' }} className="text-3xl font-bold mb-2">Clients</h2>
            <p style={{ color: '#a8d5ca' }} className="text-sm">Manage your clients and their history.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5" style={{ color: '#d7a859' }} />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                style={{ backgroundColor: '#0f2416', borderColor: 'rgba(215, 168, 89, 0.2)', color: '#ffffff' }}
                className="w-64 pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a1911]"
              />
            </div>
            <button
              onClick={onAddClient}
              style={{ backgroundColor: '#d7a859', color: '#0a1911' }}
              className="px-4 py-2 font-bold rounded-lg transition hover:opacity-90 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Add Client
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-5 mb-8">
          <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-5 border">
            <div className="flex items-center gap-3 mb-3">
              <div style={{ backgroundColor: '#102418' }} className="p-2 rounded-lg">
                <Users className="w-5 h-5" style={{ color: '#d7a859' }} strokeWidth={1.5} />
              </div>
              <p style={{ color: '#a8d5ca' }} className="text-xs font-semibold">Total Clients</p>
            </div>
            <p style={{ color: '#ffffff' }} className="text-4xl font-bold mb-1">{clients.length}</p>
            <p style={{ color: '#10b981' }} className="text-xs">+5 this month ↑</p>
          </div>

          <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-5 border">
            <div className="flex items-center gap-3 mb-3">
              <div style={{ backgroundColor: '#102418' }} className="p-2 rounded-lg">
                <Plus className="w-5 h-5" style={{ color: '#d7a859' }} strokeWidth={1.5} />
              </div>
              <p style={{ color: '#a8d5ca' }} className="text-xs font-semibold">New This Month</p>
            </div>
            <p style={{ color: '#ffffff' }} className="text-4xl font-bold mb-1">
              {clients.filter(c => {
                const date = new Date(c.createdAt);
                const now = new Date();
                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
              }).length}
            </p>
            <p style={{ color: '#fbbf24' }} className="text-xs">+25% vs last month ↑</p>
          </div>

          <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-5 border">
            <div className="flex items-center gap-3 mb-3">
              <div style={{ backgroundColor: '#102418' }} className="p-2 rounded-lg">
                <TrendingUp className="w-5 h-5" style={{ color: '#d7a859' }} strokeWidth={1.5} />
              </div>
              <p style={{ color: '#a8d5ca' }} className="text-xs font-semibold">Repeat Clients</p>
            </div>
            <p style={{ color: '#ffffff' }} className="text-4xl font-bold mb-1">
              {clients.filter(c => c.eventCount > 1).length}
            </p>
            <p style={{ color: '#a8d5ca' }} className="text-xs">67% of total clients</p>
          </div>

          <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-5 border">
            <div className="flex items-center gap-3 mb-3">
              <div style={{ backgroundColor: '#102418' }} className="p-2 rounded-lg">
                <DollarSign className="w-5 h-5" style={{ color: '#d7a859' }} strokeWidth={1.5} />
              </div>
              <p style={{ color: '#a8d5ca' }} className="text-xs font-semibold">Total Revenue</p>
            </div>
            <p style={{ color: '#d7a859' }} className="text-4xl font-bold mb-1">
              ${clients.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}
            </p>
            <p style={{ color: '#10b981' }} className="text-xs">+18% vs last month ↑</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Clients Table */}
          <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="lg:col-span-2 rounded-xl p-6 border">
            {/* Filters */}
            <div style={{ borderBottomColor: 'rgba(215, 168, 89, 0.1)' }} className="mb-6 flex items-center justify-between gap-4 pb-6 border-b">
              <div className="flex gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  style={{ backgroundColor: '#0a1911', borderColor: 'rgba(215, 168, 89, 0.2)', color: '#ffffff' }}
                  className="px-3 py-1.5 rounded text-xs font-semibold border focus:outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="lead">Lead</option>
                </select>

                <select
                  value={clientTypeFilter}
                  onChange={(e) => {
                    setClientTypeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{ backgroundColor: '#0a1911', borderColor: 'rgba(215, 168, 89, 0.2)', color: '#ffffff' }}
                  className="px-3 py-1.5 rounded text-xs font-semibold border focus:outline-none"
                >
                  <option value="all">All Client Types</option>
                  <option value="VIP">VIP</option>
                  <option value="Regular">Regular</option>
                  <option value="Referral">Referral</option>
                </select>

                <select
                  style={{ backgroundColor: '#0a1911', borderColor: 'rgba(215, 168, 89, 0.2)', color: '#ffffff' }}
                  className="px-3 py-1.5 rounded text-xs font-semibold border focus:outline-none"
                >
                  <option>All Tags</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button style={{ borderColor: 'rgba(215, 168, 89, 0.3)', color: '#d7a859' }} className="px-3 py-1.5 rounded border flex items-center gap-1 text-xs font-semibold hover:opacity-80 transition">
                  <Filter className="w-4 h-4" /> Filters
                </button>
                <button style={{ borderColor: 'rgba(215, 168, 89, 0.3)', color: '#d7a859' }} className="px-3 py-1.5 rounded border flex items-center gap-1 text-xs font-semibold hover:opacity-80 transition">
                  <Download className="w-4 h-4" /> Export
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottomColor: 'rgba(215, 168, 89, 0.1)' }} className="border-b">
                    <th style={{ color: '#d7a859' }} className="text-left py-3 px-4 font-bold">Client</th>
                    <th style={{ color: '#d7a859' }} className="text-left py-3 px-4 font-bold">Contact</th>
                    <th style={{ color: '#d7a859' }} className="text-left py-3 px-4 font-bold">Events</th>
                    <th style={{ color: '#d7a859' }} className="text-left py-3 px-4 font-bold">Total Spent</th>
                    <th style={{ color: '#d7a859' }} className="text-left py-3 px-4 font-bold">Last Event</th>
                    <th style={{ color: '#d7a859' }} className="text-left py-3 px-4 font-bold">Status</th>
                    <th style={{ color: '#d7a859' }} className="text-left py-3 px-4 font-bold">Tags</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedClients.map((client, idx) => (
                    <tr
                      key={client.id}
                      onClick={() => setSelectedClientId(client.id)}
                      style={{ borderBottomColor: 'rgba(215, 168, 89, 0.05)', backgroundColor: selectedClientId === client.id ? 'rgba(215, 168, 89, 0.1)' : 'transparent' }}
                      className="border-b hover:bg-[#102418] transition cursor-pointer"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            style={{ backgroundColor: getAvatarColor(idx) }}
                            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
                          >
                            {getInitials(client.name)}
                          </div>
                          <div>
                            <p style={{ color: '#ffffff' }} className="font-semibold">{client.name}</p>
                            {client.company && <p style={{ color: '#a8d5ca' }} className="text-xs">{client.company}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-xs space-y-1">
                          <p style={{ color: '#ffffff' }}>{client.phone}</p>
                          <p style={{ color: '#a8d5ca' }}>{client.email}</p>
                        </div>
                      </td>
                      <td style={{ color: '#ffffff' }} className="py-4 px-4">{client.eventCount}</td>
                      <td style={{ color: '#d7a859' }} className="py-4 px-4 font-bold">${client.totalSpent.toLocaleString()}</td>
                      <td style={{ color: '#ffffff' }} className="py-4 px-4">
                        {new Date(client.lastEventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          style={{ backgroundColor: STATUS_COLORS[client.status || 'active'], color: '#0a1911' }}
                          className="px-2 py-1 rounded text-xs font-bold"
                        >
                          {(client.status || 'active').charAt(0).toUpperCase() + (client.status || 'active').slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1">
                          {client.tags?.slice(0, 2).map((tag, i) => (
                            <span key={i} style={{ backgroundColor: 'rgba(215, 168, 89, 0.2)', color: '#d7a859' }} className="px-2 py-0.5 rounded text-xs font-semibold">
                              {tag}
                            </span>
                          ))}
                          {client.tags && client.tags.length > 2 && (
                            <span style={{ color: '#d7a859' }} className="px-2 py-0.5 text-xs font-semibold">
                              +{client.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ borderTopColor: 'rgba(215, 168, 89, 0.1)' }} className="mt-6 pt-6 border-t flex items-center justify-between">
                <p style={{ color: '#a8d5ca' }} className="text-xs">
                  Showing {paginatedClients.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredClients.length)} of {filteredClients.length} results
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    style={{ borderColor: 'rgba(215, 168, 89, 0.3)', color: currentPage === 1 ? '#666' : '#d7a859' }}
                    className="px-3 py-1 rounded border text-sm font-semibold disabled:opacity-50 transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      style={{
                        backgroundColor: currentPage === page ? '#d7a859' : '#0a1911',
                        borderColor: 'rgba(215, 168, 89, 0.3)',
                        color: currentPage === page ? '#0a1911' : '#d7a859'
                      }}
                      className="px-3 py-1 rounded border text-sm font-semibold hover:opacity-80 transition"
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    style={{ borderColor: 'rgba(215, 168, 89, 0.3)', color: currentPage === totalPages ? '#666' : '#d7a859' }}
                    className="px-3 py-1 rounded border text-sm font-semibold disabled:opacity-50 transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Client Details Sidebar */}
          {selectedClient && (
            <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl border h-fit overflow-y-auto max-h-[calc(100vh-200px)]">
              {/* Header */}
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-4 mb-4">
                  <div
                    style={{ backgroundColor: getAvatarColor(clients.indexOf(selectedClient)) }}
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
                  >
                    {getInitials(selectedClient.name)}
                  </div>
                  <div className="flex-1">
                    <h3 style={{ color: '#ffffff' }} className="text-lg font-bold">{selectedClient.name}</h3>
                    {selectedClient.company && <p style={{ color: '#a8d5ca' }} className="text-sm">{selectedClient.company}</p>}
                    <span
                      style={{ backgroundColor: STATUS_COLORS[selectedClient.status || 'active'], color: '#0a1911' }}
                      className="inline-block px-2 py-0.5 rounded text-xs font-bold mt-2"
                    >
                      {(selectedClient.status || 'active').charAt(0).toUpperCase() + (selectedClient.status || 'active').slice(1)}
                    </span>
                  </div>
                </div>

                {/* Contact Info */}
                <div style={{ borderBottomColor: 'rgba(215, 168, 89, 0.1)' }} className="space-y-2 text-sm pb-4 border-b">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" style={{ color: '#d7a859' }} />
                    <p style={{ color: '#ffffff' }}>{selectedClient.phone}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" style={{ color: '#d7a859' }} />
                    <p style={{ color: '#ffffff' }}>{selectedClient.email}</p>
                  </div>
                  {selectedClient.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#d7a859' }} />
                      <p style={{ color: '#ffffff' }}>
                        {selectedClient.address}<br />
                        {selectedClient.city}, {selectedClient.state} {selectedClient.zipCode}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons - 4 in a row */}
                <div className="grid grid-cols-4 gap-2">
                  <button style={{ backgroundColor: '#102418', borderColor: 'rgba(215, 168, 89, 0.3)', color: '#d7a859' }} className="px-2 py-2 rounded border text-xs font-semibold hover:opacity-80 transition flex items-center justify-center gap-1">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button style={{ backgroundColor: '#102418', borderColor: 'rgba(215, 168, 89, 0.3)', color: '#d7a859' }} className="px-2 py-2 rounded border text-xs font-semibold hover:opacity-80 transition flex items-center justify-center gap-1">
                    <Calendar className="w-4 h-4" />
                  </button>
                  <button style={{ backgroundColor: '#102418', borderColor: 'rgba(215, 168, 89, 0.3)', color: '#d7a859' }} className="px-2 py-2 rounded border text-xs font-semibold hover:opacity-80 transition flex items-center justify-center gap-1">
                    <Send className="w-4 h-4" />
                  </button>
                  <button style={{ backgroundColor: '#102418', borderColor: 'rgba(215, 168, 89, 0.3)', color: '#d7a859' }} className="px-2 py-2 rounded border text-xs font-semibold hover:opacity-80 transition flex items-center justify-center gap-1">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ borderBottomColor: 'rgba(215, 168, 89, 0.1)' }} className="border-b px-6 flex gap-4 overflow-x-auto">
                {(['overview', 'events', 'invoices', 'payments', 'notes', 'files'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      borderBottomColor: activeTab === tab ? '#d7a859' : 'transparent',
                      color: activeTab === tab ? '#d7a859' : '#a8d5ca'
                    }}
                    className="py-3 px-2 text-xs font-semibold border-b-2 transition whitespace-nowrap"
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6 space-y-6">
                {activeTab === 'overview' && (
                  <>
                    {/* Client Summary - 4 cards horizontal */}
                    <div>
                      <h4 style={{ color: '#d7a859' }} className="font-bold text-sm mb-4">Client Summary</h4>
                      <div className="grid grid-cols-4 gap-4">
                        <div style={{ backgroundColor: '#0a1911', borderColor: 'rgba(215, 168, 89, 0.1)' }} className="rounded-lg p-4 border">
                          <Calendar className="w-5 h-5" style={{ color: '#d7a859' }} strokeWidth={1.5} />
                          <p style={{ color: '#a8d5ca' }} className="text-xs font-semibold mt-3 mb-1">Total Events</p>
                          <p style={{ color: '#ffffff' }} className="text-2xl font-bold">{selectedClient.eventCount}</p>
                        </div>
                        <div style={{ backgroundColor: '#0a1911', borderColor: 'rgba(215, 168, 89, 0.1)' }} className="rounded-lg p-4 border">
                          <DollarSign className="w-5 h-5" style={{ color: '#d7a859' }} strokeWidth={1.5} />
                          <p style={{ color: '#a8d5ca' }} className="text-xs font-semibold mt-3 mb-1">Total Spent</p>
                          <p style={{ color: '#d7a859' }} className="text-2xl font-bold">${selectedClient.totalSpent.toLocaleString()}</p>
                        </div>
                        <div style={{ backgroundColor: '#0a1911', borderColor: 'rgba(215, 168, 89, 0.1)' }} className="rounded-lg p-4 border">
                          <TrendingUp className="w-5 h-5" style={{ color: '#d7a859' }} strokeWidth={1.5} />
                          <p style={{ color: '#a8d5ca' }} className="text-xs font-semibold mt-3 mb-1">Since First Event</p>
                          <p style={{ color: '#ffffff' }} className="text-sm font-bold">2.8 yrs</p>
                        </div>
                        <div style={{ backgroundColor: '#0a1911', borderColor: 'rgba(215, 168, 89, 0.1)' }} className="rounded-lg p-4 border">
                          <Users className="w-5 h-5" style={{ color: '#d7a859' }} strokeWidth={1.5} />
                          <p style={{ color: '#a8d5ca' }} className="text-xs font-semibold mt-3 mb-1">Client Type</p>
                          <p style={{ color: '#ffffff' }} className="text-sm font-bold">{selectedClient.clientType || 'Regular'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Preferences and Tags - 2 columns same section */}
                    <div style={{ borderTopColor: 'rgba(215, 168, 89, 0.1)' }} className="grid grid-cols-2 gap-6 border-t pt-6">
                      <div>
                        <h4 style={{ color: '#d7a859' }} className="font-bold text-sm mb-3">Preferences</h4>
                        <div className="space-y-3">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <CheckCircle className="w-5 h-5" style={{ color: '#10b981' }} strokeWidth={1.5} />
                            <span style={{ color: '#ffffff' }} className="text-sm">Prefers local/organic dishes</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <CheckCircle className="w-5 h-5" style={{ color: '#10b981' }} strokeWidth={1.5} />
                            <span style={{ color: '#ffffff' }} className="text-sm">No shellfish (allergy)</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <CheckCircle className="w-5 h-5" style={{ color: '#10b981' }} strokeWidth={1.5} />
                            <span style={{ color: '#ffffff' }} className="text-sm">Loves jollof rice & grilled chicken</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <Circle className="w-5 h-5" style={{ color: '#6b7280' }} strokeWidth={1.5} />
                            <span style={{ color: '#a8d5ca' }} className="text-sm">Prefers afternoon events</span>
                          </label>
                        </div>
                        <button style={{ color: '#d7a859' }} className="text-xs font-semibold mt-4 hover:opacity-80">
                          View all preferences →
                        </button>
                      </div>

                      <div>
                        <h4 style={{ color: '#d7a859' }} className="font-bold text-sm mb-3">Tags</h4>
                        {selectedClient.tags && selectedClient.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {selectedClient.tags.map((tag, i) => (
                              <span key={i} style={{ backgroundColor: 'rgba(215, 168, 89, 0.2)', color: '#d7a859' }} className="px-3 py-1 rounded text-xs font-semibold">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <button style={{ backgroundColor: 'rgba(215, 168, 89, 0.1)', color: '#d7a859', borderColor: 'rgba(215, 168, 89, 0.3)' }} className="px-3 py-1 rounded border text-xs font-semibold hover:opacity-80">
                          + Add Tag
                        </button>
                      </div>
                    </div>

                    {/* Recent Activity and Notes - same line */}
                    <div style={{ borderTopColor: 'rgba(215, 168, 89, 0.1)' }} className="grid grid-cols-2 gap-6 border-t pt-6">
                      <div>
                        <h4 style={{ color: '#d7a859' }} className="font-bold text-sm mb-4">Recent Activity</h4>
                        <div className="space-y-3 text-xs">
                          <div className="flex gap-3">
                            <div style={{ backgroundColor: '#10b981' }} className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"></div>
                            <div>
                              <p style={{ color: '#ffffff' }} className="font-semibold">Wedding completed</p>
                              <p style={{ color: '#a8d5ca' }}>Jun 15...</p>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <div style={{ backgroundColor: '#fbbf24' }} className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"></div>
                            <div>
                              <p style={{ color: '#ffffff' }} className="font-semibold">Payment received</p>
                              <p style={{ color: '#a8d5ca' }}>Invoice #INV-1003 paid</p>
                              <p style={{ color: '#a8d5ca' }}>Jun 16, 2025</p>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <div style={{ backgroundColor: '#d7a859' }} className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"></div>
                            <div>
                              <p style={{ color: '#ffffff' }} className="font-semibold">Proposal sent</p>
                              <p style={{ color: '#a8d5ca' }}>May 20, 2025</p>
                            </div>
                          </div>
                        </div>
                        <button style={{ color: '#d7a859' }} className="text-xs font-semibold mt-4 hover:opacity-80">
                          View all activity →
                        </button>
                      </div>

                      <div>
                        <h4 style={{ color: '#d7a859' }} className="font-bold text-sm mb-4">Notes</h4>
                        <p style={{ color: '#a8d5ca' }} className="text-xs leading-relaxed">Amazing couple! Very organized and easy to work with. Looking forward to future events.</p>
                        <p style={{ color: '#a8d5ca' }} className="text-xs mt-3">Next follow-up: Consider anniversary event proposal in Dec 2025</p>
                        <button style={{ color: '#d7a859' }} className="text-xs font-semibold mt-4 hover:opacity-80">
                          View all notes →
                        </button>
                      </div>
                    </div>

                    {/* Upcoming Event - Image, Event, Estimates as 3 cards */}
                    <div style={{ borderTopColor: 'rgba(215, 168, 89, 0.1)' }} className="border-t pt-6">
                      <h4 style={{ color: '#d7a859' }} className="font-bold text-sm mb-4">Upcoming Event</h4>
                      <div className="grid grid-cols-3 gap-4">
                        {/* Image Card */}
                        <div style={{ backgroundColor: '#0a1911', borderColor: 'rgba(215, 168, 89, 0.1)' }} className="rounded-lg p-4 border flex items-center justify-center h-32">
                          <ImageIcon className="w-8 h-8" style={{ color: '#d7a859' }} strokeWidth={1.5} opacity={0.5} />
                        </div>

                        {/* Event Card */}
                        <div style={{ backgroundColor: '#0a1911', borderColor: 'rgba(215, 168, 89, 0.1)' }} className="rounded-lg p-4 border">
                          <p style={{ color: '#ffffff' }} className="font-semibold text-sm">Amelia & James Anniversary</p>
                          <div className="space-y-2 mt-3 text-xs">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" style={{ color: '#d7a859' }} strokeWidth={1.5} />
                              <p style={{ color: '#d7a859' }} className="font-semibold">Jun 15, 2026</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" style={{ color: '#d7a859' }} strokeWidth={1.5} />
                              <p style={{ color: '#ffffff' }}>The Grand Pavilion</p>
                            </div>
                          </div>
                          <span style={{ backgroundColor: '#10b981', color: '#0a1911' }} className="inline-block px-2 py-1 rounded text-xs font-bold mt-3">
                            Confirmed
                          </span>
                        </div>

                        {/* Estimates Card */}
                        <div style={{ backgroundColor: '#0a1911', borderColor: 'rgba(215, 168, 89, 0.1)' }} className="rounded-lg p-4 border">
                          <p style={{ color: '#a8d5ca' }} className="text-xs font-semibold mb-3">Estimated</p>
                          <p style={{ color: '#d7a859' }} className="text-2xl font-bold">$3,250</p>
                          <button style={{ backgroundColor: 'rgba(215, 168, 89, 0.1)', color: '#d7a859' }} className="w-full mt-4 py-2 rounded text-xs font-semibold hover:opacity-80 transition">
                            View Event
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'events' && (
                  <div>
                    <p style={{ color: '#a8d5ca' }} className="text-sm">Event history coming soon</p>
                  </div>
                )}

                {activeTab === 'invoices' && (
                  <div>
                    <p style={{ color: '#a8d5ca' }} className="text-sm">Invoice history coming soon</p>
                  </div>
                )}

                {activeTab === 'payments' && (
                  <div>
                    <p style={{ color: '#a8d5ca' }} className="text-sm">Payment history coming soon</p>
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div>
                    <p style={{ color: '#a8d5ca' }} className="text-sm">Notes coming soon</p>
                  </div>
                )}

                {activeTab === 'files' && (
                  <div>
                    <p style={{ color: '#a8d5ca' }} className="text-sm">No files attached</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
