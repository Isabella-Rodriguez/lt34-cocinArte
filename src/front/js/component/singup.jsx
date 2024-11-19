import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../../styles/CreateUser.css";

export function CreateUser(){
    const [name, setName]=useState("")
    const [lastName, setLastName]=useState("")
    const [email, setEmail] =useState("")
    const [password, setPassword] =useState("")
    const [errorMessage, setErrorMessage] = useState(""); 
    const [file, setFile] =useState(null)
    const navigate = useNavigate()

    const fileToSend =(e)=>{
        setFile(e.target.files[0])
    }

    const createUser = async (e) => {
        e.preventDefault();

        if (!name || !lastName || !email || !password) {
            setErrorMessage("Por favor, completa todos los campos requeridos.");
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('last_name', lastName);
        formData.append('email', email);
        formData.append('password', password);
        if (file) {
            formData.append('file', file);
        }

        
        const response = await fetch(process.env.BACKEND_URL + '/api/usuario',{
            method: 'POST',
            body: formData
        })

        if (response.ok) {
            const user = await response.json();
            console.log('User created:', user);
            navigate('/')
        } else {
            const errorMessage = await response.text();
            console.log('Create user failed:', errorMessage);
        }
        
    }

    return (
        <div className="create-user-container">
        <div className="left-side">
            <img 
                src="https://st3.depositphotos.com/9880800/17454/i/450/depositphotos_174541272-stock-photo-family.jpg" 
                alt="Inspirational cooking" 
                className="background-image" 
            />
            <div className="quote">
                <h2>"La cocina es el corazón de la casa, donde los sabores se encuentran y las historias nacen."
                <span  className="equipo-cocinarte">— Equipo cocinArte</span>
                </h2>
            </div>
        </div>
        <div className="right-side">
    <div className='d-flex flex-column align-items-center gap-2 mt-5'>
        <h1>Conviertete en cocinero!</h1>
        <form className='d-flex flex-column align-items-center gap-2' onSubmit={createUser}>
            <label className="form-label" htmlFor="name">Nombre cocinero:</label>
            <input className="form-control" type="text" placeholder="Name" id='name' value={name} onChange={(e)=>setName(e.target.value)} required/>
            <label className="form-label" htmlFor="lastName">Apellido cocinero:</label>
            <input className="form-control" type="text" placeholder="Last Name" id='lastName' value={lastName} onChange={(e)=>setLastName(e.target.value)} required/>
            <label className="form-label" htmlFor="email">Email cocinero:</label>
            <input className="form-control" type="email" id='email' placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
            <label className="form-label" htmlFor="password">Contraseña cocinero:</label>
            <input className="form-control" type="password" id='password' placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
            <label className="form-label" htmlFor="img">Foto cocinero:</label>
            <input type="file" className='btn' id='img' onChange={(e)=>{fileToSend(e)}} />
            <p>¿Ya tienes una cuenta? <a href="/login/cocinero">¡Inicia sesión!</a></p>
            <button  className='btn btn-success col-5' type="submit">Crear Cocinero</button>
            <Link to={'/'} className='btn btn-secondary col-5'>Cancelar</Link>
            <p>© 2024 - <a href="/">cocinArte</a></p>
        </form>
        </div>
    </div>    
        </div>
    );
}