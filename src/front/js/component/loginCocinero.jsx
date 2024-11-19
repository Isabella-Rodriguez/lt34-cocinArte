import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/LoginCocinero.css";

export function LoginCocinero() {
    const navigate = useNavigate();
    const [error, setError] = useState(""); // Estado para manejar errores

    const login = async (e) => {
        e.preventDefault();
        const dataSend = {
            email: e.target.email.value,
            password: e.target.password.value,
        };

        const resp = await fetch(process.env.BACKEND_URL + "/api/usuario/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataSend),
        });

        if (resp.ok) {
            const data = await resp.json();
            console.log("Te has logueado", data);
            localStorage.setItem("token", data[1]);
            console.log("Token guardado en LocalStorage");
            setError(""); 
            navigate("/dashboard");
        } else {
            setError("Credenciales incorrectas. Por favor, inténtalo de nuevo."); 
            console.error("No has podido loguearte, revisa tus credenciales");
        }
    };

    return (
        <div className="login-container d-flex">
            <div className="left-side">
                <img
                    src="https://st3.depositphotos.com/12039478/16201/i/450/depositphotos_162010172-stock-photo-young-man-cooking.jpg"
                    alt="Inspirational cooking"
                    className="background-image"
                />
                <div className="quote">
                    <h2>
                        "La cocina es el lugar donde los ingredientes comunes se transforman en algo extraordinario con un toque de pasión y creatividad."
                        <span className="equipo-cocinarte">— Equipo cocinArte</span>
                    </h2>
                </div>
            </div>
            <div className="right-side">
                <div className="right-side d-flex flex-column align-items-center text-center">
                    <h1 className="mb-5">Hola, cocinero!</h1>
                    <form className="d-flex flex-column align-items-center gap-2" onSubmit={login}>
                        <div>
                            <label className="form-label" htmlFor="email">Email</label>
                            <input
                                className="form-control"
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Escribe tu email"
                                required
                            />
                        </div>
                        <div>
                            <label className="form-label" htmlFor="password">Contraseña</label>
                            <input
                                className="form-control"
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Contraseña"
                                required
                                autoComplete="current-password"
                            />
                        </div>
                        {error && <p className="text-danger">{error}</p>} {/* Mensaje de error */}
                        <button className="btn btn-success col-4">Login!</button>
                        <p className="mt-3">
                            ¿No tienes una cuenta? <Link to="/singup" className="text-link">Regístrate</Link>
                        </p>
                        <p>© 2024 - <a href="/">cocinArte</a></p>
                    </form>
                </div>
            </div>
        </div>
    );
}
