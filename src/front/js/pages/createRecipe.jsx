import React from "react";
import { Navbar } from "../component/navbar";
import { Footer } from "../component/footer";
import { CreateRecipeComponent } from "../component/CreateRecipe.jsx";

export const CreateRecipe=()=>{

    return(
        <div className="bg-cocinarte">
        <div  className=" h-100 w-100">
            <Navbar/>
            <CreateRecipeComponent/>
        </div>
            <div className="d-block">
            <Footer/>

            </div>
    </div>
    )
}