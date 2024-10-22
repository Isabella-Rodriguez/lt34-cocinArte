import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function AllRecipes(){
    const [recipes, setRecipes]=useState([])
    useEffect(()=>{getAllRecipes()},[])
    const getAllRecipes=async()=>{
        const resp = await fetch('https://super-rotary-phone-qjg4pw975xj344jp-3001.app.github.dev/api/recetas',{
            method:'GET'
        })
        const data = await resp.json()
        console.log(data)
        setRecipes(data)
        return (data)
    }

    return(
        <>
        {(recipes.length!=0) ? recipes.map((recipe,index)=>(
            <div key={index}>
            <h1 >{recipe.title}</h1>
            <h3>{recipe.fecha_publicacion}</h3>
            <Link to={`/recipe/${recipe.id}`}><button>Quiero probarla!</button></Link>
            </div>
        )):''}
        </>
    )
}