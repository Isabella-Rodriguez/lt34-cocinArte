import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Navbar } from "./navbar";
import { Context } from "../store/appContext";
import '../../styles/categories.css'
import { Footer } from "./footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faUpLong } from "@fortawesome/free-solid-svg-icons";

export function SearchByCategories(){
    const {categoryId}=useParams()
    const [recipes, setRecipes]=useState([])
    const{store,actions}=useContext(Context)
    const[categories,setCategories]=useState(null)
    const [promedioCalificacion, setPromedioCalificacion]=useState({})
    const [votes, setVotes]=useState({})
    useEffect(()=>{
        console.log(categoryId)
        fetch(process.env.BACKEND_URL+ `/api/recetas/filter/${categoryId}`,{
            method:'GET'
        })
        .then(response => response.json())
        .then(data =>{
            setRecipes(data);
            console.log(data);
            data.forEach((recipe)=>{obtenerPromedioCalificacion(recipe.id); getVotes(recipe.id)})
        })
            

        getCategories(categoryId)
    },[categoryId])
    const getCategories = async(categoryId)=>{
        await fetch(process.env.BACKEND_URL + `api/categorias/${categoryId}`,{
            method: 'GET',
        })
        .then(response=>response.json())
        .then(data=>{setCategories(data),console.log(data)})
    }
    const obtenerPromedioCalificacion = async (id) => {
        const resp = await fetch(`${process.env.BACKEND_URL}api/calificaciones/promedio/${id}`, {
            method: 'GET',
        });
        const data = await resp.json();
        console.log('caloracion', data)
        if (resp.ok){
            setPromedioCalificacion((prev) => ({
                ...prev,
                [id]: data.promedio,
            }));
        }
    };
    const renderStars=(calificacion)=>{
        const stars=[]
        for(let i=0; i<Math.floor(calificacion); i++){
            stars.push(<FontAwesomeIcon icon={faStar} key={i} />)
        }
        if(calificacion%1!=0){
            stars.push(<FontAwesomeIcon icon={faStarHalfStroke} />)
        }
        else{}
        return stars;
    };
    const getVotes=async(id)=>{
        const resp = await fetch(`https://uncanny-bat-7645pgrv44gcwqq5-3001.app.github.dev/api/vote/recipe/${id}`,{
            method: 'GET'
        })
        const data= await resp.json()
        console.log('votes: ', data)
        if (resp.ok){setVotes((prev) => ({
            ...prev,
            [id]: data.total_votes,
        }))}
    }
    const formatDate=(dateString)=>{
        const options={ 
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };
        return new Date(dateString).toLocaleString('es-ES', options);
    };

    return( 
    <div>
        <Navbar/> 
        <div className={`h-100 mx-5 mt-5 ${store.sideBar===false ? 'sidebar-close':'sidebar-open'}`}>
            <div className="bg-categories rounded">
                {categories!==null ? <div className="d-flex flex-column p-5"><span className="categories-text linea fs-2">Recetas filtradas por </span>
                <span className="categories-text fs-5 ps-3">Categoria: {categories.name}</span></div>:null}
                <div className="container-fluid d-flex flex-wrap gap-2 mt-3  pb-4 justify-content-center">
                {recipes && recipes.length>0 ? ( recipes.map((recipe, index)=>(
                    <div className={`card resaltar border-color m-2 ${store.sideBar===false ? 'col-15':'col-30'}`} style={{height:'750px'}} key={index}>
                        <img src={recipe.img_ilustrativa} className="card-img-top rounded-4 p-1" style={{height:'378px'}} alt={recipe.title} />
                        <div className="d-flex  p-1 py-3 align-items-center border-bottom-all-recipes " style={{minHeight:'73px'}}>
                            <h1 className="card-title mis-recetas-text-small p-3 ">{recipe.title}</h1>
                            {promedioCalificacion[recipe.id] !== undefined ? (<>
                                <span className='d-flex'>
                                {renderStars(promedioCalificacion[recipe.id]) }
                                </span>
                                </>
                            ) : (
                                <span className="fs-6"><FontAwesomeIcon icon={faStar} className='text-alert'/></span>
                            )}
                        </div>
                        <div className="d-flex ps-3 py-3 border-bottom-all-recipes justify-content-evenly" style={{minHeight:'73px'}}>
                            {votes[recipe.id]!==undefined ? (<>
                                <span className="fs-5">Votos positivos</span>
                                <span className="fs-5"><FontAwesomeIcon className='mx-1' icon={faUpLong} style={{color: "#63E6BE",}} />{votes[recipe.id]}</span>
                            </>):(<>
                                <span className='fs-5'>Aun no hay votos para esta receta</span>
                            </>) }
                        </div>
                        <div className='d-flex flex-column align-items-end pe-3 py-3 border-bottom-all-recipes'>
                            <h5 className="card-text mis-recetas-text-small m-1  fs-5">Publicado el: </h5>
                            <small style={{color:'#adb5bd'}}>{formatDate(recipe.fecha_publicacion)}</small>
                        </div>
                            <button className="d-flex justify-content-center mx-3 mb-2 mt-auto btn btn-actions" onClick={()=>{navigate(`/recipe/${recipe.id}`)}}>Quiero probarla!</button>
                        
                        </div>
                ))):
                ( <p>No hay recetas para esta categoría.</p>)}
                </div>
            </div>
        </div>
        <Footer/>
    </div>
    )}