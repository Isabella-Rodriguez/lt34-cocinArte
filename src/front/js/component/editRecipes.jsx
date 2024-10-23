import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";


export function EditRecipe(){
    const{id}=useParams()
    const [img, setImg]=useState('')
    const [steps, setSteps]=useState('')
    const [ingredient, setIngredient]=useState('')
    const [ingredients, setIngredients]=useState([])
    const [title, setTitle]=useState('')
    const navigate=useNavigate()
    useEffect(()=>{getRecipeId()},[])

    const createIngredientsList=(e)=>{
        if(e.key==='Enter'||e.type==='click'){
            e.preventDefault()
            if(ingredient!=''){
                setIngredients([...ingredients, ingredient])
                setIngredient('')
                e.target.value=''
            }
        }
    }

    const getRecipeId=async()=>{
        const data = await fetch(process.env.BACKEND_URL + `/api/recetas/${id}`,{
            method:'GET'
        })
        const resp = await data.json();
        console.log(resp)
        setTitle(resp.title)
        setIngredients(resp.ingredientes)
        setSteps(resp.pasos)
        setImg(resp.img_ilustrativa)
    }
    
    const removeIngredient = (index) => {
        const newIngredients = ingredients.filter((_, i) => i !== index)
        setIngredients(newIngredients);}
   
    const editRecipe = (e)=>{
        e.preventDefault();
        let dataSend= {
            'title': title,
            'ingredientes': ingredients,
            'pasos': steps,
            'img_ilustrativa':img,
            'fecha_publicacion': new Date().toISOString
        }        
        console.log(dataSend)
        fetch(process.env.BACKEND_URL + `/api/recetas/update/${id}`, {
            method:'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(dataSend),
        }).then(response=>{
            if(response.ok){
                navigate(`/recipe/${id}`)
            }
            else{
                alert('Hubo un error al actualizar la receta')
            }
        })
        
    }
    return(
        <>
        <h1>Publicar Receta</h1>
        <form onSubmit={(e)=>{editRecipe(e)}} action="" className="container d-flex flex-column gap-2">
            <div className="d-flex flex-column">
                <label htmlFor="title">Enter recipe title:</label>
                <input value={title} id="title" type="text" placeholder="Title" onChange={(e)=>{setTitle(e.target.value)}}/>
                
            </div>
            <div className="d-flex flex-column">
                <label htmlFor="ingredients">Ingredients:</label>
                {ingredients.length!=0 ? ingredients.map((element, index)=>(
                    <div key={index} className="d-flex align-items-center">
                        <h1>{element}</h1>
                        <button type="button" onClick={() => removeIngredient(index)}>Eliminar</button>
                    </div>)):
                    'none'}
                <input id="ingredients" type="text" placeholder="Ingredients" onChange={(e)=>{setIngredient(e.target.value)}} onKeyDown={(e)=>{createIngredientsList(e)}}/>
            </div>
            <div className="d-flex flex-column">
                <label htmlFor="steps">Steps:</label>
                <textarea value={steps} id="steps" type="text" placeholder="Steps" onChange={(e)=>{setSteps(e.target.value)}}/>
            </div>
            <div className="d-flex flex-column">
                <label htmlFor="img">Show us your finished recipe!</label>
                <input value={img} id="img" type="text" placeholder="" onChange={(e)=>{setImg(e.target.value)}}/>
            </div>
            <button onClick={(e)=>{editRecipe(e)}}>A cocinar!</button>
        </form>
        </>
    )
}