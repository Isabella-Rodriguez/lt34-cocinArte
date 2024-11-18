import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from './navbar';
import { Footer } from './footer';
import { Context } from '../store/appContext';
import '../../styles/misRecetas.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faUpLong,  } from '@fortawesome/free-solid-svg-icons';

export const MisRecetas = () => {
    const [recetas, setRecetas] = useState([]);
    const [error, setError] = useState("");
    const {store, actions}=useContext(Context)
    const navigate=useNavigate()
    const [promedioCalificacion, setPromedioCalificacion]=useState({})
    const [votes, setVotes]=useState({})
    useEffect(() => {
        const fetchRecetas = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(process.env.BACKEND_URL+'/api/recetas/mis-recetas', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
                console.log(data)
                setRecetas(data);
                data.forEach((recipe)=>{obtenerPromedioCalificacion(recipe.id); getVotes(recipe.id)})
            } catch (error) {
                setError(error.message);
            }
        };
        
        fetchRecetas();
    }, []);

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
    
    return (
        <div className='bg-cocinarte vh-100'>
            <Navbar/>
            <div className={` ${store.sideBar===false ? 'sidebar-close':'sidebar-open'} container-fluid col-10 mx-auto mt-5`}>
            <h2 className='mis-recetas-text py-3'>Mis Recetas</h2>
            {recetas.length > 0 ? (
                <div className='d-flex flex-row flex-wrap gap-3 justify-content-center mt-3 '>
                {(recetas.length!=0) ? (recetas.map((receta,index)=>(
                    <div className="card border-color resaltar " style={{width:'360px'}} key={index}>
                        <img class="img-fluid rounded-4 p-1" style={{height:'360px'}} src={receta.img_ilustrativa} alt="Unsplash"></img>
                        <div className="d-flex  ps-3 py-3 align-items-center border-bottom-all-recipes " style={{minHeight:'73px'}}>
                        <h1 className="card-title mis-recetas-text-small p-3 ">{receta.title}</h1>
                        {promedioCalificacion[receta.id] !== undefined ? (<>
                            <span className='d-flex'>
                            {renderStars(promedioCalificacion[receta.id])}
                            </span>
                            </>
                        ) : (
                            <span className="fs-6"><FontAwesomeIcon icon={faStar} className='text-alert'/></span>
                        )}
                    </div>
                    <div className="d-flex ps-3 py-3 border-bottom-all-recipes justify-content-evenly" style={{minHeight:'73px'}}>
                        {votes[receta.id]!==undefined ? (<>
                            <span className="fs-5">Votos positivos</span>
                            <span className="fs-5"><FontAwesomeIcon className='mx-1' icon={faUpLong} style={{color: "#63E6BE",}} />{votes[receta.id]}</span>
                        </>):(<>
                            <span className='fs-5'>Aun no hay votos para esta receta</span>
                        </>) }
                    </div>
                        <div className='d-flex flex-column align-items-end pe-3 py-3 border-bottom-all-recipes'>
                            <h5 className="card-text mis-recetas-text-small m-1  fs-5">Publicado el: </h5>
                            <small style={{color:'#adb5bd'}}>{formatDate(receta.fecha_publicacion)}</small>
                        </div>
                        <div className="d-flex justify-content-center my-4" onClick={()=>{navigate(`/recipe/${receta.id}`)}}><button className="btn-mis-recetas p-2">Quiero probarla!</button></div>
                    </div>
                ))):<h1>No hay recetas que mostrar actualmente</h1>
                }
                </div>
            ) : (
                <p>{error || "No tienes recetas publicadas."}</p>
            )}
            </div>
            <Footer/>
        </div>
    );
};

