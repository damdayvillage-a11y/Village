'use client';

import { useState, useEffect } from 'react';
import { UserRole } from '@prisma/client';

interface RolePermission {
  role: UserRole;
  permissions: string[];
  description: string;
}

const rolePermissions: RolePermission[] = [
  {
    role: UserRole.ADMIN,
    permissions: ['All permissions', 'User management', 'Content management', 'System settings', 'Financial data'],
    description: 'Full system access with all administrative privileges',
  },
  {
    role: UserRole.VILLAGE_COUNCIL,
    permissions: ['Village content', 'Project approval', 'User moderation', 'Booking management', 'Reports'],
    description: 'Manage village content and approve community projects',
  },
  {
    role: UserRole.SELLER,
    permissions: ['Product management', 'Order management', 'Inventory', 'Shop analytics'],
    description: 'Manage marketplace products and orders',
  },
  {
    role: UserRole.HOST,
    permissions: ['Homestay management', 'Booking management', 'Availability', 'Guest communication'],
    description: 'Manage homestay listings and guest bookings',
  },
  {
    role: UserRole.OPERATOR,
    permissions: ['Manage operations', 'View analytics', 'Handle bookings', 'Customer support'],
    description: 'Operations team managing day-to-day activities',
  },
  {
    role: UserRole.GUEST,
    permissions: ['Book services', 'Purchase products', 'Leave reviews', 'View content'],
    description: 'Basic visitor access for bookings and purchases',
  },
];

interface RoleAssignment {
  userId: string;
  userName: string;
  userEmail: string;
  currentRole: UserRole;
  newRole?: UserRole;
  changedAt: Date;
  changedBy: string;
}

export default function RoleManager() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [recentAssignments, setRecentAssignments] = useState<RoleAssignment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load recent role assignments (would fetch from API in production)
    setRecentAssignments([]);
  }, []);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(selectedRole === role ? null : role);
  };

  return (
    <div className="space-y-6">
      {/* Role Permission Matrix */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Role Permission Matrix</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Permissions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rolePermissions.map((roleInfo) => (
                <tr key={roleInfo.role} className={selectedRole === roleInfo.role ? 'bg-blue-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {roleInfo.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{roleInfo.description}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {roleInfo.permissions.map((perm, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-700">
                          {perm}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleRoleSelect(roleInfo.role)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      {selectedRole === roleInfo.role ? 'Collapse' : 'Details'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Assignment History */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Role Changes</h2>
        {recentAssignments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No recent role changes</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Previous Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">New Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Changed By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentAssignments.map((assignment, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{assignment.userName}</div>
                        <div className="text-sm text-gray-500">{assignment.userEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                        {assignment.currentRole}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        {assignment.newRole}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{assignment.changedBy}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(assignment.changedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Role Guidelines */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Role Assignment Guidelines</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <p>• <strong>ADMIN</strong>: Only assign to trusted system administrators with technical knowledge</p>
          <p>• <strong>VILLAGE_COUNCIL</strong>: For community leaders managing village operations</p>
          <p>• <strong>SELLER</strong>: Merchants selling products in the marketplace</p>
          <p>• <strong>HOST</strong>: Homestay owners providing accommodation services</p>
          <p>• <strong>RESIDENT</strong>: Verified village residents with full participation rights</p>
          <p>• <strong>GUEST</strong>: Default role for new users and visitors</p>
        </div>
      </div>
    </div>
  );
}
