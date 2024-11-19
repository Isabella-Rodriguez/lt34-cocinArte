import React, { useState, useEffect, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/LoginAdmin.css";

export function LoginAdmin() {
    const { store, actions } = useContext(Context);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true; // Variable de control para evitar actualizaciones después del desmontaje

        return () => {
            isMounted = false; // Limpieza al desmontar el componente
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const success = await actions.adminLogin(formData);

        if (success) {
            if (isMounted) setError(""); // Solo actualiza el estado si el componente sigue montado
        } else {
            if (isMounted) setError("Credenciales incorrectas. Inténtalo de nuevo.");
        }

        if (isMounted) {
            setFormData({
                email: "",
                password: "",
            });
        }
    };

    if (store.authadmin) {
        return <Navigate to="/dashboard/admin" />;
    }

    return (
        <div className="login-admin-container d-flex">
            <div className="left-side">
                <img
                    src="https://media.istockphoto.com/id/1453843862/es/foto/reuni%C3%B3n-de-negocios.jpg?s=612x612&w=0&k=20&c=npYuXIMxYxNzUPCTgqDxbtco5Wi3mFAcilVT2E8z3Hg="
                    alt="Admin Background"
                    className="background-image"
                />
                <div className="quote">
                    <h2>
                        "Administrar con pasión, liderar con propósito."
                        <span className="equipo-cocinarte">— Equipo cocinArte</span>
                    </h2>
                </div>
            </div>
            <div className="right-side">
                <div className="d-flex flex-column align-items-center text-center">
                    <h1 className="mb-5">Bienvenido, Administrador</h1>
                    <form
                        className="d-flex flex-column align-items-center gap-2"
                        onSubmit={handleSubmit}
                    >
                        <div>
                            <label className="form-label" htmlFor="email">
                                Email
                            </label>
                            <input
                                className="form-control"
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Correo electrónico"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                required
                            />
                        </div>
                        <div>
                            <label className="form-label" htmlFor="password">
                                Contraseña
                            </label>
                            <input
                                className="form-control"
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Contraseña"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                                required
                                autoComplete="current-password"
                            />
                        </div>
                        {error && <p className="text-danger">{error}</p>}
                        <button className="btn btn-success col-4" type="submit">
                            Ingresar
                        </button>
                    </form>
                    <p className="mt-3">
                        © 2024 - <a href="/">cocinArte</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
