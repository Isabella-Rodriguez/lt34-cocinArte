import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

import { Context } from "../store/appContext";



export const UsersEdit = () => {
	const { store, actions } = useContext(Context);

	const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const index = queryParams.get("index"); 

	let id = store.users[index].id;

    const [formDataMod, setFormDataMod] = useState({
        name: '',
        last_name: '',
        email: '',
        password: ''
    });

    const handleSubmit = (i) => {
        i.preventDefault();
		actions.modUser(formDataMod,id);
        setFormDataMod({
            name: '',
        	last_name: '',
        	email: '',
        	password: ''
        });
    };


    return (
        <div className="p-3 m-auto w-75">
            <div>
				<h1 className="mx-auto">Modificacion de un usuario</h1>
				<Link to="/users" className="">
					<button type="button" class="btn btn-info">Volver</button>
				</Link>
			</div>
			
			<div>
				<form onSubmit={handleSubmit}>
					
				<div className="form-group p-1">
						<label for="exampleInputEmail1">Nombre</label>
						<input
							type="text"
							name="name"
							placeholder="Nombre"
							value={formDataMod.name}
							onChange={(e) => setFormDataMod({ ...formDataMod, name: e.target.value })}
							required
							className="form-control"
						/>
					</div>

					<div className="form-group p-1">
						<label for="exampleInputEmail1">Apellido</label>
						<input
							type="text"
							name="name"
							placeholder="Apellido"
							value={formDataMod.last_name}
							onChange={(e) => setFormDataMod({ ...formDataMod, last_name: e.target.value })}
							required
							className="form-control"
						/>
					</div>
					
					
					<div className="form-group">
						<label for="exampleInputPassword1">Correo Electronico</label>
						<input
							type="email"
							name="email"
							placeholder="Email"
							value={formDataMod.email}
							onChange={(e) => setFormDataMod({ ...formDataMod, email: e.target.value })}
							required
							className="form-control"
						/>
					</div>

					<div className="form-group">
						<label for="exampleInputPassword1">Contraseña</label>
						<input
							type="text"
							name="password"
							placeholder="Contraseña"
							value={formDataMod.password}
							onChange={(e) => setFormDataMod({ ...formDataMod, password: e.target.value })}
							required
							className="form-control"
						/>
					</div>
					
					<button type="submit" className="btn btn-success m-3">Modificar Usuario</button>
				</form>

			</div>
			
        </div>
    );
};