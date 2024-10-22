//Imports
import React,{ useContext, useEffect } from "react";
import { Link } from "react-router-dom";


import "../../styles/home.css";
	//Imporatar contexto
import { Context } from "../store/appContext";

export const UsersList = () => {
	const { store, actions } = useContext(Context);

	return(
		<div className="text-center mt-5">
			<h1>Lista de Usuarios! </h1>
			<div className="">
				<button type="button" onClick={() => actions.loadUsers()} class="btn btn-primary m-2">Cargar usuarios</button>
				<Link to="/users/add">
					<button className="btn btn-primary m-2">Nuevo usuario</button>
				</Link>
			</div>
			 
			
			<div className="d-flex justify-content-center col flex-column">
				{store.users.map((usuario, index) => (
					<div key={index} className="m-1 rounded w-75 p-3 border border-info row d-flex align-items-center col mx-auto">
						
						<div className="col">
							<h3>{usuario.name} {usuario.last_name}</h3>
							<p>Email: {usuario.email}</p>
							<p>id: {usuario.id}</p>
						</div>

						<div className="col p-auto">
							<Link to={`/users/edit?index=${index}`}>
								<button type="button" class="btn btn-warning mx-3">Modificar</button>
							</Link>
							<button type="button" class="btn btn-danger" onClick={()=>actions.deleteUser(index)}>Eliminar</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};