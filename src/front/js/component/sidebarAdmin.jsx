import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/sidebarAdmin.css";
import { Context } from "../store/appContext";
import { AdminIcon } from "./adminIcon.jsx";
import { RecipeIcon } from "./recipesIcon.jsx";
import { CategoryIcon } from "./categoryIcon.jsx";
import { RecomendedIcon } from "./recomendedIcon.jsx";
import { AdminRecomendationsIcon } from "./recipesRecommendedIcon.jsx";

export const SidebarAdmin = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(store.sideBar);
    }, [store.sideBar]);

    return (
        <div
            className={`sidebar-admin-container container-fluid pt-4 flex-shrink-0 h-100 ${
                visible ? "open" : "oculta"
            }`}
            style={{ width: "280px" }}
        >
            <a
                href="/"
                className="d-flex align-items-center justify-content-center py-5 my-3 border-bottom text-decoration-none"
            >
                <AdminIcon />
                <span className="ms-2 fs-5">Admin Panel</span>
            </a>
            <ul className="sidebar-nav">
                <li className="sidebar-item">
                    <RecipeIcon />
                    <a onClick={() => navigate("/")} className="btn">
                        Dashboard
                    </a>
                </li>
                <li className="sidebar-item">
                    <CategoryIcon />
                    <a onClick={() => navigate("/categories/create")} className="btn">
                        Crear Categorías
                    </a>
                </li>
                <li className="sidebar-item">
                    <RecomendedIcon />
                    <a onClick={() => navigate("/recomended/recipe")} className="btn">
                         Recomendadas
                    </a>
                </li>
                <li className="sidebar-item">
                    <AdminRecomendationsIcon />
                    <a onClick={() => navigate("/admin/recomended/recipe")} className="btn">
                        Recomendar 
                    </a>
                </li>
                <li className="sidebar-item border-top mt-3">
                    <AdminIcon />
                    <a onClick={() => navigate("/")} className="btn">
                        Configuración
                    </a>
                </li>
            </ul>
        </div>
    );
};
