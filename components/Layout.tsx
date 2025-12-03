import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ListTodo, LogOut, HardHat, UserCircle } from 'lucide-react';
import { User, UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return <>{children}</>;

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'Pendências', icon: ListTodo, path: '/issues' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="bg-accent/10 p-2 rounded-lg text-accent">
            <HardHat size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-900 leading-tight">ObraSync</h1>
            <p className="text-xs text-slate-500 font-medium">Gestão de Obra</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-accent/5 text-accent' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-4 px-2">
             <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                {user.avatar_url ? <img src={user.avatar_url} alt="Av" /> : <UserCircle className="text-slate-400" />}
             </div>
             <div className="overflow-hidden">
               <p className="text-sm font-semibold truncate text-slate-800">{user.full_name}</p>
               <p className="text-xs text-slate-500 truncate capitalize">{user.role === UserRole.ADMIN ? 'Engenharia' : 'Encarregado'}</p>
             </div>
          </div>
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen pb-20 md:pb-0">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-30 flex items-center justify-between shadow-sm">
           <div className="flex items-center gap-2">
              <HardHat className="text-accent" size={24} />
              <span className="font-bold text-slate-900">ObraSync</span>
           </div>
           <div className="text-xs font-medium px-2 py-1 bg-slate-100 rounded text-slate-600">
             {user.role === UserRole.ADMIN ? 'Admin' : 'Campo'}
           </div>
        </div>
        
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 pb-safe">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-full space-y-1 ${
                  isActive ? 'text-accent' : 'text-slate-400'
                }`
              }
            >
              <item.icon size={22} className={location.pathname === item.path ? 'fill-current opacity-20' : ''} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          ))}
           <button
            onClick={onLogout}
            className="flex flex-col items-center justify-center w-full h-full space-y-1 text-slate-400"
          >
            <LogOut size={22} />
            <span className="text-[10px] font-medium">Sair</span>
          </button>
        </div>
      </nav>
    </div>
  );
};