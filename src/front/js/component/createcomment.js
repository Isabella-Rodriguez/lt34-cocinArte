import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

export const CreateComment = () => {
    const { store, actions } = useContext(Context);
    const [recipes, setRecipes] = useState([]);
    const [idUser, setIdUser] = useState("");
    const [idRecipe, setIdRecipe] = useState("");
    const [commentText, setCommentText] = useState("");

    const getAllRecipes = async () => {
        const resp = await fetch(process.env.BACKEND_URL + `/api/recetas`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        const data = await resp.json();
        if (Array.isArray(data)) {
            setRecipes(data);
        } else {
            setRecipes([]);
        }
    };

    useEffect(() => {
        actions.loadUsers();
        getAllRecipes();
    }, []);

    const handleUserChange = (e) => {
        const selectedUserId = e.target.value;
        setIdUser(selectedUserId);
        console.log("User ID:", selectedUserId);
    };

    const handleRecipeChange = (e) => {
        const selectedRecipeId = e.target.value;
        setIdRecipe(selectedRecipeId);
        console.log("Recipe ID:", selectedRecipeId);
    };

    const handleCommentChange = (e) => {
        setCommentText(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addNewComment(idUser, idRecipe, commentText);
    };

    function addNewComment(user_id, recipe_id, comment_text) {
        fetch(process.env.BACKEND_URL + `/api/comentario`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: user_id,
                recipe_id: recipe_id,
                comment_text: comment_text,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Comentario agregado:", data);
            })
            .catch((error) => {
                console.error("Hubo un problema con la solicitud fetch:", error);
            });
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="user" className="form-label">User</label>
            <select
                className="form-select"
                aria-label="Default select example"
                onChange={handleUserChange}
                value={idUser}
            >
                <option value="">Selecciona un usuario</option>
                {store.users.map((user, index) => (
                    <option key={index} value={user.id}>
                        {user.email}
                    </option>
                ))}
            </select>

            <label htmlFor="recipe" className="form-label">Recipe</label>
            <select
                className="form-select"
                aria-label="Default select example"
                onChange={handleRecipeChange}
                value={idRecipe}
            >
                <option value="">Selecciona una receta</option>
                {recipes.map((recipe, index) => (
                    <option key={index} value={recipe.id}>
                        {recipe.title}
                    </option>
                ))}
            </select>

            <div className="mb-3">
                <label htmlFor="comentario" className="form-label">Deja tu Comentario</label>
                <input
                    type="text"
                    className="form-control"
                    id="comentario"
                    aria-describedby="emailHelp"
                    value={commentText}
                    onChange={handleCommentChange}
                />
            </div>

            <button type="submit" className="btn btn-primary">Submit</button>
            <Link to="/comment/list">
                <button type="button" className="btn btn-primary">List Comentarios</button>
            </Link>
        </form>
    );
};
