# =============================================================================
# ИМПОРТЫ И НАСТРОЙКА ПРИЛОЖЕНИЯ
# =============================================================================

# Импортируем необходимые модули Flask для создания веб-приложения
from flask import Flask, render_template, request, jsonify
# SQLAlchemy для работы с базой данных
from flask_sqlalchemy import SQLAlchemy
# datetime для работы с датами и временем
from datetime import datetime
# os для работы с операционной системой
import os

# Создаем экземпляр Flask приложения
app = Flask(__name__)

# Настраиваем подключение к базе данных
# Для продакшена используем PostgreSQL, для разработки SQLite
if os.environ.get('DATABASE_URL'):
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///barbershop.db'

# Отключаем отслеживание изменений для оптимизации производительности
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Настройка секретного ключа для сессий
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')

# Инициализируем SQLAlchemy для работы с базой данных
db = SQLAlchemy(app)

# =============================================================================
# ДАННЫЕ МАСТЕРОВ БАРБЕРШОПА
# =============================================================================

# Список мастеров с их информацией для отображения на сайте
# Каждый мастер имеет уникальный ID, имя, специализацию, опыт работы и цены
masters = [
    {
        'id': 1,  # Уникальный идентификатор мастера
        'name': 'Александр "Бритва" Петров',  # Имя и псевдоним мастера
        'specialty': 'Классические стрижки и бритье',  # Специализация мастера
        'experience': '8 лет',  # Опыт работы
        'price_range': '1500-2500₽',  # Диапазон цен за услуги
        'image': 'master1.jpg',  # Файл с фотографией мастера
        'description': 'Мастер классических мужских стрижек с 8-летним опытом. Специализируется на британском стиле и традиционном бритье.'
    },
    {
        'id': 2,
        'name': 'Дмитрий "Стиль" Козлов',
        'specialty': 'Современные стрижки и укладки',
        'experience': '6 лет',
        'price_range': '1200-2000₽',
        'image': 'master2.jpg',
        'description': 'Эксперт в области современных трендов. Создает стильные образы для любого возраста и типа волос.'
    },
    {
        'id': 3,
        'name': 'Михаил "Борода" Соколов',
        'specialty': 'Уход за бородой и усами',
        'experience': '10 лет',
        'price_range': '800-1500₽',
        'image': 'master3.jpg',
        'description': 'Профессионал по уходу за бородой и усами. Мастер сложных форм и стилей бороды.'
    }
]

# =============================================================================
# МОДЕЛЬ БАЗЫ ДАННЫХ ДЛЯ КЛИЕНТОВ
# =============================================================================

# Класс Client представляет таблицу в базе данных для хранения информации о записях клиентов
class Client(db.Model):
    # Первичный ключ - уникальный идентификатор записи
    id = db.Column(db.Integer, primary_key=True)
    # Имя клиента (обязательное поле, максимум 100 символов)
    name = db.Column(db.String(50), nullable=False)
    # Номер телефона клиента (обязательное поле, максимум 20 символов)
    phone = db.Column(db.String(20), nullable=False)
    # ID мастера, к которому записан клиент (обязательное поле)
    master_id = db.Column(db.Integer, nullable=False)
    # Название услуги, которую заказал клиент (обязательное поле)
    service = db.Column(db.String(100), nullable=False)
    # Дата записи (обязательное поле)
    date = db.Column(db.String(20), nullable=False)
    # Время записи (обязательное поле)
    time = db.Column(db.String(10), nullable=False)
    # Комментарий клиента (необязательное поле)
    comment = db.Column(db.Text)
    # Дата и время создания записи (автоматически устанавливается при создании)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    # Статус записи: pending (ожидает), confirmed (подтверждена), completed (выполнена), cancelled (отменена)
    status = db.Column(db.String(20), default='pending')

    # Метод для преобразования объекта в словарь (для JSON API)
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'phone': self.phone,
            'master_id': self.master_id,
            'service': self.service,
            'date': self.date,
            'time': self.time,
            'comment': self.comment,
            'created_at': self.created_at.isoformat(),
            'status': self.status
        }

# =============================================================================
# СПИСОК УСЛУГ БАРБЕРШОПА
# =============================================================================

# Список услуг с ценами и продолжительностью для отображения на сайте
services = [
    {'name': 'Мужская стрижка', 'price': '1500₽', 'duration': '45 мин'},  # Классическая мужская стрижка
    {'name': 'Стрижка + Бритье', 'price': '2500₽', 'duration': '60 мин'},  # Комплексная услуга
    {'name': 'Укладка волос', 'price': '800₽', 'duration': '30 мин'},  # Укладка и стайлинг
    {'name': 'Стрижка бороды', 'price': '1000₽', 'duration': '30 мин'},  # Формирование бороды
    {'name': 'Комплексный уход', 'price': '3500₽', 'duration': '90 мин'},  # Полный уход
    {'name': 'Детская стрижка', 'price': '1000₽', 'duration': '30 мин'}  # Стрижка для детей
]

# =============================================================================
# МАРШРУТЫ (ROUTES) ПРИЛОЖЕНИЯ
# =============================================================================

# Главная страница сайта - отображает информацию о барбершопе, мастерах и услугах
@app.route("/")
def home():
    # Передаем данные о мастерах и услугах в шаблон для отображения
    return render_template("index.html", masters=masters, services=services)

# Обработка записи на прием - принимает POST запросы с данными формы
@app.route("/book", methods=['POST'])
def book_appointment():
    try:
        # Получаем данные из JSON запроса
        data = request.get_json()
        
        # Создаем новую запись клиента в базе данных
        client = Client(
            name=data.get('name'),  # Имя клиента
            phone=data.get('phone'),  # Номер телефона
            master_id=int(data.get('master_id')),  # ID выбранного мастера
            service=data.get('service'),  # Выбранная услуга
            date=data.get('date'),  # Дата записи
            time=data.get('time'),  # Время записи
            comment=data.get('comment', '')  # Комментарий (по умолчанию пустая строка)
        )
        
        # Добавляем запись в базу данных и сохраняем изменения
        db.session.add(client)
        db.session.commit()
        
        # Возвращаем успешный ответ клиенту
        return jsonify({
            'status': 'success', 
            'message': 'Запись успешно создана! Мы свяжемся с вами по указанному номеру телефона  для подтверждения.',
            'booking_id': client.id  # ID созданной записи
        })
    except Exception as e:
        # В случае ошибки откатываем изменения в базе данных
        db.session.rollback()
        # Возвращаем сообщение об ошибке
        return jsonify({
            'status': 'error', 
            'message': 'Произошла ошибка при создании записи. Попробуйте еще раз.'
        }), 500

# Страница администратора - отображает все записи клиентов
@app.route("/admin")
def admin():
    # Получаем все записи клиентов, отсортированные по дате создания (новые сверху)
    clients = Client.query.order_by(Client.created_at.desc()).all()
    # Передаем данные клиентов и мастеров в шаблон админ-панели
    return render_template("admin.html", clients=clients, masters=masters)

# API для получения списка всех клиентов в формате JSON
@app.route("/api/clients")
def get_clients():
    # Получаем все записи клиентов
    clients = Client.query.order_by(Client.created_at.desc()).all()
    # Преобразуем каждую запись в словарь и возвращаем как JSON
    return jsonify([client.to_dict() for client in clients])

# API для обновления статуса записи клиента
@app.route("/api/clients/<int:client_id>/status", methods=['PUT'])
def update_client_status(client_id):
    try:
        # Получаем данные из JSON запроса
        data = request.get_json()
        # Находим клиента по ID или возвращаем 404 ошибку
        client = Client.query.get_or_404(client_id)
        # Обновляем статус записи
        client.status = data.get('status', client.status)
        # Сохраняем изменения в базе данных
        db.session.commit()
        # Возвращаем успешный ответ
        return jsonify({'status': 'success'})
    except Exception as e:
        # В случае ошибки возвращаем сообщение об ошибке
        return jsonify({'status': 'error', 'message': str(e)}), 500

# =============================================================================
# ИНИЦИАЛИЗАЦИЯ БАЗЫ ДАННЫХ И ЗАПУСК ПРИЛОЖЕНИЯ
# =============================================================================

# Создание всех таблиц в базе данных при первом запуске приложения
# Это создаст таблицу clients с полями, определенными в модели Client
with app.app_context():
    db.create_all()

# Запуск Flask приложения
# В продакшене debug=False, в разработке debug=True
if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') != 'production'
    app.run(host='0.0.0.0', port=port, debug=debug)
