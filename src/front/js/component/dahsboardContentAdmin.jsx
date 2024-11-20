import React, { useEffect, useState, useContext } from "react";
import "../../styles/dashboardContentAdmin.css";
import { Context } from "../store/appContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUtensils } from '@fortawesome/free-solid-svg-icons';

export const DashboardContentAdmin = () => {
    const { store } = useContext(Context);
    const [categories, setCategories] = useState([]);
    const [recommendedRecipes, setRecommendedRecipes] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalRecipes, setTotalRecipes] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const categoriesResp = await fetch(`${process.env.BACKEND_URL}/api/categorias`);
                const categoriesData = await categoriesResp.json();
                if (isMounted) setCategories(categoriesData);

                const recommendationsResp = await fetch(`${process.env.BACKEND_URL}/api/recommendations`);
                const recommendationsData = await recommendationsResp.json();
                if (isMounted) setRecommendedRecipes(recommendationsData);

                const usersResp = await fetch(`${process.env.BACKEND_URL}/api/usuario`);
                const usersData = await usersResp.json();
                if (isMounted) setTotalUsers(usersData.length);

                const recipesResp = await fetch(`${process.env.BACKEND_URL}/api/recetas`);
                const recipesData = await recipesResp.json();
                if (isMounted) setTotalRecipes(recipesData.length);

                if (isMounted) setLoading(false);
            } catch (error) {
                if (isMounted) console.error("Error fetching data:", error);
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, []);

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="dashboard-admin-container">
            <main
                className={`content me-4 ${
                    store.sideBar ? "sidebar-open-admin" : "sidebar-close-admin"
                }`}
            >
                <div className="container-fluid pb-4 p-0">
                    <h3 className="ps-5 pt-5 card-text-dashboard">¡Bienvenido al panel de administrador!</h3>
                    
                    <div className="row justify-content-center pt-3">
                        {/* Tarjeta de Usuarios */}
                        <div className="col-12 col-sm-6 col-xxl-6 d-flex">
                            <div className="card flex-fill dashboard">
                                <div className="card-body py-4 align-items-center text-center">
                                    <FontAwesomeIcon icon={faUser} className="icon-dashboard mb-3" />
                                    <h4 className="illustration-text">Usuarios Totales</h4>
                                    <h3 className="gold-text">{totalUsers}</h3>
                                </div>
                            </div>
                        </div>

                        {/* Tarjeta de Recetas */}
                        <div className="col-12 col-sm-6 col-xxl-6 d-flex">
                            <div className="card flex-fill dashboard">
                                <div className="card-body py-4 align-items-center text-center">
                                    <FontAwesomeIcon icon={faUtensils} className="icon-dashboard mb-3" />
                                    <h4 className="illustration-text">Recetas Totales</h4>
                                    <h3 className="gold-text">{totalRecipes}</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 py-5 bg-dashboard-section">
                        <h3 className="ps-5 card-text-dashboard">Categorías</h3>
                        <ul>
                            {categories.map((category) => (
                                <li key={category.id}>{category.name}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-5 py-5 bg-dashboard-section">
                        <h3 className="ps-5 card-text-dashboard">Recetas Recomendadas</h3>
                        <div className="container-fluid bg-dashboard-section p-3 mb-4" style={{ height: "700px" }}>
                            <div id="carouselExample" className="carousel slide h-100">
                                <div className="carousel-inner rounded h-100">
                                    {recommendedRecipes.length > 0 ? (
                                        recommendedRecipes.map((recipe, index) => (
                                            <div
                                                className={`carousel-item pointer rounded h-100 ${index === 0 ? "active" : ""}`}
                                                key={recipe.id}
                                            >
                                                <img
                                                    src={recipe.recipe_image} 
                                                    className="img-fluid rounded w-100"
                                                    alt={recipe.recipe_title || "Receta"}
                                                />
                                                <div className="carousel-caption d-none d-md-block">
                                                    <h3 className="ps-5">{recipe.recipe_title}</h3>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div>No hay recetas recomendadas</div>
                                    )}
                                </div>
                                <button
                                    className="carousel-control-prev"
                                    type="button"
                                    data-bs-target="#carouselExample"
                                    data-bs-slide="prev"
                                >
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Previous</span>
                                </button>
                                <button
                                    className="carousel-control-next"
                                    type="button"
                                    data-bs-target="#carouselExample"
                                    data-bs-slide="next"
                                >
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Next</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
