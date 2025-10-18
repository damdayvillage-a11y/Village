'use client';

import React, { useState } from 'react';
import { 
  Leaf, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Gift,
  ArrowUpRight,
  ArrowDownRight,
  History,
  Award,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Button } from '@/lib/components/ui/Button';
import { Badge } from '@/lib/components/ui/Badge';

interface CarbonCreditBalance {
  balance: number;
  totalEarned: number;
  totalSpent: number;
}

interface CarbonTransaction {
  id: string;
  type: 'EARN' | 'SPEND' | 'TRANSFER' | 'BONUS' | 'REFUND';
  amount: number;
  reason: string;
  description?: string;
  createdAt: string;
}

interface EarningOpportunity {
  id: string;
  title: string;
  description: string;
  credits: number;
  category: string;
  available: boolean;
}

interface CarbonCreditWalletProps {
  creditBalance: CarbonCreditBalance;
  transactions: CarbonTransaction[];
  earningOpportunities?: EarningOpportunity[];
  onEarnCredits?: (opportunityId: string) => Promise<void>;
  onSpendCredits?: (amount: number, reason: string) => Promise<void>;
}

export function CarbonCreditWallet({
  creditBalance,
  transactions,
  earningOpportunities = [],
  onEarnCredits,
  onSpendCredits
}: CarbonCreditWalletProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'earn' | 'spend' | 'history'>('overview');
  const [spendAmount, setSpendAmount] = useState(0);
  const [spendReason, setSpendReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'EARN':
      case 'BONUS':
      case 'REFUND':
        return <ArrowUpRight className="h-4 w-4 text-green-600" />;
      case 'SPEND':
        return <ArrowDownRight className="h-4 w-4 text-red-600" />;
      case 'TRANSFER':
        return <RefreshCw className="h-4 w-4 text-blue-600" />;
      default:
        return <History className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'EARN':
      case 'BONUS':
      case 'REFUND':
        return 'text-green-600';
      case 'SPEND':
        return 'text-red-600';
      case 'TRANSFER':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleEarnCredits = async (opportunityId: string) => {
    if (!onEarnCredits) return;
    
    setIsProcessing(true);
    try {
      await onEarnCredits(opportunityId);
    } catch (error) {
      console.error('Failed to earn credits:', error);
      alert('Failed to earn credits. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSpendCredits = async () => {
    if (!onSpendCredits || spendAmount <= 0 || !spendReason) {
      alert('Please enter a valid amount and reason');
      return;
    }

    if (spendAmount > creditBalance.balance) {
      alert('Insufficient balance');
      return;
    }

    setIsProcessing(true);
    try {
      await onSpendCredits(spendAmount, spendReason);
      setSpendAmount(0);
      setSpendReason('');
    } catch (error) {
      console.error('Failed to spend credits:', error);
      alert('Failed to spend credits. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Carbon Credit Wallet</h2>
        <p className="text-gray-600">Manage your carbon credits and track your environmental impact</p>
      </div>

      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current Balance */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 mb-1">Current Balance</p>
                <p className="text-3xl font-bold text-green-900">{creditBalance.balance.toFixed(2)}</p>
                <p className="text-xs text-green-600 mt-1">Carbon Credits</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Leaf className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Earned */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Earned</p>
                <p className="text-2xl font-bold text-gray-900">{creditBalance.totalEarned.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Spent */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">{creditBalance.totalSpent.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <TrendingDown className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('earn')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'earn'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Earn Credits
            </button>
            <button
              onClick={() => setActiveTab('spend')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'spend'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Spend Credits
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'history'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Transaction History
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Carbon Impact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <Award className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="text-sm text-green-700">CO₂ Offset</p>
                        <p className="text-xl font-bold text-green-900">
                          {(creditBalance.totalEarned * 0.1).toFixed(1)} kg
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                      <Gift className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="text-sm text-blue-700">Green Actions</p>
                        <p className="text-xl font-bold text-blue-900">
                          {transactions.filter(t => t.type === 'EARN').length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
                <div className="space-y-3">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getTransactionIcon(transaction.type)}
                        <div>
                          <p className="font-medium text-gray-900">{transaction.reason}</p>
                          {transaction.description && (
                            <p className="text-sm text-gray-600">{transaction.description}</p>
                          )}
                          <p className="text-xs text-gray-500">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className={`text-lg font-bold ${getTransactionColor(transaction.type)}`}>
                        {transaction.type === 'SPEND' ? '-' : '+'}{transaction.amount.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Earn Credits Tab */}
          {activeTab === 'earn' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Earning Opportunities</h3>
                <p className="text-gray-600 mb-4">Complete these actions to earn carbon credits</p>
              </div>

              {earningOpportunities.length === 0 ? (
                <div className="text-center py-8">
                  <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No earning opportunities available at the moment</p>
                  <p className="text-sm text-gray-500 mt-2">Check back later for new opportunities</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {earningOpportunities.map((opportunity) => (
                    <Card key={opportunity.id} className={opportunity.available ? 'hover:shadow-md transition-shadow' : 'opacity-60'}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{opportunity.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{opportunity.description}</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800 ml-2">
                            +{opportunity.credits}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{opportunity.category}</span>
                          <Button
                            size="sm"
                            variant={opportunity.available ? 'primary' : 'outline'}
                            disabled={!opportunity.available || isProcessing}
                            onClick={() => handleEarnCredits(opportunity.id)}
                          >
                            {opportunity.available ? 'Earn Now' : 'Completed'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Spend Credits Tab */}
          {activeTab === 'spend' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Redeem Your Credits</h3>
                <p className="text-gray-600 mb-4">Use your carbon credits for discounts or donations</p>
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Amount to Spend
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={creditBalance.balance}
                        step="0.1"
                        value={spendAmount}
                        onChange={(e) => setSpendAmount(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter amount"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Available: {creditBalance.balance.toFixed(2)} credits
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Purpose
                      </label>
                      <select
                        value={spendReason}
                        onChange={(e) => setSpendReason(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Select purpose</option>
                        <option value="discount">Redeem for Discount</option>
                        <option value="donation">Donate to Village Project</option>
                        <option value="offset">Purchase Carbon Offset</option>
                        <option value="gift">Gift to Another User</option>
                      </select>
                    </div>

                    {spendAmount > 0 && spendReason && (
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-700 mb-1">You will receive:</p>
                        <p className="text-lg font-bold text-blue-900">
                          {spendReason === 'discount' && `₹${(spendAmount * 10).toFixed(2)} discount`}
                          {spendReason === 'donation' && `Support for village projects`}
                          {spendReason === 'offset' && `${(spendAmount * 0.1).toFixed(1)} kg CO₂ offset`}
                          {spendReason === 'gift' && `${spendAmount.toFixed(2)} credits transfer`}
                        </p>
                      </div>
                    )}

                    <Button
                      variant="primary"
                      className="w-full"
                      disabled={isProcessing || spendAmount <= 0 || !spendReason}
                      onClick={handleSpendCredits}
                    >
                      <DollarSign className="h-4 w-4 mr-2" />
                      {isProcessing ? 'Processing...' : 'Redeem Credits'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Transaction History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">All Transactions</h3>
                <p className="text-sm text-gray-600">{transactions.length} transactions</p>
              </div>

              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No transactions yet</p>
                  <p className="text-sm text-gray-500 mt-2">Start earning credits to see your history</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <Card key={transaction.id} className="hover:shadow-sm transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            {getTransactionIcon(transaction.type)}
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-gray-900">{transaction.reason}</p>
                                <Badge className={
                                  transaction.type === 'EARN' || transaction.type === 'BONUS' || transaction.type === 'REFUND'
                                    ? 'bg-green-100 text-green-800'
                                    : transaction.type === 'SPEND'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-blue-100 text-blue-800'
                                }>
                                  {transaction.type}
                                </Badge>
                              </div>
                              {transaction.description && (
                                <p className="text-sm text-gray-600 mt-1">{transaction.description}</p>
                              )}
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(transaction.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <p className={`text-xl font-bold ${getTransactionColor(transaction.type)} ml-4`}>
                            {transaction.type === 'SPEND' ? '-' : '+'}{transaction.amount.toFixed(2)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
