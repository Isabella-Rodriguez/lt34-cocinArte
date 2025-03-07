import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";

import { UsersList } from "./pages/users_list";
import { UsersAdd } from "./pages/users_add";
import { UsersEdit } from "./pages/users_edit";

import injectContext from "./store/appContext";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";

import { CrudAdmin } from "./component/crudadmin";
import { ListAdministradores } from "./component/listadministradores";
import { EditarAdministradores } from "./component/editaradmins";
import { LoginAdmin } from "./component/loginAdministrador.jsx";

import { CreateRecipe } from "./pages/createRecipe.jsx";
import { ViewRecipe } from "./component/ViewRecipe.jsx";
import { AllRecipes } from "./component/allRecipes.jsx";
import { MisRecetas } from "./component/misRecetas.jsx";
import { EditRecipe } from "./component/editRecipes.jsx";
import { LoginCocinero } from "./component/loginCocinero.jsx";
import { CategoriesAdmin } from "./component/createCategories.jsx";

import { Favoritos } from "./component/favoritos.jsx";
import { SearchByCategories } from "./component/searchbyCategories.jsx";
import { SearchByTitle } from "./component/searchByTitle.jsx";
import { CreateUser } from "./component/singup.jsx";
import { ViewRecipeApi } from "./component/viewRecipesApi.jsx";
import { Sidebar } from "./component/sidebar.jsx";
import { OpenAiAssistant } from "./component/openAi.jsx";
import { OpenAiRecipe } from "./component/openAiRecipe.jsx";
import { RecomendedRecipePage } from "./pages/recomededRecipePage.jsx";
import { AdminRecommendedRecipes } from "./component/adminrecomendedrecipe.js";
import { ChatList } from "./component/chatList.jsx";
import { Chats } from "./pages/chats.jsx";
import { AddRecipeAi } from "./component/addRecipeAi.jsx";
import { Dashboard } from "./pages/dashboard.jsx";
import { DashboardAdmin } from "./pages/dashboardAdmin.jsx";


//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if(!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL/ >;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <div>
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<Single />} path="/single/:theid" />
                        <Route element={<CrudAdmin/>} path="/administrador"/>
                        <Route element={<ListAdministradores/>} path="/listdeadministradores"/>
                        <Route element={<EditarAdministradores/>} path="/editaradminnistrador/:idadmin"/>
                        <Route element={<LoginAdmin/>} path="/login/administrador"/>
                        <Route element={<UsersList />} path="/users" />
                        <Route element={<UsersAdd />} path="/users/add" />
                        <Route element={<UsersEdit />} path="/users/edit" />
                        <Route element={<CreateRecipe />} path="/recipe/create"/>
                        <Route element={<ViewRecipe />} path="/recipe/:id"/>
                        <Route element={<AllRecipes />} path="/recipe/"/>
                        <Route element={<EditRecipe />} path="/recipe/edit/:id"/>
                        <Route element={<LoginCocinero />} path="/login/cocinero"/>
                        <Route element={<CategoriesAdmin/>} path="/categories/create"/>
                        <Route element={<Favoritos />} path="/favoritos"/>
                        <Route element={<SearchByCategories />} path="/category/search/:categoryId"/>
                        <Route element={<SearchByTitle />} path="/search"/>
                        <Route element={<CreateUser />} path="/singup"/>
                        <Route element={<ViewRecipeApi />} path="/recipe/api/:id"/>
                        <Route element={<OpenAiAssistant/>} path="/assistant"/>
                        <Route element={<OpenAiRecipe/>} path="/assistant/resp"/>
                        <Route element={<RecomendedRecipePage />} path="/recomended/recipe"/>
                        <Route element={<AdminRecommendedRecipes />} path="/admin/recomended/recipe"/>
                        <Route element={<MisRecetas />} path="/mis-recetas"/>
                        <Route element={<Chats />} path="/chats"/>
                        

                        <Route element={<AddRecipeAi />} path="/postear-recipe-ai" />
                        <Route element={<Dashboard/> } path="/dashboard" />
                        <Route element={<DashboardAdmin/> } path="/dashboard/admin" />
                        
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                    </div>
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
