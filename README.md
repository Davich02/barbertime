# BarberTime - Мужская парикмахерская

Веб-приложение для записи в барбершоп с современным дизайном.

## Особенности

- 🎨 Современный дизайн с черно-белым фоновым изображением
- 📱 Адаптивная верстка для всех устройств
- 👥 Информация о мастерах и услугах
- 📅 Система записи на прием
- 🔧 Админ-панель для управления записями

## Технологии

- **Backend**: Flask, SQLAlchemy
- **Frontend**: HTML5, CSS3, JavaScript
- **База данных**: SQLite (разработка), PostgreSQL (продакшен)

## Локальная разработка

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd snusapp
```

2. Создайте виртуальное окружение:
```bash
python3 -m venv venv
source venv/bin/activate  # На Windows: venv\Scripts\activate
```

3. Установите зависимости:
```bash
pip install -r requirements.txt
```

4. Запустите приложение:
```bash
python app.py
```

5. Откройте http://127.0.0.1:5000 в браузере

## Деплой на Render

### Автоматический деплой (рекомендуется)

1. **Подключите репозиторий к Render:**
   - Зайдите на [render.com](https://render.com)
   - Войдите в аккаунт или зарегистрируйтесь
   - Нажмите "New +" → "Web Service"
   - Подключите ваш GitHub репозиторий

2. **Настройте сервис:**
   - **Name**: `barbershop-app` (или любое другое имя)
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`

3. **Переменные окружения:**
   - `FLASK_ENV` = `production`
   - `SECRET_KEY` = (сгенерируйте случайную строку)
   - `PYTHON_VERSION` = `3.11.0`

4. **Деплой:**
   - Нажмите "Create Web Service"
   - Render автоматически задеплоит приложение

### Ручной деплой через render.yaml

1. **Создайте Blueprint:**
   - В Render Dashboard нажмите "New +" → "Blueprint"
   - Подключите репозиторий с файлом `render.yaml`

2. **Деплой:**
   - Render автоматически создаст сервис согласно конфигурации

### Деплой на Heroku (альтернатива)

1. Установите Heroku CLI
2. Войдите в аккаунт:
```bash
heroku login
```

3. Создайте приложение:
```bash
heroku create your-app-name
```

4. Добавьте PostgreSQL (опционально):
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

5. Установите переменные окружения:
```bash
heroku config:set SECRET_KEY=your-secret-key-here
heroku config:set FLASK_ENV=production
```

6. Деплой:
```bash
git add .
git commit -m "Initial commit"
git push heroku main
```

7. Откройте приложение:
```bash
heroku open
```

## Структура проекта

```
snusapp/
├── app.py                 # Основное приложение Flask
├── requirements.txt       # Зависимости Python
├── Procfile              # Конфигурация для деплоя
├── render.yaml           # Конфигурация для Render
├── .gitignore            # Игнорируемые файлы Git
├── README.md             # Документация
├── static/               # Статические файлы
│   ├── css/
│   │   └── style.css     # Стили CSS
│   ├── js/
│   │   └── script.js     # JavaScript
│   └── images/           # Изображения
├── templates/            # HTML шаблоны
│   ├── index.html        # Главная страница
│   └── admin.html        # Админ-панель
└── instance/             # База данных (локально)
    └── barbershop.db
```

## API Endpoints

- `GET /` - Главная страница
- `POST /book` - Запись на прием
- `GET /admin` - Админ-панель
- `GET /api/clients` - API для получения клиентов
- `PUT /api/clients/<id>/status` - Обновление статуса записи

## Лицензия

MIT License
