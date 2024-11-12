import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../../styles/navBar.css'
import { SearchIcon } from "./searchIcon.jsx";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Context } from "../store/appContext.js";
import { Sidebar } from "./sidebar.jsx";


export const Navbar = () => {
	const [isLogin, setIsLogin]=useState(false)
	const [search, setSearch] = useState("")
	const navigate = useNavigate()
	const {store, actions}=useContext(Context)
	useEffect(()=>{
		const token =localStorage.getItem('token')
		if(token){
			setIsLogin(true)
		} else{ setIsLogin(false)}

	},[localStorage.getItem('token')])
	const logOut = ()=>{
		localStorage.removeItem('token');
		setIsLogin(false);
		console.log("Se cerro la sesion")
	}

	const searchTitle=(e)=>{
		e.preventDefault();
		navigate(`/search?query=${search}`);
	}
	const mostrarSidebar=()=>{
		actions.setSidebar()
	}

	return (
		<div className="container-fluid d-flex py-5">
			<Sidebar/>
			<div className="container-fluid d-flex justify-content-around nav-cocinarte">
				<a className="sidebar-toggle" onClick={mostrarSidebar}>
                <FontAwesomeIcon className="cocinarte-text my-auto fs-3" icon={faBars} />
                </a>
					<div>
						<form className="input-group input-group-navbar " onSubmit={searchTitle}>
							<input type="text" className="form-control form-cocinarte bg-white bg-opacity-10 border border-0" placeholder="Search projects…" aria-label="Search" value={search} onChange={(e)=>setSearch(e.target.value)}/>
							<button className="btn bg-white bg-opacity-10 text-light" type="submit">
								<SearchIcon/>
							</button>
						</form>
					</div>
					<div>
						{(isLogin) ? <>
							<Link className="mx-2" to={"/recipe/create"} ><button className="btn bg-white bg-opacity-10 cocinarte-text  btn-cocinarte">Crear Receta</button></Link>
							<Link className="mx-2" to={"/mis-recetas"} ><button className="btn bg-white bg-opacity-10 cocinarte-text  btn-cocinarte">Mis Recetas</button></Link>
							<Link className="mx-2" to={"/favoritos"} ><button className="btn bg-white bg-opacity-10 cocinarte-text  btn-cocinarte">Favoritos</button></Link>
							<Link className="mx-2" to={"/login/cocinero"}><button onClick={logOut} className="btn bg-white bg-opacity-10  ms-5 exit-text btn-cocinarte ">Exit</button></Link>
						</> : 
							(<>
							<Link to="/login/cocinero">
							<button className="btn bg-white bg-opacity-10 cocinarte-text mx-2 btn-cocinarte" >Login Cocinero</button>
							</Link>
							<Link to="/login/administrador">
							<button className="btn bg-white bg-opacity-10 cocinarte-text btn-cocinarte" >Login Admin</button>
			   				</Link>
							</>)
						}
					</div>
			</div>
		</div>
	);
};
