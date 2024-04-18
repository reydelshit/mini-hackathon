import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';

import Admin from './admin/Admin';
import Layout from './root/Layout';
import Payment from './pages/Payment';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <div className="h-dvh w-dvw items-center  overflow-x-hidden ">
      <Routes>
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
    </div>
  );
}

export default App;
