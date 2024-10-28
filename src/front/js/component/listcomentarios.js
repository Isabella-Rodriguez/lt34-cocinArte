import React from "react";
import { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

export const ListComentarios = () => {
    const { store, actions } = useContext(Context);
    const [comentarios, setComentarios] = useState([]);

    const loadSomeData = () => {
        fetch(process.env.BACKEND_URL+"/api/comentario")
            .then((response) => response.json())
            .then((data) => {
                setComentarios(data);
            })
            .catch((error) => console.error('Error al cargar los comentarios:', error));
    };
    useEffect(() => {
        loadSomeData();
    }, []);
    useEffect(() => {
        if (comentarios.length > 0) {
            console.log("comens cargados:", comentarios);
        }
    }, [comentarios]);

    function removeComentario(idToDelete) {
        fetch(process.env.BACKEND_URL + "/api/delete/comentario/" + idToDelete, {
            method: "DELETE",
            redirect: "follow",
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('No se pudo eliminar el comentario');
            }
            return response.text();
        })
        .then(() => loadSomeData())
        .catch((error) => {
            console.error('Error al eliminar el comentario:', error);
        });
    }
    
    return (
        <>
            <Link to={"/comment/create"}>
                <button type="button" className="btn btn-primary">
                    crear comenario
                </button>
            </Link>
            <ul className="list-group">
                {comentarios.map((item, index) => {
                    return (
                        <li key={index} className="list-group-item d-flex justify-content-between">
                            <div className="d-flex">
                                <div style={{ marginLeft: "10px", display: "flex", flexDirection: "column", padding: "5px" }}>
                                    <h3>{item.user_id}</h3>
                                    <div style={{ display: "flex" }}>
                                        <p style={{ marginBottom: "0", marginLeft: "5px" }}>{item.recipe_id}</p>
                                    </div>
                                    <div style={{ display: "flex" }}>
                                        <p style={{ marginBottom: "0", marginLeft: "5px" }}>{item.comment_text}</p>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                                <Link to={"/comment/edit/" + item.id}>
                                    <button style={{ backgroundColor: "white", border: "0px" }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" className="bi bi-pencil-fill" viewBox="0 0 16 16" style={{ marginRight: "25px" }}>
                                            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H2v1.293l6.5-6.5L14.5 7.5z" />
                                        </svg>
                                    </button>
                                </Link>
                                <button onClick={() => removeComentario(item.id)} style={{ backgroundColor: "white", border: "0px" }}>
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