// ===================== ГЛАВНЫЕ НАСТРОЙКИ =====================
const CONFIG = {
    themeSwitchStart: 0.1,  // Порог в НАЧАЛЕ проекта (проект только появился)
    themeSwitchEnd: 0.9,    // Порог в КОНЦЕ проекта (проект почти прошли)
    scrollAnimationOffset: 100, // Отступ для анимации появления
    themeTransitionDuration: 800 // Длительность перехода темы в мс
};

// ===================== СИСТЕМА ПЕРЕВОДА =====================
class LanguageSystem {
    constructor() {
        this.currentLang = 'ru';
        this.translations = {};
        this.init();
    }
    
    init() {
        // Пробуем загрузить сохранённый язык
        const savedLang = localStorage.getItem('portfolio_lang');
        if (savedLang && (savedLang === 'ru' || savedLang === 'en')) {
            this.currentLang = savedLang;
        } else {
            // Определяем язык браузера
            const browserLang = navigator.language.slice(0, 2);
            this.currentLang = (browserLang === 'ru') ? 'ru' : 'en';
        }
        
        this.updateLangButtons();
        this.applyLanguage();
        
        // Вешаем обработчики на кнопки
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.dataset.lang;
                this.setLanguage(lang);
            });
        });
    }
    
    setLanguage(lang) {
        if (this.currentLang === lang) return;
        
        this.currentLang = lang;
        localStorage.setItem('portfolio_lang', lang);
        
        this.updateLangButtons();
        this.applyLanguage();
        
        // Пасхалка в консоль
        console.log(`%c🌍 Язык изменён на: ${lang.toUpperCase()}`, 
            `background: linear-gradient(135deg, ${lang === 'ru' ? '#5a7d5a' : '#7b6cb3'}, ${lang === 'ru' ? '#3a5c3a' : '#5d4a9a'}); 
             color: white; padding: 8px; border-radius: 5px;`);
    }
    
    updateLangButtons() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            if (btn.dataset.lang === this.currentLang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    applyLanguage() {
        // Меняем атрибут lang у html
        document.documentElement.lang = this.currentLang;
        
        // Меняем title страницы
        const titleElement = document.querySelector('title');
        if (titleElement.dataset.lang) {
            const titleData = JSON.parse(titleElement.dataset.lang);
            titleElement.textContent = titleData[this.currentLang] || titleData['ru'];
        }
        
        // Проходим по всем элементам с data-lang
        document.querySelectorAll('[data-lang]').forEach(element => {
            try {
                const langData = JSON.parse(element.dataset.lang);
                if (langData[this.currentLang]) {
                    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                        element.value = langData[this.currentLang];
                    } else if (element.hasChildNodes() && element.children.length > 0) {
                        // Для элементов с HTML внутри
                        element.innerHTML = langData[this.currentLang];
                    } else {
                        // Для обычных текстовых элементов
                        element.textContent = langData[this.currentLang];
                    }
                }
            } catch (e) {
                console.warn('Ошибка парсинга data-lang:', element, e);
            }
        });
    }
}

// ===================== СИСТЕМА ТЕМ =====================
class ThemeSystem {
    constructor() {
        this.currentTheme = 'default';
        this.themes = ['default', 'nature', 'urban'];
        this.isTransitioning = false;
        
        // Проекты и их темы
        this.projects = {
            'project-military': 'nature',
            'project-cyberpunk': 'urban'
        };
        
        this.init();
    }
    
    init() {
        // Устанавливаем CSS-переменную для длительности перехода
        document.documentElement.style.setProperty(
            '--transition-main', 
            `${CONFIG.themeTransitionDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`
        );
    }
    
    setTheme(themeName) {
        if (this.isTransitioning || this.currentTheme === themeName) return;
        
        this.isTransitioning = true;
        this.currentTheme = themeName;
        
        // Удаляем все классы тем
        this.themes.forEach(theme => {
            document.body.classList.remove(`theme-${theme}`);
        });
        
        // Добавляем новую тему (если не default)
        if (themeName !== 'default') {
            document.body.classList.add(`theme-${themeName}`);
        }
        
        // Логируем смену темы с пасхалкой
        this.logThemeChange(themeName);
        
        // Сбрасываем флаг после перехода
        setTimeout(() => {
            this.isTransitioning = false;
        }, CONFIG.themeTransitionDuration);
    }
    
    logThemeChange(themeName) {
        const facts = {
            default: [
                "💜 Лавандовая база — пространство для чистого концепта.",
                "✨ Нейтральный фон позволяет идеям дышать."
            ],
            nature: [
                "🍃 'Милитари × Сад' — метаморфоза агрессии в гармонию.",
                "🌿 Цвет мха после дождя — самый сложный оттенок зелени.",
                "🧵 Лён стареет достоинством, а не износом."
            ],
            urban: [
                "⚡ 'Норильский киберпанк' — технологии, которые не эволюционировали, а выжили.",
                "🧱 Бетон здесь не фон, а соучастник. Он хранит холод и память.",
                "📟 Будущее здесь наступило в 1978 году и с тех пор тихо ржавеет.",
                "🛠️ Индустриальная эстетика — это не дизайн, это следы эксплуатации."
            ]
        };
        
        const themeFacts = facts[themeName] || facts.default;
        const randomFact = themeFacts[Math.floor(Math.random() * themeFacts.length)];
        
        console.log(
            `%c🎨 Тема: ${themeName.toUpperCase()}\n${randomFact}`,
            `background: linear-gradient(135deg, ${this.getThemeColor(themeName)}); 
             color: white; 
             padding: 12px; 
             border-radius: 8px; 
             font-weight: bold;
             line-height: 1.5;`
        );
    }
    
    getThemeColor(themeName) {
        const colors = {
            default: '#7b6cb3, #5d4a9a',
            nature: '#5a7d5a, #3a5c3a',
            urban: '#2a2a2a, #8b0000, #00cccc'
        };
        return colors[themeName] || colors.default;
    }
    
    updateThemeOnScroll() {
    if (this.isTransitioning) return;
    
    const viewportHeight = window.innerHeight;
    let closestProject = null;
    let projectProgress = 0; // От 0 (проект вверху экрана) до 1 (проект внизу экрана)
    let projectId = null;
    
    // 1. Находим активный проект и его прогресс внутри экрана
    for (const [id, theme] of Object.entries(this.projects)) {
        const element = document.getElementById(id);
        if (element) {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top;
            const elementHeight = rect.height;
            
            // Считаем, какая часть проекта видна на экране
            const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
            const visibilityRatio = visibleHeight / viewportHeight;
            
            // Если проект достаточно виден (>30%), считаем его активным
            if (visibilityRatio > 0.3) {
                // Прогресс проекта от 0 (верх на экране) до 1 (низ на экране)
                projectProgress = Math.max(0, Math.min(1, 
                    (viewportHeight - rect.top) / (viewportHeight + elementHeight)
                ));
                closestProject = theme;
                projectId = id;
                break;
            }
        }
    }
    
    // 2. Рассчитываем ДИНАМИЧЕСКИЙ порог
    let targetTheme = 'default';
    
    if (closestProject && projectId) {
        // Линейно интерполируем порог от start до end
        const dynamicThreshold = CONFIG.themeSwitchStart + 
                                (CONFIG.themeSwitchEnd - CONFIG.themeSwitchStart) * projectProgress;
        
        // Если видимость проекта превышает динамический порог — включаем тему
        const element = document.getElementById(projectId);
        const rect = element.getBoundingClientRect();
        const visibilityRatio = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
        const normalizedVisibility = visibilityRatio / viewportHeight;
        
        if (normalizedVisibility > dynamicThreshold) {
            targetTheme = closestProject;
        }
        
        // Логируем для отладки (можно убрать)
        console.log(`Проект: ${projectId}, Прогресс: ${(projectProgress*100).toFixed(1)}%, ` +
                   `Порог: ${(dynamicThreshold*100).toFixed(1)}%, ` +
                   `Видимость: ${(normalizedVisibility*100).toFixed(1)}%, ` +
                   `Тема: ${targetTheme}`);
    }
    
    // 3. Если далеко от всех проектов — default тема
    if (!closestProject) {
        targetTheme = 'default';
    }
    
    // 4. Применяем тему
    if (targetTheme !== this.currentTheme) {
        this.setTheme(targetTheme);
    }
}
}

// ===================== АНИМАЦИЯ ПОЯВЛЕНИЯ =====================
class ScrollAnimator {
    constructor() {
        this.animatedElements = [];
        this.init();
    }
    
    init() {
        // Собираем все элементы для анимации
        this.animatedElements = Array.from(document.querySelectorAll(
            '.concept-card, .intro, .gallery, .project-title, .project-subtitle'
        ));
        
        // Устанавливаем начальные стили
        this.animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `opacity 0.8s ease, transform 0.8s ease`;
        });
        
        // Первая проверка
        this.checkVisibility();
    }
    
    checkVisibility() {
        const windowHeight = window.innerHeight;
        
        this.animatedElements.forEach((el, index) => {
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top < windowHeight - CONFIG.scrollAnimationOffset;
            
            if (isVisible) {
                // Задержка для последовательного появления
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 100);
                
                // Удаляем из массива после анимации
                this.animatedElements = this.animatedElements.filter(e => e !== el);
            }
        });
    }
}

// ===================== ПЛАВНАЯ ПРОКРУТКА =====================
class SmoothScroller {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.handleClick(e));
        });
    }
    
    handleClick(e) {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = 80;
            // РАСЧЁТ: отступ до элемента минус высота шапки
            let targetPosition = targetElement.offsetTop - headerHeight;
            
            // ДОПОЛНИТЕЛЬНЫЙ СКРОЛЛ ДЛЯ АКТИВАЦИИ ТЕМЫ:
            // Если это проект (не секция "Обо мне"), скроллим ещё на 150px вниз
            if (targetId.includes('project-')) {
                targetPosition += 150; // Можно регулировать это значение (150-250px)
            }
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
}

// ===================== ПРОГРЕСС БАР =====================
class ProgressBar {
    constructor() {
        this.bar = document.querySelector('.scroll-progress');
        this.init();
    }
    
    init() {
        if (!this.bar) {
            this.bar = document.createElement('div');
            this.bar.className = 'scroll-progress';
            document.body.prepend(this.bar);
        }
        
        window.addEventListener('scroll', () => this.update());
        this.update();
    }
    
    update() {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        this.bar.style.width = `${scrolled}%`;
    }
}

// ===================== МОДАЛЬНАЯ ГАЛЕРЕЯ =====================
class ImageGallery {
    constructor() {
        this.modal = null;
        this.currentIndex = 0;
        this.images = [];
        this.init();
    }
    
    init() {
        // Создаём модальное окно
        this.createModal();
        
        // Находим все изображения галереи
        this.galleryItems = document.querySelectorAll('.gallery-item[data-image-modal]');
        
        // Вешаем обработчики
        this.galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => this.openModal(index));
            
            // Собираем данные об изображениях
            const img = item.querySelector('.gallery-real-image');
            if (img) {
                this.images.push({
                    src: img.dataset.full || img.src,
                    alt: img.alt,
                    caption: item.querySelector('p')?.textContent || ''
                });
            }
        });
        
        // Закрытие по ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });
    }
    
    createModal() {
        this.modal = document.createElement('div');
        this.modal.className = 'image-modal';
        this.modal.innerHTML = `
            <div class="modal-content">
                <button class="close-modal">&times;</button>
                <div class="modal-nav">
                    <button class="nav-btn prev-btn">❮</button>
                    <button class="nav-btn next-btn">❯</button>
                </div>
                <img class="modal-image" src="" alt="">
                <p class="modal-caption"></p>
            </div>
        `;
        
        document.body.appendChild(this.modal);
        
        // Обработчики для модалки
        this.modal.querySelector('.close-modal').addEventListener('click', () => this.closeModal());
        this.modal.querySelector('.prev-btn').addEventListener('click', () => this.prevImage());
        this.modal.querySelector('.next-btn').addEventListener('click', () => this.nextImage());
        
        // Закрытие по клику на фон
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });
    }
    
    openModal(index) {
        this.currentIndex = index;
        this.updateModal();
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Блокируем скролл страницы
    }
    
    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Восстанавливаем скролл
    }
    
    updateModal() {
        if (this.images.length === 0) return;
        
        const image = this.images[this.currentIndex];
        const modalImg = this.modal.querySelector('.modal-image');
        const modalCaption = this.modal.querySelector('.modal-caption');
        
        modalImg.src = image.src;
        modalImg.alt = image.alt;
        modalCaption.textContent = image.caption;
        
        // Показываем/скрываем кнопки навигации
        const prevBtn = this.modal.querySelector('.prev-btn');
        const nextBtn = this.modal.querySelector('.next-btn');
        
        prevBtn.style.display = this.images.length > 1 ? 'flex' : 'none';
        nextBtn.style.display = this.images.length > 1 ? 'flex' : 'none';
    }
    
    prevImage() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateModal();
    }
    
    nextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateModal();
    }
}

// ===================== ИНИЦИАЛИЗАЦИЯ ВСЕХ СИСТЕМ =====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('%c🚀 Концепт-портфолио загружено', 
        'background: linear-gradient(135deg, #7b6cb3, #5d4a9a); color: white; padding: 10px; border-radius: 5px; font-weight: bold;');
    
    // Инициализируем все системы
    const languageSystem = new LanguageSystem();
    const themeSystem = new ThemeSystem();
    const scrollAnimator = new ScrollAnimator();
    const smoothScroller = new SmoothScroller();
    const progressBar = new ProgressBar();
    const imageGallery = new ImageGallery();
    
    // Обработчики событий
    window.addEventListener('scroll', () => {
        themeSystem.updateThemeOnScroll();
        scrollAnimator.checkVisibility();
        progressBar.update();
    });
    
    window.addEventListener('load', () => {
        scrollAnimator.checkVisibility();
        themeSystem.updateThemeOnScroll();
    });
    
    // Запускаем начальную анимацию
    setTimeout(() => scrollAnimator.checkVisibility(), 300);
    
    // Дополнительная пасхалка
    console.log('%c💡 Совет: Прокрутите до проектов, чтобы увидеть смену тематических миров.', 
        'background: #2d3b2d; color: #b8c9b8; padding: 10px; border-radius: 5px; border-left: 4px solid #5a7d5a;');
});