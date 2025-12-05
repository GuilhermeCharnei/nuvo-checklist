#!/usr/bin/env python3
"""
Script para inicializar o banco de dados
"""

from app import app, db
from models import Client, Environment, Piece, Material, Progress

def init_database():
    """Cria todas as tabelas"""
    with app.app_context():
        print("Criando tabelas...")
        db.create_all()
        print("✓ Banco de dados inicializado com sucesso!")

        # Criar dados de exemplo (opcional)
        create_sample_data()

def create_sample_data():
    """Cria dados de exemplo para testes"""
    print("\nCriando dados de exemplo...")

    # Verificar se já existem dados
    if Client.query.first():
        print("⚠ Dados já existem. Pulando criação de exemplos.")
        return

    # Cliente 1: GUTERRES
    client1 = Client(
        name="GUTERRES",
        job_name="GUTERRES CS 3090 PROD JR"
    )
    db.session.add(client1)

    # Ambiente 1: BENCH
    env1 = Environment(
        client=client1,
        name="BENCH",
        date="11/21/2025",
        material="TAFISA C1"
    )
    db.session.add(env1)

    # Peças do BENCH
    piece1 = Piece(
        environment=env1,
        cab_number="504",
        name="Base Box",
        type="cabinet",
        width="56 3/4",
        height="7 1/4",
        depth="17 1/4",
        finished="Both"
    )
    db.session.add(piece1)

    progress1 = Progress(
        piece=piece1,
        assembled=True,
        doors_status="placed",
        shipped=False
    )
    db.session.add(progress1)

    piece2 = Piece(
        environment=env1,
        cab_number="507",
        name="BASE TOE v3",
        type="cabinet",
        width="48 5/4",
        height="5",
        depth="9 1/4"
    )
    db.session.add(piece2)

    progress2 = Progress(
        piece=piece2,
        assembled=True,
        doors_status=None,
        shipped=False
    )
    db.session.add(progress2)

    # Material: Legs
    material1 = Material(
        environment=env1,
        type="legs",
        quantity=8,
        description="8x Hafele Axilo Square (Press Fit) 4\"",
        installed=True
    )
    db.session.add(material1)

    # Material: Hinges
    material2 = Material(
        environment=env1,
        type="hinges",
        quantity=11,
        description="11x Salice 110° Opening Angle, Silentia+(329.15.430)",
        installed=False
    )
    db.session.add(material2)

    # Cliente 2: GALLITO
    client2 = Client(
        name="GALLITO",
        job_name="GALLITO 4 DP 3144 PROD"
    )
    db.session.add(client2)

    env2 = Environment(
        client=client2,
        name="CUSTOM BAR",
        date="11/26/2025"
    )
    db.session.add(env2)

    db.session.commit()

    print("✓ Dados de exemplo criados com sucesso!")
    print(f"  - Clientes: {Client.query.count()}")
    print(f"  - Ambientes: {Environment.query.count()}")
    print(f"  - Peças: {Piece.query.count()}")
    print(f"  - Materiais: {Material.query.count()}")

if __name__ == '__main__':
    init_database()
