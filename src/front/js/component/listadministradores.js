import React from "react";
import { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

export const ListAdministradores = () => {
    const { store, actions } = useContext(Context);
    const [administradores, setAdministradores] = useState([]);

    const loadSomeData = () => {
        fetch("https://ideal-zebra-p6jr757gq9p2rqj6-3001.app.github.dev/api/administrador")
            .then((response) => response.json())
            .then((data) => {
                setAdministradores(data);
            })
            .catch((error) => console.error('Error al cargar los administradores:', error));
    };

    useEffect(() => {
        loadSomeData();
    }, []);

    useEffect(() => {
        if (administradores.length > 0) {
            console.log("admins cargados:", administradores);
        }
    }, [administradores]);

    function removeAdministrador(idToDelete) {
        fetch("https://ideal-zebra-p6jr757gq9p2rqj6-3001.app.github.dev/api/administrador/" + idToDelete, {
            method: "DELETE",
            redirect: "follow",
        })
            .then((response) => response.text())
            .then(() => loadSomeData())
            .catch((error) => console.error('Error al eliminar el administrador:', error));
    }

    function addNewAdministrador(name, lastname, email, password) {
        fetch('https://cuddly-waffle-5g9r4r6qrjxf7p45-3001.app.github.dev/api/signup/restaurant', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "name": name,
                "last_name": lastname,
                "email": email,
                "password": password,
            }),
            redirect: "follow",
        })
            .then((response) => response.text())
            .then(() => loadSomeData())
            .catch((error) => console.error('Error al agregar el administrador:', error));
    }

    return (
        <>
            <Link to={"/administrador"}>
                <button type="button" className="btn btn-primary">
                    crear administrador
                </button>
            </Link>

            <ul className="list-group">
                {administradores.map((item, index) => {
                    return (
                        <li key={index} className="list-group-item d-flex justify-content-between">
                            <div className="d-flex">
                                <div style={{ marginLeft: "10px", display: "flex", flexDirection: "column", padding: "5px" }}>
                                    <h3>{item.name}</h3>
                                    <div style={{ display: "flex" }}>
                                        <p style={{ marginBottom: "0", marginLeft: "5px" }}>{item.last_name}</p>
                                    </div>
                                    <div className="d-flex">
                                        <p style={{ marginBottom: "0", marginLeft: "5px" }}>{item.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                                <Link to={"/editaradminnistrador/" + item.id}>
                                    <button style={{ backgroundColor: "white", border: "0px" }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" className="bi bi-pencil-fill" viewBox="0 0 16 16" style={{ marginRight: "25px" }}>
                                            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H2v1.293l6.5-6.5L14.5 7.5z" />
                                        </svg>
                                    </button>
                                </Link>
                                <button onClick={() => removeAdministrador(item.id)} style={{ backgroundColor: "white", border: "0px" }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" className="bi bi-trash-fill">
                                        <path d="M4.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a.5.5 0 0 1 0 1H1a.5.5 0 0 1 0-1h1V.5a.5.5 0 0 1 .5-.5zM3 2h10a1 1 0 0 1 1 1v1H2V3a1 1 0 0 1 1-1zm11 3v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5h12z" />
                                    </svg>
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </>
    );
};
