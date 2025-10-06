// =============================================================================
// МОБИЛЬНОЕ МЕНЮ
// =============================================================================

// Получаем элементы мобильного меню
const hamburger = document.querySelector('.hamburger');  // Кнопка-гамбургер
const navMenu = document.querySelector('.nav-menu');     // Список меню

// Обработчик клика по кнопке-гамбургеру
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');  // Переключаем активное состояние кнопки
    navMenu.classList.toggle('active');    // Показываем/скрываем меню
});

// Закрытие мобильного меню при клике на любую ссылку
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');  // Убираем активное состояние кнопки
        navMenu.classList.remove('active');    // Скрываем меню
    });
});

// =============================================================================
// ПЛАВНАЯ ПРОКРУТКА
// =============================================================================

// Функция для плавной прокрутки к указанной секции страницы
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);  // Находим элемент по ID
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',  // Плавная анимация прокрутки
            block: 'start'       // Позиционируем элемент в начале видимой области
        });
    }
}

// =============================================================================
// МОДАЛЬНОЕ ОКНО ЗАПИСИ НА ПРИЕМ
// =============================================================================

// Получаем элементы модального окна
const modal = document.getElementById('bookingModal');  // Само модальное окно
const closeBtn = document.querySelector('.close');      // Кнопка закрытия

// Функция для открытия модального окна записи
function openBookingModal() {
    modal.style.display = 'block';                    // Показываем модальное окно
    document.body.classList.add('modal-open');        // Блокируем прокрутку страницы
}

// Функция для закрытия модального окна записи
function closeBookingModal() {
    modal.style.display = 'none';                     // Скрываем модальное окно
    document.body.classList.remove('modal-open');     // Разрешаем прокрутку страницы
}

// Обработчик клика по кнопке закрытия
closeBtn.addEventListener('click', closeBookingModal);

// Закрытие модального окна при клике вне его области
window.addEventListener('click', (e) => {
    if (e.target === modal) {  // Если клик был по фону модального окна
        closeBookingModal();
    }
});

// Закрытие модального окна по нажатию клавиши Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        closeBookingModal();
    }
});

// =============================================================================
// ФУНКЦИИ ЗАПИСИ К МАСТЕРУ
// =============================================================================

// Функция для записи к конкретному мастеру (вызывается с кнопки "Записаться" у мастера)
function bookMaster(masterId) {
    openBookingModal();  // Открываем модальное окно
    const masterSelect = document.getElementById('masterSelect');  // Находим селект выбора мастера
    if (masterSelect) {
        masterSelect.value = masterId;  // Устанавливаем выбранного мастера
    }
}

// Функция для записи на конкретную услугу (вызывается с кнопки "Записаться" у услуги)
function bookService(serviceName) {
    openBookingModal();  // Открываем модальное окно
    const serviceSelect = document.getElementById('serviceSelect');  // Находим селект выбора услуги
    if (serviceSelect) {
        serviceSelect.value = serviceName;  // Устанавливаем выбранную услугу
    }
}

// =============================================================================
// ОБРАБОТКА ФОРМЫ ЗАПИСИ НА ПРИЕМ
// =============================================================================

// Обработчик отправки формы записи
document.getElementById('bookingForm').addEventListener('submit', async (e) => {
    e.preventDefault();  // Предотвращаем стандартную отправку формы
    
    // Собираем данные из формы
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),           // Имя клиента
        phone: formData.get('phone'),         // Номер телефона
        master_id: formData.get('master_id'), // ID выбранного мастера
        service: formData.get('service'),     // Выбранная услуга
        date: formData.get('date'),           // Дата записи
        time: formData.get('time'),           // Время записи
        comment: formData.get('comment')      // Комментарий клиента
    };
    
    // Валидация обязательных полей
    if (!data.name || !data.phone || !data.master_id || !data.service || !data.date || !data.time) {
        alert('Пожалуйста, заполните все обязательные поля');
        return;
    }
    
    // Валидация номера телефона (немецкий формат)
    const phoneRegex = /^\+49\s?\d{2,3}\s?\d{6,8}$/;
    if (!phoneRegex.test(data.phone)) {
        alert('Пожалуйста, введите корректный номер телефона в формате +49 30 12345678');
        return;
    }
    
    try {
        // Отправляем данные на сервер
        const response = await fetch('/book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',  // Указываем тип отправляемых данных
            },
            body: JSON.stringify(data)  // Преобразуем объект в JSON
        });
        
        // Получаем ответ от сервера
        const result = await response.json();
        
        if (result.status === 'success') {
            alert(result.message);        // Показываем сообщение об успехе
            closeBookingModal();          // Закрываем модальное окно
            e.target.reset();             // Очищаем форму
        } else {
            alert(result.message || 'Произошла ошибка. Попробуйте еще раз.');
        }
    } catch (error) {
        console.error('Error:', error);  // Логируем ошибку в консоль
        alert('Произошла ошибка. Попробуйте еще раз.');
    }
});

// =============================================================================
// ОБРАБОТКА ФОРМЫ КОНТАКТОВ
// =============================================================================

// Обработчик отправки формы контактов (пока только имитация)
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();  // Предотвращаем стандартную отправку формы
    alert('Спасибо за заявку! Мы свяжемся с вами в ближайшее время.');
    e.target.reset();   // Очищаем форму
});

// =============================================================================
// ИНТЕРАКТИВНЫЕ ЭФФЕКТЫ
// =============================================================================

// Изменение прозрачности навигации при прокрутке страницы
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {  // Если прокрутили больше 100px
        navbar.style.background = 'rgba(26, 26, 26, 0.98)';  // Делаем более непрозрачным
    } else {
        navbar.style.background = 'rgba(26, 26, 26, 0.95)';  // Возвращаем исходную прозрачность
    }
});

// Настройки для анимации появления элементов при прокрутке
const observerOptions = {
    threshold: 0.1,                    // Элемент считается видимым при 10% видимости
    rootMargin: '0px 0px -50px 0px'    // Смещение области видимости
};

// Создаем наблюдатель для анимации появления элементов
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {  // Если элемент становится видимым
            entry.target.style.opacity = '1';           // Делаем элемент полностью видимым
            entry.target.style.transform = 'translateY(0)';  // Убираем смещение
        }
    });
}, observerOptions);

// Настройка анимации для элементов при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Находим все элементы, которые должны анимироваться
    const animatedElements = document.querySelectorAll('.master-card, .service-card, .about-text, .about-image');
    
    // Настраиваем начальное состояние элементов и подключаем наблюдатель
    animatedElements.forEach(el => {
        el.style.opacity = '0';                    // Делаем элемент невидимым
        el.style.transform = 'translateY(30px)';   // Смещаем элемент вниз
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';  // Настраиваем анимацию
        observer.observe(el);                      // Подключаем наблюдатель к элементу
    });
});

// Плавное появление счетчиков в секции "О нас"
function animateCounters() {
    const counters = document.querySelectorAll('.stat h4');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        const increment = target / 50;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + '+';
            }
        };
        
        updateCounter();
    });
}

// Запуск анимации счетчиков при появлении секции "О нас"
const aboutSection = document.querySelector('.about');
const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            aboutObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (aboutSection) {
    aboutObserver.observe(aboutSection);
}

// Добавление эффекта печатания для заголовка
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Инициализация эффекта печатания для главного заголовка
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.innerHTML;
        typeWriter(heroTitle, originalText, 50);
    }
});

// Добавление hover эффектов для карточек
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.master-card, .service-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Валидация форм
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#e74c3c';
            isValid = false;
        } else {
            input.style.borderColor = '#e9ecef';
        }
    });
    
    return isValid;
}

// Добавление валидации к формам
document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            if (!validateForm(form)) {
                e.preventDefault();
                alert('Пожалуйста, заполните все обязательные поля');
            }
        });
    });
});

// Добавление эффекта параллакса для hero секции
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Маска для ввода телефона (немецкий формат)
// =============================================================================
// ФУНКЦИИ ВАЛИДАЦИИ И ФОРМАТИРОВАНИЯ
// =============================================================================

// Функция для автоматического форматирования номера телефона в немецком формате
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');  // Убираем все нецифровые символы
    
    if (value.startsWith('49')) {  // Если номер начинается с 49 (код Германии)
        if (value.length >= 2) {
            input.value = '+49';
        }
        if (value.length >= 4) {
            input.value = '+49 ' + value.slice(2, 5);  // Добавляем пробел после кода страны
        }
        if (value.length >= 7) {
            input.value = '+49 ' + value.slice(2, 5) + ' ' + value.slice(5);  // Добавляем пробел в середине номера
        }
    } else if (value.startsWith('0')) {  // Если номер начинается с 0 (внутренний формат)
        // Заменяем 0 на +49 для международного формата
        if (value.length >= 1) {
            input.value = '+49 ' + value.slice(1);
        }
    }
}

// Инициализация всех функций при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    console.log('BarberTime - сайт загружен успешно!');
    
    // Добавление класса для плавной анимации
    document.body.classList.add('loaded');
    
    // Добавление маски для полей телефона
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', () => formatPhoneNumber(input));
        input.addEventListener('keydown', (e) => {
            // Разрешаем только цифры, +, (, ), -, пробел и управляющие клавиши
            if (!/[0-9+\-\(\)\s]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
            }
        });
    });
});
