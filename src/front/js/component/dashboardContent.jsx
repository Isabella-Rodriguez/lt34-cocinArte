import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import '../../styles/dashboardContent.css'
import { Navigate, Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { height } from "@fortawesome/free-solid-svg-icons/fa0";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar,faStarHalfStroke, faThumbsUp, faUser } from "@fortawesome/free-solid-svg-icons";

export const DashboardContent = () => {
    const { store, actions } = useContext(Context);
    const [recetas, setRecetas] = useState([]);
    const [userID, setUserId] = useState(null);
    const [state, setState] = useState(true);
    const [totalLikes, setTotalLikes] = useState(0);
    const [overallRating, setOverallRating] = useState(0);

    const fetchVotes = async (recipeId) => {
        try {
        const response = await fetch(
            `${process.env.BACKEND_URL}/api/vote/recipe/${recipeId}`,
            { method: "GET" }
        );
        const data = await response.json();
        return data.total_votes || 0;
        } catch (error) {
        console.error("Error fetching votes:", error);
        return 0;
        }
    };

    const fetchRating = async (recipeId) => {
        try {
        const response = await fetch(
            `${process.env.BACKEND_URL}/api/calificaciones/promedio/${recipeId}`,
            { method: "GET" }
        );
        const data = await response.json();
        return data.promedio || 0;
        } catch (error) {
        console.error("Error fetching rating:", error);
        return 0;
        }
    };
    
    useEffect(() => {
        const fetchRecetas = async () => {
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.sub);
        setState(false);

        try {
            const response = await fetch(
            `${process.env.BACKEND_URL}/api/recetas/mis-recetas`,
            {
                method: "GET",
                headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                },
            }
            );
            const data = await response.json();

            let totalLikesSum = 0;
            let totalRatingSum = 0;

            const enrichedRecetas = await Promise.all(
            data.map(async (recipe) => {
                const votes = await fetchVotes(recipe.id);
                const rating = await fetchRating(recipe.id);
                totalLikesSum += votes;
                totalRatingSum += rating;

                return { ...recipe, votes, rating };
            })
            );

            setRecetas(enrichedRecetas);
            setTotalLikes(totalLikesSum);
            setOverallRating(
            enrichedRecetas.length > 0
                ? (totalRatingSum / enrichedRecetas.length).toFixed(2)
                : 0
            );
        } catch (error) {
            console.error("Error fetching recetas:", error);
        }
        };

        fetchRecetas();
        actions.loadFavs();
    }, []);

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

    if (state) {
        return <div>Cargando</div>;
    }

    if (userID === null) {
        return <Navigate to="/login/cocinero" />;
    }

    return (
        <main className={`content me-4 ${store.sideBar===false ? 'sidebar-close':'sidebar-open'}`}>
			<div className="container-fluid pb-4 p-0">
				<div className="col-auto d-none d-sm-block">
					<h3 className="pt-4 card-text-dashboard">Nos alegra que seas parte de la cocina!!</h3>
			    </div>
                <div className="row justify-content-center pt-3">
                    <div className="col-12 col-sm-6 col-xxl-6 d-flex">
                        <div className="card illustration flex-fill profile-card">
                            <div className="card-body align-items-center p-0 d-flex flex-fill">

                            <div className="row g-0 w-100 card-text-dashboard" style={{ height: "100px" }}>
                                <div className="col-7">
                                    <div className="illustration-text p-3 m-1">
                                        <h4 className="illustration-text">Bienvenido, {store.user.name}!</h4>
                                        <p className="mb-0">¿Qué deseas cocinar hoy?</p>
                                    </div>
                                </div>

                                <div className="col-5 text-end d-flex align-items-center justify-content-center">
                                    {store.user.img_profile ? (
                                        <div class="round-container">
                                            <img
                                                src={store.user.img_profile}
                                                alt="Customer Support"
                                            />
                                        </div>
                                    ) : (
                                        <div className="gold-text user-icon">
                                            <FontAwesomeIcon icon={faUser} />
                                        </div>
                                    )}
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-sm-3 col-xxl-3 d-flex pointer" onClick={()=>{navigate('/recomended/recipe')}}>
                        <div className="card flex-fill dashboard">
                        <div className="card-body py-4 align-items-center">
                            <div className="d-flex align-items-start">
                            <div className="flex-grow-1 card-text-dashboard">
                                <h3 className="mb-2">Votos</h3>
                                <p className="mb-3">El numero de votos en tus recetas es:</p>
                                <h3 className="gold-text px-3">{totalLikes} <FontAwesomeIcon icon={faThumbsUp} /></h3>
                                
                            </div>
                            
                            </div>
                        </div>
                        </div>
                    </div>

                    <div className="col-12 col-sm-3 col-xxl-3 d-flex pointer" onClick={()=>{navigate("/favoritos")}}>
                        <div className="card flex-fill dashboard">
                        <div className="card-body py-4 align-items-center">
                            <div className="d-flex align-items-start">
                            <div className="flex-grow-1 card-text-dashboard">
                                <h3 className="mb-2">Calificaciones</h3>
                                <p className="mb-3">El promedio de tus recetas es: </p>
                                <h3 className="gold-text ">{renderStars(overallRating)}</h3>
                            </div>
                            
                            </div>
                        </div>
                        </div>
                    </div>
                
                </div>

                <div className="col-auto d-none mt-5 py-2 bg-dashboard-section d-sm-block">
					<h3 className="p-4 card-text-dashboard">Tus Recetas</h3>
			    </div>
                <div className="container-fluid bg-dashboard-section p-3 mb-4">
                    <div className="table-responsive">  
                        <table className="table table-bordered user-recipes-table">
                            
                            <thead>
                            <tr>
                                <th>Imagen</th>
                                <th>Nombre</th>
                                <th>Fecha Publicacion</th>
                                <th>Calificacion</th>
                                <th>Votos</th>
                                <th>Visitar</th>
                            </tr>
                            </thead>
                            <tbody>
                            {recetas.length>0 ? recetas.map((recipe, index) => (
                                <tr key={index}>
                                <td className="image-cell">
                                    {recipe.img_ilustrativa ? (
                                    <img src={recipe.img_ilustrativa} alt={recipe.title} className="recipe-image" />
                                    ) : (
                                    <i className="bi bi-card-image default-icon"></i>
                                    )}
                                </td>
                                <td className="name-cell">{recipe.title}</td>
                                <td className="description-cell">
                                    <span>{recipe.fecha_publicacion}</span>
                                </td>
                                <td className="rating-cell">{renderStars(recipe.rating)}</td>
                                <td className="rating-cell">{recipe.votes} <FontAwesomeIcon icon={faThumbsUp} /></td>
                                <td className="action-cell">
                                    <Link className="mx-2" to={`/recipe/${recipe.id}`}>
                                        <button className="btn btn-primary btn-sm">Ver Receta</button>
                                    </Link>
                                    
                                </td>
                                </tr>
                            )):
                            <></>
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
                
            </div>
		</main>
    )
}