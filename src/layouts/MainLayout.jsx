import { Outlet } from 'react-router-dom';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <div className='w-10/12  mx-auto'>
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default MainLayout;