import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export function LoginAdmin(){
	const { store, actions } = useContext(Context);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
		actions.adminLogin(formData)
        setFormData({
        	email: '',
        	password: ''
        });
    };

    return (
        <div className="p-3 m-auto w-75">
            <div>
				<h1 className="mx-auto">Admin LOGIN</h1>
			</div>
			
			<div>
					<form onSubmit={handleSubmit}>
						
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
						
						<button type="submit" className="btn btn-success ">Ingresar</button>
					</form>

			</div>
			
        </div>
    );
};