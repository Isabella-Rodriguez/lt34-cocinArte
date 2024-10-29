import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export function SearchByCategories(){
    const {categoryId}=useParams()
    const [recipes, setRecipes]=useState([])

    useEffect(()=>{
        console.log(categoryId)
        fetch(process.env.BACKEND_URL+ `/api/recetas/filter/${categoryId}`,{
            method:'GET'
        })
        .then(response => response.json())
        .then(data =>setRecipes(data))
    },[categoryId])
    return( 
    <> 
    {recipes.length!==0 ? ( recipes.map((recipe)=>(
        <div key={recipe.id}>
        <Link to={`/recipe/${recipe.id}`}><h1 >{recipe.title}</h1></Link>
        <h3>{recipe.fecha_publicacion}</h3>
        </div>))):
    ( <p>No hay recetas para esta categoría.</p>)}
    </>)}