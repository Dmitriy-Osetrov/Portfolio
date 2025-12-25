// 1. Плавная прокрутка к якорям
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // -80px чтобы учесть шапку
                behavior: 'smooth'
            });
        }
    });
});



// 2. Анимация появления элементов при скролле
function animateOnScroll() {
    const elements = document.querySelectorAll('.concept-card, .project, .intro');
    
    elements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if(elementTop < windowHeight - 100) {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }
    });
}

// Начальные стили для анимации
document.querySelectorAll('.concept-card, .project, .intro').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
});

// Запускаем при загрузке и при скролле
window.addEventListener('load', animateOnScroll);
window.addEventListener('scroll', animateOnScroll);



// 3. Простая модальная галерея
document.querySelectorAll('.gallery-image').forEach(imgContainer => {
    imgContainer.addEventListener('click', function() {
        const imgSrc = this.querySelector('img').src;
        const imgAlt = this.querySelector('img').alt;
        
        // Создаём модальное окно
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <img src="${imgSrc}" alt="${imgAlt}">
                <p>${imgAlt}</p>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Закрытие по клику на крестик или вне картинки
        modal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if(e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    });
});



// 4. Случайный факт в консоли (пасхалка)
const conceptFacts = [
    "Концепт 'Милитари × Сад' родился из наблюдения, как мох прорастает сквозь асфальт.",
    "В 'Киберпанк × Брутализм' технология не кричит, а шепчет из-за бетона.",
    "Философия тонального кроя: цвет должен не контрастировать, а вести диалог.",
    "Настоящий люкс — это когда технология пошива скрыта, а не выставлена напоказ.",
    "Пост-стратегический гардероб: одежда как доспехи, но для внутренней устойчивости."
];

console.log(`%c💡 Концептуальная пасхалка: ${conceptFacts[Math.floor(Math.random() * conceptFacts.length)]}`, 
    'background: linear-gradient(135deg, #7b6cb3, #5d4a9a); color: white; padding: 10px; border-radius: 5px; font-weight: bold;');



// 5. Индикатор прогресса прокрутки
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = `${scrolled}%`;
});


// ========== ОСНОВНАЯ СИСТЕМА ТЕМ ==========
const themeController = {
    currentTheme: null,
    themes: {
        default: '', // Исходная лавандовая тема
        nature: 'theme-nature', // Для проекта Military × Garden
        urban: 'theme-urban'    // Для проекта Cyberpunk × Brutalism
    },

    // Функция смены темы
    setTheme(themeName) {
        const body = document.body;
        const newTheme = this.themes[themeName];

        // Удаляем все классы тем
        Object.values(this.themes).forEach(themeClass => {
            if(themeClass) body.classList.remove(themeClass);
        });

        // Если тема существует и она не текущая — применяем
        if (newTheme && this.currentTheme !== newTheme) {
            body.classList.add(newTheme);
            this.currentTheme = newTheme;
            console.log(`🎨 Тема переключена на: ${themeName}`);
        }
    },

    // Определяем, какая тема должна быть активна при скролле
    updateThemeOnScroll() {
        const projects = {
            nature: document.getElementById('project-military'),
            urban: document.getElementById('project-cyberpunk')
        };

        const scrollPosition = window.scrollY + (window.innerHeight / 3);

        // Проверяем, какой проект сейчас ближе к центру экрана
        let closestProject = null;
        let minDistance = Infinity;

        for (const [theme, element] of Object.entries(projects)) {
            if (element) {
                const rect = element.getBoundingClientRect();
                const distance = Math.abs(rect.top + (rect.height / 2) - (window.innerHeight / 2));

                if (distance < minDistance) {
                    minDistance = distance;
                    closestProject = theme;
                }
            }
        }

        // Если нашли ближайший проект — применяем его тему
        if (closestProject && minDistance < window.innerHeight / 2) {
            this.setTheme(closestProject);
        } else {
            // Если далеко от обоих проектов — возвращаем стандартную тему
            this.setTheme('default');
        }
    }
};

// ========== ПЛАВНАЯ ПРОКРУТКА ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// ========== АНИМАЦИЯ ЭЛЕМЕНТОВ ПРИ СКРОЛЛЕ ==========
function animateOnScroll() {
    const elements = document.querySelectorAll('.concept-card, .project, .intro');
    
    elements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if(elementTop < windowHeight - 100) {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }
    });

    // Обновляем тему при каждом скролле
    themeController.updateThemeOnScroll();
}

// Начальные стили для анимации
document.querySelectorAll('.concept-card, .project, .intro').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
});

// ========== ЗАПУСК ВСЕХ СИСТЕМ ==========
window.addEventListener('load', () => {
    animateOnScroll();
    // Начальная проверка темы
    themeController.updateThemeOnScroll();
});

window.addEventListener('scroll', animateOnScroll);

// ========== ПАСХАЛКА В КОНСОЛИ (оставим, она классная) ==========
const conceptFacts = {
    nature: [
        "Концепт 'Милитари × Сад' родился из наблюдения, как мох прорастает сквозь асфальт.",
        "В природной теме каждый элемент должен дышать, как лист после дождя."
    ],
    urban: [
        "В 'Киберпанк × Брутализм' технология не кричит, а шепчет из-за бетона.",
        "Урбанистическая тема — это не хаос, а новый порядок из обломков старого."
    ],
    default: [
        "Философия тонального кроя: цвет должен не контрастировать, а вести диалог.",
        "Настоящий люкс — это когда технология пошива скрыта, а не выставлена напоказ."
    ]
];

// Показываем случайный факт при переключении темы
const originalSetTheme = themeController.setTheme;
themeController.setTheme = function(themeName) {
    originalSetTheme.call(this, themeName);
    
    const facts = conceptFacts[themeName] || conceptFacts.default;
    const randomFact = facts[Math.floor(Math.random() * facts.length)];
    
    console.log(`%c💡 ${randomFact}`, 
        'background: linear-gradient(135deg, #7b6cb3, #5d4a9a); color: white; padding: 10px; border-radius: 5px; font-weight: bold;');
};