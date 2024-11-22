import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { Context } from "../store/appContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faUpLong } from "@fortawesome/free-solid-svg-icons";
import '../../styles/allRecipes.css';
export function AllRecipes() {
    const [recipes, setRecipes] = useState([]);
    const { store } = useContext(Context);
    const navigate = useNavigate();
    const [promedioCalificacion, setPromedioCalificacion] = useState({});
    const [votes, setVotes] = useState({});
    useEffect(() => {
        getAllRecipes();
    }, []);
    const getAllRecipes = async () => {
        const resp = await fetch(`${process.env.BACKEND_URL}/api/recetas`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        const data = await resp.json();
        if (Array.isArray(data)) {
            setRecipes(data);
            data.forEach((recipe) => {
                obtenerPromedioCalificacion(recipe.id);
                getVotes(recipe.id);
            });
        } else {
            setRecipes([]);
        }
    };
    const obtenerPromedioCalificacion = async (id) => {
        const resp = await fetch(`${process.env.BACKEND_URL}/api/calificaciones/promedio/${id}`, {
            method: 'GET',
        });
        const data = await resp.json();
        if (resp.ok) {
            setPromedioCalificacion((prev) => ({
                ...prev,
                [id]: data.promedio,
            }));
        }
    };
    const renderStars = (calificacion) => {
        const stars = [];
        for (let i = 0; i < calificacion; i++) {
            stars.push(<FontAwesomeIcon icon={faStar} key={i} />);
        }
        return stars;
    };
    const getVotes = async (id) => {
        const resp = await fetch(`${process.env.BACKEND_URL}/api/vote/recipe/${id}`, {
            method: 'GET'
        });
        const data = await resp.json();
        if (resp.ok) {
            setVotes((prev) => ({
                ...prev,
                [id]: data.total_votes,
            }));
        }
    };
    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };
        return new Date(dateString).toLocaleString('es-ES', options);
    };
    return (
        <div className="all-recipes-container">
            <Navbar />
            <div className={`h-100 mx-5 mt-5 ${store.sideBar === false ? 'sidebar-close' : 'sidebar-open'}`}>
                <div className="bg-all-recipe">
                    <h1 className="all-recipe-text p-4">Estas son nuestras recetas</h1>
                    <div className="container-fluid d-flex justify-content-center flex-wrap gap-2 mt-3">
                        {recipes.length !== 0 ? (
                            recipes.map((recipe, index) => (
                                <div className="card resaltar border-color m-2 col-lg-3 col-md-4 col-sm-6" key={index}>
                                    <img src={recipe.img_ilustrativa} className="card-img-top" alt={recipe.title} style={{ height: '250px', objectFit: 'cover' }} />
                                    <div className="card-body">
                                        <h5 className="card-title text-truncate">{recipe.title}</h5>
                                        <div className="star-container">
                                            {promedioCalificacion[recipe.id] !== undefined ? (
                                                renderStars(promedioCalificacion[recipe.id])
                                            ) : (
                                                <FontAwesomeIcon icon={faStar} className="text-warning" />
                                            )}
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between mt-3">
                                            <span className="fs-6">Votos positivos:</span>
                                            <span className="fs-6 d-flex align-items-center">
                                                <FontAwesomeIcon icon={faUpLong} className="me-1" style={{ color: "#63E6BE" }} />
                                                {votes[recipe.id] !== undefined ? votes[recipe.id] : 0}
                                            </span>
                                        </div>
                                        <p className="text-muted mt-3">Publicado el: {formatDate(recipe.fecha_publicacion)}</p>
                                    </div>
                                    <button className="btn btn-primary mt-auto" onClick={() => navigate(`/recipe/${recipe.id}`)}>
                                        Quiero probarla!
                                    </button>
                                </div>
                            ))
                        ) : (
                            <h1>No hay recetas que mostrar actualmente</h1>
                        )}
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
}