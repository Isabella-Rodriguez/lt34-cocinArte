import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";


export const Navbar = () => {
	const [isLogin, setIsLogin]=useState(false)
	const [categories, setCategories] = useState([])
	const [search, setSearch] = useState("")
	const navigate = useNavigate()
	useEffect(()=>{
		const token =localStorage.getItem('token')
		if(token){
			setIsLogin(true)
		} else{ setIsLogin(false)}
		fetch(process.env.BACKEND_URL + '/api/categorias',{ 
			method: 'GET', 
			headers: { 'Content-Type': 'application/json' } 
		}) 
		.then(response=> response.json()) 
		.then(data=> setCategories(data));
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
					<div className="nav-item dropdown">
						<a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">Categorías</a>
						<ul className="dropdown-menu" aria-labelledby="navbarDropdown">
							{categories.map((category) => (
								<li key={category.id}> 
									<Link className="dropdown-item" to={`/category/search/${category.id}`}>{category.name}</Link>
								</li>))} 
						</ul>
					</div>
						{(isLogin) ? <>
							<Link className="mx-2" to={"/recipe/create"} ><button className="btn btn-primary">Crear Receta</button></Link>
							<Link className="mx-2" to={"/favoritos"} ><button className="btn btn-warning">Favoritos</button></Link>
							<button onClick={logOut} className="btn btn-danger">LogOut</button>
						</> : 
							(<Link to="/login/cocinero">
							<button className="btn btn-primary">Login Cocinero</button>
							</Link>)
						}
				</div>
			</div>
		</nav>
	);
};
