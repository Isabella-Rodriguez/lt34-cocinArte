import React from "react";
import { Sidebar } from "../component/sidebar.jsx";
import { Navbar } from "../component/navbar.js";


export const Dashboard=()=>{

    return(
        <div  className="container-fluid vh-100 w-100 bg-cocinarte d-flex">
            <Navbar/>
        </div>
    )
}