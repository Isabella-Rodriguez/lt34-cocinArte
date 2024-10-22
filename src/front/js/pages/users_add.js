import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import { Context } from "../store/appContext";



export const UsersAdd = () => {
	const { store, actions } = useContext(Context);

    const [formData, setFormData] = useState({
        name: '',
        last_name: '',
        email: '',
        password: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
		actions.addUser(formData)
        setFormData({
            name: '',
        	last_name: '',
        	email: '',
        	password: ''
        });
    };


    return (
        <div className="p-3 m-auto w-75">
            <div>
				<h1 className="mx-auto">Agregar un nuevo usuario</h1>
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
							value={formData.name}
							onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
							value={formData.last_name}
							onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
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
							value={formData.email}
							onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
							value={formData.password}
							onChange={(e) => setFormData({ ...formData, password: e.target.value })}
							required
							className="form-control"
						/>
					</div>
					
					<button type="submit" className="btn btn-success ">Agregar Usuario</button>
				</form>

			</div>
			
        </div>
    );
};