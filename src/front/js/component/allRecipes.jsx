import React, { useContext, useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { Context } from "../store/appContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faUpLong } from "@fortawesome/free-solid-svg-icons";
import '../../styles/allRecipes.css'

export function AllRecipes(){
    const [recipes, setRecipes]=useState([])
    const{store,actions}=useContext(Context)
    const navigate=useNavigate()
    const [promedioCalificacion, setPromedioCalificacion]=useState({})
    const [votes, setVotes]=useState({})
    useEffect(()=>{getAllRecipes()},[])
    const getAllRecipes=async()=>{
        const resp = await fetch(`${process.env.BACKEND_URL}/api/recetas`,{
            method:'GET',
            headers:{'Content-Type': 'application/json'},
        })
        const data = await resp.json()
        console.log(data)
        if (Array.isArray(data)) {
            setRecipes(data);
            data.forEach((recipe)=>{obtenerPromedioCalificacion(recipe.id); getVotes(recipe.id)})
        } else {
            setRecipes([]);
        }

        return data;
    }
    const obtenerPromedioCalificacion = async (id) => {
        const resp = await fetch(`${process.env.BACKEND_URL}/api/calificaciones/promedio/${id}`, {
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
        for(let i=0; i<calificacion; i++){
            stars.push(<FontAwesomeIcon icon={faStar} key={i} />)
        }
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
                <div className="bg-all-recipe">
                <h1 className="all-recipe-text p-4">Estas son nuestras recetas</h1>
                <div className="container-fluid d-flex justify-content-center flex-wrap gap-2 mt-3" >
                {(recipes.length!=0) ? (recipes.map((recipe,index)=>(
                    <div className={`card resaltar border-color m-2 ${store.sideBar===false ? 'col-2':'col-30'}`} style={{height:'750px'}} key={index}>
                        <img src={recipe.img_ilustrativa} className="card-img-top rounded-4 p-1" style={{height:'378px'}} alt={recipe.title} />
                        
                        <div className="d-flex  ps-3 py-3 align-items-center border-bottom-all-recipes " style={{minHeight:'73px'}}>
                            <h1 className="card-title mis-recetas-text-small p-3 ">{recipe.title}</h1>
                            {promedioCalificacion[recipe.id] !== undefined ? (<>
                                <span className='d-flex'>
                                {renderStars(promedioCalificacion[recipe.id])}
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
                ))):<h1>No hay recetas que mostrar actualmente</h1>}
                </div>
            </div>
            <div>
            <Footer/>
            </div>
            </div>
        </div>
    )
}