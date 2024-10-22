import { element } from "prop-types";
import React, { useState } from "react";

export function CreateRecipe(){
    const [img, setImg]=useState('')
    const [steps, setSteps]=useState('')
    const [ingredient, setIngredient]=useState('')
    const [ingredients, setIngredients]=useState('')
    const [title, setTitle]=useState('')

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
    const removeIngredient = (index) => {
        const newIngredients = ingredients.filter((_, i) => i !== index)
        setIngredients(newIngredients);}

    const sendRecipe = (e)=>{
        e.preventDefault();
        let dataSend= {
            'title': title,
            'ingredientes': ingredients,
            'pasos': steps,
            'img_ilustrativa':img
        }        
        console.log(dataSend)
        fetch('https://super-rotary-phone-qjg4pw975xj344jp-3001.app.github.dev/api/recetas', {
            method:['POST'],
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(dataSend),
        }).then(response=>{
            if(response.ok){
                alert('Se subio la receta')
            }
            else{
                alert('Hubo un error')
            }
        })
    }



return(
        <>
        <h1>Publicar Receta</h1>
        <form onSubmit={(e)=>{sendRecipe(e)}} action="" className="container d-flex flex-column gap-2">
            <div className="d-flex flex-column">
                <label htmlFor="title">Enter recipe title:</label>
                <input  id="title" type="text" placeholder="Title" onChange={(e)=>{setTitle(e.target.value)}}/>
                
            </div>
            <div className="d-flex flex-column">
                <label htmlFor="ingredients">Ingredients:</label>
                {ingredients.length!=0 ? ingredients.map((element, index)=>(
                    <div key={index} className="d-flex align-items-center">
                        <h1>{element}</h1>
                        <button type="button" onClick={() => removeIngredient(index)}>Eliminar</button>
                    </div>)):
                    'none'}
                <input id="ingredients" type="text" placeholder="Ingredients" onChange={(e)=>{setIngredient(e.target.value)}} onKeyDown={createIngredientsList}/>
            </div>
            <div className="d-flex flex-column">
                <label htmlFor="steps">Steps:</label>
                <input id="steps" type="text" placeholder="Steps" onChange={(e)=>{setSteps(e.target.value)}}/>
            </div>
            <div className="d-flex flex-column">
                <label htmlFor="img">Show us your finished recipe!</label>
                <input id="img" type="text" placeholder="" onChange={(e)=>{setImg(e.target.value)}}/>
            </div>
            <button onClick={(e)=>{sendRecipe(e)}}>A cocinar!</button>
        </form>
        </>
    )
}