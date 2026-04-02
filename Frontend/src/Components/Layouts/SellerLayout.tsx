// layouts/SellerLayout.tsx
import React, { useState, ReactNode } from 'react';
import { Menu } from 'lucide-react';
import { SellerSidebar } from '../Seller/Sidebar';

interface SellerLayoutProps {
  children: ReactNode;
  activePage: 'dashboard' | 'products' | 'orders' | 'sales-report';
  title: string;
  subtitle?: string;
}

export const SellerLayout: React.FC<SellerLayoutProps> = ({ 
  children, 
  activePage, 
  title,
  subtitle 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = (): void => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="hidden lg:flex">
        <div className="w-64 fixed left-0 top-0 bottom-0 bg-white border-r border-gray-200 z-30">
          <SellerSidebar activePage={activePage} />
        </div>
        <div className="w-64 flex-shrink-0"></div>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-40 w-64">
            <SellerSidebar 
              activePage={activePage} 
              onClose={() => setSidebarOpen(false)} 
            />
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="lg:hidden p-4 border-b border-gray-200 bg-white sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">{title}</h1>
              {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
            </div>
            <div className="w-10"></div>
          </div>
        </div>

        <div className="hidden lg:block p-8 pb-0">
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
        </div>

        <div className="p-4 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
};