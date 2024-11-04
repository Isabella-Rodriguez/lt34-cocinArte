import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function ViewRecipeApi(){
    const [recipe, setRecipe]=useState({})
    const [loading, setLoading]=useState(false)
    const{id}= useParams()
    const navigate = useNavigate()
    
    useEffect(()=>{getRecipeId()},[])
    const getRecipeId=()=>{
        setLoading(true)
        fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=f6c3531069234577afe4d0e2e49fd508`,{
            method:'GET',
            headers:{ 'Content-Type':'application/json' }
        }).then(resp=>resp.json())
        .then(data=>{setRecipe(data);console.log(data)})
        .finally(()=>setLoading(false))
    }
    
    

    return(
        <>
        {loading==true ? <h1 className="container text-center">Mezclando los ingredientes!</h1>:(
            <>
                {recipe ? 
                <div className="container mt-3">
                    <div className="card d-flex flex-column align-content-center ">
                        <h2 className="card-title text-center mt-3">{recipe.title}</h2>
                        <img src={recipe.image} className="img-fluid" alt={recipe.title}/>
                        <div className="card-body">
                            <h2>Ingredientes!</h2>
                            {recipe.extendedIngredients ? (
                                <ul className="card-text">
                                    {recipe.extendedIngredients.map((ingredient, index)=>(
                                        <li key={index}>
                                            <h4>{ingredient.nameClean}</h4>
                                            <p>{`${ingredient.amount} ${ingredient.unit}`}</p>
                                        </li>))}
                                </ul>
                            ) : (
                            <p>No Hay ingredientes disponibles</p>
                        )}
                            <h2>Instrucciones:</h2>
                            {recipe.analyzedInstructions && recipe.analyzedInstructions.length >0 ? (
                                <ol className="card-text">
                                    {recipe.analyzedInstructions[0].steps.map((step)=>(
                                        <li key={step.number}>
                                            <p>{step.step}</p>
                                        </li>
                                    ))}
                                </ol>):(
                                    <p>No hay instrucciones para esta receta</p> )}
                        </div>
                    </div>
                </div>:
                <>

                </>}
            </>
        )}
        </>
    )
}