import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext"
export function OpenAiAssistant(){

    const [title, setTitle]=useState('')
    const [ingredient, setIngredient]=useState('')
    const [ingredients, setIngredients]=useState([])
    const [taste, setTaste] = useState('')
    const [duration, setDuration] = useState('')
    const [dificulty, setDificulty]= useState('')
    const navigate = useNavigate()

    const addIngredient=(e)=>{
        setIngredient(e.target.value)
    }

    const ingredientsToSend=(e)=>{
        if(e.key==='Enter'){
            e.preventDefault()
            if(ingredient!=''){
                setIngredients([...ingredients, ingredient])
                setIngredient('')
                e.target.value=''
            }
        }
    }

    const sendData = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('taste', taste);
        formData.append('duration', duration);
        formData.append('dificulty', dificulty);
        formData.append('ingredients', ingredients.join(', '));

        try {
            const response = await fetch(process.env.BACKEND_URL + '/api/assistant', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            console.log(data.receta)
            if(data.receta){
                const parsedRecipe = JSON.parse(data.receta)
                console.log("parsedRecipe: ", parsedRecipe)
                localStorage.setItem('RecipeAi', JSON.stringify(parsedRecipe))
                navigate('/assistant/resp')
            }
        } catch (error) {
            console.error("Error al obtener la receta:", error);
        }
    };



    return(
        <div className="m-5">
            <h1>En que podemos ayudarte hoy?</h1>
            <h5 className="my-4">Cuentanos en que estas pensando y te daremos la mejor receta para ti!</h5>
            <form className="d-flex flex-column justify-content-center gap-2" action="" onSubmit={sendData}>
                <label htmlFor="title">Titulo</label>
                <input type="text" name="title" id="title" onChange={(e)=>{setTitle(e.target.value)}}/>
                <label htmlFor="ingredients">Ingredientes</label>
                <input type="text" name="ingredients" id="ingredients" onChange={(e)=>{addIngredient(e)}} onKeyDown={(e)=>{ingredientsToSend(e)}} />
                <ul>
                    {ingredients.map((ing, index) => (
                        <li key={index}>{ing}</li>
                    ))}
                </ul>
                <label htmlFor="taste">Gustos</label>
                <input type="text" name="taste" id="taste" onChange={(e)=>{setTaste(e.target.value)}}/>
                <label htmlFor="duration">Comida del Dia</label>
                <input type="text" name="duration" id="duration" onChange={(e)=>{setDuration(e.target.value)}}/>
                <label htmlFor="dificulty">Dificultad</label>
                <input type="text" name="dificulty" id="dificulty" onChange={(e)=>{setDificulty(e.target.value)}}/>
                <button className="btn btn-success mt-3" type="submit">Recomiendame!</button>
            </form>
        </div>
    )
}