import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "./navbar";
import { Context } from "../store/appContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { height } from "@fortawesome/free-solid-svg-icons/fa0";
import { Footer } from "./footer";

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
    const {store, actions}=useContext(Context)
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
        console.log(e.target.files)
        setImages([...e.target.files])
    };

    const editRecipe = (e) => {
        e.preventDefault();
        const formData = new FormData()
        formData.append('title', title)
        formData.append('ingredientes', JSON.stringify(ingredients))
        formData.append('pasos', steps)
        selectedCategories.forEach((catId) => formData.append('categories', catId))
        images.forEach((image, index) => {
            formData.append(`files_${index}`, image)
        });

        fetch(process.env.BACKEND_URL + `/api/recetas/update/${id}`, {
            method: 'PUT',
            body: formData,
        }).then(response => response.json())
        .then(data => {
            console.log('Data actualizada:', data)
                navigate(`/recipe/${id}`)
        })
        .catch(error => console.error('Error:', error))
    }
    return (
        <>
        <div  className=" h-100 w-100 bg-cocinarte">
            <Navbar/>
            <div className={`h-100 ${store.sideBar===false ? 'sidebar-close':'sidebar-open'}`}>
                <div className="container-fluid col-8 d-flex mt-5 p-5 bg-create-recipe flex-column ">
                <h1 className="create-recipe-text mt-4">Edita tu receta!</h1>
                <p className="mb-o label-create-recipe">¿Que quieres modificar de tu plato?</p>
                <form onSubmit={editRecipe} className="container d-flex flex-column mt-4 gap-3">
                    <div className="d-flex flex-column col-4">
                        <label className="form-label label-create-recipe size" htmlFor="title">Enter recipe title:</label>
                        <input className="form-control input-create-recipe" value={title} id="title" type="text" placeholder="Title" onChange={(e)=>setTitle(e.target.value)}/>
                    </div>
                    <div className="d-flex flex-column">
                        <label className="form-label label-create-recipe size" htmlFor="ingredients">Ingredients:</label>
                        <input className="form-control input-create-recipe mb-4" id="ingredients" type="text" placeholder="Ingredients" onChange={(e)=>setIngredient(e.target.value)} onKeyDown={createIngredientsList} />
                        <div className="d-flex flex-row flex-wrap col-12">
                        {ingredients.length !==0 ? ingredients.map((element, index)=>(
                            <div key={index} className="d-flex  button-x-recipe align-items-center m-2">
                                <span className="label-create-recipe me-2 capitalize">{element}</span>
                                <FontAwesomeIcon icon={faTrash} onClick={() => removeIngredient(index)}/>
                            </div>
                        )) : 'none'}
                    </div>
                    </div>
                    <div className="d-flex flex-column">
                        <label className="form-label label-create-recipe size" htmlFor="steps">Steps:</label>
                        <textarea value={steps} id="steps" className="form-control input-create-recipe mb-4" style={{minHeight:"170px"}} type="text" placeholder="Steps" onChange={(e)=>setSteps(e.target.value)} />
                    </div>
                    <div className="d-flex flex-column">
                        <label className="form-label label-create-recipe size" htmlFor="img">Show us your finished recipe images!</label>
                        <input className="form-control input-create-recipe mb-4" id="img" type="file" multiple onChange={uploadImages} />
                    </div>
                    <label className="form-label label-create-recipe size">Categories:</label>
                    <div className="d-flex flex-row gap-3 py-3 flex-wrap">
                    {categories.length !==0 ? categories.map((category)=>(
                        <div key={category.id} className="form-check categorias-select">
                            <input className="form-check-input input-create-recipe" type="checkbox" value={category.id} checked={selectedCategories.includes(category.id)} onChange={() => addCategorySelection(category.id)} />
                            <label className="form-check-label label-create-recipe">{category.name}</label>
                        </div> 
                    )) : <p className="form-label label-create-recipe">No hay categorias</p>}
                    </div>
                    <button className="btn btn-cocinarte cocinarte-text col-4 mx-auto" type="submit">Actualizar Receta</button>
                </form>
            </div>
            </div>
            <Footer/>
            </div>
        </>
    );
}
