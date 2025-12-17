import React, { useState } from 'react';
import AdminHeader from '../components/Layout/AdminHeader';
import AdminSideBar from '../components/Admin/Layout/AdminSideBar';
import EditProduct from '../components/Admin/EditProduct';

const AdminEditProduct = () => {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div>
      <AdminHeader setOpenSidebar={setOpenSidebar} openSidebar={openSidebar} />
      <div className="flex justify-between w-full">
        <div className={`${openSidebar ? 'w-[250px]' : 'w-[80px]'} 800px:w-[330px]`}>
          <AdminSideBar active={5} openSidebar={openSidebar} />
        </div>
        <div className="w-full justify-center flex">
          <EditProduct />
        </div>
      </div>
    </div>
  );
};

export default AdminEditProduct; 