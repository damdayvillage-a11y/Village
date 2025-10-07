'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/lib/components/ui/Button';
import { Input } from '@/lib/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Badge } from '@/lib/components/ui/Badge';
import { Avatar } from '@/lib/components/ui/Avatar';
import { 
  Users,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Shield,
  Ban,
  CheckCircle,
  Mail,
  Calendar,
  UserPlus
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'VILLAGE_COUNCIL' | 'HOST' | 'SELLER' | 'GUEST';
  status: 'active' | 'inactive' | 'suspended';
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
  verified: boolean;
}

interface UserManagementProps {
  onUserUpdate: (userId: string, updates: Partial<User>) => void;
}

export function UserManagement({ onUserUpdate }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      // TODO: Replace with actual API call
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'Sita Devi',
          email: 'sita@damdayvillage.com',
          role: 'HOST',
          status: 'active',
          avatar: '/avatars/sita.jpg',
          createdAt: '2024-01-15T10:00:00Z',
          lastLogin: '2024-01-20T14:30:00Z',
          verified: true
        },
        {
          id: '2',
          name: 'Ram Singh',
          email: 'ram@damdayvillage.com',
          role: 'HOST',
          status: 'active',
          createdAt: '2024-01-10T09:00:00Z',
          lastLogin: '2024-01-19T16:45:00Z',
          verified: true
        },
        {
          id: '3',
          name: 'Priya Sharma',
          email: 'priya@email.com',
          role: 'GUEST',
          status: 'active',
          createdAt: '2024-01-18T12:00:00Z',
          lastLogin: '2024-01-20T08:15:00Z',
          verified: true
        },
        {
          id: '4',
          name: 'John Doe',
          email: 'john@email.com',
          role: 'GUEST',
          status: 'inactive',
          createdAt: '2024-01-05T15:30:00Z',
          verified: false
        },
        {
          id: '5',
          name: 'Village Admin',
          email: 'admin@damdayvillage.com',
          role: 'ADMIN',
          status: 'active',
          createdAt: '2023-12-01T10:00:00Z',
          lastLogin: '2024-01-20T18:00:00Z',
          verified: true
        }
      ];
      
      setUsers(mockUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await onUserUpdate(userId, { role: newRole as any });
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole as any } : user
      ));
    } catch (error) {
      console.error('Failed to update user role:', error);
    }
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      await onUserUpdate(userId, { status: newStatus as any });
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status: newStatus as any } : user
      ));
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'VILLAGE_COUNCIL':
        return 'bg-purple-100 text-purple-800';
      case 'HOST':
        return 'bg-green-100 text-green-800';
      case 'SELLER':
        return 'bg-blue-100 text-blue-800';
      case 'GUEST':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage users, roles, and permissions</p>
        </div>
        <Button variant="primary" icon={<UserPlus className="h-4 w-4" />}>
          Add User
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="VILLAGE_COUNCIL">Village Council</option>
              <option value="HOST">Host</option>
              <option value="SELLER">Seller</option>
              <option value="GUEST">Guest</option>
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {filteredUsers.length} of {users.length} users
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">User</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Role</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Last Login</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <Avatar
                          src={user.avatar}
                          alt={user.name}
                          initials={user.name.split(' ').map(n => n[0]).join('')}
                          size="sm"
                        />
                        <div>
                          <div className="font-medium text-gray-900 flex items-center">
                            {user.name}
                            {user.verified && (
                              <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${getRoleColor(user.role)}`}
                        disabled={user.id === '5'} // Prevent changing admin role
                      >
                        <option value="ADMIN">Admin</option>
                        <option value="VILLAGE_COUNCIL">Village Council</option>
                        <option value="HOST">Host</option>
                        <option value="SELLER">Seller</option>
                        <option value="GUEST">Guest</option>
                      </select>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={user.status}
                        onChange={(e) => handleStatusChange(user.id, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(user.status)}`}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {user.lastLogin ? (
                        <div>
                          <div>{new Date(user.lastLogin).toLocaleDateString()}</div>
                          <div className="text-xs">
                            {new Date(user.lastLogin).toLocaleTimeString()}
                          </div>
                        </div>
                      ) : (
                        'Never'
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}