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
        <div className="container-fluid d-flex justify-content-center gap-2 mt-3 row" style={{height:'750px'}}>
        {(recipes.length!=0) ? (recipes.map((recipe,index)=>(
            <div className="card m-2 col-3 border p-2" style={{height:'100%'}} key={index}>
                <img src={recipe.img_ilustrativa} className="card-img-top" alt={recipe.title} />
                <div className="card-body d-flex flex-column">
                    <h1 className="card-title text-center mt-3">{recipe.title}</h1>
                    <h4>Ingrediente principal!</h4>
                    <h5 className="card-text">{recipe.fecha_publicacion}</h5>
                    <Link className="d-flex justify-content-center mb-2 mt-auto btn btn-success" to={`/recipe/${recipe.id}`}>Quiero probarla!</Link>
                </div>
            </div>
        ))):<h1>No hay recetas que mostrar actualmente</h1>}
        </div>
    )
}