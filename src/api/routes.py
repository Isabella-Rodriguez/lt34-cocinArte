"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Recipe
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

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
