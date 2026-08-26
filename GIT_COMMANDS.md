# 📦 Git Commands для публикации на GitHub

Эта справка поможет вам залить проект на GitHub.

## 🔑 Первый раз

### Шаг 1: Создайте репозиторий на GitHub

1. Перейдите на [github.com](https://github.com)
2. Нажмите **+ → New repository**
3. Название: `components-of-actions`
4. Описание: "Интерактивная методическая разработка для школьников 4–6 классов"
5. Выберите **Public**
6. **Не инициализируйте** README (мы уже имеем)
7. Нажмите **Create repository**

### Шаг 2: Откройте терминал/командную строку

**Windows:**
- Нажмите `Win+R`
- Введите `cmd`
- Enter

**Mac/Linux:**
- Откройте Terminal

### Шаг 3: Перейдите в папку проекта

```bash
cd путь/к/components-of-actions
```

Например:
```bash
cd C:\Users\YourName\Desktop\components-of-actions
```

### Шаг 4: Инициализируйте Git

```bash
git init
```

### Шаг 5: Добавьте все файлы

```bash
git add .
```

### Шаг 6: Первый коммит

```bash
git commit -m "Initial commit: Add interactive math components learning platform"
```

### Шаг 7: Добавьте remote (адрес репозитория)

Замените `YOUR-USERNAME` на ваше имя на GitHub:

```bash
git remote add origin https://github.com/YOUR-USERNAME/components-of-actions.git
```

### Шаг 8: Переименуйте ветку на main (если нужно)

```bash
git branch -M main
```

### Шаг 9: Push на GitHub

```bash
git push -u origin main
```

Если просит пароль — введите Personal Access Token (не пароль!).

## ✅ Готово!

Ваш репозиторий теперь на GitHub!

---

## 📲 Активируем GitHub Pages

1. Перейдите в ваш репозиторий на GitHub
2. Нажмите **Settings**
3. Слева найдите **Pages**
4. В разделе "Source" выберите **Branch: main**
5. Нажмите **Save**

**Через минуту ваш сайт будет доступен по адресу:**
```
https://YOUR-USERNAME.github.io/components-of-actions
```

---

## 🔄 Следующие обновления

Если вы что-то изменили локально и хотите обновить GitHub:

### Быстро (3 команды):
```bash
git add .
git commit -m "Your message here"
git push
```

### Пример:
```bash
git add .
git commit -m "Add new equations for division practice"
git push
```

---

## 🆘 Частые ошибки

### Ошибка: "fatal: not a git repository"

**Решение:**
```bash
git init
```

### Ошибка: "fatal: origin does not appear to be a git repository"

**Решение:**
```bash
git remote add origin https://github.com/YOUR-USERNAME/components-of-actions.git
```

### Ошибка: "Permission denied" или "403 Forbidden"

**Решение:**
- Используйте Personal Access Token вместо пароля
- Создайте токен в Settings → Developer settings → Personal access tokens
- Выберите `repo` scope
- Используйте токен как пароль

### Ошибка: "Please commit your changes or stash them before you merge"

**Решение:**
```bash
git add .
git commit -m "Save current work"
git push
```

---

## 📚 Полезные команды

```bash
# Проверить статус
git status

# Просмотреть историю
git log

# Отменить последний коммит (без push)
git reset --soft HEAD~1

# Просмотреть remote репозиторий
git remote -v

# Обновить локально из GitHub
git pull
```

---

## 💡 Советы

1. **Коммитьте часто** — пишите понятные сообщения
2. **Используйте имена веток** — например `feature/new-equations`
3. **Читайте обновления** — смотрите GitHub после push

---

**Больше info:** [docs.github.com](https://docs.github.com)

Good luck! 🚀
