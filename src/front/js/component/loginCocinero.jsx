import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export function LoginCocinero(){
    const navigate = useNavigate()
    const login=async(e)=>{
        e.preventDefault()
        e.persist()
        const dataSend={
            'email':e.target.email.value,
            'password':e.target.password.value
        }
        const resp = await fetch(process.env.BACKEND_URL + '/api/usuario/login',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(dataSend)
        })
        if(resp.ok){
            const data = await resp.json()
            console.log(('Te has logueado'), data);
            localStorage.setItem('token', data[1])
            console.log('token guardado en LocalStorage')
            navigate('/')
        } else console.log('No has podido loguearte, revisa tus credenciales');
    }

    return (
    <div className="container d-flex flex-column align-items-center text-center">
        <h1 className="container mb-5">Login!</h1>
        <form className="container d-flex flex-column align-items-center gap-2" action="" onSubmit={(e)=>{login(e)}}>
            <div>
                <label className="form-label" htmlFor="email">Email</label>
                <input className="form-control" type="text" name="email" id="email" placeholder="Enter your email"/>
            </div>
            <div>
                <label className="form-label" htmlFor="password">Password</label>
                <input className="form-control" type="password" name="password" id="password" placeholder="Enter your password"/>
            </div>
            <button className="btn btn-primary col-4">Login!</button>
        </form>
    </div>)
}