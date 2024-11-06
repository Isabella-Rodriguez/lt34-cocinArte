import React, { useEffect, useState, useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { jwtDecode } from "jwt-decode";

export const AdminRecommendedRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [recommendedRecipes, setRecommendedRecipes] = useState([]);
    const { store, actions, setStore } = useContext(Context); 
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (token && !store.admin?.id) {
            const decoded = jwtDecode(token);
            const adminId = decoded.sub;
            setStore({ admin: { id: adminId } });
            console.log(adminId)
        }
    }, [store.admin]);

    useEffect(() => {
        if (!store.authadmin) {
            navigate("/");
        } else {
            fetchRecipes();
            fetchRecommendedRecipes();
        }
    }, [store.authadmin]);

    const fetchRecipes = async () => {
        try {
            const resp = await fetch(`${process.env.BACKEND_URL}/api/recetas`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await resp.json();
            setRecipes(data);
        } catch (error) {
            console.error("Error fetching recipes:", error);
        }
    };

    const fetchRecommendedRecipes = async () => {
        try {
            const resp = await fetch(`${process.env.BACKEND_URL}/api/recommendations`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await resp.json();
            setRecommendedRecipes(data.map(rec => rec.recipe_id));
        } catch (error) {
            console.error("Error fetching recommended recipes:", error);
        }
    };

    const addRecipeToRecommended = async (recipeId) => {
        console.log("Admin ID:", store.admin?.id);
        try {
            const resp = await fetch(`${process.env.BACKEND_URL}/api/recommendations/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    admin_id: store.admin.id, 
                    recipe_id: recipeId,
                }),
            });
            if (resp.ok) {
                setRecommendedRecipes([...recommendedRecipes, recipeId]);
            } else {
                console.error("Failed to add recipe to recommended list");
            }
        } catch (error) {
            console.error("Error adding recipe to recommended:", error);
        }
    };

    const removeRecipeFromRecommended = async (recipeId) => {
        try {
            const resp = await fetch(`${process.env.BACKEND_URL}/api/recommendations/${recipeId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            if (resp.ok) {
                setRecommendedRecipes(recommendedRecipes.filter(id => id !== recipeId));
            } else {
                console.error("Failed to remove recipe from recommended list");
            }
        } catch (error) {
            console.error("Error removing recipe from recommended:", error);
        }
    };

    return store.authadmin ? (
        <div className="container mt-4">
            <h2>Administrar Recetas Recomendadas</h2>
            <div className="row">
                {recipes.map((recipe) => (
                    <div key={recipe.id} className="col-4 mb-4">
                        <div className="card">
                            <img src={recipe.image_url} className="card-img-top" alt={recipe.title} />
                            <div className="card-body">
                                <h5 className="card-title">{recipe.title}</h5>
                                {recommendedRecipes.includes(recipe.id) ? (
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => removeRecipeFromRecommended(recipe.id)}
                                    >
                                        Quitar de Recomendadas
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => addRecipeToRecommended(recipe.id)}
                                    >
                                        Agregar a Recomendadas
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    ) : (
        <Navigate to="/" />
    );
};
