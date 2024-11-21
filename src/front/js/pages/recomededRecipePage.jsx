import React, { useContext, useState, useEffect } from "react";
import { Sidebar } from "../component/sidebar.jsx";
import { Navbar } from "../component/navbar.js";
import { Footer } from "../component/footer.js";
import { RecomendedRecipe } from "../component/recomendedrecipe.jsx";

export const RecomendedRecipePage=()=>{
    

    return(
    <div className="bg-cocinarte">
        <div  className=" h-100 w-100">
            <Navbar/>
            <RecomendedRecipe/>
        </div>
            <div className="d-block">
            <Footer/>

            </div>
    </div>
    )
}