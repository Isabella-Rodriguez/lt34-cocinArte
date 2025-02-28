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
    img_profile = db.Column(db.String(200), nullable=True)

    recipes = db.relationship('Recipe', backref='user')
    favoritos = db.relationship('Favorito', backref='user')
    comments = db.relationship('Comment', backref='user', lazy=True)
    calificacion = db.relationship('Calificacion', backref='user')
    votes = db.relationship('Vote', backref='user')
 

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "last_name": self.last_name,
            "email": self.email,
            "is_active": self.is_active,
            "recipes": [recipe.serialize() for recipe in self.recipes],
            "img_profile":self.img_profile
            # do not serialize the password, its a security breach
        }
class Recipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), nullable=False)
    ingredientes = db.Column(db.JSON, nullable=False)
    pasos = db.Column(db.String, nullable=False)
    fecha_publicacion= db.Column(db.DateTime, nullable=False, default=lambda : datetime.now(timezone.utc))
    img_ilustrativa= db.Column(db.JSON, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    categories = db.relationship('Category', secondary=recipe_categories, backref=db.backref('recipes'))
    favoritos = db.relationship('Favorito', backref='recipe')

    comments = db.relationship('Comment', backref='recipe', lazy=True)
    calificacion = db.relationship('Calificacion', backref='recipe')
    votes = db.relationship('Vote', backref='recipe')

    def __repr__(self):
        return f'<Recipe {self.title}>'
    
    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'ingredientes': self.ingredientes,
            'pasos': self.pasos,
            'fecha_publicacion': self.fecha_publicacion,
            'img_ilustrativa': self.img_ilustrativa,
            'user_id': self.user_id,
            'categories':[category.serialize() for category in self.categories],
        }
class Administrador(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=False, nullable=False)
    last_name = db.Column(db.String(120), unique=False, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)

    recommended_recipes = db.relationship('RecommendedRecipe', backref='admin', lazy=True)

    def __repr__ (self):
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

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipe.id'), nullable=False)
    comment_text = db.Column(db.String(500), nullable=False)

    def __repr__(self):
        return f'<Comment {self.id} by User {self.user_id} on Recipe {self.recipe_id}>'

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,  
            "recipe_id": self.recipe_id,  
            "comment_text": self.comment_text,
            "user_email": self.user.email,
            "name": self.user.name,
            "img_profile": self.user.img_profile
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

class Calificacion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipe.id'), nullable=False)
    qualification = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f'<Qualification {self.id} by User {self.user_id} on Recipe {self.recipe_id}>'

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,  
            "recipe_id": self.recipe_id,  
            "qualification": self.qualification,
        } 
 
    
class RecommendedRecipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    admin_id = db.Column(db.Integer, db.ForeignKey('administrador.id'), nullable=False)
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipe.id'), nullable=False)
   
    __table_args__ = (db.UniqueConstraint('admin_id', 'recipe_id', name='_admin_recipe_recommendation_uc'),)

    recipe = db.relationship('Recipe', backref='recommended_by')

    def __repr__(self):
        return f'<RecommendedRecipe by Admin {self.admin_id} for Recipe {self.recipe_id}>'
    def serialize(self):
        return {
            "id": self.id,
            "admin_id": self.admin_id,
            "admin_email": self.admin.email,
            "recipe_id": self.recipe_id,
            "recipe_title": self.recipe.title,
            "recipe_image": self.recipe.img_ilustrativa,  # Imagen ilustrativa
        }
    
class Chat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_1_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user_2_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    messages = db.relationship('Message', backref='chat', lazy=True)

    def __repr__(self):
        return f'<Chat {self.id}>'
    
    def serialize(self):
        return{
            "id": self.id,
            "user_1_id": self.user_1_id,
            "user_2_id": self.user_2_id
        }
    
class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    chat_id = db.Column(db.Integer, db.ForeignKey('chat.id'), nullable=False)
    sender = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content =db.Column(db.Text, nullable=False)
    date = db.Column(db.Date, nullable=False, default=datetime.now(timezone.utc))

    def __repr__(self):
        return f'<Message {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "chat_id": self.chat_id,
            "sender": self.sender,
            "content": self.content,
            "date": self.date
        }
    
    
class Vote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipe.id'), nullable=False)
    vote_type = db.Column(db.Integer, nullable=False)  # 1 para positivo, -1 para negativo
    __table_args__ = (db.UniqueConstraint('user_id', 'recipe_id', name='_user_recipe_vote_uc'),)

    def __repr__(self):
        return f'<Vote {self.vote_type} by User {self.user_id} on Recipe {self.recipe_id}>'

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "recipe_id": self.recipe_id,
            "vote_type": self.vote_type
        }