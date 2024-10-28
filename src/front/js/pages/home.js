import React, { useContext } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";
import { Link } from "react-router-dom";
export const Home = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="text-center mt-5">
			<h1>Hello Rigo!!</h1>
	

			<div className="alert alert-info">
				{store.message || "Loading message from the backend (make sure your python backend is running)..."}
			</div>

			<Link to="/administrador">
				<button className="btn btn-primary">ver administradores y crear</button>
			</Link>
			<p>
				This boilerplate comes with lots of documentation:{" "}
				<a href="https://start.4geeksacademy.com/starters/react-flask">
					Read documentation
				</a>
			</p>
			<Link to="/recipe/"><button>Ver Recetas!</button></Link>
			<Link to="/recipe/create"><button>Crear Receta!</button></Link>
			<Link to="/categories/create"><button>Crear etiquetas!</button></Link>
		</div>
	);
};
