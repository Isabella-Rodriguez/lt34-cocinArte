import React from "react";
import { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

export const CrudAdmin = () => {
    const [inputName, setInputname] = useState("");
    const [inputLastname, setInputLastname] = useState("");
    const [inputEmail, setInputEmail] = useState("");
    const [inputPassword, setInputPassword] = useState("");


    const { store, actions } = useContext(Context);
    const [administradores, setAdministradores] = useState([]);

    const loadSomeData = () => {
        fetch(process.env.BACKEND_URL+"/api/administrador")
            .then((response) => response.json())
            .then((data) => {
                setAdministradores(data);
            })
            .catch((error) => console.error('Error al cargar los administradores:', error));
    };





    function addNewAdministrador(name,lastname,email,password) {
        fetch(process.env.BACKEND_URL+'/api/administrador', {
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
            .then(() => loadSomeData());
    }


    return (
        <>
            <div className="container">
                <h1 style={{ marginTop: "100px" }}>Crea administrador</h1>

                <form>
                    <div className="form-group">
                        <label htmlFor="name">Nombre</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            value={inputName}
                            onChange={(e) => setInputname(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">last name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            value={inputLastname}
                            onChange={(e) => setInputLastname(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={inputEmail}
                            onChange={(e) => setInputEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={inputPassword}
                            onChange={(e) => setInputPassword(e.target.value)}
                        />
                    </div>
                    <Link to={"/listdeadministradores"}>
                        <button type="button" className="btn btn-primary" style={{"marginRight": "10px"}} onClick={() => {addNewAdministrador(inputName,inputLastname,inputEmail,inputPassword); 
                            loadSomeData()
                            setInputname(""); 
                            setInputLastname(""); 
                            setInputEmail("") ; 
                            setInputPassword("");
                        }}>
                            Crear admin
                        </button>
                    </Link>
                    <Link to={"/"}>
                        volver a home
                    </Link>
                    <div>
                        
                     <Link to={"/listdeadministradores"}>
                    ver lista de admins
                      </Link>
                    </div>
                </form>
            </div>
        </>
    );
};