import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const RecomendedRecipe = () => {
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

            const data = await response.json();
            setRecommendedRecipes(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching recommended recipes:", error);
            setError("No se pudieron cargar las recetas recomendadas.");
        }
    };

    return (
        <div className="container d-flex flex-column align-items-center gap-5 ">
            <h2>Recetas Recomendadas</h2>
            {error ? (
                <p className="text-danger">{error}</p>
            ) : recommendedRecipes.length > 0 ? (
                recommendedRecipes.map((recipe) => (
                    <div className="border px-2" key={recipe.id}>
                        <h3 className="text-center">{recipe.recipe_title}</h3>
                        <Link className="d-flex justify-content-center mb-2" to={`/recipe/${recipe.recipe_id}`}>
                            <button className="btn btn-success">Ver Receta</button>
                        </Link>
                    </div>
                ))
            ) : (
                <p>No hay recetas recomendadas actualmente</p>
            )}
        </div>
    );
};
