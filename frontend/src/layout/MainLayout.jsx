import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import Topbar from '../components/Topbar/Topbar';
import Layout from './Layout';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} isMobile />

      {sidebarOpen ? (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <div className="lg:pl-72">
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          searchValue={searchValue}
          onSearchChange={(event) => setSearchValue(event.target.value)}
        />
        <main className="px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
          <Layout>
            <Outlet context={{ searchValue }} />
          </Layout>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
