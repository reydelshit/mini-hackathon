import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { Toaster } from '@/components/ui/toaster';

const Admin = () => {
  return (
    <div className="bg-primary-bg h-full">
      <Header />
      <Sidebar />
      <Toaster />
    </div>
  );
};

export default Admin;
