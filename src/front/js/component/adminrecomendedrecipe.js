import React, { useEffect, useState, useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import {jwtDecode} from "jwt-decode";
import "../../styles/AdminRecommendedRecipes.css";

export const AdminRecommendedRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [recommendedRecipes, setRecommendedRecipes] = useState([]);
    const { store, actions, setStore } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (!store.admin?.id) {
                    setStore({ admin: { id: decoded.sub } });
                }
                if (!store.authadmin) {
                    setStore({ authadmin: true });
                }
            } catch (error) {
                console.error("Error al decodificar el token:", error);
                navigate("/login/administrador");
            }
        } else {
            navigate("/login/administrador");
        }
    }, [store.admin, store.authadmin, setStore, navigate]);

    useEffect(() => {
        let isMounted = true;

        if (!store.authadmin) {
            navigate("/");
        } else {
            fetchRecipes();
            fetchRecommendedRecipes();
        }

        async function fetchRecipes() {
            try {
                const resp = await fetch(`${process.env.BACKEND_URL}/api/recetas`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                const data = await resp.json();
                if (isMounted) setRecipes(data);
            } catch (error) {
                if (isMounted) console.error("Error fetching recipes:", error);
            }
        }

        async function fetchRecommendedRecipes() {
            try {
                const resp = await fetch(`${process.env.BACKEND_URL}/api/recommendations`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                const data = await resp.json();
                if (isMounted) setRecommendedRecipes(data.map((rec) => rec.recipe_id));
            } catch (error) {
                if (isMounted) console.error("Error fetching recommended recipes:", error);
            }
        }

        return () => {
            isMounted = false;
        };
    }, [store.authadmin, navigate]);

    const addRecipeToRecommended = async (recipeId) => {
        try {
            const resp = await fetch(`${process.env.BACKEND_URL}/api/recommendations/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
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
            const resp = await fetch(`${process.env.BACKEND_URL}/api/recommendations/recipe/${recipeId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (resp.ok) {
                setRecommendedRecipes(recommendedRecipes.filter((id) => id !== recipeId));
            } else {
                console.error("Failed to remove recipe from recommended list");
            }
        } catch (error) {
            console.error("Error removing recipe from recommended:", error);
        }
    };

    return store.authadmin ? (
        <div className="admin-recipes-page">
            <div className="admin-recipes-container mt-4">
                <h2 className="text-center mb-4">Administrar Recetas Recomendadas</h2>
                <div className="row">
                    {recipes.map((recipe) => (
                        <div key={recipe.id} className="col-md-4">
                            <div className="card custom-card">
                                <img
                                    src={recipe.img_ilustrativa}
                                    className="card-img-top"
                                    alt={recipe.title}
                                />
                                <div className="card-body text-center">
                                    <h5 className="card-title">{recipe.title}</h5>
                                    {recommendedRecipes.includes(recipe.id) ? (
                                        <button
                                            className="btn btn-remove"
                                            onClick={() => removeRecipeFromRecommended(recipe.id)}
                                        >
                                            Quitar de Recomendadas
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-add"
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
        </div>
    ) : (
        <Navigate to="/" />
    );
};
