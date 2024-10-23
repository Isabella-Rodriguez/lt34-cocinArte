import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function AllRecipes(){
    const [recipes, setRecipes]=useState([])
    useEffect(()=>{getAllRecipes()},[])
    const getAllRecipes=async()=>{
        const resp = await fetch(`${process.env.BACKEND_URL}/api/recetas`,{
            method:'GET',
            headers:{'Content-Type': 'application/json'},
        })
        const data = await resp.json()
        console.log(data)
        if (Array.isArray(data)) {
            setRecipes(data);
        } else {
            setRecipes([]);
        }

        return data;
    }

    return(
        <>
        {(recipes.length!=0) ? (recipes.map((recipe,index)=>(
            <div key={index}>
            <h1 >{recipe.title}</h1>
            <h3>{recipe.fecha_publicacion}</h3>
            <Link to={`/recipe/${recipe.id}`}><button>Quiero probarla!</button></Link>
            </div>
        ))):<h1>No hay recetas que mostrar actualmente</h1>}
        </>
    )
}