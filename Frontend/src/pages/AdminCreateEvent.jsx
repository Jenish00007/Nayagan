import React, { useState } from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Admin/Layout/AdminSideBar";
import CreateEvent from "../components/Admin/CreateEvent";

const AdminCreateEvent = () => {
    const [openSidebar, setOpenSidebar] = useState(false);

    return (
        <div>
            <AdminHeader setOpenSidebar={setOpenSidebar} openSidebar={openSidebar} />
            <div className="w-full flex">
                <div className="flex items-start justify-between w-full">
                    <div className={`${openSidebar ? 'w-[250px]' : 'w-[80px]'} 800px:w-[330px]`}>
                        <AdminSideBar active={6} openSidebar={openSidebar} />
                    </div>
                    <div className="w-full flex justify-start">
                        <div className="w-[90%] mx-auto">
                            <CreateEvent />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCreateEvent; 