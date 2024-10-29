import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";



export function SearchByTitle(){
    const useQuery= ()=>{
        return new URLSearchParams(useLocation().search)
    }
    const query = useQuery()
    const searchTitle = query.get('query')
    const [recipes, setRecipes]=useState([])
    
    const fetchData = async () =>{
        const response = await fetch(process.env.BACKEND_URL + `/api/recetas/filter/search?query=${searchTitle}`)
        if (!response.ok){
            setRecipes([])
        }
        const data = await response.json(); 
        console.log('Received data:', data);
        setRecipes(data);
    }
    
    useEffect(()=>{
        fetchData()
    },[searchTitle])
    
    return(
        <div className="container">
            <h1>Resultados de búsqueda para "{searchTitle}"</h1>
            {recipes.length ? recipes.map((recipe)=>(
                <div key={recipe.id} className="col-md-4">
                    <div className="card">
                        <img src={recipe.img_ilustrativa} className="card-img-top" />
                        <div className="card-body"> <h5 className="card-title">{recipe.title}</h5>
                            <p className="card-text">{recipe.pasos}</p>
                        </div>
                    </div>
                </div>)):( 
                <p>No se encontraron recetas.</p> )
            } 
        </div>)
}