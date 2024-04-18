import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';

import Admin from './admin/Admin';
import Layout from './root/Layout';

function App() {
  return (
    <div className="h-dvh w-dvw items-center  overflow-x-hidden ">
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}

        <Route>
          <Route path="/" element={<div>dsad</div>} />
          {/* <Route path="/my-bids" element={<MyBids />} />
        <Route path="/view/:id" element={<ViewProduct />} />
        <Route path="/product-bid-history" element={<BidHistory />} />
        <Route path="/bid-logs/:id" element={<BidLogs />} />
        <Route path="/view-calendar" element={<ViewCalendar />} /> */}
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
    </div>
  );
}

export default App;
