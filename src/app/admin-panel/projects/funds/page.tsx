"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Button } from '@/lib/components/ui/Button';
import { Input } from '@/lib/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/lib/components/ui/select';
import { Badge } from '@/lib/components/ui/Badge';
import {
  Loader2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
  RefreshCw,
  Search,
  Filter,
  Calendar as CalendarIcon,
} from 'lucide-react';

interface Transaction {
  id: string;
  amount: number;
  type: 'CONTRIBUTION' | 'ALLOCATION' | 'DISBURSEMENT' | 'REFUND';
  projectId: string;
  projectName: string;
  userId?: string;
  userName?: string;
  description: string;
  timestamp: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
}

interface FundStats {
  totalRaised: number;
  totalAllocated: number;
  totalDisbursed: number;
  availableFunds: number;
  contributionsCount: number;
  projectsCount: number;
}

export default function FundManagementPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<FundStats>({
    totalRaised: 0,
    totalAllocated: 0,
    totalDisbursed: 0,
    availableFunds: 0,
    contributionsCount: 0,
    projectsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (typeFilter && typeFilter !== 'all') {
        params.append('type', typeFilter);
      }
      if (statusFilter && statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      
      const res = await fetch(`/api/admin/projects/funds?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions || []);
        setStats(data.stats || stats);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  }, [typeFilter, statusFilter]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const filteredTransactions = transactions.filter((tx) =>
    tx.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.userName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'CONTRIBUTION':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'DISBURSEMENT':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'ALLOCATION':
        return <DollarSign className="w-4 h-4 text-blue-600" />;
      case 'REFUND':
        return <TrendingDown className="w-4 h-4 text-yellow-600" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'CONTRIBUTION':
        return 'bg-green-100 text-green-800';
      case 'DISBURSEMENT':
        return 'bg-red-100 text-red-800';
      case 'ALLOCATION':
        return 'bg-blue-100 text-blue-800';
      case 'REFUND':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && transactions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fund Management</h1>
          <p className="text-muted-foreground">
            Track funding, allocations, and disbursements
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchTransactions}>
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${(stats.totalRaised / 1000).toFixed(1)}K
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Allocated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${(stats.totalAllocated / 1000).toFixed(1)}K
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Disbursed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${(stats.totalDisbursed / 1000).toFixed(1)}K
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Available Funds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              ${(stats.availableFunds / 1000).toFixed(1)}K
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Contributors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.contributionsCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.projectsCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Transaction type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="CONTRIBUTION">Contributions</SelectItem>
                <SelectItem value="ALLOCATION">Allocations</SelectItem>
                <SelectItem value="DISBURSEMENT">Disbursements</SelectItem>
                <SelectItem value="REFUND">Refunds</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Ledger */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Ledger</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No transactions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Date</th>
                    <th className="text-left p-3 font-medium">Type</th>
                    <th className="text-left p-3 font-medium">Project</th>
                    <th className="text-left p-3 font-medium">User</th>
                    <th className="text-left p-3 font-medium">Description</th>
                    <th className="text-right p-3 font-medium">Amount</th>
                    <th className="text-left p-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b hover:bg-muted/50">
                      <td className="p-3 text-sm text-muted-foreground">
                        {new Date(tx.timestamp).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(tx.type)}
                          <Badge className={getTypeColor(tx.type)}>
                            {tx.type}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-3 font-medium">{tx.projectName}</td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {tx.userName || 'System'}
                      </td>
                      <td className="p-3 text-sm">{tx.description}</td>
                      <td className="p-3 text-right font-semibold">
                        <span
                          className={
                            tx.type === 'CONTRIBUTION' || tx.type === 'ALLOCATION'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }
                        >
                          {tx.type === 'CONTRIBUTION' || tx.type === 'ALLOCATION' ? '+' : '-'}$
                          {tx.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="p-3">
                        <Badge className={getStatusColor(tx.status)}>{tx.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
