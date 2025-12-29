import { Outlet } from 'react-router-dom';
import Navbar from '../pages/nav/Navbar';

const Layout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
