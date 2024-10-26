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
        <div className="container d-flex flex-column align-items-center gap-5 ">
        {(recipes.length!=0) ? (recipes.map((recipe,index)=>(
            <div className="border px-2" key={index}>
            <h1 className="text-center">{recipe.title}</h1>
            <h3 className="text-center">{recipe.fecha_publicacion}</h3>
            <Link className="d-flex justify-content-center mb-2" to={`/recipe/${recipe.id}`}><button className="btn btn-success">Quiero probarla!</button></Link>
            </div>
        ))):<h1>No hay recetas que mostrar actualmente</h1>}
        </div>
    )
}