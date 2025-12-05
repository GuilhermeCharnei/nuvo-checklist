import pdfplumber
from pdf2image import convert_from_path
from PIL import Image
import re
import os
from datetime import datetime

def parse_pdf(pdf_path):
    """
    Processa PDF e extrai informações estruturadas

    Retorna:
    {
        'client_name': str,
        'job_name': str,
        'environment_name': str,
        'date': str,
        'material': str,
        'pieces': [
            {
                'cab_number': str,
                'name': str,
                'type': 'cabinet' | 'special' | 'loose',
                'width': str,
                'height': str,
                'depth': str,
                'finished': str
            }
        ],
        'materials': [
            {
                'type': 'legs' | 'hinges',
                'quantity': int,
                'description': str
            }
        ]
    }
    """

    result = {
        'client_name': '',
        'job_name': '',
        'environment_name': '',
        'date': None,
        'material': None,
        'pieces': [],
        'materials': []
    }

    with pdfplumber.open(pdf_path) as pdf:
        first_page = pdf.pages[0]

        # Extrair texto da primeira página
        text = first_page.extract_text()
        lines = text.split('\n')

        # Extrair informações do cabeçalho
        result['client_name'], result['job_name'], result['environment_name'] = extract_header_info(lines)

        # Detectar cores usando análise de imagem
        color_map = detect_colors_in_pdf(pdf_path)

        # Processar todas as páginas
        for page_num, page in enumerate(pdf.pages):
            # Extrair tabelas
            tables = page.extract_tables()

            if not tables:
                continue

            # Processar cada tabela
            for table in tables:
                # Pular cabeçalhos
                if not table or len(table) < 2:
                    continue

                # Identificar tipo de conteúdo da tabela
                if is_pieces_table(table):
                    pieces = parse_pieces_table(table, color_map, page_num)
                    result['pieces'].extend(pieces)

                elif is_materials_table(table):
                    materials = parse_materials_table(table)
                    result['materials'].extend(materials)

        # Extrair data e material se encontrados
        result['date'] = extract_date(lines)
        result['material'] = extract_material(lines)

    return result


def extract_header_info(lines):
    """Extrai nome do cliente, job e ambiente do cabeçalho"""
    client_name = ''
    job_name = ''
    environment_name = ''

    # Procurar por padrões típicos
    for line in lines[:10]:  # Primeiras 10 linhas
        # Exemplo: "GUTERRES CS 3090 TALL WALL SHIPPING LIST"
        if 'SHIPPING LIST' in line:
            parts = line.replace('SHIPPING LIST', '').strip().split()

            # Tentar extrair nome do cliente (geralmente primeira palavra em maiúsculas)
            if len(parts) > 0:
                client_name = parts[0]

            # Job name é geralmente algo como "CS 3090" ou "4 DP 3144"
            if len(parts) > 2:
                job_name = ' '.join(parts[:3])

            # Ambiente é o resto
            if len(parts) > 3:
                environment_name = ' '.join(parts[3:])

        # Exemplo: "PROD JR" ou "PROD"
        if 'PROD' in line and not job_name:
            job_name = line.strip()

    # Se não encontrou, usar nome do arquivo
    if not client_name:
        client_name = "Cliente Desconhecido"

    if not environment_name:
        environment_name = "Ambiente Principal"

    return client_name, job_name, environment_name


def detect_colors_in_pdf(pdf_path):
    """
    Detecta cores de fundo em cada linha do PDF
    Retorna mapa: {page_num: {row_num: 'blue'|'yellow'|'none'}}
    """
    color_map = {}

    try:
        # Converter PDF em imagens
        images = convert_from_path(pdf_path, dpi=150)

        for page_num, image in enumerate(images):
            color_map[page_num] = {}

            # Analisar cada linha da imagem
            width, height = image.size
            rows = 50  # Dividir em ~50 linhas
            row_height = height // rows

            for row in range(rows):
                y_start = row * row_height
                y_end = min((row + 1) * row_height, height)

                # Extrair faixa da imagem
                region = image.crop((0, y_start, width, y_end))

                # Detectar cor predominante
                color = detect_predominant_color(region)
                color_map[page_num][row] = color

    except Exception as e:
        print(f"Erro ao detectar cores: {e}")
        # Se falhar, retornar mapa vazio

    return color_map


def detect_predominant_color(image_region):
    """Detecta se região tem fundo azul, amarelo ou nenhum"""
    # Converter para RGB
    rgb_image = image_region.convert('RGB')

    # Amostrar pixels
    pixels = list(rgb_image.getdata())

    # Contar cores
    blue_count = 0
    yellow_count = 0

    for r, g, b in pixels:
        # Azul: mais azul que vermelho/verde
        if b > 150 and b > r + 30 and b > g + 30:
            blue_count += 1

        # Amarelo: alto vermelho e verde, baixo azul
        elif r > 200 and g > 200 and b < 150:
            yellow_count += 1

    total = len(pixels)

    # Se mais de 20% dos pixels são azuis
    if blue_count > total * 0.2:
        return 'blue'

    # Se mais de 20% são amarelos
    if yellow_count > total * 0.2:
        return 'yellow'

    return 'none'


def is_pieces_table(table):
    """Verifica se tabela contém peças (tem colunas Cab#, Name, Width, etc)"""
    if not table or len(table) < 2:
        return False

    header = ' '.join([str(cell) for cell in table[0] if cell]).upper()

    return any(keyword in header for keyword in ['CAB', 'NAME', 'WIDTH', 'HEIGHT', 'DEPTH'])


def is_materials_table(table):
    """Verifica se tabela contém materiais (Legs, Hinges, etc)"""
    if not table or len(table) < 2:
        return False

    text = ' '.join([str(cell) for cell in table[0] if cell]).upper()

    return any(keyword in text for keyword in ['LEGS', 'HINGES', 'HARDWARE', 'MATERIALS'])


def parse_pieces_table(table, color_map, page_num):
    """Processa tabela de peças"""
    pieces = []

    # Identificar índices das colunas
    header = table[0]
    col_indices = identify_column_indices(header)

    # Processar cada linha (pular cabeçalho)
    for row_num, row in enumerate(table[1:], start=1):
        if not row or len(row) < 3:
            continue

        # Detectar cor de fundo
        color = color_map.get(page_num, {}).get(row_num, 'none')

        # Extrair dados
        cab_number = safe_get(row, col_indices.get('cab', 0))
        name = safe_get(row, col_indices.get('name', 1))
        width = safe_get(row, col_indices.get('width', 2))
        height = safe_get(row, col_indices.get('height', 3))
        depth = safe_get(row, col_indices.get('depth', 4))
        finished = safe_get(row, col_indices.get('finished', 5))

        # Pular linhas vazias ou totais
        if not name or 'TOTAL' in name.upper():
            continue

        # Determinar tipo da peça
        piece_type = determine_piece_type(name, color)

        piece = {
            'cab_number': cab_number,
            'name': name,
            'type': piece_type,
            'width': width,
            'height': height,
            'depth': depth,
            'finished': finished
        }

        pieces.append(piece)

    return pieces


def parse_materials_table(table):
    """Processa tabela de materiais"""
    materials = []

    for row in table[1:]:  # Pular cabeçalho
        if not row:
            continue

        text = ' '.join([str(cell) for cell in row if cell]).strip()

        if not text:
            continue

        # Detectar Legs
        if 'leg' in text.lower() and any(char.isdigit() for char in text):
            quantity = extract_quantity(text)
            materials.append({
                'type': 'legs',
                'quantity': quantity,
                'description': text
            })

        # Detectar Hinges
        elif 'hinge' in text.lower() or 'salice' in text.lower():
            quantity = extract_quantity(text)
            materials.append({
                'type': 'hinges',
                'quantity': quantity,
                'description': text
            })

    return materials


def identify_column_indices(header):
    """Identifica índices das colunas baseado no cabeçalho"""
    indices = {}

    for i, cell in enumerate(header):
        if not cell:
            continue

        cell_upper = str(cell).upper()

        if 'CAB' in cell_upper:
            indices['cab'] = i
        elif 'NAME' in cell_upper:
            indices['name'] = i
        elif 'WIDTH' in cell_upper or 'W' == cell_upper:
            indices['width'] = i
        elif 'HEIGHT' in cell_upper or 'H' == cell_upper:
            indices['height'] = i
        elif 'DEPTH' in cell_upper or 'D' == cell_upper:
            indices['depth'] = i
        elif 'FINISH' in cell_upper:
            indices['finished'] = i

    return indices


def determine_piece_type(name, color):
    """Determina tipo da peça baseado em nome e cor"""
    # Peça Especial: Amarelo com @
    if color == 'yellow' and '@' in name:
        return 'special'

    # Gabinete: Azul sem @
    if color == 'blue' and '@' not in name:
        return 'cabinet'

    # Peça Avulsa: Sem cor
    return 'loose'


def safe_get(row, index, default=''):
    """Obtém valor de forma segura"""
    try:
        return str(row[index]).strip() if row[index] else default
    except (IndexError, TypeError):
        return default


def extract_quantity(text):
    """Extrai quantidade numérica do texto"""
    match = re.search(r'(\d+)\s*x', text, re.IGNORECASE)
    if match:
        return int(match.group(1))

    # Procurar número no início
    match = re.search(r'^(\d+)', text)
    if match:
        return int(match.group(1))

    return 1


def extract_date(lines):
    """Extrai data do PDF"""
    for line in lines:
        # Formato: MM/DD/YYYY ou DD/MM/YYYY
        match = re.search(r'(\d{1,2}/\d{1,2}/\d{4})', line)
        if match:
            return match.group(1)

    return None


def extract_material(lines):
    """Extrai material (ex: TAFISA C1) do PDF"""
    for line in lines:
        if 'TAFISA' in line.upper() or 'MATERIAL' in line.upper():
            return line.strip()

    return None
