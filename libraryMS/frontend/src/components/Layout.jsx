import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import useOverdueCount from '../hooks/useOverdueCount';
import { 
  BookOpen, 
  Home, 
  User, 
  Users, 
  FileText, 
  LogOut, 
  Menu, 
  X,
  Library,
  Download,
  ClipboardList
} from 'lucide-react';

const Layout = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const overdueCount = useOverdueCount();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Browse Books', href: '/books', icon: BookOpen },
    { name: 'My Borrowings', href: '/profile', icon: ClipboardList },
  ];

  const adminNavigation = [
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Transactions', href: '/admin/transactions', icon: FileText },
  ];

  // Generate user initials
  const initials = `${user?.firstName?.charAt(0) || ''}${user?.lastName?.charAt(0) || ''}`.toUpperCase();

  const NavItem = ({ item, mobile = false }) => (
    <NavLink
      to={item.href}
      className={({ isActive }) =>
        `group flex items-center gap-2 px-2.5 py-2 text-xs font-body rounded-md transition-all duration-200 ${
          isActive
            ? 'bg-ak-mahogany-light border-l-2 border-ak-gold text-ak-parchment font-semibold'
            : 'text-ak-gold-dim hover:bg-ak-mahogany-light/50 hover:text-ak-parchment border-l-2 border-transparent'
        } ${mobile ? 'text-sm px-3 py-2.5' : ''}`
      }
      onClick={() => mobile && setSidebarOpen(false)}
    >
      <item.icon
        className={`flex-shrink-0 h-3.5 w-3.5 ${mobile ? 'h-5 w-5' : ''}`}
        aria-hidden="true"
      />
      <span className="flex-1">{item.name}</span>
      {item.name === 'Browse Books' && !isAdmin && overdueCount > 0 && (
        <span className="ml-2 h-2 w-2 rounded-full bg-ak-terracotta flex-shrink-0" />
      )}
    </NavLink>
  );

  const SidebarContent = ({ mobile = false }) => (
    <>
      {/* Navigation */}
      <nav className={`px-2 space-y-0.5 ${mobile ? 'pt-2' : 'pt-2.5'}`}>
        {navigation.map((item) => (
          <NavItem key={item.name} item={item} mobile={mobile} />
        ))}
        
        {isAdmin && (
          <div className="pt-3 mt-3 border-t border-ak-border-subtle">
            <p className="px-2.5 text-[9px] font-body font-semibold text-ak-section-label uppercase tracking-wider mb-1">
              Admin
            </p>
            <div className="space-y-0.5">
              {adminNavigation.map((item) => (
                <NavItem key={item.name} item={item} mobile={mobile} />
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );

  return (
    <div className="h-screen flex bg-ak-ebony">
      {/* Mobile sidebar overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          sidebarOpen ? 'block' : 'hidden'
        }`}
      >
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
        
        {/* Mobile sidebar */}
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-ak-ebony-deep shadow-xl border-r border-ak-border-subtle">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ak-gold"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-ak-parchment" aria-hidden="true" />
            </button>
          </div>
          
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center gap-2 px-4 mb-6">
              <div className="w-7 h-7 bg-ak-gold rounded-md flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-ak-ebony" />
              </div>
              <span className="font-display text-base font-semibold text-ak-parchment">Akosombo</span>
              <span className="font-body text-[10px] text-ak-gold-dim ml-0.5">Library</span>
            </div>
            
            <SidebarContent mobile />
          </div>
          
          {/* User section */}
          <div className="flex-shrink-0 border-t border-ak-border-subtle p-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-ak-mahogany-light rounded-full border-[1.5px] border-ak-gold flex items-center justify-center">
                <span className="font-display text-[10px] font-semibold text-ak-gold">{initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-[11px] font-semibold text-ak-warm-text truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="font-body text-[10px] text-ak-dark-text capitalize">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 text-ak-gold-dim hover:text-ak-terracotta rounded-md hover:bg-ak-mahogany-light transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-52">
          <div className="flex flex-col h-0 flex-1 bg-ak-ebony-deep border-r border-ak-border-subtle">
            {/* Logo */}
            <div className="flex items-center gap-2 h-14 flex-shrink-0 px-4 border-b border-ak-border-subtle">
              <div className="w-6 h-6 bg-ak-gold rounded-[5px] flex items-center justify-center">
                <BookOpen className="h-3.5 w-3.5 text-ak-ebony" />
              </div>
              <span className="font-display text-[15px] font-semibold text-ak-parchment">Akosombo</span>
            </div>
            
            {/* Nav items */}
            <div className="flex-1 flex flex-col overflow-y-auto">
              <SidebarContent />
            </div>
            
            {/* User section */}
            <div className="flex-shrink-0 border-t border-ak-border-subtle p-3 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-ak-mahogany-light rounded-full border-[1.5px] border-ak-gold flex items-center justify-center flex-shrink-0">
                  <span className="font-display text-[10px] font-semibold text-ak-gold">{initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-[11px] font-semibold text-ak-warm-text truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="font-body text-[10px] text-ak-dark-text capitalize">{user?.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-ak-gold-dim hover:text-ak-terracotta rounded-md hover:bg-ak-mahogany-light transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between bg-ak-ebony-deep px-4 py-2 border-b border-ak-border-subtle">
            <button
              type="button"
              className="p-2 rounded-md text-ak-gold-dim hover:text-ak-gold hover:bg-ak-mahogany-light focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ak-gold"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
            
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-ak-gold rounded-md flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-ak-ebony" />
              </div>
              <span className="font-display text-base font-semibold text-ak-parchment">Akosombo</span>
            </div>
            
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-ak-ebony">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;