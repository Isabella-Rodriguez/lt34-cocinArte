import { element } from "prop-types";
import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export function CreateRecipe(){
    const [img, setImg]=useState('')
    const navigate = useNavigate()
    const [steps, setSteps]=useState('')
    const [ingredient, setIngredient]=useState('')
    const [ingredients, setIngredients]=useState([])
    const [title, setTitle]=useState('')
    const [categories, setCategories]= useState([])
    const [selectedCategories, setSelectedCategories] = useState([]);
    
    useEffect(()=>{
        fetch(process.env.BACKEND_URL + '/api/categorias',{
            method:'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => setCategories(data))
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

    const sendRecipe = (e)=>{
        e.preventDefault();
        const token = localStorage.getItem('token');
        const decriptedToken = jwtDecode(token)
        const userId = decriptedToken.sub
        console.log(decriptedToken)
        console.log(userId)

        let dataSend= {
            'title': title,
            'ingredientes': ingredients,
            'pasos': steps,
            'img_ilustrativa':img,
            'user_id':userId,
            'categories':selectedCategories
        };
        console.log(dataSend)
        fetch(process.env.BACKEND_URL + '/api/recetas/create', {
            method:'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataSend),
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
        {localStorage.getItem('token') ? <div className="container col-6 d-flex flex-column gap-3">
            <h1 className="text-center my-4">Publica tu receta!</h1>
        <form onSubmit={(e)=>{sendRecipe(e)}} action="" className="container d-flex flex-column gap-2">
            <div className="d-flex flex-column">
                <label className="form-label" htmlFor="title">Enter recipe title:</label>
                <input className="form-control" id="title" type="text" placeholder="Title" onChange={(e)=>{setTitle(e.target.value)}}/>
                
            </div>
            <div className="d-flex flex-column">
                <label className="form-label" htmlFor="ingredients">Ingredients:</label>
                {ingredients.length!=0 ? ingredients.map((element, index)=>(
                    <div key={index} className="d-flex align-items-center">
                        <h1>{element}</h1>
                        <button className="btn btn-danger ms-2" type="button" onClick={() => removeIngredient(index)}>Eliminar</button>
                    </div>)):
                    null}
                <input className="form-control" id="ingredients" type="text" placeholder="Ingredients" onChange={(e)=>{setIngredient(e.target.value)}} onKeyDown={createIngredientsList}/>
            </div>
            <div className="d-flex flex-column">
                <label className="form-label" htmlFor="steps">Steps:</label>
                <textarea className="form-control" id="steps" type="text" placeholder="Steps" onChange={(e)=>{setSteps(e.target.value)}}/>
            </div>
            <div className="d-flex flex-column">
                <label className="form-label" htmlFor="img">Show us your finished recipe url!</label>
                <input className="form-control" id="img" type="text" aria-label="Add steps" onChange={(e)=>{setImg(e.target.value)}}/>
            </div>
            <div className="d-flex flex-column">
                <label className="form-label">Selecciona las categorias adecuadas para tu receta!</label>
                {categories.map((categories)=>(
                    <div key={categories.id} className="form-check" >
                        <input className="form-check-input" type="checkbox" value={categories.id} onChange={()=>{addCategorySlection(categories.id)}}/>
                        <label className="form-check-label">{categories.name}</label>
                    </div>
                ))}
            </div>
            <button className="btn btn-success col-4 mx-auto" onClick={(e)=>{sendRecipe(e)}}>A cocinar!</button>
            <Link to={'/'} className="btn btn-secondary col-4 mx-auto" >Cancelar</Link>
        </form>
        </div>:
        <>
        <h1>Por favor logueate para continuar</h1>
        <button onClick={()=>{navigate('/login/cocinero')}}>To login</button>
        </>}
        </>
    )
}