// ============================================
// ИНТЕРАКТИВНАЯ ЛОГИКА
// ============================================

let stats = {
    solved: 0,
    independent: 0,
    withHint: 0,
    mistakes: 0
};

document.addEventListener('DOMContentLoaded', function() {
    initializeRecognitionTrainer();
    initializeEquationInputs();
    initializeHintToggles();
    initializeResetButton();
    updateResults();
});

// ============================================
// ТРЕНАЖЁР РАСПОЗНАВАНИЯ КОМПОНЕНТОВ
// ============================================

const componentOptions = [
    { value: 'first-addend', label: 'Первое слагаемое' },
    { value: 'second-addend', label: 'Второе слагаемое' },
    { value: 'sum', label: 'Сумма' },
    { value: 'minuend', label: 'Уменьшаемое' },
    { value: 'subtrahend', label: 'Вычитаемое' },
    { value: 'difference', label: 'Разность' },
    { value: 'first-factor', label: 'Первый множитель' },
    { value: 'second-factor', label: 'Второй множитель' },
    { value: 'product', label: 'Произведение' },
    { value: 'dividend', label: 'Делимое' },
    { value: 'divisor', label: 'Делитель' },
    { value: 'quotient', label: 'Частное' }
];

const recognitionBank = {
    addition: [
        { id: 'a1', expression: '12 + 8 = 20', target: '12', answer: 'first-addend' },
        { id: 'a2', expression: '14 + 9 = 23', target: '9', answer: 'second-addend' },
        { id: 'a3', expression: '17 + 6 = 23', target: '23', answer: 'sum' },
        { id: 'a4', expression: '25 + 13 = 38', target: '25', answer: 'first-addend' },
        { id: 'a5', expression: '18 + 27 = 45', target: '27', answer: 'second-addend' },
        { id: 'a6', expression: '34 + 16 = 50', target: '50', answer: 'sum' },
        { id: 'a7', expression: '42 + 19 = 61', target: '42', answer: 'first-addend' },
        { id: 'a8', expression: '28 + 35 = 63', target: '35', answer: 'second-addend' },
        { id: 'a9', expression: '46 + 24 = 70', target: '70', answer: 'sum' },
        { id: 'a10', expression: '57 + 18 = 75', target: '18', answer: 'second-addend' }
    ],
    subtraction: [
        { id: 's1', expression: '52 − 17 = 35', target: '52', answer: 'minuend' },
        { id: 's2', expression: '64 − 28 = 36', target: '28', answer: 'subtrahend' },
        { id: 's3', expression: '73 − 25 = 48', target: '48', answer: 'difference' },
        { id: 's4', expression: '91 − 37 = 54', target: '91', answer: 'minuend' },
        { id: 's5', expression: '80 − 46 = 34', target: '46', answer: 'subtrahend' },
        { id: 's6', expression: '68 − 29 = 39', target: '39', answer: 'difference' },
        { id: 's7', expression: '100 − 43 = 57', target: '100', answer: 'minuend' },
        { id: 's8', expression: '76 − 18 = 58', target: '18', answer: 'subtrahend' },
        { id: 's9', expression: '85 − 32 = 53', target: '53', answer: 'difference' },
        { id: 's10', expression: '94 − 27 = 67', target: '27', answer: 'subtrahend' }
    ],
    multiplication: [
        { id: 'm1', expression: '6 × 7 = 42', target: '6', answer: 'first-factor' },
        { id: 'm2', expression: '8 × 9 = 72', target: '9', answer: 'second-factor' },
        { id: 'm3', expression: '7 × 5 = 35', target: '35', answer: 'product' },
        { id: 'm4', expression: '4 × 12 = 48', target: '4', answer: 'first-factor' },
        { id: 'm5', expression: '11 × 6 = 66', target: '6', answer: 'second-factor' },
        { id: 'm6', expression: '9 × 8 = 72', target: '72', answer: 'product' },
        { id: 'm7', expression: '3 × 14 = 42', target: '14', answer: 'second-factor' },
        { id: 'm8', expression: '12 × 7 = 84', target: '12', answer: 'first-factor' },
        { id: 'm9', expression: '5 × 13 = 65', target: '65', answer: 'product' },
        { id: 'm10', expression: '8 × 11 = 88', target: '11', answer: 'second-factor' }
    ],
    division: [
        { id: 'd1', expression: '48 ÷ 6 = 8', target: '48', answer: 'dividend' },
        { id: 'd2', expression: '63 ÷ 9 = 7', target: '9', answer: 'divisor' },
        { id: 'd3', expression: '72 ÷ 8 = 9', target: '9', answer: 'quotient' },
        { id: 'd4', expression: '56 ÷ 7 = 8', target: '56', answer: 'dividend' },
        { id: 'd5', expression: '84 ÷ 7 = 12', target: '7', answer: 'divisor' },
        { id: 'd6', expression: '96 ÷ 8 = 12', target: '12', answer: 'quotient' },
        { id: 'd7', expression: '54 ÷ 6 = 9', target: '54', answer: 'dividend' },
        { id: 'd8', expression: '90 ÷ 15 = 6', target: '15', answer: 'divisor' },
        { id: 'd9', expression: '66 ÷ 6 = 11', target: '11', answer: 'quotient' },
        { id: 'd10', expression: '88 ÷ 8 = 11', target: '88', answer: 'dividend' }
    ]
};

let lastRecognitionIds = new Set();

function initializeRecognitionTrainer() {
    renderRecognitionTasks();

    const shuffleButton = document.getElementById('shuffle-recognition-btn');
    if (shuffleButton) {
        shuffleButton.addEventListener('click', function() {
            renderRecognitionTasks(true);
        });
    }
}

function shuffleArray(items) {
    const array = [...items];
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function pickRecognitionSet() {
    const selected = [];

    Object.values(recognitionBank).forEach(group => {
        let candidates = group.filter(item => !lastRecognitionIds.has(item.id));
        if (candidates.length < 2) candidates = group;
        selected.push(...shuffleArray(candidates).slice(0, 2));
    });

    return shuffleArray(selected);
}

function renderRecognitionTasks(animate = false) {
    const grid = document.getElementById('recognition-tasks-grid');
    if (!grid) return;

    const tasks = pickRecognitionSet();
    lastRecognitionIds = new Set(tasks.map(task => task.id));

    grid.innerHTML = tasks.map(task => {
        const options = shuffleArray(componentOptions)
            .map(option => `<option value="${option.value}">${option.label}</option>`)
            .join('');

        return `
            <div class="task-card recognition-task-card">
                <div class="task-question">
                    <p>В выражении <strong>${task.expression}</strong></p>
                    <p>Что такое число <strong>${task.target}</strong>?</p>
                </div>
                <select class="task-select" data-answer="${task.answer}" aria-label="Выбери название компонента">
                    <option value="">-- Выбери ответ --</option>
                    ${options}
                </select>
                <div class="task-feedback"></div>
            </div>`;
    }).join('');

    initializeSelects();

    if (animate) {
        grid.classList.remove('recognition-refresh');
        void grid.offsetWidth;
        grid.classList.add('recognition-refresh');
    }
}

// ============================================
// ЗАДАНИЯ С ВЫБОРОМ ОТВЕТА
// ============================================

function initializeSelects() {
    document.querySelectorAll('.task-select').forEach(select => {
        if (select.dataset.listenerBound === 'true') return;
        select.dataset.listenerBound = 'true';
        select.addEventListener('change', function() {
            checkSelectAnswer(this);
        });
    });
}

function checkSelectAnswer(selectElement) {
    if (selectElement.dataset.completed === 'true') return;

    const correctAnswer = selectElement.getAttribute('data-answer');
    const selectedValue = selectElement.value;
    const feedbackElement = selectElement.parentElement.querySelector('.task-feedback');

    if (selectedValue === '') {
        feedbackElement.classList.remove('show', 'correct', 'incorrect');
        return;
    }

    if (selectedValue === correctAnswer) {
        stats.solved++;
        stats.independent++;
        selectElement.dataset.completed = 'true';
        feedbackElement.textContent = '✓ Верно! Ты правильно применил правило.';
        feedbackElement.classList.remove('incorrect');
        feedbackElement.classList.add('show', 'correct');
        selectElement.disabled = true;
        selectElement.style.opacity = '0.72';
        animateSuccess(selectElement.closest('.task-card'));
    } else {
        stats.mistakes++;
        feedbackElement.textContent = 'Пока неверно. Сравни компоненты действия и попробуй ещё раз.';
        feedbackElement.classList.remove('correct');
        feedbackElement.classList.add('show', 'incorrect');
        selectElement.value = '';
    }

    updateResults();
}

// ============================================
// ТРЁХСТУПЕНЧАТЫЕ ПОДСКАЗКИ
// ============================================

function initializeHintToggles() {
    document.querySelectorAll('.hint-toggle').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const card = this.closest('.equation-card');
            const hint = card.querySelector('.equation-hint');
            let currentStep = Number(this.dataset.hintStep || '0');

            if (currentStep >= 3) {
                hint.hidden = true;
                hint.textContent = '';
                this.dataset.hintStep = '0';
                this.setAttribute('aria-expanded', 'false');
                this.querySelector('.hint-label').textContent = 'Подсказка 1/3';
                return;
            }

            const nextStep = currentStep + 1;
            const text = this.getAttribute(`data-hint-${nextStep}`);
            if (!text) return;

            card.dataset.hintUsed = 'true';
            this.dataset.hintStep = String(nextStep);
            this.setAttribute('aria-expanded', 'true');
            hint.hidden = false;
            hint.innerHTML = `<span class="hint-step-label">Подсказка ${nextStep}/3</span>${text}`;

            const label = this.querySelector('.hint-label');
            if (nextStep === 1) {
                label.textContent = 'Следующая подсказка 2/3';
            } else if (nextStep === 2) {
                label.textContent = 'Последняя подсказка 3/3';
            } else {
                label.textContent = 'Скрыть подсказки';
            }
        });
    });
}

// ============================================
// УРАВНЕНИЯ
// ============================================

function initializeEquationInputs() {
    document.querySelectorAll('.check-btn').forEach(button => {
        button.addEventListener('click', function() {
            checkEquation(this);
        });
    });

    document.querySelectorAll('.equation-input').forEach(input => {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                this.parentElement.querySelector('.check-btn').click();
            }
        });
    });
}

function checkEquation(button) {
    const card = button.closest('.equation-card');
    if (card.dataset.completed === 'true') return;

    const input = card.querySelector('.equation-input');
    const feedback = card.querySelector('.equation-feedback');
    const correctAnswer = input.getAttribute('data-answer');
    const userAnswer = input.value.trim();

    if (userAnswer === '') {
        feedback.classList.remove('show', 'correct', 'incorrect');
        return;
    }

    if (userAnswer === correctAnswer) {
        stats.solved++;
        if (card.dataset.hintUsed === 'true') {
            stats.withHint++;
        } else {
            stats.independent++;
        }

        card.dataset.completed = 'true';
        feedback.textContent = '✓ Верно! Ты правильно нашёл значение x.';
        feedback.classList.remove('incorrect');
        feedback.classList.add('show', 'correct');
        input.disabled = true;
        button.disabled = true;
        input.style.opacity = '0.72';
        button.style.opacity = '0.72';
        animateSuccess(card);
    } else {
        stats.mistakes++;
        const attempts = Number(card.dataset.wrongAttempts || '0') + 1;
        card.dataset.wrongAttempts = String(attempts);

        if (attempts === 1) {
            feedback.textContent = 'Пока неверно. Сначала определи, каким компонентом является x, и попробуй ещё раз.';
        } else if (attempts === 2) {
            feedback.textContent = 'Ещё не получилось. Можно открыть первую подсказку — она не выдаёт ответ, а направляет рассуждение.';
        } else {
            feedback.textContent = 'Попробуй пройти подсказки по шагам и снова решить уравнение самостоятельно.';
        }

        feedback.classList.remove('correct');
        feedback.classList.add('show', 'incorrect');
        input.value = '';
        input.focus();
    }

    updateResults();
}

// ============================================
// РЕЗУЛЬТАТЫ
// ============================================

function updateResults() {
    document.getElementById('total-solved').textContent = stats.solved;
    document.getElementById('independent-solved').textContent = stats.independent;
    document.getElementById('hint-solved').textContent = stats.withHint;
    document.getElementById('mistakes').textContent = stats.mistakes;

    const note = document.getElementById('result-note');
    if (!note) return;

    if (stats.solved === 0 && stats.mistakes === 0) {
        note.textContent = 'Здесь будет видно, сколько заданий получилось решить самостоятельно и сколько — с подсказкой.';
    } else if (stats.solved > 0 && stats.mistakes === 0 && stats.withHint === 0) {
        note.textContent = 'Отлично: все выполненные задания решены самостоятельно и без ошибок.';
    } else if (stats.withHint > stats.independent) {
        note.textContent = 'Подсказки помогают. В следующем примере попробуй открыть на одну ступень подсказки меньше.';
    } else if (stats.mistakes > 0) {
        note.textContent = 'Ошибки — часть тренировки. Возвращайся к правилу и обращай внимание, каким компонентом является x.';
    } else {
        note.textContent = 'Хорошая работа: большинство выполненных заданий решено самостоятельно.';
    }
}

// ============================================
// СБРОС
// ============================================

function initializeResetButton() {
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetAllTasks);
    }
}

function resetAllTasks() {
    document.querySelectorAll('.task-select').forEach(select => {
        select.value = '';
        select.disabled = false;
        select.style.opacity = '1';
        delete select.dataset.completed;
        const feedback = select.parentElement.querySelector('.task-feedback');
        if (feedback) feedback.classList.remove('show', 'correct', 'incorrect');
    });

    document.querySelectorAll('.equation-card').forEach(card => {
        delete card.dataset.completed;
        delete card.dataset.hintUsed;
        delete card.dataset.wrongAttempts;
    });

    document.querySelectorAll('.equation-input').forEach(input => {
        input.value = '';
        input.disabled = false;
        input.style.opacity = '1';
        const feedback = input.parentElement.querySelector('.equation-feedback');
        if (feedback) feedback.classList.remove('show', 'correct', 'incorrect');
    });

    document.querySelectorAll('.hint-toggle').forEach(toggle => {
        toggle.dataset.hintStep = '0';
        toggle.setAttribute('aria-expanded', 'false');
        toggle.querySelector('.hint-label').textContent = 'Подсказка 1/3';
        const hint = toggle.closest('.equation-card').querySelector('.equation-hint');
        if (hint) {
            hint.hidden = true;
            hint.textContent = '';
        }
    });

    document.querySelectorAll('.check-btn').forEach(btn => {
        btn.disabled = false;
        btn.style.opacity = '1';
    });

    stats = {
        solved: 0,
        independent: 0,
        withHint: 0,
        mistakes: 0
    };

    renderRecognitionTasks(true);
    updateResults();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// АНИМАЦИЯ УСПЕХА
// ============================================

function animateSuccess(element) {
    if (!element) return;
    element.style.animation = 'none';
    setTimeout(() => {
        element.style.animation = 'slideIn 0.3s ease';
    }, 10);
    createConfetti(element);
}

function createConfetti(element) {
    const rect = element.getBoundingClientRect();
    const colors = ['#A8D5BA', '#E5B3D3', '#F5E6D3', '#89B4D1'];

    for (let i = 0; i < 5; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = (rect.left + rect.width / 2) + 'px';
        confetti.style.top = (rect.top + rect.height / 2) + 'px';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';

        document.body.appendChild(confetti);

        const randomX = (Math.random() - 0.5) * 100;
        const randomY = Math.random() * -100 - 50;
        const duration = Math.random() * 1000 + 500;

        confetti.animate([
            { transform: 'translate(0, 0)', opacity: 1 },
            { transform: `translate(${randomX}px, ${randomY}px)`, opacity: 0 }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });

        setTimeout(() => confetti.remove(), duration);
    }
}

// ============================================
// ДОПОЛНИТЕЛЬНАЯ ИНТЕРАКТИВНОСТЬ
// ============================================

document.addEventListener('focus', function(e) {
    if (e.target.classList.contains('equation-input') || e.target.classList.contains('task-select')) {
        e.target.parentElement.style.transform = 'scale(1.02)';
    }
}, true);

document.addEventListener('blur', function(e) {
    if (e.target.classList.contains('equation-input') || e.target.classList.contains('task-select')) {
        e.target.parentElement.style.transform = 'scale(1)';
    }
}, true);

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const activeElement = document.activeElement;
        if (activeElement && (activeElement.classList.contains('equation-input') || activeElement.classList.contains('task-select'))) {
            activeElement.blur();
        }
    }
});
