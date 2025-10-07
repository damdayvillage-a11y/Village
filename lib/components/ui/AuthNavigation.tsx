'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { User, LogOut, UserCircle, Shield } from 'lucide-react';
import { Button } from './Button';

export function AuthNavigation() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center space-x-4">
        <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
        <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
      </div>
    );
  }

  if (status === 'authenticated' && session?.user) {
    const isAdmin = session.user.role === 'ADMIN';
    const isVillageCouncil = session.user.role === 'VILLAGE_COUNCIL';
    const hasManagementAccess = isAdmin || isVillageCouncil;

    return (
      <div className="flex items-center space-x-4">
        {/* User Panel Link */}
        <Link href="/user-panel">
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <UserCircle className="h-4 w-4" />
            <span>My Panel</span>
          </Button>
        </Link>

        {/* Admin Panel Link - Only for authorized users */}
        {hasManagementAccess && (
          <Link href="/admin-panel">
            <Button variant="outline" size="sm" className="flex items-center space-x-2 border-orange-300 text-orange-600 hover:bg-orange-50">
              <Shield className="h-4 w-4" />
              <span>Admin</span>
            </Button>
          </Link>
        )}

        {/* User Menu */}
        <div className="flex items-center space-x-3">
          <div className="text-sm">
            <span className="text-gray-600">Welcome, </span>
            <span className="font-medium text-gray-900">{session.user.name}</span>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <Link href="/auth/signin">
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <User className="h-4 w-4" />
          <span>Sign In</span>
        </Button>
      </Link>
      <Link href="/auth/signup">
        <Button size="sm" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium">
          Sign Up
        </Button>
      </Link>
    </div>
  );
}