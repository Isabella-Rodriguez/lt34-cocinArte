import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";


export function EditRecipe(){
    const{id}=useParams()
    const [img, setImg]=useState('')
    const [steps, setSteps]=useState('')
    const [ingredient, setIngredient]=useState('')
    const [ingredients, setIngredients]=useState([])
    const [title, setTitle]=useState('')
    const [categories, setCategories]=useState([])
    const [selectedCategories, setSelectedCategories]=useState([])
    const navigate=useNavigate()
    useEffect(()=>{
        getRecipeId()
        getCategories()
    },[])

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
    const getCategories=async()=>{
        await fetch(process.env.BACKEND_URL + '/api/categorias',{
            method:'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {setCategories(data);console.log(data)})
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
        setSelectedCategories(resp.categories.map(category=>category.id))
    }
    
    const removeIngredient = (index) => {
        const newIngredients = ingredients.filter((_, i) => i !== index)
        setIngredients(newIngredients);
    }

    const addCategorySelection=(categoryId)=>{
        if(selectedCategories.includes(categoryId)){
            const updatedCategories = selectedCategories.filter(id => id !== categoryId);
            setSelectedCategories(updatedCategories)
            }else{
                setSelectedCategories([...selectedCategories, categoryId])
            }
        }

    const editRecipe = (e)=>{
        e.preventDefault();
        let dataSend= {
            'title': title,
            'ingredientes': ingredients,
            'pasos': steps,
            'img_ilustrativa':img,
            'fecha_publicacion': new Date().toISOString,
            'categories': selectedCategories
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
        <h1>Editar Receta</h1>
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
            <label>Categories:</label>
            {categories.length!==0 ? categories.map((category)=>(
                <div key={category.id} className="form-check" >
                    <input className="form-check-input" type="checkbox" value={category.id} checked={selectedCategories.includes(category.id)} onChange={()=>{addCategorySelection(categories.id)}}/>
                    <label className="form-check-label">{category.name}</label>
                </div>
            )):<p>No hay categorias</p>}
            <button onClick={(e)=>{editRecipe(e)}}>A cocinar!</button>
        </form>
        </>
    )
}