import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";


export const Navbar = () => {
	const [isLogin, setIsLogin]=useState(false)
	const [search, setSearch] = useState("")
	const navigate = useNavigate()
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
		navigate("/login/cocinero")
	}

	const searchTitle=(e)=>{
		e.preventDefault();
		navigate(`/search?query=${search}`);
	}

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">cocinArte</span>
				</Link>
				<div className="ml-auto d-flex">
					<form className="d-flex" onSubmit={searchTitle}>
						<input className="form-control me-2" type="search" placeholder="Buscar recetas" aria-label="Search" value={search} onChange={(e)=>setSearch(e.target.value)}/>
						<button className="btn btn-outline-success" type="submit">Buscar</button>
					</form>
						{(isLogin) ? <>
							<Link className="mx-2" to={"/recipe/create"} ><button className="btn btn-primary">Crear Receta</button></Link>
							<Link className="mx-2" to={"/favoritos"} ><button className="btn btn-warning">Favoritos</button></Link>
							<button onClick={logOut} className="btn btn-danger">LogOut</button>
						</> : 
							(<>
							<Link to="/login/cocinero">
							<button className="btn btn-primary mx-2">Login Cocinero</button>
							</Link>
							<Link to="/login/administrador">
							<button className="btn btn-primary">login admin</button>
			   				</Link>
							</>)
						}
				</div>
			</div>
		</nav>
	);
};
