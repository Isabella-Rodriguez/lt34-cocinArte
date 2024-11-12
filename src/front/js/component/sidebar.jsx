import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext"
import '../../styles/sidebar.css'
import { ChatIcon } from "./chatIcon.jsx";
import { CategoryIcon } from "./categoryIcon.jsx";
import { RecipeIcon } from "./recipesIcon.jsx";
import { PersonalAssistant } from "./personalAssistant.jsx";
import { RecomendedIcon } from "./recomendedIcon.jsx";
import { AdminIcon } from "./aminIcon.jsx";
import { ViewRecipeIcon } from "./viewRecipeIcon.jsx";
import { AdminRecomendationsIcon } from "./recipesRecommendedIcon.jsx";
import { AccountIcon } from "./accountIcon.jsx";

export function Sidebar(){
    const [categories, setCategories] = useState([])
    const navigate = useNavigate()
	const { store, actions } = useContext(Context)
    const [categoryRotate ,setCategoryRotate]= useState(false)
    const [visible, setVisible]=useState(false)
	

    useEffect(()=>{
        fetch(process.env.BACKEND_URL + '/api/categorias',{ 
			method: 'GET', 
			headers: { 'Content-Type': 'application/json' } 
		}) 
		.then(response=> response.json()) 
		.then(data=> setCategories(data));
        fetch(process.env.BACKEND_URL + '/api/categorias',{ 
            method: 'GET', 
            headers: { 'Content-Type': 'application/json' } 
        }) 
        .then(response=> response.json()) 
        .then(data=> setCategories(data));
    },[])
useEffect(()=>{
    setVisible(store.sideBar)    
},[store.sideBar])

    function navegar() {
		navigate("/categories/create"); // Usa navigate para redirigir programáticamente
	}

    const rotate=()=>{
        if (categoryRotate===false){
            setCategoryRotate(true)
        } else{
            setCategoryRotate(false)
        }
    }

    return (
        <div className={`container-fluid pt-4 flex-shrink-0 h-100 bg-transparent cocinarte-text oculta ${visible===false ? '':'open'}`} style={{ width: '280px' }}>
            <a href="/" className="d-flex align-items-center justify-content-center py-3 mb-3 border-bottom text-decoration-none">
            <RecipeIcon/>
            <span className="sidebar-brand text-center  ms-2 cocinarte-text fs-5">cocinArte</span>
            </a>
            <ul className="sidebar-nav">
                <li className="sidebar-item py-3 mb-1 svg-hover">
                    <ViewRecipeIcon/>
                    <a 
                        className="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed cocinarte-text" 
                        onClick={() => navigate("/recipe/")} 
                        aria-expanded="true">
                        Recetas
                    </a>
                </li>

                <li className="sidebar-item mb-1 py-3 cocinarte-text " onClick={rotate}>
                    <div className="svg-hover ">
                        <CategoryIcon />
                        <a 
                            className="btn btn-toggle d-inline-flex align-items-center rounded border-0 cocinarte-text collapsed" 
                            data-bs-toggle="collapse" 
                            data-bs-target="#dashboard-collapse" 
                            aria-expanded={categoryRotate}>
                                Categorias
                            <svg className={`rotate ${categoryRotate ? ('rotate-180'): ''}`} height={'30px'} width={'30px'} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" > <path d="M18 15L12 9L6 15" stroke="#ffffff" strokeWidth="2" /> </svg>
                        </a>
                    </div>
                    <div className="collapse" id="dashboard-collapse">
                        <ul className="btn-toggle-nav list-unstyled fw-normal ps-5 pt-3 pb-1 small">
                            {categories.map((category) => (
                                <li className="py-2 text-capitalize" key={category.id}> 
                                    <a 
                                        className="sidebar-link text-decoration-none cocinarte-text" 
                                        onClick={() => navigate(`/category/search/${category.id}`)}>
                                        {category.name}
                                    </a>
                                </li>
                            ))} 
                        </ul>
                    </div>
                </li>
                <li className="sidebar-item py-3 mb-1">
                    <PersonalAssistant/>
                    <a 
                        className="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed cocinarte-text" 
                        onClick={() => navigate("/assistant/")} 
                        aria-expanded="true">
                        Asistente personal
                    </a>
                </li>
                <li className="sidebar-item py-3 mb-1">
                    <div className="svg-hover">
                        <ChatIcon/>
                        <a 
                            className="btn btn-toggle d-inline-flex align-items-center rounded border-0 cocinarte-text" 
                            onClick={() => navigate("/chats")}>
                            Chats
                        </a>
                    </div>
                </li>
                <li className="sidebar-item py-3 mb-1">
                    <AdminIcon/>
                    <a 
                        className="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed cocinarte-text" 
                        onClick={() => navigate("/administrador")} 
                        aria-expanded="false">
                        Crear Admins
                    </a>
                </li>
                <li className="sidebar-item py-3 mb-1">
                    <RecomendedIcon/>
                    <a 
                        className="btn btn-toggle d-inline-flex align-items-center rounded border-0 cocinarte-text" 
                        onClick={() => navigate("/recomended/recipe")}>
                        Recetas Recomendadas
                    </a>
                </li>
                {store.authadmin && (
                    <li className="sidebar-item py-3 mb-1">
                        
                        <CategoryIcon/>
                        <a
                            className="btn btn-toggle d-inline-flex align-items-center rounded border-0 cocinarte-text"
                            onClick={() => navigate("/categories/create")}
                        >
                            Crear Etiquetas!
                        </a>
                    </li>
                )}
                {store.authadmin && (
                    <li className="sidebar-item py-3 mb-1">
                        <div className="d-flex align-items-center">
                        <AdminRecomendationsIcon/>
                        <a 
                            className="btn btn-toggle d-inline-flex align-items-center rounded border-0 cocinarte-text" 
                            onClick={() => navigate("/admin/recomended/recipe")}>
                            Administrar Recetas Recomendadas
                        </a>
                        </div>
                    </li>
                )}
            </ul>
                <div className="sidebar-item py-3 mt-3 mb-1 border-top" style={{paddingLeft:'2rem'}} >
                    <AccountIcon/>
                    <a 
                        className="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed cocinarte-text" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#account-collapse" 
                        aria-expanded="false">
                        Account
                    </a>
                    <div className="collapse" id="account-collapse">
                        <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                            {/* Puedes agregar enlaces relacionados con la cuenta aquí */}
                        </ul>
                    </div>
                </div>
        </div>
    );
}
