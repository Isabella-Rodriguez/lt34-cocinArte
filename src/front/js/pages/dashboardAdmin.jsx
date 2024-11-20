import React from "react";
import { SidebarAdmin } from "../component/sidebarAdmin.jsx";
import { NavbarAdmin } from "../component/navbarAdmin.jsx";
import { Footer } from "../component/footer.js";
import { DashboardContentAdmin } from "../component/dahsboardContentAdmin.jsx";
import { Context } from "../store/appContext";
import { useContext } from "react";


export const DashboardAdmin = () => {
    const { store } = useContext(Context);


    return (
        
        <div className="bg-cocinarte">
        {store.authadmin ? ( 
            <div className="h-100 w-100">
                <NavbarAdmin />
                <DashboardContentAdmin />
                <div className="d-block">
                    <Footer />
                </div>
            </div>
        ) : (
            <div className="h-100 w-100 d-flex justify-content-center align-items-center">
                <h1 className="text-danger">Acceso no autorizado</h1>
            </div>
        )}
    </div>
);
};