import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useParams, Link, useNavigate } from "react-router-dom";

export const EditarAdministradores = () => {
    const [administradorData, setAdministradorData] = useState(null);
    const [inputName, setInputName] = useState("");
    const [inputLastname, setInputLastname] = useState("");
    const [inputEmail, setInputEmail] = useState("");
    const navigate = useNavigate();
    const params = useParams();

    console.log("ID del administrador:", params.idadmin); // Verifica que el ID esté llegando correctamente

    function get_administrador() {
        fetch(process.env.BACKEND_URL+`/api/administrador/${params.idadmin}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta de la red');
                }
                return response.json();
            })
            .then((data) => {
                setAdministradorData(data);
            })
            .catch((error) => console.error('Error al cargar el administrador:', error));
    }

    useEffect(() => {
        if (params.idadmin) {
            get_administrador();
        } else {
            console.error('No se ha proporcionado un ID válido.');
        }
    }, [params.idadmin]);

    useEffect(() => {
        if (administradorData) {
            setInputName(administradorData.name || "");
            setInputLastname(administradorData.last_name || "");
            setInputEmail(administradorData.email || "");
        }
    }, [administradorData]);

    function putAdministrador(name, lastname, email) {
        fetch(process.env.BACKEND_URL+`/api/administrador/${params.idadmin}`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: name,
                last_name: lastname,
                email: email,
            }),
            redirect: "follow"
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error en la respuesta de la red');
            }
            return response.text();
        })
        .then(() => navigate("/listdeadministradores"))
        .catch((error) => console.error('Error al actualizar el administrador:', error));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        putAdministrador(inputName, inputLastname, inputEmail);
    };

    return (
        <div className="container" style={{ backgroundColor: "white", width: "70%", paddingBottom: "10%" }}>
            <h1 style={{ marginLeft: "30%" }}>Edit Restaurant</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="Name" className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="Name"
                        placeholder="name"
                        onChange={(e) => setInputName(e.target.value)}
                        value={inputName}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="lastname" className="form-label">Last Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="lastname"
                        placeholder="Last Name"
                        onChange={(e) => setInputLastname(e.target.value)}
                        value={inputLastname}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="Email" className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="Email"
                        placeholder="Email"
                        onChange={(e) => setInputEmail(e.target.value)}
                        value={inputEmail}
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100 mb-4">
                    Save
                </button>
                <Link to={"/administrador"}>
                    volver
                </Link>
            </form>
        </div>
    );
};
