import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Package, Briefcase, HelpCircle, LogOut, Menu, X } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/'); 
  };

  React.useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  const menuItems = [
    { name: 'Projeler', icon: <Briefcase size={22} />, path: '/admin/projects' },
    { name: 'Paket Yönetimi', icon: <Package size={22} />, path: '/admin/packages' },
    { name: 'S.S.S Yönetimi', icon: <HelpCircle size={22} />, path: '/admin/faqs' },
  ];

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex font-sans">
      

      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 bg-primary text-white p-3 rounded-xl shadow-lg hover:bg-dark transition"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>


      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
        ></div>
      )}


      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 
        flex flex-col z-40 shadow-2xl lg:shadow-none transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        <div className="h-24 flex flex-col items-center justify-center border-b border-gray-100">
          <h2 className="text-2xl font-black text-dark tracking-tighter">BUĞRA ŞENGÜL<span className="text-primary">.</span></h2>
        </div>

        <nav className="flex-1 p-6 space-y-3 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold text-lg ${
                  isActive 
                    ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-dark'
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-red-500 font-bold hover:bg-red-50 transition-colors text-lg"
          >
            <LogOut size={22} />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </aside>

    
      <main className="flex-1 lg:ml-72 p-4 md:p-8 lg:p-10 transition-all duration-300">
        <div className="max-w-[1600px] mx-auto mt-12 lg:mt-0">
           <Outlet />
        </div>
      </main>

    </div>
  );
};

export default AdminLayout;