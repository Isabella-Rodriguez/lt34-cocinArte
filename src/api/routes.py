"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Administrador
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
