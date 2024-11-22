import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import { Context } from "../store/appContext";
import { jwtDecode } from "jwt-decode";
import { Navbar } from "./navbar";
import '../../styles/viewRecipe.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faStar, faTrashCan, faThumbsUp, faThumbsDown, faUser} from "@fortawesome/free-solid-svg-icons";


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
        console.log('dataComentarios:',resp)
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

    const renderStars=(calificacion)=>{
        const stars=[]
        for(let i=0; i<calificacion; i++){
            stars.push(<FontAwesomeIcon icon={faStar} key={i} style={{color:'#c9a669'}} />)
        }
        return stars;
    };


    return(<>
        <Navbar/>
        <div className={` ${store.sideBar===false ? 'sidebar-close':'sidebar-open'} container-fluid col-11 mt-4 d-flex flex-column `}>
            <div className="bg-view-recipe p-4">
                <div className="border-bottom mb-3 d-flex ">
                    <div className="col-6">
                    <h1 className="container view-recipe-text fs-1 mt-3">{recipe.title}</h1>
                    <div className="d-flex">
                        <p className="view-recipe-text text-start ps-4 pe-2"> | Calificación promedio </p>
                        <span>{renderStars(promedioCalificacion)}</span>
                    </div>
                    </div>
                        <div className="d-flex align-items-center col-3">
                        {userId===recipe.user_id ? (
                    <div className="d-flex col-12 gap-3 my-3">
                        <button className="btn btn-actions " onClick={()=>{deleteReceta(id)}}><FontAwesomeIcon icon={faTrashCan} style={{color: "inherit",}} /></button>
                        <Link to={`/recipe/edit/${id}`}><button className="btn btn-actions"><FontAwesomeIcon icon={faPen} style={{color: "inherit",}} /></button></Link>
                        <button className="btn btn-actions" onClick={()=>{actions.addFav(id)}}><FontAwesomeIcon icon={faStar}  style={{color: "inherit",}}/></button>
                    </div>):(null)}
                    </div>
                    <div className="col-3 d-flex align-items-center">
                    {isLogin && (
                      <div className="vote-section">
                    <button
                        className={`btn ${userVote === 1 ? "btn-actions-outline" : "btn-actions"}`}
                        onClick={() => handleVote(1)}
                        >
                        <FontAwesomeIcon icon={faThumbsUp} />
                    </button>
                    <span className="mx-3 fs-4">{voteCount}</span>
                    <button
                        className={`btn ${userVote === -1 ? "btn-actions-outline" : "btn-actions"}`}
                        onClick={() => handleVote(-1)}
                    >
                        <FontAwesomeIcon icon={faThumbsDown} />
                    </button>
                    </div>
                )}
                    </div>
                </div>
                <div className="container-fluid d-flex border-bottom">
                <div className="container-fluid d-flex flex-column col-6 justify-content-evenly ">
                    <div>
                    <h2 className="view-recipe-text linea pb-3">Ingredientes</h2>
                    <ul>
                        {recipe.ingredientes && recipe.ingredientes.length>0 ? (
                            recipe.ingredientes.map((ingrediente, index)=>(
                                <li className='view-recipe-text' key={index}>{ingrediente}</li>))
                            ):(<li>El chef aún no especifica los ingredientes!</li>)}
                    </ul>
                    </div>
                    <div>
                    <h2 className="view-recipe-text linea py-3">Pasos</h2>
                    <p className="view-recipe-text ps-4">{recipe.pasos}</p>
                    </div>
                    <p>{recipe.category}</p>
                    <div className="col-12">
                        <h2 className="view-recipe-text linea">Fecha de publicacion</h2>
                        <p className="view-recipe-text ps-4">{recipe.fecha_publicacion}</p>
                    </div>
                </div>
                <div className="col-6">
                    <img src={recipe.img_ilustrativa} alt="recipe image" className="img-fluid p-5" />
                </div>
                </div>
            <div className="col-7 float-start">            
            {isLogin && (
                <div className="view-recipe-text mt-4 ">
                        <h3 className="my-2 view-recipe-text linea">Comentarios</h3>
                        <div className="form-floating  ms-4">
                            <textarea
                                style={{minHeight:'150px'}}
                                className="form-control"
                                placeholder="Leave a comment here"
                                id="floatingTextarea"
                                value={comment}
                                onChange={(e)=>setComment(e.target.value)}
                                ></textarea>
                            <label htmlFor="floatingTextarea">Danos una opinion sobre la receta</label>
                        <button className="btn btn-comentarios btn-actions col-2 my-3" onClick={createComment}>Crear comentarios</button>
                        </div>
                    </div>
                )}
                <div className="comments-section py-4">
                <ul className="list-group">
                    {comments.length > 0 ? (
                        comments.map((item, index) => (
                            <li key={index} className=" d-flex align-items-center bg-transparent my-2 p-3 border-bottom border-top ms-4">
                                <div className="px-3">
                                    {item.img_profile ? (
                                        <div className="round-container-view">
                                            <img
                                                src={item.img_profile}
                                                alt="Customer Support"
                                            />
                                        </div>
                                    ) : (
                                        <div className="user-icon-view">
                                            <FontAwesomeIcon icon={faUser} />
                                        </div>
                                    )}
                                </div>
                                <div className="container-fluid">
                                    <h5 className="view-recipe-text soft">{item.name}</h5>
                                    <h4 className="view-recipe-text soft">{item.comment_text}</h4>
                                </div>
                                {item.user_id === userId ? (  
                                    <button className="btn-actions" onClick={() => removeComentario(item.id)} style={{width:'40px', height:'40px'}}>
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
            <div className="col-5 float-end d-flex flex-column align-items-center">
            {isLogin && (
                <form onSubmit={addCalif} className="calificacion-form ">
                    <h3 className="view-recipe-text my-2 col-12 text-center mt-4">Cuentanos cuanto te ha gustado</h3>
                    <div className="d-flex align-items-center">
                        <select className="form-select select-view-recipe" name="" id="calificacion" value={calificacion} onChange={handleCalificacionChange}>
                            <option className="p-1" value={0}>Elige una opcion</option>
                            <option className="p-1" value={1}>1</option>
                            <option className="p-1" value={2}>2</option>
                            <option className="p-1" value={3}>3</option>
                            <option className="p-1" value={4}>4</option>
                            <option className="p-1" value={5}>5</option>
                        </select>
                    <button type="submit" className="btn btn-actions ms-2">Enviar</button>
                    </div>
                </form>)}
                <div className="container mt-5 ms-3 ">
                    <div className="d-flex">
                    <h3 className="view-recipe-text">Categorias</h3>
                    </div>
                    <div className="d-flex flex-row flex-wrap mt-2">
                        {recipe.categories && recipe.categories.length>0 ? recipe.categories.map((category, index)=>(
                            <p className='py-2 px-4 m-3 btn-recipe-category' key={index}>{category.name}</p>
                        )):(null)}
                    </div>
                </div>
            </div>
                  
            </div>
        </div>
        </>
    )
}