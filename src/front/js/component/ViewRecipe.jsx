import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import { Context } from "../store/appContext";
import { jwtDecode } from "jwt-decode";


export function ViewRecipe(){
    const { store, actions } = useContext(Context);
    const [recipe, setRecipe]=useState({})
    const{id}= useParams()
    const navigate = useNavigate()
    const [isLogin, setIsLogin] = useState(false);
    const [comment, setComment] = useState("");  
    const [comments, setComments] = useState([]);
    const [userId, setUserId] = useState(null);
    const [calificacion, setCalificacion] = useState(0);
    const [promedioCalificacion, setPromedioCalificacion] = useState(null);
    const [voteCount, setVoteCount] = useState(0);
    const [userVote, setUserVote] = useState(null); 


    useEffect(()=>{
        getRecipeId()
        getComments();
        checkLoginStatus();
        obtenerPromedioCalificacion();
        fetchVotes(); // Obtener votos iniciales
        fetchUserVote(); // Obtener el voto del usuario al cargar la página
        
    },[userId])

    const getRecipeId=async()=>{
        const data = await fetch(process.env.BACKEND_URL +`/api/recetas/${id}`,{
            method:'GET',
        })
        const resp = await data.json()
        console.log ("recipe es: " ,resp)
        setRecipe(resp)
    }

    const getComments = async () => {
        const data = await fetch(`${process.env.BACKEND_URL}/api/comentario/receta/${id}`, {
            method: 'GET',
        });
        const resp = await data.json();
        setComments(resp);
    };

    const checkLoginStatus = () => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLogin(true);
            const decodedToken = jwtDecode(token);
            console.log(decodedToken)
            setUserId(decodedToken.sub);
        } else {
            setIsLogin(false);
        }
    };

    const deleteReceta=async(id)=>{
        const resp = await fetch(process.env.BACKEND_URL +`/api/recetas/${id}`,{
            method:'DELETE',
        })
        if (resp.ok){
            const data = resp.json()
            console.log(data);
            navigate('/recipe')
        } else alert('Hubo un Error al eliminar la receta!')
    }

    const createComment = async () => {
        await actions.userById(userId)
        console.log("user es",store.user)
        if (!store.user.email) return console.error("User email is missing");

        const data = {
            recipe_id: id,
            comment_text: comment,
            user_email: store.user.email,
            user_id: userId,
        };

        const resp = await fetch(process.env.BACKEND_URL + `/api/comentario`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (resp.ok) {
            setComment("");
            getComments();
        } else {
            console.error("Error al crear el comentario");
        }
    };

    const removeComentario = async (idToDelete) => {
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/delete/comentario/${idToDelete}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setComments(comments.filter(comment => comment.id !== idToDelete));
            } else {
                console.error("Error al eliminar el comentario");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };
    
    const obtenerPromedioCalificacion = async () => {
        const resp = await fetch(`${process.env.BACKEND_URL}/api/calificaciones/promedio/${id}`, {
            method: 'GET',
        });
        const data = await resp.json();
        if (resp.ok) setPromedioCalificacion(data.promedio);
    };

    const handleCalificacionChange = (event) => {
        setCalificacion(parseInt(event.target.value));
    };

    const addCalif = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem("token");
        const data = {
            recipe_id: id,
            qualification: calificacion,
        };

        const resp = await fetch(`${process.env.BACKEND_URL}/api/calificaciones`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });

        if (resp.ok) {
            obtenerPromedioCalificacion();
        } else {
            console.error("Error al enviar la calificación");
        }
    };



    const fetchVotes = async () => {
        const data = await fetch(`${process.env.BACKEND_URL}/api/vote/recipe/${id}`, {
            method: 'GET',
        });
        const resp = await data.json();
        if (resp && resp.total_votes !== undefined) {
            setVoteCount(resp.total_votes);
        }
    };

    const fetchUserVote = async () => {
        if (!userId) return;
        const token = localStorage.getItem("token");
        // Obtiene el voto específico del usuario para esta receta
        const data = await fetch(`${process.env.BACKEND_URL}/api/vote/user/${userId}/recipe/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const resp = await data.json();
        if (resp && resp.vote_type !== undefined) {
            setUserVote(resp.vote_type); 
        } else {
            setUserVote(null); 
        }
    };

    const handleVote = async (type) => {
        const token = localStorage.getItem("token");

        if (userVote === type) {
            await deleteVote();
            setVoteCount(voteCount - type); 
            setUserVote(null);
            return;
        }

        if (userVote !== null) {
            alert("Debe anular su voto actual antes de cambiar a otro.");
            return;
        }

        const voteData = {
            recipe_id: id,
            vote_type: type,
        };
        
        const resp = await fetch(`${process.env.BACKEND_URL}/api/vote/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(voteData),
        });

        if (resp.ok) {
            setVoteCount(voteCount + type); 
            setUserVote(type); 
        } else {
            console.error("Error al enviar el voto");
        }
    };

    const deleteVote = async () => {
        const token = localStorage.getItem("token");
        const resp = await fetch(`${process.env.BACKEND_URL}/api/vote/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ recipe_id: id }),
        });
        if (resp.ok) {
            setUserVote(null); 
        } else {
            console.error("Error al eliminar el voto");
        }
    };


    return(
        <div className="container d-flex flex-column align-items-center">
            <div className="container d-flex flex-column align-items-center">
                <h1 className="container fs-1">{recipe.title}</h1>
                <p className="container text-start">{" | Calificación promedio: " + promedioCalificacion + " estrellas"}</p>
                <h2 className="">Ingredientes!</h2>
                {recipe.ingredientes && recipe.ingredientes.length>0 ? (
                    recipe.ingredientes.map((ingrediente, index)=>(
                    <h3 key={index}>{ingrediente}</h3>))
                    ):(<h3>El chef aún no especifica los ingredientes!</h3>)}
                <h2>Pasos:</h2>
                <p>{recipe.pasos}</p>
                <img src={recipe.img_ilustrativa} alt="" />
                <h2>Fecha de publicacion:</h2>
                <p>{recipe.fecha_publicacion}</p>
                <p>{recipe.category}</p>
            </div>
            {userId===recipe.user_id ? (
                <div className="d-flex col-12 gap-2 justify-content-evenly my-3">
                    <button className="btn btn-danger " onClick={()=>{deleteReceta(id)}}>Borrar Receta!</button>
                    <Link to={`/recipe/edit/${id}`}><button className="btn btn-warning">Editar Receta!</button></Link>
                    <button className="btn btn-warning" onClick={()=>{actions.addFav(id)}}>Añadir a favoritos!</button>
                </div>):(
                    <>
                        <button className="btn btn-warning my-3" onClick={()=>{actions.addFav(id)}}>Añadir a favoritos!</button>
                    </>)}

            {isLogin && (
                    <div className="d-flex col-12 gap-2 justify-content-center">
                        <div className="form-floating col-7 ms-2">
                            <textarea
                                className="form-control"
                                placeholder="Leave a comment here"
                                id="floatingTextarea"
                                value={comment}
                                onChange={(e)=>setComment(e.target.value)}
                            ></textarea>
                            <label htmlFor="floatingTextarea">Comments</label>
                        </div>
                        <button className="btn btn-success col-2 my-3" onClick={createComment}>Crear comentarios</button>
                    </div>
                )}

                <form onSubmit={addCalif} className="calificacion-form">
                    <h5>Califica la receta:</h5>
                    <select value={calificacion} onChange={handleCalificacionChange}>
                        <option value={0}>Selecciona una calificación</option>
                        <option value={1}>1 estrella</option>
                        <option value={2}>2 estrellas</option>
                        <option value={3}>3 estrellas</option>
                        <option value={4}>4 estrellas</option>
                        <option value={5}>5 estrellas</option>
                            </select>
                    <button type="submit" className="btn btn-primary mt-2">Enviar Calificación</button>
                </form>
                  {isLogin && (
                <div className="vote-section">
                    <button
                        className={`btn ${userVote === 1 ? "btn-success" : "btn-outline-primary"}`}
                        onClick={() => handleVote(1)}
                    >
                        Votar Positivo
                    </button>
                    <span className="mx-3 fs-4">{voteCount}</span>
                    <button
                        className={`btn ${userVote === -1 ? "btn-danger" : "btn-outline-danger"}`}
                        onClick={() => handleVote(-1)}
                    >
                        Votar Negativo
                    </button>
                </div>
            )}
            {userVote !== null && (
                <p className="text-info">Has votado: {userVote === 1 ? "Positivo" : "Negativo"}</p>
            )}
           
            <div className="comments-section">
                <h3>Comentarios</h3>
                <ul className="list-group">
                    {comments.length > 0 ? (
                        comments.map((item, index) => (
                            <li key={index} className="list-group-item d-flex justify-content-between">
                                <div className="d-flex">
                                    <div style={{ marginLeft: "10px", display: "flex", flexDirection: "column", padding: "5px" }}>
                                        <h4>{item.user_email}</h4>
                                        <p style={{ marginBottom: "0", marginLeft: "5px" }}>{item.comment_text}</p>
                                    </div>
                                </div>
                                {item.user_id === userId ? (  
                                    <button onClick={() => removeComentario(item.id)} style={{ backgroundColor: "white", border: "0px" }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" className="bi bi-trash-fill">
                                            <path d="M4.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a.5.5 0 0 1 0 1H1a.5.5 0 0 1 0-1h1V.5a.5.5 0 0 1 .5-.5zM3 2h10a1 1 0 0 1 1 1v1H2V3a1 1 0 0 1 1-1zm11 3v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5h12z" />
                                        </svg>
                                    </button>
                                ) : null} 
                            </li>
                        ))
                    ) : (
                        <li className="list-group-item">No hay comentarios aún.</li>
                    )}
                </ul>
            </div>
        </div>
    )
}