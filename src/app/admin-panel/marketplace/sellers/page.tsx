"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Button } from '@/lib/components/ui/Button';
import { Input } from '@/lib/components/ui/Input';
import { Badge } from '@/lib/components/ui/Badge';
import {
  Store,
  Search,
  Eye,
  UserCheck,
  UserX,
  Loader2,
  DollarSign,
  Package,
  TrendingUp,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
} from 'lucide-react';

interface Seller {
  id: string;
  name: string;
  email: string;
  role: string;
  phoneNumber?: string;
  createdAt: string;
  _count?: {
    products: number;
  };
}

interface SellerStats {
  totalSellers: number;
  activeSellers: number;
  totalProducts: number;
  totalRevenue: number;
}

export default function SellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [stats, setStats] = useState<SellerStats>({
    totalSellers: 0,
    activeSellers: 0,
    totalProducts: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const fetchSellers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/users?role=SELLER');
      if (response.ok) {
        const data = await response.json();
        setSellers(data.users || []);
        
        // Calculate stats
        const totalSellers = data.users?.length || 0;
        const activeSellers = data.users?.filter((s: Seller) => s.role === 'SELLER').length || 0;
        const totalProducts = data.users?.reduce((sum: number, s: Seller) => 
          sum + (s._count?.products || 0), 0) || 0;
        
        setStats({
          totalSellers,
          activeSellers,
          totalProducts,
          totalRevenue: 0, // TODO: Implement revenue tracking
        });
      }
    } catch (error) {
      console.error('Failed to fetch sellers:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSellers();
  }, [fetchSellers]);

  const handleToggleSellerStatus = async (sellerId: string, currentRole: string) => {
    const newRole = currentRole === 'SELLER' ? 'USER' : 'SELLER';
    
    if (!confirm(`Are you sure you want to ${newRole === 'SELLER' ? 'approve' : 'revoke'} seller status?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${sellerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        await fetchSellers();
      } else {
        alert('Failed to update seller status');
      }
    } catch (error) {
      console.error('Error updating seller:', error);
      alert('Failed to update seller status');
    }
  };

  const handleViewDetails = (seller: Seller) => {
    setSelectedSeller(seller);
    setShowDetailsModal(true);
  };

  const filteredSellers = sellers.filter((seller) => {
    const matchesSearch = 
      seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && seller.role === 'SELLER') ||
      (statusFilter === 'inactive' && seller.role !== 'SELLER');

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Store className="h-8 w-8" />
            Seller Management
          </h1>
          <p className="text-gray-600 mt-1">Manage marketplace sellers and their products</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Sellers</CardTitle>
            <Store className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSellers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Sellers</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeSellers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">₹{stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-gray-500 mt-1">Coming soon</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active Sellers</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Sellers List */}
      <Card>
        <CardHeader>
          <CardTitle>Sellers ({filteredSellers.length})</CardTitle>
          <CardDescription>View and manage all sellers</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : filteredSellers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Store className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No sellers found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Seller
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Products
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSellers.map((seller) => (
                    <tr key={seller.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Store className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{seller.name}</div>
                            <div className="text-sm text-gray-500">{seller.id.substring(0, 8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{seller.email}</div>
                        {seller.phoneNumber && (
                          <div className="text-sm text-gray-500">{seller.phoneNumber}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium">{seller._count?.products || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          className={
                            seller.role === 'SELLER'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }
                        >
                          {seller.role === 'SELLER' ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(seller.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(seller)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant={seller.role === 'SELLER' ? 'destructive' : 'default'}
                          onClick={() => handleToggleSellerStatus(seller.id, seller.role)}
                        >
                          {seller.role === 'SELLER' ? (
                            <>
                              <UserX className="h-4 w-4 mr-1" />
                              Revoke
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-4 w-4 mr-1" />
                              Approve
                            </>
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Seller Details Modal */}
      {showDetailsModal && selectedSeller && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Seller Details
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail className="h-4 w-4" />
                    <span>{selectedSeller.email}</span>
                  </div>
                  {selectedSeller.phoneNumber && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="h-4 w-4" />
                      <span>{selectedSeller.phoneNumber}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="h-4 w-4" />
                    <span>Joined: {new Date(selectedSeller.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Products</span>
                        <Package className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="text-2xl font-bold mt-2">
                        {selectedSeller._count?.products || 0}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Revenue</span>
                        <TrendingUp className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="text-2xl font-bold mt-2">₹0.00</div>
                      <p className="text-xs text-gray-500">Coming soon</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Coming Soon Features */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900">Additional Features Coming Soon</h4>
                    <ul className="mt-2 space-y-1 text-sm text-blue-800">
                      <li>• Commission tracking</li>
                      <li>• Payout management</li>
                      <li>• Sales analytics</li>
                      <li>• Performance reports</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
