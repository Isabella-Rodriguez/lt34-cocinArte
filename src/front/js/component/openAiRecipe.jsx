import React, { useContext, useEffect, useState } from "react";
export function OpenAiRecipe(){

    const [recipe, setRecipe] = useState(null)
    
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
        <div className="mx-5 my-5">
            <h1>Titulo:</h1>
            <h1>{recipe.nombre}</h1>
            <h3>Ingredientes:</h3>
            <ul>
                {recipe.ingredientes.map((ingrediente, index)=>(
                    <li key={index}>{ingrediente}</li>
                ))}
            </ul>
            <h1>Pasos:</h1>
            <ul>
                {recipe.pasos.map((paso, index)=>(
                    <li key={index}>{paso}</li>
                ))}
            </ul>
            <div className="d-flex gap-3">
                <h4>Dificultad:</h4>
                <h4>{recipe.dificultad}</h4>
            </div>
            <div className="d-flex gap-3">
                <h5>Tiempo de preparacion:</h5>
                <h5>{recipe.tiempo_preparacion}</h5>
                <h5 className="border-start ps-3">Tiempo de coccion:</h5>     
                <h5>{recipe.tiempo_coccion}</h5>
            </div>
        </div>
    )
}
/*

*/