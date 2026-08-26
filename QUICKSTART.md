# 🚀 QUICK START – Быстрый старт

## Для пользователей

### На компьютере (Windows/Mac/Linux)
```
1. Скачайте все файлы из папки
2. Откройте файл index.html в браузере
3. Начните учиться!
```

### Через GitHub Pages (онлайн)
```
1. Раздели (Fork) репозиторий →
2. Идёшь в Settings → Pages →
3. Выбираешь ветку main и сохраняешь →
4. Твой сайт готов! (может занять минуту)
```

### Через Live Server (VS Code)
```
1. Открой папку проекта в VS Code
2. Установи расширение "Live Server" (опционально)
3. Кликни на index.html → "Open with Live Server"
4. Готово! Браузер откроется автоматически
```

---

## Для учителей

### Как использовать на уроке?

**Вариант 1: Интерактивная доска**
```
1. Откройте index.html на проекторе
2. Вызывайте учеников к доске
3. Они решают задания в реальном времени
4. Класс видит, как система проверяет ответы
```

**Вариант 2: Персональные устройства**
```
1. Поделитесь ссылкой: https://[ваш-ник].github.io/components-of-actions
2. Каждый ученик откроет на своём устройстве
3. Все решают самостоятельно
4. Система даёт им обратную связь
```

**Вариант 3: Печать**
```
1. Откройте страницу
2. Нажмите Ctrl+P (или Cmd+P на Mac)
3. Выберите "Сохранить как PDF" или "Печать"
4. Распечатайте памятку и карточки для класса
```

### Как изменить задания?

**Редактируем в любом текстовом редакторе (Notepad++, VS Code и т.д.):**

1. Откройте `index.html` текстовым редактором
2. Найдите нужное задание по названию (например, "Простые уравнения")
3. Измените текст уравнения и ответ
4. Сохраните файл (Ctrl+S)
5. Обновите браузер (F5)

**Пример изменения:**

Было:
```html
<div class="equation-problem">x + 15 = 42</div>
<input type="number" class="equation-input" placeholder="Введи ответ" data-answer="27">
```

Стало:
```html
<div class="equation-problem">x + 20 = 50</div>
<input type="number" class="equation-input" placeholder="Введи ответ" data-answer="30">
```

---

## Для разработчиков

### Установка локально

```bash
# 1. Клонируй репозиторий
git clone https://github.com/your-username/components-of-actions.git

# 2. Перейди в папку
cd components-of-actions

# 3. Открой в VS Code (опционально)
code .

# 4. Запусти Live Server (в VS Code)
# Кликни правой кнопкой на index.html → Open with Live Server
```

### Структура файлов

```
📁 components-of-actions/
  ├── 📄 index.html          ← Основная разметка
  ├── 📄 styles.css          ← Все стили (2000+ строк)
  ├── 📄 script.js           ← Интерактивная логика
  ├── 📄 README.md           ← Полная документация
  ├── 📄 QUICKSTART.md       ← Этот файл
  ├── 📄 LICENSE             ← MIT License
  ├── 📄 .gitignore          ← Для Git
  └── 📁 assets/             ← Будущие изображения
```

### Как добавить новое задание

#### 1. Простое уравнение

Откройте `index.html` и найдите раздел "Простые уравнения":

```html
<div class="equation-card">
    <div class="equation-type">Сложение</div>
    <div class="equation-problem">x + 15 = 42</div>
    <div class="equation-hint">💡 Подсказка: x = 42 − 15</div>
    <input type="number" class="equation-input" 
           placeholder="Введи ответ" data-answer="27">
    <button class="check-btn">Проверить</button>
    <div class="equation-feedback"></div>
</div>
```

Скопируйте этот блок и измените:
- `equation-type` — тип действия
- `equation-problem` — само уравнение
- `equation-hint` — подсказка
- `data-answer` — правильный ответ

#### 2. Задание на распознавание

Найдите раздел "Распознавание компонентов":

```html
<div class="task-card">
    <div class="task-question">
        <p>В выражении <strong>12 + 8 = 20</strong></p>
        <p>Что такое число <strong>12</strong>?</p>
    </div>
    <select class="task-select" data-answer="first-addend">
        <option value="">-- Выбери ответ --</option>
        <option value="first-addend">✓ Первое слагаемое</option>
        <option value="second-addend">Второе слагаемое</option>
        <option value="sum">Сумма</option>
    </select>
    <div class="task-feedback"></div>
</div>
```

#### 3. Правило в памятке

Найдите раздел "Памятка":

```html
<div class="rule-card">
    <div class="rule-icon">➕</div>
    <div class="rule-content">
        <h3>Сложение: a + b = c</h3>
        <div class="rule-item">
            <span class="rule-title">Найти первое слагаемое (a)</span>
            <span class="rule-formula">a = c − b</span>
        </div>
        <!-- добавляйте больше rule-item -->
    </div>
</div>
```

### Кастомизация цветов

Откройте `styles.css` и найдите блок `:root`:

```css
:root {
    --color-primary: #6B8CAE;      /* Основной синий */
    --color-accent: #D8A5C4;       /* Розовый акцент */
    --color-light: #E8D5E8;        /* Светлый розовый */
    --color-bg: #FBF8F3;           /* Фоновый цвет */
    --color-text: #3F3F3F;         /* Основной текст */
    --color-success: #A8D5BA;      /* Правильный ответ */
    --color-error: #E8A5A5;        /* Неправильный ответ */
    --color-warning: #F5D080;      /* Подсказка */
    /* и так далее */
}
```

Измените hex-коды на нужные вам цвета.

### Деплой на GitHub Pages

```bash
# 1. Инициализируй Git
git init

# 2. Добавь файлы
git add .

# 3. Коммит
git commit -m "Initial commit"

# 4. Добавь remote
git remote add origin https://github.com/YOUR-USERNAME/components-of-actions.git

# 5. Push на GitHub
git branch -M main
git push -u origin main

# 6. В GitHub Settings → Pages → выбери ветку main
# Готово! Сайт будет на https://YOUR-USERNAME.github.io/components-of-actions
```

---

## 🆘 Решение проблем

### Сайт не загружается
- ✓ Проверьте интернет соединение
- ✓ Очистите кэш браузера (Ctrl+Shift+Delete)
- ✓ Откройте в другом браузере

### Интерактивность не работает
- ✓ Обновите страницу (F5 или Ctrl+R)
- ✓ Откройте консоль браузера (F12) — есть ошибки?
- ✓ Проверьте, что файл `script.js` в одной папке с `index.html`

### Стили некрасивые
- ✓ Проверьте, что файл `styles.css` в одной папке с `index.html`
- ✓ Обновите браузер (Ctrl+Shift+R для жёсткого обновления)

### Ответы не проверяются
- ✓ Откройте консоль браузера (F12 → Console)
- ✓ Проверьте, есть ли ошибки JavaScript
- ✓ Убедитесь, что атрибут `data-answer` заполнен правильно

---

## 📞 Помощь и поддержка

- **GitHub Issues** — для сообщений об ошибках
- **Discussions** — для вопросов и идей
- **Вики** — для документации

---

**Версия:** 1.0.0  
**Обновлено:** август 2026

Happy learning! 🎓💡
