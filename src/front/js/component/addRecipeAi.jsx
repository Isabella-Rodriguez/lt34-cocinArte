import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Context } from "../store/appContext";
import { Navbar } from "./navbar";
import '../../styles/addRecipeAi.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import { Footer } from "./footer";

export function AddRecipeAi(){
    const [recipe, setRecipe] = useState({});
    const [ingredients, setIngredients] = useState([]);
    const [ steps, setSteps]= useState('');
    const [images, setImages]= useState([]);
    const [categories, setCategories]= useState([]);
    const navigate = useNavigate();
    const [selectedCategories, setSelectedCategories] = useState([]);
    const {store,actions}=useContext(Context)


    useEffect(()=>{
        const recipeAi = localStorage.getItem('RecipeAi')
        if (recipeAi){
            const recipeParsed= JSON.parse(recipeAi)
            setRecipe(recipeParsed)
            setIngredients(recipeParsed.ingredientes || [])
            const stepsStr = recipeParsed.pasos.join('\n')
            setSteps(stepsStr)
            console.log("recipe es: ",JSON.parse(recipeAi))
        }
        getCategories()
    },[])
    const getCategories = async()=>{
        await fetch(process.env.BACKEND_URL + '/api/categorias',{
            method: 'GET',
            headers: { 'Content-Type':'application/json' }
        })
        .then(response=>response.json())
        .then(data=>setCategories(data))
    }
    const addCategorySelection=(categoryId)=>{
        if (selectedCategories.includes(categoryId)){
            const categoryToSend = selectedCategories.filter(id => id!= categoryId)
            setSelectedCategories(categoryToSend)
        } else {
            setSelectedCategories([...selectedCategories, categoryId])
        }
    }

    const uploadImages=(e)=>{
        console.log(e.target.files)
        setImages([...e.target.files])
    }

    const removeIngredient = (index) => {
        const newIngredients = ingredients.filter((_, i) => i !== index)
        setIngredients(newIngredients);}

    const sendRecipe = (e)=>{
        e.preventDefault();
        const token = localStorage.getItem('token');
        const decriptedToken = jwtDecode(token)
        const userId = decriptedToken.sub
        console.log(decriptedToken)
        console.log(userId)

        const formData= new FormData();
            formData.append('title', recipe.nombre)
            formData.append('ingredientes', JSON.stringify(ingredients))
            formData.append('pasos', steps)
            formData.append('user_id', userId)
            images.forEach((image, index) => {
                formData.append(`files_${index}`, image)
            });
            formData.append('categories', JSON.stringify(selectedCategories))
            console.log(formData)
        fetch(process.env.BACKEND_URL + '/api/recetas/create', {
            method:'POST',
            body: formData,
        }).then(response=>{
            if(response.ok){
                navigate(`/`)
            }
            else{
                alert('Hubo un error')
            }
        })
    }


    return(
        <div>
            <Navbar/>
        <div className={`h-100 ${store.sideBar===false ? 'sidebar-close':'sidebar-open'}`}>
            <div className="bg-add-recipe m-5">
            <h1 className="create-recipeai-text p-4 border-bottom">Confirmemos su Receta</h1>
            <form onSubmit={sendRecipe} className="d-flex flex-column justify-content-start ps-4 col-7 gap-2">
                <div className="d-flex flex-column ">
                    <label htmlFor="title" className='form-label create-recipeai-text linea size mt-4'>Titulo</label>
                    <input className='form-control input-createai-recipe' value={recipe.nombre} id="title" type="text" placeholder="Title"/>
                </div>
                <div className="d-flex flex-column ">
                    <label className='form-label create-recipeai-text linea size mt-4' htmlFor="ingredients">Ingredientes</label>
                    <input id="ingredients" type="text" placeholder="Ingredients" className='form-control input-createai-recipe '/>
                    <div className="d-flex flex-row flex-wrap mt-4">
                    {ingredients.length !==0 ? ingredients.map((ingredient, index)=>(
                        <div key={index} className="d-flex button-x-recipe align-items-center m-2">
                            <label className='label-create-recipe me-2 capitalize'>{ingredient}</label>
                            <FontAwesomeIcon icon={faTrash} onClick={() => removeIngredient(index)}/>
                        </div>
                    )) : 'none'}
                </div>
                </div>
                <div className="d-flex flex-column">
                    <label className='form-label create-recipeai-text linea size mt-4' htmlFor="steps">Pasos</label>
                    <textarea className='form-control input-createai-recipe' style={{minHeight:'230px'}} value={steps} onChange={(e) => setSteps(e.target.value)} id="steps" type="text" placeholder="Steps" />
                </div>
                <div className="d-flex flex-column">
                    <label className='form-label create-recipeai-text linea size mt-4' htmlFor="img">Muestranos tu Receta</label>
                    <input id="img" type="file" className='form-control input-createai-recipe' multiple onChange={uploadImages}/>
                </div>
                <label className='form-label create-recipeai-text linea size mt-4'>Categorias</label>
                <div className="d-flex flex-row flex-wrap gap-3 mt-2">
                {categories.length !==0 ? categories.map((category)=>(
                    <div key={category.id} className="categorias-select px-3">
                        <input className="form-check-input" type="checkbox" value={category.id} checked={selectedCategories.includes(category.id)} onChange={() => addCategorySelection(category.id)} />
                        <label className="form-check-label create-recipeai-text small ms-2">{category.name}</label>
                    </div>
                )) : <p>No hay categorias</p>}   
                </div>
                <div className="d-flex gap-2 justify-content-center">
                <button className="btn btn-secondary my-3 col-5" style={{borderRadius:'10px'}} onClick={()=>{navigate('/assistant')}}>Intentemoslo una vez mas</button>
                <button className="btn btn-actions my-3 col-5" type="submit">A cocinar</button>
                </div>             
            </form>
            </div>
        </div>
        <Footer/>
        </div>
    );
}