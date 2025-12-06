import json
import uuid
from typing import Dict, Any, List
from datetime import datetime, timedelta

"""
Онлайн режим для игры Мурино.
Позволяет игрокам создавать комнаты, подключаться к ним и соревноваться в реальном времени.
"""

rooms: Dict[str, Dict[str, Any]] = {}

ROOM_TIMEOUT = 3600

def clean_old_rooms():
    """Удаляет комнаты старше 1 часа"""
    current_time = datetime.now()
    rooms_to_delete = []
    
    for room_id, room in rooms.items():
        room_time = datetime.fromisoformat(room['created_at'])
        if current_time - room_time > timedelta(seconds=ROOM_TIMEOUT):
            rooms_to_delete.append(room_id)
    
    for room_id in rooms_to_delete:
        del rooms[room_id]

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Обрабатывает запросы для онлайн режима игры Мурино.
    Поддерживает создание комнат, подключение игроков, обновление состояния.
    """
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Session-Id',
                'Access-Control-Max-Age': '86400'
            },
            'isBase64Encoded': False,
            'body': ''
        }
    
    clean_old_rooms()
    
    if method == 'POST':
        body = json.loads(event.get('body', '{}'))
        action = body.get('action')
        
        if action == 'create_room':
            room_id = str(uuid.uuid4())[:8]
            player_name = body.get('player_name', 'Игрок')
            
            rooms[room_id] = {
                'id': room_id,
                'host': player_name,
                'players': [{'name': player_name, 'ready': False, 'score': 0}],
                'status': 'waiting',
                'created_at': datetime.now().isoformat(),
                'max_players': 2
            }
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({
                    'success': True,
                    'room': rooms[room_id]
                })
            }
        
        elif action == 'join_room':
            room_id = body.get('room_id')
            player_name = body.get('player_name', 'Игрок')
            
            if room_id not in rooms:
                return {
                    'statusCode': 404,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({
                        'success': False,
                        'error': 'Комната не найдена'
                    })
                }
            
            room = rooms[room_id]
            
            if len(room['players']) >= room['max_players']:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({
                        'success': False,
                        'error': 'Комната заполнена'
                    })
                }
            
            room['players'].append({
                'name': player_name,
                'ready': False,
                'score': 0
            })
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({
                    'success': True,
                    'room': room
                })
            }
        
        elif action == 'update_ready':
            room_id = body.get('room_id')
            player_name = body.get('player_name')
            ready = body.get('ready', False)
            
            if room_id not in rooms:
                return {
                    'statusCode': 404,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({
                        'success': False,
                        'error': 'Комната не найдена'
                    })
                }
            
            room = rooms[room_id]
            
            for player in room['players']:
                if player['name'] == player_name:
                    player['ready'] = ready
                    break
            
            all_ready = all(p['ready'] for p in room['players']) and len(room['players']) >= 2
            if all_ready:
                room['status'] = 'playing'
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({
                    'success': True,
                    'room': room
                })
            }
        
        elif action == 'update_score':
            room_id = body.get('room_id')
            player_name = body.get('player_name')
            score = body.get('score', 0)
            
            if room_id not in rooms:
                return {
                    'statusCode': 404,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({
                        'success': False,
                        'error': 'Комната не найдена'
                    })
                }
            
            room = rooms[room_id]
            
            for player in room['players']:
                if player['name'] == player_name:
                    player['score'] = score
                    break
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({
                    'success': True,
                    'room': room
                })
            }
    
    elif method == 'GET':
        params = event.get('queryStringParameters', {})
        room_id = params.get('room_id')
        
        if room_id:
            if room_id not in rooms:
                return {
                    'statusCode': 404,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({
                        'success': False,
                        'error': 'Комната не найдена'
                    })
                }
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({
                    'success': True,
                    'room': rooms[room_id]
                })
            }
        else:
            available_rooms = [
                room for room in rooms.values() 
                if room['status'] == 'waiting' and len(room['players']) < room['max_players']
            ]
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({
                    'success': True,
                    'rooms': available_rooms
                })
            }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'success': False,
            'error': 'Метод не поддерживается'
        })
    }
