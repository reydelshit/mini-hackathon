import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';

import Admin from './admin/Admin';
import { Toaster } from './components/ui/toaster';
import Payment from './pages/Payment';
import Layout from './root/Layout';
import LayoutUser from './root/LayoutUser';
import Footer from './admin/components/Footer';

function App() {
  return (
    <div className="relative h-dvh w-dvw items-center overflow-x-hidden ">
      <Routes>
        <Route path="/" element={<LayoutUser />} />
        <Route path="/login" element={<Login />} />
        <Route>
          <Route path="/pay/:event_name/:event_id" element={<Payment />} />
        </Route>
        <Route
          path="/admin/*"
          element={
            <Layout>
              <Admin />
            </Layout>
          }
        />
      </Routes>
      <Toaster />

      <Footer />
    </div>
  );
}

export default App;
