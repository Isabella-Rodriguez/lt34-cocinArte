import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useParams, Link, useNavigate } from "react-router-dom";

export const EditComment = () => {
    const [comentarioData, setComentarioData] = useState(null);
    const [inputComentario, setInputComentario] = useState("");
    const navigate = useNavigate();
    const params = useParams();

    console.log("ID del comentario:", params.id);

    function get_comment() {
        fetch(`${process.env.BACKEND_URL}/api/comentario/${params.id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta de la red');
                }
                return response.json();
            })
            .then((data) => {
                console.log("Datos del comentario recibidos:", data); // Verificar los datos recibidos
                setComentarioData(data);
            })
            .catch((error) => console.error('Error al cargar el comentario:', error));
    }

    useEffect(() => {
        if (params.id) {
            get_comment();
        } else {
            console.error('No se ha proporcionado un ID válido.');
        }
    }, [params.id]);

    useEffect(() => {
        if (comentarioData) {
            setInputComentario(comentarioData.comment_text || "");
        }
    }, [comentarioData]);

    function putComentario(comment_text) {
        fetch(`${process.env.BACKEND_URL}/api/edit/comentario/${params.id}`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                comment_text: comment_text
            }),
        })
        .then((response) => {
            console.log("Respuesta del servidor:", response); // Verificar si la respuesta es correcta
            if (!response.ok) {
                throw new Error('Error en la respuesta de la red');
            }
            return response.json();
        })
        .then(() => {
            console.log("Comentario actualizado con éxito");
            navigate("/comment/list");
        })
        .catch((error) => console.error('Error al actualizar el comentario:', error));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        putComentario(inputComentario);
    };

    return (
        <div className="container" style={{ backgroundColor: "white", width: "70%", paddingBottom: "10%" }}>
            <h1 style={{ marginLeft: "30%" }}>Editar comentario</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="Comentario" className="form-label">Comentario</label>
                    <input
                        type="text"
                        className="form-control"
                        id="Comentario"
                        placeholder="Escribe tu comentario aquí"
                        onChange={(e) => setInputComentario(e.target.value)}
                        value={inputComentario}
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100 mb-4">
                    Guardar
                </button>
                <Link to="/comentarios/crear" className="btn btn-secondary w-100">
                    Volver
                </Link>
            </form>
        </div>
    );
};
