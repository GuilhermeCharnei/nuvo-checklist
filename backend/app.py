from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
import json

# Carregar variáveis de ambiente
load_dotenv()

# Inicializar Flask
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///nuvo_checklist.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = os.getenv('UPLOAD_FOLDER', './uploads')
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB max

# Criar pasta de uploads
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Inicializar extensões
CORS(app)
db = SQLAlchemy(app)

# Importar modelos
from models import Client, Environment, Piece, Material, Progress

# Importar parser de PDF
from pdf_parser import parse_pdf

# Criar tabelas do banco de dados (se não existirem)
with app.app_context():
    db.create_all()

# ==================== ROTAS ====================

@app.route('/', methods=['GET'])
def index():
    """Rota raiz - informações da API"""
    return jsonify({
        'name': 'NUVO Checklist API',
        'version': '1.0.0',
        'status': 'online',
        'endpoints': {
            'health': '/api/health',
            'clients': '/api/clients',
            'upload': '/api/upload (POST)'
        },
        'timestamp': datetime.utcnow().isoformat()
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'timestamp': datetime.utcnow().isoformat()
    })

@app.route('/api/clients', methods=['GET'])
def get_clients():
    """Retorna lista de todos os clientes"""
    archived = request.args.get('archived', 'false').lower() == 'true'
    clients = Client.query.filter_by(archived=archived).all()

    return jsonify([{
        'id': c.id,
        'name': c.name,
        'job_name': c.job_name,
        'created_at': c.created_at.isoformat(),
        'updated_at': c.updated_at.isoformat(),
        'archived': c.archived,
        'environment_count': len(c.environments),
        'progress': calculate_client_progress(c)
    } for c in clients])

@app.route('/api/clients/<int:client_id>', methods=['GET'])
def get_client(client_id):
    """Retorna detalhes de um cliente específico"""
    client = Client.query.get_or_404(client_id)

    environments = [{
        'id': env.id,
        'name': env.name,
        'date': env.date,
        'material': env.material,
        'pieces': get_environment_pieces(env),
        'materials': get_environment_materials(env),
        'progress': calculate_environment_progress(env)
    } for env in client.environments]

    return jsonify({
        'id': client.id,
        'name': client.name,
        'job_name': client.job_name,
        'created_at': client.created_at.isoformat(),
        'updated_at': client.updated_at.isoformat(),
        'archived': client.archived,
        'environments': environments,
        'progress': calculate_client_progress(client)
    })

@app.route('/api/upload', methods=['POST'])
def upload_pdf():
    """Upload e processa PDF"""
    if 'file' not in request.files:
        return jsonify({'error': 'Nenhum arquivo enviado'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'Arquivo sem nome'}), 400

    if not file.filename.lower().endswith('.pdf'):
        return jsonify({'error': 'Apenas arquivos PDF são permitidos'}), 400

    try:
        # Salvar arquivo temporariamente
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        # Processar PDF
        parsed_data = parse_pdf(filepath)

        # Salvar no banco de dados
        client = save_pdf_data(parsed_data)

        # Remover arquivo temporário
        os.remove(filepath)

        return jsonify({
            'success': True,
            'client_id': client.id,
            'message': f'PDF processado com sucesso! Cliente: {client.name}'
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/pieces/<int:piece_id>/progress', methods=['PUT'])
def update_piece_progress(piece_id):
    """Atualiza progresso de uma peça"""
    piece = Piece.query.get_or_404(piece_id)
    data = request.json

    progress = Progress.query.filter_by(piece_id=piece_id).first()
    if not progress:
        progress = Progress(piece_id=piece_id)
        db.session.add(progress)

    # Atualizar campos
    if 'assembled' in data:
        progress.assembled = data['assembled']
    if 'doors_status' in data:
        progress.doors_status = data['doors_status']  # 'placed', 'packed', None
    if 'shipped' in data:
        progress.shipped = data['shipped']
    if 'custom_checkpoints' in data:
        progress.custom_checkpoints = json.dumps(data['custom_checkpoints'])

    progress.updated_at = datetime.utcnow()

    db.session.commit()

    return jsonify({'success': True})

@app.route('/api/materials/<int:material_id>/progress', methods=['PUT'])
def update_material_progress(material_id):
    """Atualiza progresso de materiais (legs/hinges)"""
    material = Material.query.get_or_404(material_id)
    data = request.json

    if 'installed' in data:
        material.installed = data['installed']

    material.updated_at = datetime.utcnow()
    db.session.commit()

    return jsonify({'success': True})

@app.route('/api/clients/<int:client_id>/archive', methods=['PUT'])
def archive_client(client_id):
    """Arquiva ou desarquiva um cliente"""
    client = Client.query.get_or_404(client_id)
    data = request.json

    client.archived = data.get('archived', True)
    client.updated_at = datetime.utcnow()

    db.session.commit()

    return jsonify({'success': True})

# ==================== FUNÇÕES AUXILIARES ====================

def calculate_client_progress(client):
    """Calcula progresso total do cliente"""
    total_pieces = 0
    assembled = 0
    doors = 0
    shipped = 0

    for env in client.environments:
        for piece in env.pieces:
            total_pieces += 1
            if piece.progress:
                if piece.progress.assembled:
                    assembled += 1
                if piece.progress.doors_status:
                    doors += 1
                if piece.progress.shipped:
                    shipped += 1

    if total_pieces == 0:
        return {'total': 0, 'assembled': 0, 'doors': 0, 'shipped': 0}

    return {
        'total': total_pieces,
        'assembled': assembled,
        'assembled_percent': round((assembled / total_pieces) * 100),
        'doors': doors,
        'doors_percent': round((doors / total_pieces) * 100),
        'shipped': shipped,
        'shipped_percent': round((shipped / total_pieces) * 100)
    }

def calculate_environment_progress(environment):
    """Calcula progresso de um ambiente"""
    total = len(environment.pieces)
    if total == 0:
        return {'assembled': 0, 'doors': 0, 'shipped': 0}

    assembled = sum(1 for p in environment.pieces if p.progress and p.progress.assembled)
    doors = sum(1 for p in environment.pieces if p.progress and p.progress.doors_status)
    shipped = sum(1 for p in environment.pieces if p.progress and p.progress.shipped)

    return {
        'total': total,
        'assembled': f'{assembled}/{total}',
        'doors': f'{doors}/{total}',
        'shipped': f'{shipped}/{total}'
    }

def get_environment_pieces(environment):
    """Retorna peças agrupadas por tipo"""
    cabinets = []
    special = []
    loose = []

    for piece in environment.pieces:
        piece_data = {
            'id': piece.id,
            'cab_number': piece.cab_number,
            'name': piece.name,
            'width': piece.width,
            'height': piece.height,
            'depth': piece.depth,
            'finished': piece.finished,
            'progress': {
                'assembled': piece.progress.assembled if piece.progress else False,
                'doors_status': piece.progress.doors_status if piece.progress else None,
                'shipped': piece.progress.shipped if piece.progress else False,
                'custom_checkpoints': json.loads(piece.progress.custom_checkpoints) if piece.progress and piece.progress.custom_checkpoints else []
            }
        }

        if piece.type == 'cabinet':
            cabinets.append(piece_data)
        elif piece.type == 'special':
            special.append(piece_data)
        elif piece.type == 'loose':
            loose.append(piece_data)

    return {
        'cabinets': cabinets,
        'special': special,
        'loose': loose
    }

def get_environment_materials(environment):
    """Retorna materiais do ambiente"""
    materials = {
        'legs': [],
        'hinges': []
    }

    for material in environment.materials:
        material_data = {
            'id': material.id,
            'quantity': material.quantity,
            'description': material.description,
            'installed': material.installed
        }

        if material.type == 'legs':
            materials['legs'].append(material_data)
        elif material.type == 'hinges':
            materials['hinges'].append(material_data)

    return materials

def save_pdf_data(parsed_data):
    """Salva dados parseados do PDF no banco"""
    # Verificar se cliente já existe
    client = Client.query.filter_by(name=parsed_data['client_name']).first()

    if not client:
        client = Client(
            name=parsed_data['client_name'],
            job_name=parsed_data['job_name']
        )
        db.session.add(client)
    else:
        client.updated_at = datetime.utcnow()

    # Criar ambiente
    environment = Environment(
        client=client,
        name=parsed_data['environment_name'],
        date=parsed_data.get('date'),
        material=parsed_data.get('material')
    )
    db.session.add(environment)

    # Adicionar peças
    for piece_data in parsed_data['pieces']:
        piece = Piece(
            environment=environment,
            cab_number=piece_data['cab_number'],
            name=piece_data['name'],
            type=piece_data['type'],  # 'cabinet', 'special', 'loose'
            width=piece_data.get('width'),
            height=piece_data.get('height'),
            depth=piece_data.get('depth'),
            finished=piece_data.get('finished')
        )
        db.session.add(piece)

        # Criar registro de progresso inicial
        progress = Progress(piece=piece)
        db.session.add(progress)

    # Adicionar materiais
    for material_data in parsed_data.get('materials', []):
        material = Material(
            environment=environment,
            type=material_data['type'],  # 'legs', 'hinges'
            quantity=material_data['quantity'],
            description=material_data['description']
        )
        db.session.add(material)

    db.session.commit()

    return client

# ==================== MAIN ====================

if __name__ == '__main__':
    with app.app_context():
        db.create_all()

    app.run(
        host='0.0.0.0',
        port=int(os.getenv('PORT', 5000)),
        debug=os.getenv('FLASK_ENV') == 'development'
    )
