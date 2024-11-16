import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from './navbar';
import { Footer } from './footer';
import { Context } from '../store/appContext';
import '../../styles/misRecetas.css';

export const MisRecetas = () => {
    const [recetas, setRecetas] = useState([]);
    const [error, setError] = useState("");
    const {store, actions}=useContext(Context)
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
            } catch (error) {
                setError(error.message);
            }
        };
        
        fetchRecetas();
    }, []);

    return (
        <div className='bg-cocinarte vh-100'>
            <Navbar/>
            <div className={` ${store.sideBar===false ? 'sidebar-close':'sidebar-open'} container-fluid col-10 mx-auto mt-5`}>
            <h2 className='mis-recetas-text py-3'>Mis Recetas</h2>
            {recetas.length > 0 ? (
                <div className='d-flex flex-row flex-wrap gap-3 justify-content-center mt-3 '>
                {(recetas.length!=0) ? (recetas.map((receta,index)=>(
                    <div className="card col-3 rounded" key={index}>
                        <img class="card-img-top w-auto" src={receta.img_ilustrativa} alt="Unsplash"></img>
                        <h1 className="card-title mis-recetas-text-small m-1">{receta.title}</h1>
                        <h3 className="text-center">{receta.fecha_publicacion}</h3>
                        <Link className="d-flex justify-content-center mb-2" to={`/recipe/${receta.id}`}><button className="btn btn-success">Quiero probarla!</button></Link>
                    </div>
                ))):<h1>No hay recetas que mostrar actualmente</h1>}
                </div>
            ) : (
                <p>{error || "No tienes recetas publicadas."}</p>
            )}
            </div>
            <Footer/>
        </div>
    );
};

