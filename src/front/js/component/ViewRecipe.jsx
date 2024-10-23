import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
export function ViewRecipe(){
    const [recipe, setRecipe]=useState({})
    const{id}= useParams()
    const navigate = useNavigate()
    
    useEffect(()=>{getRecipeId()},[])
    const getRecipeId=async()=>{
        const data = await fetch(process.env.BACKEND_URL +`/api/recetas/${id}`,{
            method:'GET',
        })
        const resp = await data.json()
        console.log (resp)
        setRecipe(resp)
    }
    const deleteReceta=async(id)=>{
        const resp = await fetch(preocess.env.BACKEND_URL +`/api/recetas/${id}`,{
            method:'DELETE',
        })
        if (resp.ok){
            const data = resp.json()
            console.log(data);
            navigate('/recipe')
        } else alert('Hubo un Error al eliminar la receta!')
    }
    

    return(
        <>
        <div className="container d-flex flex-column">
            <h1>{recipe.title}</h1>
            <h2>Ingredientes!</h2>
            {recipe.ingredientes && recipe.ingredientes.length>0 ? (
                recipe.ingredientes.map((ingrediente, index)=>(
                <h3 key={index}>{ingrediente}</h3>))
                ):(<h3>El chef aún no especifica los ingredientes!</h3>)}
            <h2>Pasos:</h2>
            <p>{recipe.pasos}</p>
            <h2>Fecha de publicacion:</h2>
            <p>{recipe.fecha_publicacion}</p>
            <img src={recipe.img_ilustrativa} alt="" />
        </div>

        <button onClick={()=>{deleteReceta(id)}}>Borrar Receta!</button>
        <Link to={`/recipe/edit/${id}`}><button>Editar Receta!</button></Link>
        </>
    )
}