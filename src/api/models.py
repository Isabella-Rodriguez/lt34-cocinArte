from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone
db = SQLAlchemy()
import json

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }
    

class Recipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), nullable=False)
    ingredientes = db.Column(db.JSON, nullable=False)
    pasos = db.Column(db.String, nullable=False)
    fecha_publicacion= db.Column(db.DateTime, nullable=False, default=lambda : datetime.now(timezone.utc))
    img_ilustrativa= db.Column(db.String(200), nullable=True)

    def __repr__(self):
        return f'<User {self.title}'
    
    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'ingredientes': json.loads(self.ingredientes),
            'pasos': self.pasos,
            'fecha_publicacion': self.fecha_publicacion,
            'img_ilustrativa': self.img_ilustrativa
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
