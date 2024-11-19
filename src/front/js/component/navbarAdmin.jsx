import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/navbarAdmin.css"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { Context } from "../store/appContext.js";
import { SidebarAdmin } from "./sidebarAdmin.jsx";
import {jwtDecode} from "jwt-decode";

export const NavbarAdmin = () => {
    const navigate = useNavigate();
    const { store, actions } = useContext(Context);
    const [isLogin, setIsLogin] = useState(false);
    const [adminName, setAdminName] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLogin(true);
            const decodedToken = jwtDecode(token);
            const adminId = decodedToken.sub;
            fetch(`${process.env.BACKEND_URL}/api/administrador/${adminId}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(async (response) => {
                    if (!response.ok) {
                        throw new Error("Error en la respuesta del servidor");
                    }
                    return response.json();
                })
                .then((data) => {
                    if (data) {
                        setAdminName(`${data.name} ${data.last_name}`);
                        actions.setAdmin(data);
                    }
                })
                .catch((error) =>
                    console.error("Error al cargar datos del administrador:", error)
                );
        } else {
            setIsLogin(false);
        }
    }, []);

    const logOut = () => {
        console.log("Logout iniciado");
        localStorage.removeItem("token");
        console.log("Token eliminado");
        setIsLogin(false);
        console.log("Estado de login actualizado");
        navigate("/");
        console.log("Navegación realizada");
    };

    const toggleSidebar = () => {
        actions.setSidebar();
    };

    return (
        <div className="navbar-admin-container">
        <SidebarAdmin />
        <div
            className={`d-flex col-12 bg-admin-dashboard nav-admin align-items-center py-4 ${
                store.sideBar ? "sidebar-open" : ""
            }`}
        >
            <a className="sidebar-toggle ps-3" onClick={toggleSidebar}>
                <FontAwesomeIcon className="admin-text fs-3" icon={faBars} />
            </a>
            <div className="container-fluid d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center admin-controls ms-auto">
                    {isLogin && (
                        <div className="d-flex align-items-center">
                            <span className="admin-text me-3">
                                {adminName ? `Bienvenid@, ${adminName}` : "Cargando..."}
                            </span>
                            <button className="btn-logout" onClick={logOut}>
                                <FontAwesomeIcon icon={faArrowRightFromBracket} /> Cerrar Sesión
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
    );
};
