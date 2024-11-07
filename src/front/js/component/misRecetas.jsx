import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";

export const MisRecetas = () => {
    const [recetas, setRecetas] = useState([]);
    const [error, setError] = useState("");

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
        <div>
            <h2>Mis Recetas</h2>
            {recetas.length > 0 ? (
                <div className="container d-flex flex-column align-items-center gap-5 ">
                {(recetas.length!=0) ? (recetas.map((receta,index)=>(
                    <div className="border px-2" key={index}>
                    <h1 className="text-center">{receta.title}</h1>
                    <h3 className="text-center">{receta.fecha_publicacion}</h3>
                    <Link className="d-flex justify-content-center mb-2" to={`/receta/${receta.id}`}><button className="btn btn-success">Quiero probarla!</button></Link>
                    </div>
                ))):<h1>No hay recetas que mostrar actualmente</h1>}
                </div>
            ) : (
                <p>{error || "No tienes recetas publicadas."}</p>
            )}
        </div>
    );
};

