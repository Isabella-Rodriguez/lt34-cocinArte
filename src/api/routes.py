"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Recipe
from api.models import db, User, Administrador
from api.models import db, User, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/recetas', methods=['POST'])
def create_recete():
    data = request.get_json()
    new_recipe= Recipe(
        title=data['title'],
        ingredientes=data['ingredientes'],
        pasos=data['pasos'],
        img_ilustrativa=data['img_ilustrativa']
    )
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
    data = request.get_json()
    recipe = recipe = Recipe.query.filter_by(id=id).first()
    if recipe:
        recipe.title = data['title']
        recipe.ingredientes = data['ingredientes']
        recipe.pasos=data['pasos']
        recipe.img_ilustrativa=data['img_ilustrativa']
        db.session.commit()
        return jsonify(recipe.serialize()), 200
    else: {"msg": "Recipe not found!"}, 400


@api.route("/administrador", methods=["POST"])
def signup():
    body = request.get_json()
    
    if not body:
        return jsonify({"msg": "No se recibió ningún dato"}), 400  # Manejo de errores si el cuerpo está vacío

    print(body)

    # Buscar el administrador por email
    administrador = Administrador.query.filter_by(email=body["email"]).first()
    print(administrador)

    if administrador is None: 
        # Crear un nuevo administrador
        administrador = Administrador(
            name=body["name"],
            last_name=body["last_name"],
            email=body["email"],  
            password=body["password"], 
            is_active=True
        )
        # Agregar el nuevo administrador a la sesión y confirmar los cambios
        db.session.add(administrador)
        db.session.commit()

        response_body = {
            "msg": "usuario de administrador creado"
        }
        return jsonify(response_body), 201  # Usar 201 para indicar que se creó un recurso
    else:
        return jsonify({"msg": "ya hay un usuario con ese email"}), 409  # Usar 409 para indicar conflicto


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
        return jsonify({"error": "Ocurrió un error al eliminar el administrador", "detail": str(e)}), 500  # Error 500

@api.route('/administrador/<int:administrador_id>', methods=['PUT'])
def update_administrador(administrador_id):
    body = request.get_json() 

    if not body:
        return jsonify({"msg": "No se recibió ningún dato"}), 400  

  
    administrador = Administrador.query.filter_by(id=administrador_id).first()
    
    if administrador is None:
        return jsonify({"error": "administrador no encontrado"}), 404  

    # Actualizar los campos del administrador con los nuevos datos
    administrador.name = body.get('name', administrador.name)
    administrador.last_name = body.get('last_name', administrador.last_name)
    administrador.email = body.get('email', administrador.email)
    administrador.password = body.get('password', administrador.password)  
    administrador.is_active = body.get('is_active', administrador.is_active)

   
    db.session.commit()

    return jsonify({"msg": "administrador actualizado exitosamente"}), 200  

@api.route('/usuario', methods=['POST'])
def create_usuario():
    body = request.get_json()
    
    if not body:
        return jsonify({"msg": "No se recibió ningún dato"}), 400

    # Verificar si el usuario ya existe por email
    usuario = User.query.filter_by(email=body["email"]).first()
    if usuario is None:
        new_usuario = User(
            name=body["name"],
            last_name=body["last_name"],
            email=body["email"],
            password=body["password"],  
            is_active=True
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