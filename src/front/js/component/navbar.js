import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";


export const Navbar = () => {
	const [isLogin, setIsLogin]=useState(false)
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
	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">cocinArte</span>
				</Link>
				<div className="ml-auto">
					{(isLogin) ? <button onClick={logOut} className="btn btn-danger">LogOut</button> : 
						<Link to="/login/cocinero">
						<button className="btn btn-primary">Login Cocinero</button>
						</Link>
					}
					
				</div>
			</div>
		</nav>
	);
};
