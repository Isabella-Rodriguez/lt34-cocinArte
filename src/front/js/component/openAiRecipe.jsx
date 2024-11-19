import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "./navbar";
import { Context } from "../store/appContext";
import '../../styles/openAiRecipe.css'
import { Footer } from "./footer";
export function OpenAiRecipe(){

    const [recipe, setRecipe] = useState(null)
    const navigate = useNavigate()
    const {store,actions}=useContext(Context)
    
    useEffect(()=>{
        const recipeAi = localStorage.getItem('RecipeAi')
        if (recipeAi){
            setRecipe(JSON.parse(recipeAi))
            console.log("recipe es: ",JSON.parse(recipeAi))
        }
    },[])

    if(!recipe){
        return(<div>No hemos podido generar una receta para ti</div>)
    }
    return(
        <div>
            <Navbar/>
            <div className={`h-100 mx-5 mt-5 ${store.sideBar===false ? 'sidebar-close':'sidebar-open'}`}>
                <div className="bg-open-ia">
                    <div className="col-12 border-bottom d-flex align-items-stretch">
                        <div className="col-6 border-end p-4">
                            <h1 className="ia-recipe-text">{recipe.nombre}</h1>
                            <p className="ia-recipe-text soft ps-3">Nuestro asistente a pensado en lo siguiente para ti!</p>
                        </div>
                        <div className="d-flex flex-column justify-content-center col-2 border-end">
                            <h4 className="ia-recipe-text soft text-center">Dificultad</h4>
                            <h4 className="ia-recipe-text soft text-center">{recipe.dificultad}</h4>
                        </div>
                        <div className="d-flex flex-column justify-content-center col-3">
                            <h3 className="ia-recipe-text soft text-center">Tiempo de preparacion</h3>
                            <h4 className="ia-recipe-text soft text-center">{recipe.tiempo_preparacion}</h4>
                            <h3 className="ia-recipe-text soft text-center">Tiempo de coccion</h3>     
                            <h4 className="ia-recipe-text soft text-center">{recipe.tiempo_coccion}</h4>
                        </div>
                    </div>
                    <div className="mt-4 ps-3">
                        <h3 className="ia-recipe-text linea mt-3">Ingredientes</h3>
                        <ul>
                            {recipe.ingredientes.map((ingrediente, index)=>(
                                <li className="ia-recipe-text my-1" key={index}>{ingrediente}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="mt-4 ps-3">
                        <h3 className="ia-recipe-text linea mt-3">Pasos</h3>
                        <ul>
                            {recipe.pasos.map((paso, index)=>(
                                <li className="ia-recipe-text my-1" key={index}>{paso}</li>
                            ))}
                        </ul>
                    </div>
                
                <div>
                <button className="btn btn-actions m-4" onClick={()=>{navigate('/postear-recipe-ai')}}>Preparar esta receta!</button>c
                </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}
/*

*/