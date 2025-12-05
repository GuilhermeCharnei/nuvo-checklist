from datetime import datetime
from app import db

class Client(db.Model):
    """Modelo de Cliente"""
    __tablename__ = 'clients'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False, index=True)
    job_name = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    archived = db.Column(db.Boolean, default=False, index=True)

    # Relacionamentos
    environments = db.relationship('Environment', backref='client', lazy=True, cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Client {self.name}>'


class Environment(db.Model):
    """Modelo de Ambiente (TALL WALL, BENCH, etc)"""
    __tablename__ = 'environments'

    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    date = db.Column(db.String(50))
    material = db.Column(db.String(255))  # Ex: TAFISA C1
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relacionamentos
    pieces = db.relationship('Piece', backref='environment', lazy=True, cascade='all, delete-orphan')
    materials = db.relationship('Material', backref='environment', lazy=True, cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Environment {self.name}>'


class Piece(db.Model):
    """Modelo de Peça (Gabinete, Especial, Avulsa)"""
    __tablename__ = 'pieces'

    id = db.Column(db.Integer, primary_key=True)
    environment_id = db.Column(db.Integer, db.ForeignKey('environments.id'), nullable=False)
    cab_number = db.Column(db.String(50))  # Ex: 504, 101, N1
    name = db.Column(db.String(255), nullable=False)
    type = db.Column(db.String(20), nullable=False)  # 'cabinet', 'special', 'loose'
    width = db.Column(db.String(50))
    height = db.Column(db.String(50))
    depth = db.Column(db.String(50))
    finished = db.Column(db.String(20))  # 'Left', 'Right', 'Both', 'None'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relacionamentos
    progress = db.relationship('Progress', backref='piece', uselist=False, cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Piece {self.cab_number} - {self.name}>'


class Material(db.Model):
    """Modelo de Materiais (Legs, Hinges)"""
    __tablename__ = 'materials'

    id = db.Column(db.Integer, primary_key=True)
    environment_id = db.Column(db.Integer, db.ForeignKey('environments.id'), nullable=False)
    type = db.Column(db.String(20), nullable=False)  # 'legs', 'hinges'
    quantity = db.Column(db.Integer, nullable=False)
    description = db.Column(db.String(500), nullable=False)
    installed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<Material {self.type} - {self.quantity}x>'


class Progress(db.Model):
    """Modelo de Progresso de Peça"""
    __tablename__ = 'progress'

    id = db.Column(db.Integer, primary_key=True)
    piece_id = db.Column(db.Integer, db.ForeignKey('pieces.id'), nullable=False, unique=True)

    # Checkboxes padrão
    assembled = db.Column(db.Boolean, default=False)
    doors_status = db.Column(db.String(20))  # 'placed', 'packed', None
    shipped = db.Column(db.Boolean, default=False)

    # Checkpoints customizados (JSON)
    custom_checkpoints = db.Column(db.Text)  # JSON: [{"name": "QC Aprovado", "checked": true}, ...]

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<Progress piece_id={self.piece_id}>'
