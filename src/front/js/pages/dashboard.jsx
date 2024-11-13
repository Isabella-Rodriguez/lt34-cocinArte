import React, { useContext } from "react";
import { Sidebar } from "../component/sidebar.jsx";
import { Navbar } from "../component/navbar.js";
import { Footer } from "../component/footer.js";
import { DashboardContent } from "../component/dashboardContent.jsx";
import { Context } from "../store/appContext.js";


export const Dashboard=()=>{

    return(<div className="bg-cocinarte">
        <div  className="container-fluid h-100 w-100">
            <Navbar/>
            <DashboardContent/>
        </div>
            <div className="d-block">
            <Footer/>

            </div>
    </div>
    )
}