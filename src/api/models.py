from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone
db = SQLAlchemy()
import json

#creo tabla intermedia para relacion muchos a muchos.
recipe_categories = db.Table('recipe_categories',
    db.Column('recipe_id', db.Integer, db.ForeignKey('recipe.id'), primary_key=True),
    db.Column('category_id', db.Integer, db.ForeignKey('category.id'), primary_key=True)
)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(60), unique=False, nullable=False)
    last_name= db.Column(db.String(60), unique=False, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    recipes = db.relationship('Recipe', backref='user')
    favoritos = db.relationship('Favorito', backref='user')

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "last_name": self.last_name,
            "email": self.email,
            "is_active": self.is_active,
            "recipes": [recipe.serialize() for recipe in self.recipes]
            # do not serialize the password, its a security breach
        }
class Recipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), nullable=False)
    ingredientes = db.Column(db.JSON, nullable=False)
    pasos = db.Column(db.String, nullable=False)
    fecha_publicacion= db.Column(db.DateTime, nullable=False, default=lambda : datetime.now(timezone.utc))
    img_ilustrativa= db.Column(db.String(200), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    categories = db.relationship('Category', secondary=recipe_categories, backref=db.backref('recipes'))
    favoritos = db.relationship('Favorito', backref='recipe')

    def __repr__(self):
        return f'<User {self.title}'
    
    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'ingredientes': self.ingredientes,
            'pasos': self.pasos,
            'fecha_publicacion': self.fecha_publicacion,
            'img_ilustrativa': self.img_ilustrativa,
            'user_id': self.user_id,
            'category':[Category.serialize() for Category in self.categories]
        }
class Administrador(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=False, nullable=False)
    last_name = db.Column(db.String(120), unique=False, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)

    def _repr_(self):
        return f'<Administrador {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "last_name": self.last_name,
            "email": self.email,
            "is_active": self.is_active
            # do not serialize the password, its a security breach
        }    

class Category(db.Model):
    id= db.Column(db.Integer, primary_key=True)
    name= db.Column(db.String(30), nullable=False, unique=False)

    def _repr_(self):
        return f'<Category {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name
        } 

class Favorito(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipe.id'), nullable=False)
    __table_args__ = (db.UniqueConstraint('user_id', 'recipe_id', name='_user_recipe_uc'),)
    
    def _repr_(self):
        return f'<Favorito {self.user_id}>'

    def serialize(self):
        return {
            "favorito_id": self.id,
            "user_id": self.user_id,
            "recipe_id": self.recipe_id
        }
