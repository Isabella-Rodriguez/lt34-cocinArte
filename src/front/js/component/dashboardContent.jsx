import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import '../../styles/dashboardContent.css'
import { Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export const DashboardContent=()=>{

    const{store,actions}= useContext(Context)
    const [recetas, setRecetas] = useState([]);
    const navigate=useNavigate()
    const[userID, setUserId]=useState(null)
    useEffect(() => {
        const fetchRecetas = async () => {
            const token = localStorage.getItem('token');
                const decodeToken = jwtDecode(token)
                setUserId(decodeToken.sub)
                try {
                    const response = await fetch(process.env.BACKEND_URL+'/api/recetas/mis-recetas', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    const data = await response.json();
                    console.log('recetas es:', data)
                    setRecetas(data);
                } catch (error) {
                    console.log(error.message);
                }       
        };
        
        fetchRecetas();
        actions.loadFavs()

    }, []);

    if(!userID){
        navigate('/login/cocinero')
    }

    return(
        <main className={`content ${store.sideBar===false ? 'sidebar-close':'sidebar-open'}`}>
			<div className="container-fluid p-0">
				<div className="col-auto d-none d-sm-block">
					<h3 className="ps-5 cocinarte-text">Dashboard</h3>
			    </div>
                <div className="row justify-content-center mt-5 pt-3">
                    <div className="col-12 col-sm-5 col-xxl-5 d-flex">
                        <div className="card illustration flex-fill profile-card">
                            <div className="card-body p-0 d-flex flex-fill">
                                <div className="row g-0 align-items-center w-100">
                                    <div className="col-7">
                                    <div className="illustration-text p-3 m-1">
                                    <h4 className="illustration-text">Bienvenido, {store.user.name}</h4>
                                    <p className="mb-0">¿Que deseas cocinar hoy?</p>
                                    </div>
                                </div>
                                <div className="col-5 align-self-end text-end">
                                    <img
                                    src={store.user.img_profile}
                                    alt="Customer Support"
                                    className="img-fluid col-6 m-3"
                                    />
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-5 col-xxl-5 d-flex pointer" onClick={()=>{navigate('/recomended/recipe')}}>
                        <div className="card flex-fill dashboard">
                        <div className="card-body py-4">
                            <div className="d-flex align-items-start">
                            <div className="flex-grow-1">
                                <h3 className="mb-2">Pruebe los platos de la semana</h3>
                                <p className="mb-2">Estas son las recomendaciones del chef</p>
                                <div className="mb-0">
                                <span className="text-muted "  >Ver mas!</span>
                                </div>
                            </div>
                            
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-5 col-xxl-5 d-flex pointer" onClick={()=>{navigate("/favoritos")}}>
                        <div className="card flex-fill dashboard">
                        <div className="card-body py-4">
                            <div className="d-flex align-items-start">
                            <div className="flex-grow-1">
                                <h3 className="mb-2">Prueba tus platos favoritos</h3>
                                <p className="mb-2">Prueba uno de tus {store.favoritos.length} platos favoritos</p>
                                <div className="mb-0">
                                <span className="text-muted "  >Ver todos</span>
                                </div>
                            </div>
                            
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-5 col-xxl-5 d-flex pointer" onClick={()=>{navigate("/recipe/create")}}>
                        <div className="card flex-fill dashboard">
                        <div className="card-body py-4">
                            <div className="d-flex align-items-start">
                            <div className="flex-grow-1">
                                <h3 className="mb-2">Comparte una nueva idea!</h3>
                                <p className="mb-2">Postea una nueva receta.</p>
                                <div className="mb-0">
                                <span className="text-muted ">A cocinar</span>
                                </div>
                            </div>
                            
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
                <div className="col-auto d-none my-5 d-sm-block">
					<h3 className="ps-5 cocinarte-text">Tus Creaciones</h3>
			    </div>
                <div className="container-fluid my-4" style={{height:'700px'}}>
                    <div id="carouselExample" className="carousel slide h-100">
                        <div className="carousel-inner rounded h-100" >
                            {recetas.length>0 ? recetas.map((receta, index)=>(
                                <div className={`carousel-item pointer rounded h-100 ${index === 0 ? 'active' : ''}`} key={receta.id} onClick={()=>{navigate(`/recipe/${receta.id}`)}}>
                                <img src={receta.img_ilustrativa} className="img-fluid rounded w-100" alt="..."/>
                                <div class="carousel-caption d-none d-md-block">
                                    <h3 className="ps-5 ">{receta.title}</h3>
                                    <h5>Publicado el {receta.fecha_publicacion}</h5>
                                    </div>
                            </div>
                            )):
                            <></>
                            }
                            
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>
            </div>
		</main>
    )
}