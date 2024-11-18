import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext"
import { Navbar } from "./navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Footer } from "./footer";
export function OpenAiAssistant(){

    const [title, setTitle]=useState('')
    const [ingredient, setIngredient]=useState('')
    const [ingredients, setIngredients]=useState([])
    const [taste, setTaste] = useState('')
    const [duration, setDuration] = useState('')
    const [dificulty, setDificulty]= useState('')
    const navigate = useNavigate()
    const{store,actions}=useContext(Context)

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
        <div className="h-100 bg-cocinarte">
            <Navbar/>
            <div className={`h-100 mx-5 ${store.sideBar===false ? 'sidebar-close':'sidebar-open'}`}>
                    <div className="container mx-auto mt-5 pt-3 ps-5 rounded bg-create-recipe">
                    <h1 className="create-recipe-text mt-4">En que podemos ayudarte hoy?</h1>
                    <h5 className="mby-2 label-create-recipe">Cuentanos en que estas pensando y te daremos la mejor receta para ti!</h5>
                    <form className="d-flex flex-column justify-content-center gap-5 mt-5 col-6 pb-5" action="" onSubmit={sendData}>
                        <div>
                        <label className='form-label label-create-recipe size linea' htmlFor="title">Titulo</label>
                        <input  className="form-control input-create-recipe" type="text" name="title" id="title" onChange={(e)=>{setTitle(e.target.value)}}/>
                        </div>
                        <div>
                        <label className='form-label label-create-recipe size linea' htmlFor="ingredients">Ingredientes</label>
                        <input  className="form-control input-create-recipe" type="text" name="ingredients" id="ingredients" onChange={(e)=>{addIngredient(e)}} onKeyDown={(e)=>{ingredientsToSend(e)}} />
                        {ingredients && ingredients.length > 0 && (
                        <div className="label-create-recipe mt-2 p-3">
                        <ul className="d-flex flex-row flex-wrap gap-1 p-0 ">
                        {ingredients.map((ing, index) => (
                            <div key={index} className="d-flex  button-x-recipe align-items-center m-2">
                            <span className="label-create-recipe me-2 capitalize">{ing}</span>
                            <FontAwesomeIcon icon={faTrash} onClick={() => removeIngredient(index)}/>
                        </div>
                        ))}
                        </ul>
                        </div>)}
                        </div>
                        <div>
                        <label className='form-label label-create-recipe size linea' htmlFor="taste">Gustos</label>
                        <input  className="form-control input-create-recipe" type="text" name="taste" id="taste" onChange={(e)=>{setTaste(e.target.value)}}/>
                        </div>
                        <div>
                        <label className='form-label label-create-recipe size linea' htmlFor="duration">Comida del Dia</label>
                        <input  className="form-control input-create-recipe" type="text" name="duration" id="duration" onChange={(e)=>{setDuration(e.target.value)}}/>
                        </div>
                        <div>
                        <label className='form-label label-create-recipe size linea' htmlFor="dificulty">Dificultad</label>
                        <input  className="form-control input-create-recipe" type="text" name="dificulty" id="dificulty" onChange={(e)=>{setDificulty(e.target.value)}}/>
                        </div>
                        <button className="btn btn-cocinarte cocinarte-text col-4 mx-auto my-5" type="submit">Probemos!</button>
                    </form>
                </div>
            </div>
            <Footer/>
        </div>
    )
}