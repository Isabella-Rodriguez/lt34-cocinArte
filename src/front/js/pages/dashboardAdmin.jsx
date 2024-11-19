import React from "react";
import { SidebarAdmin } from "../component/sidebarAdmin.jsx";
import { NavbarAdmin } from "../component/navbarAdmin.jsx";
import { Footer } from "../component/footer.js";
import { DashboardContentAdmin } from "../component/dahsboardContentAdmin.jsx";


export const DashboardAdmin = () => {
    return (
        <div className="bg-cocinarte">
            <div className="h-100 w-100">
                <NavbarAdmin />
                <DashboardContentAdmin />
            </div>
            <div className="d-block">
                <Footer />
            </div>
        </div>
    );
};
