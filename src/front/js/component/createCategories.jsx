import React, { useEffect, useState } from "react";

export function CategoriesAdmin() {
    const [name, setName] = useState('');
    const [categories, setCategories]=useState([])
    const [editInput, setEditInput]= useState(false)
    const [nameToEdit, setNameToEdit]=useState('')
    const [idToEdit, setIdToEdit]=useState('')
    useEffect(()=>{
        fetch(process.env.BACKEND_URL + '/api/categorias',{
            method:'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => setCategories(data))
    },[])
    const newCategory = async (e) => {
        e.preventDefault();

        let dataSend = {
            'nombre': name,
        };

        const response = await fetch(`${process.env.BACKEND_URL}/api/categorias/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataSend),
        });
        if (response.ok) {
            const newCategory = await response.json()
            console.log({"msg": "Categoria añadida con exito!"})
            setCategories([...categories, newCategory])
        } else return({"msg": "Error al crear categoria"})
    };
    const deleteCategory = (idCategory) => {
        fetch(`${process.env.BACKEND_URL}/api/categorias/${idCategory}`, {
            method: 'DELETE',
        })
        .then(resp => resp.json())
        .then(data => {
            console.log(data);
            setCategories(categories.filter(category => category.id !== idCategory));
        })
    };
    const updateCategory = async (e) => {
        e.preventDefault();

        let dataSend = {
            'name': nameToEdit,
        };

        const response = await fetch(`${process.env.BACKEND_URL}/api/categorias/${idToEdit}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataSend),
        });
        if (response.ok) {
            const data = await response.json()
            console.log({"msg": "Categoria actualizada con exito!"});
            setCategories(categories.map(category => category.id === idToEdit ? data : category))
            setEditInput(false)
            setNameToEdit('')
            setIdToEdit('')
        } else console.log({"msg": "Error al actualizar categoria"})
    };

    return (
        <div className="container-fluid d-flex">
            <div className="col-5">
                <h1 className="container-fluid text-center fw-semibold">Crear nueva etiqueta</h1>
                <form onSubmit={newCategory} className="d-flex flex-column align-items-center gap-3">
                    <label htmlFor="name">Nombre categoria:</label>
                    <input className="col-8" onChange={(e) => { setName(e.target.value) }} type="text" id="name" placeholder="Nueva categoria"/>
                    <button className="btn btn-success col-5" type="submit">Crear</button>
                </form>
            </div>
            <div className="col-5 d-flex flex-column align-items-center gap-2">
                <h1 className="container-fluid text-center fw-semibold">Estas son las recetas disponibles</h1>
                {categories.length!=0 ? categories.map((category)=>(
                    <div className="d-flex" key={category.id}>
                        <p className="fs-3">{category.name}</p>
                        <button onClick={()=>{deleteCategory(category.id)}} className="btn btn-danger mx-2">Delete</button>
                        <button onClick={()=>{setEditInput(true), setNameToEdit(category.name), setIdToEdit(category.id)}} className="btn btn-primary">Edit</button>
                    </div>
                )):
                (<>
                </>)}
            </div>
            <div>
                {editInput==false ? <></>:<>
                    <h1>Editar categoria</h1>
                    <form onSubmit={(e)=>{updateCategory(e)}}>
                    <label htmlFor="nameEdit">Editar nombre de categoria:</label>
                    <input  onChange={(e)=>{setNameToEdit(e.target.value)}} type="text" id="nameEdit" placeholder={nameToEdit}/>
                    </form>
                </>}
            </div>
        </div>
    );
}