import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function EditRecipe() {
    const { id } = useParams()
    const [images, setImages] = useState([])
    const [steps, setSteps] = useState('')
    const [ingredient, setIngredient] = useState('')
    const [ingredients, setIngredients] = useState([])
    const [title, setTitle] = useState('')
    const [categories, setCategories] = useState([])
    const [selectedCategories, setSelectedCategories] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        getRecipeId()
        getCategories()
    }, []);

    const createIngredientsList =(e)=>{
        if (e.key==='Enter' || e.type==='click'){
            e.preventDefault()
            if (ingredient !== '') {
                setIngredients([...ingredients, ingredient])
                setIngredient('')
                e.target.value = ''
            }
        }
    };

    const getCategories = async () => {
        await fetch(process.env.BACKEND_URL + '/api/categorias', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => setCategories(data));
    };

    const getRecipeId = async () => {
        const data = await fetch(process.env.BACKEND_URL + `/api/recetas/${id}`, {
            method: 'GET'
        });
        const resp = await data.json()
        setTitle(resp.title)
        setIngredients(resp.ingredientes)
        setSteps(resp.pasos)
        setImages(resp.img_ilustrativa || []);
        setSelectedCategories(resp.categories.map(category => category.id))
    };

    const removeIngredient = (index) => {
        const newIngredients = ingredients.filter((_, i) => i !== index)
        setIngredients(newIngredients)
    };

    const addCategorySelection = (categoryId) => {
        if (selectedCategories.includes(categoryId)) {
            const updatedCategories = selectedCategories.filter(id => id !== categoryId)
            setSelectedCategories(updatedCategories);
        } else {
            setSelectedCategories([...selectedCategories, categoryId])
        }
    };

    const uploadImages = (e) => {
        setImages([...e.target.files])
    };

    const editRecipe = (e) => {
        e.preventDefault();
        const formData = new FormData()
        formData.append('title', title)
        formData.append('ingredientes', JSON.stringify(ingredients))
        formData.append('pasos', steps)
        selectedCategories.forEach((catId) => formData.append('categories', catId))
        images.forEach((image, index) => formData.append(`file_${index}`, image))

        fetch(process.env.BACKEND_URL + `/api/recetas/update/${id}`, {
            method: 'PUT',
            body: formData,
        }).then(response => {
            if (response.ok) {
                navigate(`/recipe/${id}`);
            } else {
                alert('Hubo un error al actualizar la receta')
            }
        });
    };

    return (
        <>
            <h1>Editar Receta</h1>
            <form onSubmit={editRecipe} className="container d-flex flex-column gap-2">
                <div className="d-flex flex-column">
                    <label htmlFor="title">Enter recipe title:</label>
                    <input value={title} id="title" type="text" placeholder="Title" onChange={(e)=>setTitle(e.target.value)}/>
                </div>
                <div className="d-flex flex-column">
                    <label htmlFor="ingredients">Ingredients:</label>
                    {ingredients.length !==0 ? ingredients.map((element, index)=>(
                        <div key={index} className="d-flex align-items-center">
                            <h1>{element}</h1>
                            <button type="button" onClick={()=> removeIngredient(index)}>Eliminar</button>
                        </div>
                    )) : 'none'}
                    <input id="ingredients" type="text" placeholder="Ingredients" onChange={(e)=>setIngredient(e.target.value)} onKeyDown={createIngredientsList} />
                </div>
                <div className="d-flex flex-column">
                    <label htmlFor="steps">Steps:</label>
                    <textarea value={steps} id="steps" type="text" placeholder="Steps" onChange={(e)=>setSteps(e.target.value)} />
                </div>
                <div className="d-flex flex-column">
                    <label htmlFor="img">Show us your finished recipe images!</label>
                    <input id="img" type="file" multiple onChange={uploadImages} />
                </div>
                <label>Categories:</label>
                {categories.length !==0 ? categories.map((category)=>(
                    <div key={category.id} className="form-check">
                        <input className="form-check-input" type="checkbox" value={category.id} checked={selectedCategories.includes(category.id)} onChange={() => addCategorySelection(category.id)} />
                        <label className="form-check-label">{category.name}</label>
                    </div>
                )) : <p>No hay categorias</p>}
                <button className="btn btn-primary mt-3" type="submit">Actualizar Receta</button>
            </form>
        </>
    );
}
