'use client';

import React, { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@heroui/react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">CloudOptics Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">Cloud Cost Monitoring & Optimization</p>
          </div>

          {/* User Info & Sign Out */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
              <p className="text-xs text-gray-500">{session.user?.email}</p>
              {session.user?.role && (
                <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold bg-cyan-100 text-cyan-800 rounded">
                  {session.user.role}
                </span>
              )}
            </div>

            {session.user?.image && (
              <img
                src={session.user.image}
                alt={session.user.name}
                className="h-10 w-10 rounded-full"
              />
            )}

            <Button
              auto
              color="danger"
              onClick={() => signOut({ callbackUrl: '/auth/signin' })}
              className="ml-4"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Dashboard Coming Soon
          </h2>
          <p className="text-gray-600">
            The dashboard content will be implemented here. This includes:
          </p>
          <ul className="mt-4 text-left inline-block text-gray-600 space-y-2">
            <li>• KPI Cards (Total Spend, Budget, Active Alerts)</li>
            <li>• Cost Trends Chart</li>
            <li>• Service Breakdown Chart</li>
            <li>• Top Cost-Consuming Resources</li>
            <li>• Optimization Recommendations</li>
          </ul>
        </div>

        {/* Debug Info */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Session Info (Debug)</h3>
          <pre className="text-xs text-blue-800 overflow-auto">
            {JSON.stringify(
              {
                name: session.user?.name,
                email: session.user?.email,
                role: session.user?.role,
                id: session.user?.id,
              },
              null,
              2
            )}
          </pre>
        </div>
      </main>
    </div>
  );
}
