"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Recipe, Administrador, Comment, Category, Favorito, Calificacion,RecommendedRecipe, recipe_categories,Vote, Chat, Message
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import func
import cloudinary 
import cloudinary.uploader 
import cloudinary.api
import json
import openai
from datetime import datetime, timezone
import requests


api = Blueprint('api', __name__)
# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/recetas/create', methods=['POST'])
def create_recete():
    print(request.files)
    data = request.form
    img_urls = []
    for img in request.files:
        if img.startswith("files_"):
            imgupload = request.files[img]
            try:
                upload_data = cloudinary.uploader.upload(imgupload)
                img_urls.append(upload_data['url'])
                print(f"Uploaded image URL: {upload_data['url']}")
            except Exception as e:
                return jsonify({"msg": f"Error al subir la imagen: {e}"}), 500

    print(f"Image URLs to be saved: {img_urls}")
    
    categoria_ids = json.loads(data.get('categories', '[]'))
    print(f"img_urls: {img_urls}")
    new_recipe = Recipe(
        title=data['title'],
        ingredientes=json.loads(data['ingredientes']),
        pasos=data['pasos'],
        img_ilustrativa=img_urls,
        user_id=int(data['user_id']),
    )
    for categoria_id in categoria_ids:
        categoria = Category.query.get(categoria_id)
        if categoria:
            new_recipe.categories.append(categoria)

    print(new_recipe)
    db.session.add(new_recipe)
    db.session.commit()
    return jsonify(new_recipe.serialize()), 201

@api.route('/recetas', methods=['GET'])
def get_all():
    recipes = Recipe.query.all()
    serialized_recipes = []
    for recipe in recipes:
        serialized_recipes.append(recipe.serialize())
        
    if serialized_recipes:
        return jsonify(serialized_recipes), 200
    else: return {'msg':'No hay recetas que mostrar actualmente!'}, 400

@api.route('/recetas/<int:id>', methods=['GET'])
def get_recipe_id(id):
    recipe = Recipe.query.filter_by(id=id).first()
    if recipe:
        print(recipe.serialize())
        return jsonify(recipe.serialize()), 200
    else: return {"msg":"No existe la receta solicitada!"}, 400

@api.route('/recetas/<int:id>', methods=['DELETE'])
def recipe_delete(id):
    recipe = Recipe.query.filter_by(id=id).first()
    if recipe:
        db.session.delete(recipe)
        db.session.commit()
        return {"msg":"Su receta se elimino con exito!"}, 200
    else: return {"msg":"No hay una receta que eliminar!"}, 400

@api.route('/recetas/update/<int:id>', methods=['PUT'])
def update_recipe(id):
    data = request.form
    recipe = Recipe.query.filter_by(id=id).first()
    if not recipe:
        return jsonify({"msg": "Recipe not found!"}), 404

    recipe.title = data.get('title', recipe.title)
    recipe.ingredientes = json.loads(data.get('ingredientes', json.dumps(recipe.ingredientes)))
    recipe.pasos = data.get('pasos', recipe.pasos)

    img_urls = []
    for img in request.files:
        if img.startswith("files_"):
            imgupload = request.files[img]
            try:
                upload_data = cloudinary.uploader.upload(imgupload)
                img_url = upload_data['url']
                img_urls.append(img_url)
                print(f"Uploaded image URL: {img_url}")
            except Exception as e:
                return jsonify({"msg": f"Error al subir la imagen: {e}"}), 500
    print(f"Image URLs to be saved: {img_urls}")
    recipe.img_ilustrativa = img_urls


    categoria_ids = json.loads(data.get('categories', '[]'))
    if (categoria_ids, int):
        categoria_ids = [categoria_ids]
    categoria_ids = [int(id) for id in categoria_ids]

    recipe.categories.clear()
    for categoria_id in categoria_ids:
        categoria = Category.query.get(categoria_id)
        if categoria:
            recipe.categories.append(categoria)

    db.session.commit()
    return jsonify(recipe.serialize()), 200

@api.route('/recetas/mis-recetas', methods=['GET'])
@jwt_required()
def get_my_recipes():
    user_id = get_jwt_identity() 
    recipes = Recipe.query.filter_by(user_id=user_id).all()
    
    if recipes:
        serialized_recipes = [recipe.serialize() for recipe in recipes]
        return jsonify(serialized_recipes), 200
    else:
        return jsonify({"msg": "No tienes recetas publicadas"}), 400

@api.route("/administrador", methods=["POST"])
def signup():
    body = request.get_json()
    
    if not body:
        return jsonify({"msg": "No se recibió ningún dato"}), 400  

    print(body)

    administrador = Administrador.query.filter_by(email=body["email"]).first()
    print(administrador)

    if administrador is None: 
        administrador = Administrador(
            name=body["name"],
            last_name=body["last_name"],
            email=body["email"],  
            password=body["password"], 
            is_active=True
        )
        db.session.add(administrador)
        db.session.commit()

        response_body = {
            "msg": "usuario de administrador creado"
        }
        return jsonify(response_body), 201  
    else:
        return jsonify({"msg": "ya hay un usuario con ese email"}), 


@api.route('/administrador', methods=['GET'])
def get_administradores():
    all_administradores = list(Administrador.query.all())
    results = list(map(lambda administrador: administrador.serialize(), all_administradores)) 

    return jsonify(results), 200

@api.route('/administrador/<int:administrador_id>', methods=['GET'])
def get_administrador(administrador_id):
    # Buscar el administrador por ID
    administrador = Administrador.query.filter_by(id=administrador_id).first()
    
    if administrador is None:
        return jsonify({"error": "administrador no encontrado"}), 404  # Error 404 si no se encuentra

    return jsonify(administrador.serialize()), 200  

@api.route('/administrador/<int:administrador_id>', methods=['DELETE'])
def delete_administrador(administrador_id):
    try:
        # Buscar el administrador por ID
        administrador = Administrador.query.filter_by(id=administrador_id).first()
        
        if administrador is None:
            return jsonify({"error": "administrador no encontrado"}), 404  # Error 404 si no se encuentra

        # Eliminar el administrador
        db.session.delete(administrador)
        db.session.commit()

        return jsonify({"msg": "administrador eliminado exitosamente"}), 200  
    except Exception as e:
        return jsonify({"error": "Ocurrió un error al eliminar el administrador", "detail": str(e)}), 500  

@api.route('/administrador/<int:administrador_id>', methods=['PUT'])
def update_administrador(administrador_id):
    body = request.get_json() 

    if not body:
        return jsonify({"msg": "No se recibió ningún dato"}), 400  

  
    administrador = Administrador.query.filter_by(id=administrador_id).first()
    
    if administrador is None:
        return jsonify({"error": "administrador no encontrado"}), 404  

    administrador.name = body.get('name', administrador.name)
    administrador.last_name = body.get('last_name', administrador.last_name)
    administrador.email = body.get('email', administrador.email)
    administrador.password = body.get('password', administrador.password)  
    administrador.is_active = body.get('is_active', administrador.is_active)

   
    db.session.commit()

    return jsonify({"msg": "administrador actualizado exitosamente"}), 200  

@api.route('/usuario', methods=['POST'])
def create_usuario():
    body = request.form
    img_to_send = request.files.get('file')
    print("Image file:", img_to_send)
    img_profile_url=None
    print("Form data:", request.form)
    print("Files data:", request.files)

    if img_to_send:
        try:
            upload_data = cloudinary.uploader.upload(img_to_send)
            img_profile_url = upload_data['url']
        except Exception as e:
            print(f"Error al subir imagen: {e}")
            return jsonify({"msg": f"Error al subir imagen: {e}"}), 500
    # Verificar si el usuario ya existe por email
    usuario = User.query.filter_by(email=body["email"]).first()
    if usuario is None:
        new_usuario = User(
            name=request.form['name'],
            last_name=request.form["last_name"],
            email=request.form["email"],
            password=request.form["password"],  
            is_active=True,
            img_profile= img_profile_url
        )
        db.session.add(new_usuario)
        db.session.commit()

        return jsonify({"msg": "Usuario creado exitosamente"}), 201
    else:
        return jsonify({"msg": "Ya existe un usuario con ese email"}), 409

@api.route('/usuario', methods=['GET'])
def get_usuarios():
    all_usuarios = User.query.all()
    results = [usuario.serialize() for usuario in all_usuarios]
    return jsonify(results), 200

@api.route('/usuario/<int:usuario_id>', methods=['GET'])
def get_usuario(usuario_id):
    usuario = User.query.filter_by(id=usuario_id).first()
    
    if usuario is None:
        return jsonify({"error": "Usuario no encontrado"}), 404

    return jsonify(usuario.serialize()), 200

@api.route('/usuario/<int:usuario_id>', methods=['DELETE'])
def delete_usuario(usuario_id):
    usuario = User.query.filter_by(id=usuario_id).first()
    
    if usuario is None:
        return jsonify({"error": "Usuario no encontrado"}), 404

    db.session.delete(usuario)
    db.session.commit()

    return jsonify({"msg": "Usuario eliminado exitosamente"}), 200

@api.route('/usuario/<int:usuario_id>', methods=['PUT'])
def update_usuario(usuario_id):
    body = request.get_json()

    if not body:
        return jsonify({"msg": "No se recibió ningún dato"}), 400

    usuario = User.query.filter_by(id=usuario_id).first()
    
    if usuario is None:
        return jsonify({"error": "Usuario no encontrado"}), 404

    # Actualizar los campos del usuario con los nuevos datos
    usuario.name = body.get('name', usuario.name)
    usuario.last_name = body.get('last_name', usuario.last_name)
    usuario.email = body.get('email', usuario.email)
    usuario.password = body.get('password', usuario.password)  
    usuario.is_active = body.get('is_active', usuario.is_active)

    db.session.commit()

    return jsonify({"msg": "Usuario actualizado exitosamente"}), 200

@api.route('/usuario/login', methods=['POST'])

def login_user():
    body = request.get_json()
    email = body.get("email")
    password = body.get("password")
    
    user = User.query.filter_by(email=email).first()

    if user and user.password == password:
        access_token = create_access_token(identity=user.id)
        return jsonify('Se logueo correctamente!', access_token), 200
    
    else:
        return jsonify('Hubo un error en las credenciales'), 401
    
@api.route('/administrador/login', methods=['POST'])
def login_admin():
    body = request.get_json()
    email = body.get("email")
    password = body.get("password")
    
    admin = Administrador.query.filter_by(email=email).first()

    if admin and admin.password == password:
        # Crear el token solo con `admin.id`
        access_token = create_access_token(identity=admin.id)
        return jsonify({"message": "Se logueó correctamente!", "access_token": access_token}), 200
    else:
        return jsonify({"message": "Hubo un error en las credenciales"}), 401

    
@api.route('/comentario', methods=['GET'])
def get_comentarios():
    try:
        all_comentarios = Comment.query.all()
        print(f'Comentarios recuperados: {all_comentarios}')
        results = list(map(lambda comentario: comentario.serialize(), all_comentarios))
        print(f'Resultados serializados: {results}')
        return jsonify(results), 200
    except Exception as e:
        print(f'Error: {e}')
        return jsonify({"msg": "Error interno del servidor", "error": str(e)}), 500
    


@api.route("/comentario", methods=["POST"])
def create_comment():
    body = request.get_json() 
    if not body:
        return jsonify({"msg": "No se recibió ningún dato"}), 400
    if "user_id" not in body or "recipe_id" not in body or "comment_text" not in body:
        return jsonify({"msg": "Datos incompletos"}), 400
    if not body["comment_text"].strip():
        return jsonify({"msg": "El texto del comentario no puede estar vacío"}), 400

    user = User.query.get(body["user_id"])
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    recipe = Recipe.query.get(body["recipe_id"])
    if not recipe:
        return jsonify({"msg": "Receta no encontrada"}), 404

    try:
        comentario = Comment(
            user_id=user.id,
            recipe_id=recipe.id,
            comment_text=body["comment_text"]
        )
        db.session.add(comentario)
        db.session.commit()

        response_body = {
            "msg": "Comentario creado con éxito",
            "comment": comentario.serialize()  
        }
        return jsonify(response_body), 201
    
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"msg": "Error al crear el comentario", "error": str(e)}), 500
   

@api.route('/edit/comentario/<int:comentario_id>', methods=['PUT'])
def edit_comentario(comentario_id):
 
    comentario = Comment.query.get(comentario_id)
    if not comentario:
        return jsonify({"msg": "Comentario no encontrado"}), 404
    
    data = request.get_json()
    
    if 'comment_text' not in data:
        return jsonify({"msg": "El texto del comentario es requerido"}), 400

    comentario.comment_text = data['comment_text']
    db.session.commit()
    return jsonify(comentario.serialize()), 200


@api.route('/delete/comentario/<int:comentario_id>', methods=['DELETE']) 
@jwt_required()
def delete_comentario(comentario_id): 
    user_id = get_jwt_identity()
    print (user_id)
    comentario = Comment.query.get(comentario_id)
    if comentario.user_id!=user_id:
        return jsonify({"msg": "Comentario no pertenece al usuario"}), 404 

    if not comentario:
        return jsonify({"msg": "Comentario no encontrado"}), 404  
    
    db.session.delete(comentario)
    db.session.commit()  
    
    return jsonify({"msg": "Comentario eliminado exitosamente"}), 200

@api.route('/comentario/<int:comentario_id>', methods=['GET'])
def get_comentario(comentario_id):
    try:
        comentario = Comment.query.get(comentario_id)
        if not comentario:
            return jsonify({"msg": "Comentario no encontrado"}), 404
        
        return jsonify(comentario.serialize()), 200
    except Exception as e:
        print(f'Error: {e}')
        return jsonify({"msg": "Error interno del servidor", "error": str(e)}), 500 
    

@api.route('/comentario/receta/<int:recipe_id>', methods=['GET'])
def get_comments_by_recipe(recipe_id):
    try:
        comentarios = Comment.query.filter_by(recipe_id=recipe_id).all()
        
        if not comentarios:
            return jsonify({"msg": "No hay comentarios para esta receta"}), 404

        results = [comentario.serialize() for comentario in comentarios]
        return jsonify(results), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"msg": "Error interno del servidor", "error": str(e)}), 500


       
@api.route('/categorias/create', methods=['POST'])

def create_categoria():
    body = request.get_json()
    nombre = body.get('nombre')

    new_categoria = Category(name=nombre)
    db.session.add(new_categoria)
    db.session.commit()
    return jsonify(new_categoria.serialize()), 200

@api.route('/categorias', methods=['GET'])
def get_categories():
    categories= Category.query.all()
    return jsonify([categoria.serialize() for categoria in categories]), 200

@api.route('/categorias/<int:id>', methods=['GET'])
def get_category(id):
    category = Category.query.get(id)
    if not category:
        return jsonify({"msg":"Categoria no encontrada"}),400
    return jsonify(category.serialize()),200

@api.route('/categorias/<int:id>', methods=['PUT'])
def update_category(id):
    body = request.get_json()
    category = Category.query.get(id)
    name = body.get('name')
    if name:
        category.name = name

    db.session.commit()
    return jsonify(category.serialize()),200

@api.route('/categorias/<int:id>', methods=['DELETE'])
def delete_category(id):
    category = Category.query.get(id)
    if not category:
        return jsonify({"msg":"Categoria no encontrada!!"}),400
    db.session.delete(category)
    db.session.commit()
    return jsonify({"msg": "Categoria eliminada"}),200

@api.route('/favoritos', methods=['GET'])
@jwt_required()
def obtener_favoritos():
    user_id = get_jwt_identity()  
    favoritos = Favorito.query.filter_by(user_id=user_id).all()
    
    return jsonify({
        "user_id": user_id,
        "favoritos": [favorito.serialize() for favorito in favoritos]
    }),200


@api.route('/favoritos/<int:recipe_id>', methods=['POST'])
@jwt_required()
def agregar_favorito(recipe_id):
    user_id = get_jwt_identity()  

    favorito_existente = Favorito.query.filter_by(user_id=user_id, recipe_id=recipe_id).first()
    if favorito_existente:
        return jsonify({"msg": "La receta ya está en favoritos"}), 409

    nuevo_favorito = Favorito(user_id=user_id, recipe_id=recipe_id)
    db.session.add(nuevo_favorito)
    db.session.commit()
    return jsonify({"msg": "Receta añadida a favoritos"}), 201

@api.route('/favoritos/<int:recipe_id>', methods=['DELETE'])
@jwt_required()
def eliminar_favorito(recipe_id):
    user_id = get_jwt_identity() 

    # Buscar el favorito en la base de datos
    favorito = Favorito.query.filter_by(user_id=user_id, recipe_id=recipe_id).first()
    if not favorito:
        return jsonify({"msg": "La receta no está en favoritos"}), 404

    db.session.delete(favorito)
    db.session.commit()
    return jsonify({"msg": "Receta eliminada de favoritos"}), 200

@api.route('/recetas/filter/<int:categoria_id>', methods=['GET'])
def filtrar_recetas(categoria_id):
        recetas = Recipe.query.join(recipe_categories).join(Category).filter(Category.id == categoria_id).all()
        if not recetas:
            return jsonify({"message": "No se encontraron recetas"}), 404
        return jsonify([recipe.serialize() for recipe in recetas]), 200

@api.route('/recetas/filter/search', methods=['GET'])
def search_recipe():
    query = request.args.get('query')
    if not query:
        return jsonify({"msg": "No se proporciono palabra de busqueda"}), 400
    recetas = Recipe.query.filter(Recipe.title.ilike(f"%{query}%")).all()
    if not recetas: 
        return jsonify({"message": "No se encontraron recetas"}), 404 
    return jsonify([recipe.serialize() for recipe in recetas]), 200

@api.route('/calificaciones', methods=['POST'])
@jwt_required()
def agregar_o_actualizar_calificacion():
    data = request.get_json()
    user_id = get_jwt_identity()
    recipe_id = data.get('recipe_id')
    qualification = data.get('qualification')

    if not (1 <= qualification <= 5):
        return jsonify({"error": "La calificación debe ser entre 1 y 5"}), 400

    calificacion_existente = Calificacion.query.filter_by(user_id=user_id, recipe_id=recipe_id).first()

    if calificacion_existente:
        calificacion_existente.qualification = qualification
        mensaje = "Calificación actualizada exitosamente"
    else:
        calificacion_existente = Calificacion(user_id=user_id, recipe_id=recipe_id, qualification=qualification)
        db.session.add(calificacion_existente)
        mensaje = "Calificación agregada exitosamente"
    
    db.session.commit()
    return jsonify({"message": mensaje, "calificacion": calificacion_existente.serialize()}), 200

@api.route('/calificaciones', methods=['DELETE'])
@jwt_required()
def eliminar_calificacion(calificacion_id):
    data = request.get_json()
    user_id = get_jwt_identity()
    recipe_id = data.get('recipe_id')
    calificacion = Calificacion.query.filter_by(user_id=user_id, recipe_id=recipe_id).first()

    if not calificacion:
        return jsonify({"error": "Calificación no encontrada"}), 404

    db.session.delete(calificacion)
    db.session.commit()
    return jsonify({"message": "Calificación eliminada exitosamente"}), 200

@api.route('/calificaciones/promedio/<int:recipe_id>', methods=['GET'])
def obtener_promedio_calificacion(recipe_id):
    calificaciones = Calificacion.query.filter_by(recipe_id=recipe_id).all()
    if not calificaciones:
        return jsonify({"error": "No se encontraron calificaciones para esta receta"}), 404

    promedio = sum([cal.qualification for cal in calificaciones]) / len(calificaciones)
    return jsonify({"recipe_id": recipe_id, "promedio": round(promedio, 2)}), 200

@api.route('/recommendations/add', methods=['POST'])
def add_recommended_recipe():
    data = request.get_json()
    admin_id = data.get('admin_id')
    recipe_id = data.get('recipe_id')

    # Validar que admin_id y recipe_id existan en la base de datos
    admin = Administrador.query.get(admin_id)
    recipe = Recipe.query.get(recipe_id)
    if not admin or not recipe:
        return jsonify({"error": "Invalid admin_id or recipe_id"}), 400

    # Crear la recomendación si la validación es correcta
    recommended_recipe = RecommendedRecipe(admin_id=admin_id, recipe_id=recipe_id)
    db.session.add(recommended_recipe)
    db.session.commit()

    return jsonify(recommended_recipe.serialize()), 201


@api.route('/recommendations', methods=['GET'])
def get_all_recommended_recipes():
    recommended_recipes = RecommendedRecipe.query.all()
    return jsonify([recipe.serialize() for recipe in recommended_recipes]), 200


@api.route('/recommendations/<int:id>', methods=['GET'])
def get_recommended_recipe(id):
    recommended_recipe = RecommendedRecipe.query.get(id)
    if not recommended_recipe:
        return jsonify({"error": "Recommended recipe not found"}), 404

    return jsonify(recommended_recipe.serialize()), 200


@api.route('/recommendations/delete', methods=['DELETE'])
def delete_all_recommended_recipes():
    RecommendedRecipe.query.delete()
    db.session.commit()
    return jsonify({"message": "All recommended recipes deleted"}), 200


@api.route('/recommendations/recipe/<int:recipe_id>', methods=['DELETE'])
def delete_recommended_recipe_by_recipe_id(recipe_id):
    recommended_recipe = RecommendedRecipe.query.filter_by(recipe_id=recipe_id).first()
    if not recommended_recipe:
        return jsonify({"error": "Recommended recipe not found"}), 404

    db.session.delete(recommended_recipe)
    db.session.commit()
    return jsonify({"message": "Recommended recipe deleted"}), 200


@api.route('/assistant' , methods=['POST'])
def assistant():
    title = request.form.get('title')
    ingredients = request.form.get('ingredients')
    taste = request.form.get('taste')
    duration = request.form.get('duration')
    dificulty = request.form.get('dificulty')

    prompt = 'Me gustaria que me des una receta con las siguientes caracteristicas'
    if title:
        prompt+= f'Su nombre es {title}. '
    if ingredients:
        prompt+= f'Tengo los siguientes ingredientes: {ingredients}. '
    if taste:
        prompt += f'Su sabor deberia ser {taste}. '
    if duration:
        prompt+= f'No debo demorar en realizarla mas de {duration} minutos. '
    if dificulty:
        prompt += f'Debe ser {dificulty} de realizar. '

    prompt += """
    Dame una receta en formato JSON con las siguientes claves:
    {
        "nombre": "string",
        "ingredientes": ["string"],
        "pasos": ["string"],
        "tiempo_preparacion": "string",
        "tiempo_coccion": "string",
        "dificultad": "string"
    }
    Asegúrate de usar estas claves incluso si algunos datos no son proporcionados. La respuesta debe ser formato JSON valido, sin caracteres extras.
    """
    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", 'content':"Eres un asistente experto en recetas de cocina."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=400
        )
        receta = response.choices[0].message.content
        return jsonify({'receta': receta})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/chats', methods=['POST'])
def create_chat():
    body = request.get_json()
    user_1_id = body.get('user_1_id')
    user_2_id = body.get('user_2_id')

    if not user_1_id or not user_2_id:
        return jsonify({"msg": "no se encuentran los ID de los cocineros"}), 400
    
    chat = Chat(user_1_id=user_1_id, user_2_id=user_2_id)
    db.session.add(chat)
    db.session.commit()
    return jsonify(chat.serialize()), 201

@api.route('/chats/<int:chat_id>/messages', methods=['POST'])
def send_message(chat_id):
    body=request.get_json()
    sender = body.get('sender')
    content = body.get('content')

    if not sender or not content:
        return jsonify({"msg": "No hay contenido o remitente"}), 400
    
    message = Message(chat_id=chat_id, sender=sender, content = content, date=datetime.now(timezone.utc))
    db.session.add(message)
    db.session.commit()
    return jsonify(message.serialize()), 201

@api.route('/chats/<int:chat_id>/messages', methods=['GET'])
def get_messages(chat_id):
    messages = Message.query.filter_by(chat_id=chat_id).all()
    return jsonify([message.serialize() for message in messages]), 200

@api.route('/chats', methods=['GET'])
def get_all_chats():
    chats = Chat.query.all()
    return jsonify([chat.serialize() for chat in chats]), 200

@api.route('/users/<int:user_id>/chats', methods=['GET'])
@jwt_required()
def get_user_chats(user_id):
    chats = Chat.query.filter(
        (Chat.user_1_id==user_id) | (Chat.user_2_id==user_id)
    ).all()
    return jsonify([chat.serialize() for chat in chats]), 200

@api.route('/users/search', methods=['GET'])
def search_users():
    query = request.args.get('query')
    if not query:
        return jsonify({"msg": "No se proporciono usuario de busqueda"}), 400
    users = User.query.filter(User.name.ilike(f"%{query}%")).all()
    if not users: 
        return jsonify({"message": "No se encontraron usuarios"}), 404 
    return jsonify([user.serialize() for user in users]), 200
    
@api.route('/vote/add', methods=['POST'])
@jwt_required()
def create_or_update_vote():
    user_id = get_jwt_identity()  
    data = request.get_json()
    recipe_id = data.get('recipe_id')
    vote_type = data.get('vote_type')  

    if not recipe_id or vote_type is None:
        return jsonify({"message": "Missing recipe_id or vote_type"}), 400

    existing_vote = Vote.query.filter_by(user_id=user_id, recipe_id=recipe_id).first()

    if existing_vote:
        if existing_vote.vote_type == vote_type:
            db.session.delete(existing_vote)
            db.session.commit()
            return jsonify({"message": "Vote removed"}), 200

        existing_vote.vote_type = vote_type
        db.session.commit()
        return jsonify({"message": "Vote updated"}), 200
    else:
        vote = Vote(user_id=user_id, recipe_id=recipe_id, vote_type=vote_type)
        db.session.add(vote)
        db.session.commit()
        return jsonify({"message": "Vote created successfully"}), 201

@api.route('/vote/user/<int:user_id>/recipe/<int:recipe_id>', methods=['GET'])
@jwt_required()
def get_user_vote(user_id, recipe_id):
    vote = Vote.query.filter_by(user_id=user_id, recipe_id=recipe_id).first()
    if vote:
        return jsonify({"vote_type": vote.vote_type}), 200
    return jsonify({"message": "No vote found"}), 404


@api.route('/vote/recipe/<int:recipe_id>', methods=['GET'])
def get_votes(recipe_id):
    votes = Vote.query.filter_by(recipe_id=recipe_id).all()
    total_votes = sum(vote.vote_type for vote in votes)
    return jsonify({
        "recipe_id": recipe_id,
        "total_votes": total_votes,
        "votes": [vote.serialize() for vote in votes]
    }), 200


@api.route('/vote/delete', methods=['DELETE'])
def delete_vote():
    data = request.get_json()
    user_id = data.get('user_id')
    recipe_id = data.get('recipe_id')

    vote = Vote.query.filter_by(user_id=user_id, recipe_id=recipe_id).first()
    if vote:
        db.session.delete(vote)
        db.session.commit()
        return jsonify({"message": "Vote deleted successfully"}), 204
    else:
        return jsonify({"message": "Vote not found"}), 404

@api.route('/vote', methods=['GET'])
def get_all_votes():
    votes = Vote.query.all()
    return jsonify([vote.serialize() for vote in votes]), 200

@api.route('/traducir', methods=['POST'])
def translate():
    data = request.json
    texto = data.get('texto')
    idioma = data.get('idioma')

    if not texto or not idioma:
        return jsonify({'error': 'Los campos "texto" e "idioma" son obligatorios.'}), 400

    try:
        response = requests.post(
            'https://api-free.deepl.com/v2/translate',
            headers={
                'Authorization': 'DeepL-Auth-Key a20edb1b-b5a1-4aca-901a-67b25ccfe7f1:fx',
                'Content-Type': 'application/json'
            },
            json={
                'text': texto,
                'target_lang': idioma
            }
        )

        # Verificar si la respuesta de la API es exitosa
        if response.status_code != 200:
            print(f"Error en la respuesta de DeepL: {response.status_code}, {response.text}")
            return jsonify({'error': 'Error al comunicarse con el servicio de traducción.'}), response.status_code

        response_data = response.json()
        traducciones = [traduccion['text'] for traduccion in response_data.get('translations', [])]

        return jsonify({'traducciones': traducciones})

    except requests.exceptions.RequestException as e:
        print('Error al realizar la solicitud a DeepL:', e)
        return jsonify({'error': 'No se pudo completar la traducción debido a un problema de red.'}), 500

    except Exception as e:
        print('Error interno del servidor:', e)
        return jsonify({'error': 'Error interno del servidor.'}), 500