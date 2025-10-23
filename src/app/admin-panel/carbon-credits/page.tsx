"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Button } from '@/lib/components/ui/Button';
import { Input } from '@/lib/components/ui/Input';
import { Badge } from '@/lib/components/ui/Badge';
import {
  Leaf,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Activity,
  Search,
  Download,
  Plus,
  Minus,
  RefreshCw,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

interface CarbonStats {
  totalCredits: number;
  totalUsers: number;
  totalEarned: number;
  totalSpent: number;
  totalOffset: number;
  avgCreditsPerUser: number;
}

interface CarbonUser {
  id: string;
  name: string;
  email: string;
  balance: number;
  totalEarned: number;
  totalSpent: number;
  lastTransaction?: string;
}

interface Transaction {
  id: string;
  userId: string;
  userName: string;
  type: string;
  amount: number;
  reason: string;
  createdAt: string;
}

export default function CarbonCreditsPage() {
  const [stats, setStats] = useState<CarbonStats>({
    totalCredits: 0,
    totalUsers: 0,
    totalEarned: 0,
    totalSpent: 0,
    totalOffset: 0,
    avgCreditsPerUser: 0,
  });
  const [users, setUsers] = useState<CarbonUser[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustReason, setAdjustReason] = useState('');
  const [showAdjustModal, setShowAdjustModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch carbon credit stats
      const statsRes = await fetch('/api/admin/carbon/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // Fetch users with carbon credits
      const usersRes = await fetch('/api/admin/carbon/users');
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      }

      // Fetch recent transactions
      const transRes = await fetch('/api/admin/carbon/transactions?limit=20');
      if (transRes.ok) {
        const transData = await transRes.json();
        setTransactions(transData.transactions || []);
      }
    } catch (error) {
      console.error('Failed to fetch carbon credit data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustCredits = async () => {
    if (!selectedUser || !adjustAmount) return;

    try {
      const response = await fetch('/api/admin/carbon/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser,
          amount: parseFloat(adjustAmount),
          reason: adjustReason || 'Manual adjustment',
        }),
      });

      if (response.ok) {
        setShowAdjustModal(false);
        setSelectedUser(null);
        setAdjustAmount('');
        setAdjustReason('');
        await fetchData();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to adjust credits');
      }
    } catch (error) {
      console.error('Error adjusting credits:', error);
      alert('Failed to adjust credits');
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTransactionBadge = (type: string) => {
    const colors: { [key: string]: string } = {
      EARN: 'bg-green-100 text-green-800',
      SPEND: 'bg-red-100 text-red-800',
      TRANSFER: 'bg-blue-100 text-blue-800',
      BONUS: 'bg-purple-100 text-purple-800',
      REFUND: 'bg-yellow-100 text-yellow-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Leaf className="h-8 w-8 text-green-600" />
          Carbon Credit Management
        </h1>
        <p className="text-gray-600 mt-2">
          Monitor and manage carbon credits, transactions, and environmental impact
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {stats.totalCredits.toFixed(1)}
                </div>
                <div className="text-xs text-gray-600">Total Credits</div>
              </div>
              <Leaf className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <div className="text-xs text-gray-600">Active Users</div>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {stats.totalEarned.toFixed(1)}
                </div>
                <div className="text-xs text-gray-600">Credits Earned</div>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {stats.totalSpent.toFixed(1)}
                </div>
                <div className="text-xs text-gray-600">Credits Spent</div>
              </div>
              <TrendingDown className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.totalOffset.toFixed(1)}
                </div>
                <div className="text-xs text-gray-600">CO₂ Offset (kg)</div>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {stats.avgCreditsPerUser.toFixed(1)}
                </div>
                <div className="text-xs text-gray-600">Avg/User</div>
              </div>
              <DollarSign className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Users with Credits */}
        <Card>
          <CardHeader>
            <CardTitle>Users with Carbon Credits</CardTitle>
            <CardDescription>View and manage user carbon credit balances</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="p-3 border rounded-lg hover:bg-gray-50 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        Earned: {user.totalEarned.toFixed(1)} | Spent:{' '}
                        {user.totalSpent.toFixed(1)}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          {user.balance.toFixed(1)}
                        </div>
                        <div className="text-xs text-gray-500">credits</div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedUser(user.id);
                          setShowAdjustModal(true);
                        }}
                      >
                        Adjust
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest carbon credit transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {transactions.map((trans) => (
                  <div
                    key={trans.id}
                    className="p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            {trans.userName}
                          </span>
                          <Badge className={getTransactionBadge(trans.type)}>
                            {trans.type}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {trans.reason}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(trans.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-lg font-bold flex items-center gap-1 ${
                            trans.type === 'EARN' ||
                            trans.type === 'BONUS' ||
                            trans.type === 'REFUND'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {trans.type === 'EARN' ||
                          trans.type === 'BONUS' ||
                          trans.type === 'REFUND' ? (
                            <ArrowUpRight className="h-4 w-4" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4" />
                          )}
                          {Math.abs(trans.amount).toFixed(1)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Adjust Credits Modal */}
      {showAdjustModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Adjust Carbon Credits</CardTitle>
              <CardDescription>
                Add or remove credits for selected user
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Amount (positive to add, negative to remove)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  placeholder="e.g., 10 or -5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reason</label>
                <Input
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g., Manual adjustment, Bonus, Correction"
                />
              </div>
            </CardContent>
            <div className="p-6 border-t flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAdjustModal(false);
                  setSelectedUser(null);
                  setAdjustAmount('');
                  setAdjustReason('');
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAdjustCredits}>Adjust Credits</Button>
            </div>
          </Card>
        </div>
      )}

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage carbon credit system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={fetchData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Transactions
            </Button>
            <Button variant="outline">
              <Activity className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Bulk Award Credits
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
