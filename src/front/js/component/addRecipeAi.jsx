import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export function AddRecipeAi(){
    const [recipe, setRecipe] = useState({});
    const [ingredients, setIngredients] = useState([]);
    const [ steps, setSteps]= useState('');
    const [images, setImages]= useState([]);
    const [categories, setCategories]= useState([]);
    const navigate = useNavigate();
    const [selectedCategories, setSelectedCategories] = useState([]);


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
        <>
        <h1>Revisemos su Receta</h1>
            <form onSubmit={sendRecipe} className="container d-flex flex-column gap-2">
                <div className="d-flex flex-column">
                    <label htmlFor="title">Enter recipe title:</label>
                    <input value={recipe.nombre} id="title" type="text" placeholder="Title"/>
                </div>
                <div className="d-flex flex-column">
                    <label htmlFor="ingredients">Ingredients:</label>
                    {ingredients.length !==0 ? ingredients.map((ingredient, index)=>(
                        <div key={index} className="d-flex align-items-center">
                            <h1>{ingredient}</h1>
                            <button onClick={()=>removeIngredient(index)} type="button">Eliminar</button>
                        </div>
                    )) : 'none'}
                    <input id="ingredients" type="text" placeholder="Ingredients" />
                </div>
                <div className="d-flex flex-column">
                    <label htmlFor="steps">Steps:</label>
                    <textarea value={steps} onChange={(e) => setSteps(e.target.value)} id="steps" type="text" placeholder="Steps" />
                </div>
                <div className="d-flex flex-column">
                    <label htmlFor="img">Show us your finished recipe images!</label>
                    <input id="img" type="file" multiple onChange={uploadImages}/>
                </div>
                <label>Categories:</label>
                {categories.length !==0 ? categories.map((category)=>(
                    <div key={category.id} className="form-check">
                        <input className="form-check-input" type="checkbox" value={category.id} checked={selectedCategories.includes(category.id)} onChange={() => addCategorySelection(category.id)} />
                        <label className="form-check-label">{category.name}</label>
                    </div>
                )) : <p>No hay categorias</p>}                
                <button className="btn btn-primary mt-3" type="submit">Subir Receta</button>
            </form>
        </>
    );
}