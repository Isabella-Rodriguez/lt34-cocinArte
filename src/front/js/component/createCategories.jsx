import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/categoriesAdmin.css";

export function CategoriesAdmin() {
    const { store } = useContext(Context);
    const [name, setName] = useState("");
    const [categories, setCategories] = useState([]);
    const [editInput, setEditInput] = useState(false);
    const [nameToEdit, setNameToEdit] = useState("");
    const [idToEdit, setIdToEdit] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch(process.env.BACKEND_URL + "/api/categorias", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => response.json())
            .then((data) => setCategories(data));
    }, []);

    const newCategory = async (e) => {
        e.preventDefault();

        let dataSend = {
            nombre: name,
        };

        const response = await fetch(`${process.env.BACKEND_URL}/api/categorias/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataSend),
        });
        if (response.ok) {
            const newCategory = await response.json();
            setCategories([...categories, newCategory]);
            setName("");
        }
    };

    const deleteCategory = (idCategory) => {
        fetch(`${process.env.BACKEND_URL}/api/categorias/${idCategory}`, {
            method: "DELETE",
        })
            .then((resp) => resp.json())
            .then(() => {
                setCategories(categories.filter((category) => category.id !== idCategory));
            });
    };

    const updateCategory = async (e) => {
        e.preventDefault();

        let dataSend = {
            name: nameToEdit,
        };

        const response = await fetch(`${process.env.BACKEND_URL}/api/categorias/${idToEdit}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataSend),
        });
        if (response.ok) {
            const data = await response.json();
            setCategories(categories.map((category) => (category.id === idToEdit ? data : category)));
            setEditInput(false);
            setNameToEdit("");
            setIdToEdit("");
        }
    };

    return (
        <div className="categories-admin-container">
              <h1 className="admin-title">Administrar Categorías</h1>
            <div className="row-container">
                <div className="left-side">
                    <div className="create-category-container">
                        <h1>Crear nueva etiqueta</h1>
                        <form onSubmit={newCategory} className="d-flex flex-column align-items-center">
                            <label htmlFor="name">Nombre categoría:</label>
                            <input
                                className="form-control my-2"
                                onChange={(e) => setName(e.target.value)}
                                type="text"
                                id="name"
                                placeholder="Nueva categoría"
                                value={name}
                            />
                            <button className="btn btn-success col-8 mb-2" type="submit">
                                Crear
                            </button>
                            <button
                                className="btn btn-secondary col-8"
                                type="button"
                                onClick={() => navigate("/dashboard/admin")}
                            >
                                Cancelar
                            </button>
                        </form>
                    </div>
                    {editInput && (
                        <div className="edit-category-container">
                            <h1>Editar categoría</h1>
                            <form onSubmit={updateCategory} className="d-flex flex-column align-items-center">
                                <label htmlFor="nameEdit">Editar nombre de categoría:</label>
                                <input
                                    className="form-control my-2"
                                    onChange={(e) => setNameToEdit(e.target.value)}
                                    type="text"
                                    id="nameEdit"
                                    placeholder={nameToEdit}
                                />
                                <button className="btn btn-primary col-8" type="submit">
                                    Editar
                                </button>
                            </form>
                        </div>
                    )}
                </div>
                <div className="right-side">
                    <div className="categories-list">
                        <h1>Categorías disponibles</h1>
                        {categories.length !== 0 ? (
                            categories.map((category) => (
                                <div className="d-flex align-items-center category-item" key={category.id}>
                                    <p className="fs-5 flex-grow-1">{category.name}</p>
                                    <button
                                        onClick={() => deleteCategory(category.id)}
                                        className="btn btn-icon mx-2"
                                    >
                                        <i className="fa fa-trash" aria-hidden="true"></i>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditInput(true);
                                            setNameToEdit(category.name);
                                            setIdToEdit(category.id);
                                        }}
                                        className="btn btn-icon"
                                    >
                                        <i className="fa fa-pencil" aria-hidden="true"></i>
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-center">No hay categorías disponibles.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
);
}
