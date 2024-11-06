import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext"


export function Sidebar(){
    const [categories, setCategories] = useState([])
    const navigate = useNavigate()
	const { store, actions } = useContext(Context)

	

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
    function navegar() {
		navigate("/categories/create"); // Usa navigate para redirigir programáticamente
	}

    return (
        <div className="flex-shrink-0 p-3 bg-light vh-100" style={{ width: '280px' }}>
            <a href="/" className="d-flex align-items-center pb-3 mb-3 link-body-emphasis text-decoration-none border-bottom">
                <svg className="bi pe-none me-2" width="30" height="24"><use href="#bootstrap"></use></svg>
                <span className="fs-5 fw-semibold">cocinArte</span>
            </a>
            <ul className="list-unstyled ps-0">
                <li className="mb-1">
                    <button 
                        className="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed" 
                        onClick={() => navigate("/recipe/")} 
                        aria-expanded="true">
                        Ver Recetas!
                    </button>
                </li>
                <li className="mb-1">
                    <button 
                        className="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#dashboard-collapse" 
                        aria-expanded="false">
                        Categorias
                    </button>
                    <div className="collapse" id="dashboard-collapse">
                        <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                            {categories.map((category) => (
                                <li key={category.id}> 
                                    <button 
                                        className="dropdown-item" 
                                        onClick={() => navigate(`/category/search/${category.id}`)}>
                                        {category.name}
                                    </button>
                                </li>
                            ))} 
                        </ul>
                    </div>
                </li>
                <li className="mb-1">
                    <button 
                        className="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed" 
                        onClick={() => navigate("/administrador")} 
                        aria-expanded="false">
                        Crear Admins
                    </button>
                </li>
                <li className="mb-1">
                    <button 
                        className="btn btn-toggle d-inline-flex align-items-center rounded border-0" 
                        onClick={() => navigate("/recomended/recipe")}>
                        Recetas Recomendadas
                    </button>
                </li>
                {store.authadmin && (
                    <li className="mb-1">
                        <button
                            className="btn btn-toggle d-inline-flex align-items-center rounded border-0"
                            onClick={() => navigate("/categories/create")}
                        >
                            Crear Etiquetas!
                        </button>
                    </li>
                )}
                {store.authadmin && (
                    <li className="mb-1">
                        <button 
                            className="btn btn-toggle d-inline-flex align-items-center rounded border-0" 
                            onClick={() => navigate("/admin/recomended/recipe")}>
                            Administrar Recetas Recomendadas
                        </button>
                    </li>
                )}
                <li className="border-top my-3"></li>
                <li className="mb-1">
                    <button 
                        className="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#account-collapse" 
                        aria-expanded="false">
                        Account
                    </button>
                    <div className="collapse" id="account-collapse">
                        <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                            {/* Puedes agregar enlaces relacionados con la cuenta aquí */}
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
    );
}
