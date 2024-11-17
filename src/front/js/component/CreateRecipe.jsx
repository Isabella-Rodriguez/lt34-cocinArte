import { element } from "prop-types";
import React, { useContext, useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import '../../styles/createRecipe.css'
import { Context } from "../store/appContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";


export function CreateRecipeComponent(){
    const [images, setImages]=useState([])
    const navigate = useNavigate()
    const [steps, setSteps]=useState('')
    const [ingredient, setIngredient]=useState('')
    const [ingredients, setIngredients]=useState([])
    const [title, setTitle]=useState('')
    const [categories, setCategories]= useState([])
    const [selectedCategories, setSelectedCategories] = useState([])
    const [recomendedSteps, setRecomendedSteps] = useState('')
    const [recomendedIngredients, setRecomendedIngredients] = useState([])
    const {store, actions}=useContext(Context)
    
    useEffect(()=>{
        fetch(process.env.BACKEND_URL + '/api/categorias',{
            method:'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => setCategories(data))
    },[])

    const uploadImages=(e)=>{
        console.log(e.target.files)
        setImages([...e.target.files])
    }

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

    const addCategorySlection=(categoryId)=>{
        if (selectedCategories.includes(categoryId)){
            const categoryToSend = selectedCategories.filter(id => id!= categoryId)
            setSelectedCategories(categoryToSend)
        } else {
            setSelectedCategories([...selectedCategories, categoryId])
        }
    }

    const titleToFetch=(e)=>{
        const newTitle = e.target.value;
        setTitle(newTitle)
        recomendSteps(newTitle)
    }

    const recomendSteps= async(recipeTitle)=>{
        const APIkey = '9c5e9cf7930840e5acd2b5edc06177e0';
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?titleMatch=${recipeTitle}&number=1&apiKey=${APIkey}`)
        const data = await response.json()
        console.log(data)
        if (data.results && data.results.length>0){
            const stepsResponse = await fetch(`https://api.spoonacular.com/recipes/${data.results[0].id}/information?apiKey=${APIkey}`)
            const stepsData = await stepsResponse.json()
            console.log(stepsData)

            const pasosEnIngles = stepsData.instructions;
            const ingredientesEnIngles = stepsData.extendedIngredients.map(ingrediente => ingrediente.original);

            const pasosTraducidos = await traducirTexto([pasosEnIngles]);
            const ingredientesTraducidos = await traducirTexto(ingredientesEnIngles);

            setRecomendedSteps(pasosTraducidos[0]);
            setRecomendedIngredients(ingredientesTraducidos);
        }else  {
            setRecomendedSteps('');
            setRecomendedIngredients([]);
        }   
    }

    const traducirTexto = async (textoArray) => {
        console.log("Traduciendo texto...");
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/traducir`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "texto": textoArray,
                    "idioma": "es"
                })
            });
    
            if (!response.ok) {
                throw new Error(`Error en la respuesta: ${response.status} ${response.statusText}`);
            }
    
            const data = await response.json();
            return data.traducciones;
            
        } catch (error) {
            console.error("Error al traducir el texto:", error.message);
            return { error: "No se pudo completar la traducción. Intenta nuevamente más tarde." };
        }
    };

    const sendRecipe = (e)=>{
        e.preventDefault();
        const token = localStorage.getItem('token');
        const decriptedToken = jwtDecode(token)
        const userId = decriptedToken.sub
        console.log(decriptedToken)
        console.log(userId)

        const formData= new FormData();
            formData.append('title', title)
            formData.append('ingredientes', JSON.stringify(ingredients))
            formData.append('pasos', steps)
            formData.append('user_id', userId)
            images.forEach((image, index) => {
                formData.append(`files_${index}`, image)
            });
            formData.append('categories', JSON.stringify(selectedCategories))
            console.log("FormData entries:");
                for (let pair of formData.entries()) {
                console.log(pair[0] + ', ' + pair[1]);
                }
        fetch(process.env.BACKEND_URL + '/api/recetas/create', {
            method:'POST',
            body: formData,
        }).then(response=>{
            if(response.ok){
                navigate(`/mis-recetas`)
            }
            else{
                alert('Hubo un error')
            }
        })
    }
/*
                                        
*/


return(
        <div className={`h-100 ${store.sideBar===false ? 'sidebar-close':'sidebar-open'}`}>
        {localStorage.getItem('token') ? <div className="container-fluid col-8 d-flex mt-5 p-5 bg-create-recipe flex-column ">
            <h1 className="create-recipe-text mt-4">Publica tu receta!</h1>
            <p className="mb-o label-create-recipe">Cuentanos mas detalles</p>
        <form onSubmit={sendRecipe} action="" className="container d-flex flex-column mt-4 gap-3">
            <div className="d-flex flex-column col-4">
                <label className="form-label label-create-recipe size" htmlFor="title">Enter recipe title:</label>
                <input className="form-control input-create-recipe" id="title" type="text" placeholder="Title" onChange={(e)=>{titleToFetch(e)}}/>
                
            </div>
            <div className="d-flex flex-column">
                <label className="form-label label-create-recipe size" htmlFor="ingredients">Ingredients:</label>
                <input className="form-control input-create-recipe mb-4" style={{width:"41.66666667%"}} id="ingredients" type="text" placeholder="Ingredients" onChange={(e)=>{setIngredient(e.target.value)}} onKeyDown={createIngredientsList}/>
                <div className="d-flex flex-row flex-wrap">
                {ingredients.length!=0 ? ingredients.map((element, index)=>(
                    <div key={index} className="d-flex  button-x-recipe align-items-center m-2">
                        <span className="label-create-recipe me-2 capitalize">{element}</span>
                        <FontAwesomeIcon icon={faTrash} onClick={() => removeIngredient(index)}/>
                    </div>)):
                    null}
                </div>
            </div>
            
            {recomendedIngredients && recomendedIngredients.length > 0 && (
                <div className="bg-cocinarte rounded label-create-recipe p-3">
                    <p className="fs-4">Estos son los ingredientes que le recomendamos</p >
                    <ul className="d-flex flex-row flex-wrap gap-1 ">
                        {recomendedIngredients.map((ingredient, index) => (
                            <div key={index} className="d-flex  button-x-recipe align-items-center m-2">
                            <span className="label-create-recipe me-2 capitalize">{ingredient}</span>
                            <FontAwesomeIcon icon={faTrash} onClick={() => removeIngredient(index)}/>
                        </div>
                        ))}
                    </ul>
                    <button onClick={() => {setIngredients(recomendedIngredients); }} type="button" className="btn btn-cocinarte cocinarte-text col-4 mx-auto">
                        Usar ingredientes recomendados!
                    </button>
                </div>
            )}

            <div className="d-flex flex-column">
                <label className="form-label label-create-recipe size" htmlFor="steps">Pasos:</label>
                <textarea className="form-control input-create-recipe" style={{minHeight:"170px"}} id="steps" type="text" value={steps} placeholder='Escribe los pasos para tu receta' onChange={(e)=>{setSteps(e.target.value)}}/>
            </div>
            {recomendedSteps && (
                <div className="bg-cocinarte rounded label-create-recipe p-3">
                    <p className="fs-4 ">Estos son los pasos que le recomendamos</p>
                    <p>{recomendedSteps}</p>
                    <button onClick={()=>{setSteps(''); setSteps(recomendedSteps); console.log(steps)}} type="button" className="btn btn-cocinarte cocinarte-text col-4 mx-auto">Use the suggested steps!</button>
                </div> )}
            <div className="d-flex flex-column">
                <label className="form-label label-create-recipe size" htmlFor="img">Show us your finished recipe url!</label>
                <input className="form-control input-create-recipe" id="img" type="file" multiple onChange={(e)=>{uploadImages(e)}}/>
            </div>
            <div className="d-flex flex-column">
                <label className="form-label label-create-recipe size">Selecciona las categorias adecuadas para tu receta!</label>
                <div className="d-flex flex-row gap-3 py-3 flex-wrap">
                {categories.map((categories)=>(
                    <div key={categories.id} className="form-check categorias-select" >
                        <input className="form-check-input input-create-recipe" type="checkbox" value={categories.id} onChange={()=>{addCategorySlection(categories.id)}}/>
                        <label className="form-check-label label-create-recipe">{categories.name}</label>
                    </div>
                ))}
                </div>
            </div>
            <button className="btn btn-cocinarte cocinarte-text col-4 mx-auto" type="submit">A cocinar!</button>
            <Link to={'/'} className="btn btn-secondary col-4 mx-auto" >Cancelar</Link>
        </form>
        </div>:
        <>
        <h1>Por favor logueate para continuar</h1>
        <button onClick={()=>{navigate('/login/cocinero')}}>To login</button>
        </>}
        </div>
    )
}
    