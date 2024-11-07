import React, { useEffect } from "react";

export function AddRecipeAi(){
    const [recipe, setRecipe] = useState(null)


    useEffect(()=>{
        const recipeAi = localStorage.getItem('RecipeAi')
        if (recipeAi){
            setRecipe(JSON.parse(recipeAi))
            console.log("recipe es: ",JSON.parse(recipeAi))
        }
    },[])

    return(
        <>
            <h1>Revisemos su receta:</h1>
            <form onSubmit={editRecipe} className="container d-flex flex-column gap-2">
                <div className="d-flex flex-column">
                    <label htmlFor="title">Enter recipe title:</label>
                    <input value={recipe.title} id="title" type="text" placeholder="Title" onChange={(e)=>setTitle(e.target.value)}/>
                </div>
                <div className="d-flex flex-column">
                    <label htmlFor="ingredients">Ingredients:</label>
                    {ingredients.length !==0 ? ingredients.map((element, index)=>(
                        <div key={index} className="d-flex align-items-center">
                            <h1>{element}</h1>
                            <button type="button" onClick={()=> removeIngredient(index)}>Eliminar</button>
                        </div>
                    )) : 'none'}
                    <input id="ingredients" type="text" placeholder="Ingredients" onChange={(e)=>setIngredient(e.target.value)} onKeyDown={createIngredientsList} />
                </div>
                <div className="d-flex flex-column">
                    <label htmlFor="steps">Steps:</label>
                    <textarea value={steps} id="steps" type="text" placeholder="Steps" onChange={(e)=>setSteps(e.target.value)} />
                </div>
                <div className="d-flex flex-column">
                    <label htmlFor="img">Show us your finished recipe images!</label>
                    <input id="img" type="file" multiple onChange={uploadImages} />
                </div>
                <label>Categories:</label>
                {categories.length !==0 ? categories.map((category)=>(
                    <div key={category.id} className="form-check">
                        <input className="form-check-input" type="checkbox" value={category.id} checked={selectedCategories.includes(category.id)} onChange={() => addCategorySelection(category.id)} />
                        <label className="form-check-label">{category.name}</label>
                    </div>
                )) : <p>No hay categorias</p>}
                <button className="btn btn-primary mt-3" type="submit">Actualizar Receta</button>
            </form>
        </>
    );
}