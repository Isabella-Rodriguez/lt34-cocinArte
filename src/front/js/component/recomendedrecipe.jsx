import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar,faStarHalfStroke, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { Context } from "../store/appContext";

import '../../styles/recomendedRecipe.css'

export const RecomendedRecipe = () => {
    const { store, actions } = useContext(Context);
    const [recommendedRecipes, setRecommendedRecipes] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRecommendedRecipes();
    }, []);

    const fetchRecommendedRecipes = async () => {
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/recommendations`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error("Error al obtener las recetas recomendadas");
            }

            const recipes = await response.json();
            if (!Array.isArray(recipes)) {
                throw new Error("Formato incorrecto de datos recibidos");
            }

            const enrichedRecipes = await Promise.all(
                recipes.map(async (recipe) => {
                    const recipeDetails = await fetchRecipeDetails(recipe.recipe_id);
                    const recipeRating = await fetchRecipeRating(recipe.recipe_id);
                    const recipeVotes = await fetchRecipeVotes(recipe.recipe_id);

                    return {
                        ...recipe,
                        ...recipeDetails,
                        rating: recipeRating,
                        votes: recipeVotes,
                    };
                })
            );

            setRecommendedRecipes(enrichedRecipes);
        } catch (error) {
            console.error("Error fetching recommended recipes:", error);
            setError("No se pudieron cargar las recetas recomendadas.");
        }
    };

    const fetchRecipeDetails = async (id) => {
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/recetas/${id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error("Error al obtener los detalles de la receta");
            }

            return await response.json();
        } catch (error) {
            console.error(`Error fetching details for recipe ${id}:`, error);
            return {};
        }
    };

    const fetchRecipeRating = async (id) => {
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/calificaciones/promedio/${id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                return 0; 
            }

            const data = await response.json();
            return data.promedio;
        } catch (error) {
            console.error(`Error fetching rating for recipe ${id}:`, error);
            return 0;
        }
    };

    const fetchRecipeVotes = async (id) => {
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/vote/recipe/${id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                return 0; // Si no hay votos, devolver 0
            }

            const data = await response.json();
            return data.total_votes;
        } catch (error) {
            console.error(`Error fetching votes for recipe ${id}:`, error);
            return 0;
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

    return (
        <main className={`py-5 ${store.sideBar===false ? 'sidebar-close':'sidebar-open'}`}>
        <div className="recommended-section">
            <h2 className="recommended-title">Recetas Recomendadas</h2>
            <div className="recommended-list">
                {recommendedRecipes.length > 0 ? (
                    recommendedRecipes.map((recipe, index) => (
                        <div key={index} className="card dashboard recommended-card mb-3 d-flex flex-row">
                            <div className="image-container" style={{ flex: "1 0 33%", maxHeight: "300px" }}>
                                {recipe.recipe_image[0] ? (
                                    <img
                                        src={recipe.recipe_image[0]}
                                        alt={recipe.recipe_title}
                                        className="card-img"
                                        style={{ objectFit: "cover", height: "100%", width: "100%" }}
                                    />
                                ) : (
                                    <div className="default-icon-container d-flex align-items-center justify-content-center" style={{ height: "100%" }}>
                                        <i className="bi bi-card-image default-icon"></i>
                                    </div>
                                )}
                            </div>
                            <div className="card-body text-container" style={{ flex: "1 0 67%" }}>
                                <h5 className="card-title card-text-dashboard">{recipe.recipe_title}</h5>
                                <p className="card-text card-text-dashboard">
                                    Publicado: {formatDate(recipe.fecha_publicacion)}
                                </p>
                                <p className="card-text card-text-dashboard">
                                    {renderStars(recipe.rating)} | {recipe.votes} <FontAwesomeIcon icon={faThumbsUp} />
                                </p>
                                <div className="d-flex justify-content-end">
                                    <Link to={`/recipe/${recipe.recipe_id}`}>
                                        <button className="btn btn-primary btn-sm">Ver Receta</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center card-text-dashboard">No hay recetas recomendadas disponibles.</p>
                )}
            </div>
        </div>
        </main>
    );
};
