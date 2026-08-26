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
    initializeErrorTrainer();
    initializeEquationTrainers();
    initializeResetButton();
    updateResults();
});

// ============================================
// ОБЩИЕ ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================

function shuffleArray(items) {
    const array = [...items];
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function pickDistinctSet(bank, count, lastIds) {
    let candidates = bank.filter(item => !lastIds.has(item.id));
    if (candidates.length < count) candidates = bank;
    return shuffleArray(candidates).slice(0, count);
}

function animateRefresh(element) {
    if (!element) return;
    element.classList.remove('recognition-refresh');
    void element.offsetWidth;
    element.classList.add('recognition-refresh');
}

// ============================================
// ЗАДАНИЕ 1. РАСПОЗНАВАНИЕ КОМПОНЕНТОВ
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
    const button = document.getElementById('shuffle-recognition-btn');
    if (button) button.addEventListener('click', () => renderRecognitionTasks(true));
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

    initializeSelects(grid);
    if (animate) animateRefresh(grid);
}

// ============================================
// ЗАДАНИЕ 2. НАЙДИ ОШИБКУ
// ============================================

const errorRuleOptions = [
    { value: 'unknown-addend', label: 'Чтобы найти неизвестное слагаемое, нужно из суммы вычесть известное слагаемое.' },
    { value: 'unknown-minuend', label: 'Чтобы найти неизвестное уменьшаемое, нужно к разности прибавить вычитаемое.' },
    { value: 'unknown-subtrahend', label: 'Чтобы найти неизвестное вычитаемое, нужно из уменьшаемого вычесть разность.' },
    { value: 'unknown-factor', label: 'Чтобы найти неизвестный множитель, нужно произведение разделить на известный множитель.' },
    { value: 'unknown-dividend', label: 'Чтобы найти неизвестное делимое, нужно частное умножить на делитель.' },
    { value: 'unknown-divisor', label: 'Чтобы найти неизвестный делитель, нужно делимое разделить на частное.' },
    { value: 'no-error', label: 'Решение ученика верное, исправлять ничего не нужно.' }
];

const errorBank = [
    { id: 'e1', equation: '35 − x = 12', solution: 'x = 35 + 12', answer: 'unknown-subtrahend' },
    { id: 'e2', equation: 'x − 8 = 19', solution: 'x = 19 − 8', answer: 'unknown-minuend' },
    { id: 'e3', equation: '56 ÷ x = 8', solution: 'x = 56 × 8', answer: 'unknown-divisor' },
    { id: 'e4', equation: 'x × 6 = 48', solution: 'x = 48 − 6', answer: 'unknown-factor' },
    { id: 'e5', equation: 'x + 17 = 45', solution: 'x = 45 + 17', answer: 'unknown-addend' },
    { id: 'e6', equation: 'x ÷ 7 = 8', solution: 'x = 8 ÷ 7', answer: 'unknown-dividend' },
    { id: 'e7', equation: '63 − x = 28', solution: 'x = 63 − 28', answer: 'no-error' },
    { id: 'e8', equation: 'x − 14 = 32', solution: 'x = 32 + 14', answer: 'no-error' },
    { id: 'e9', equation: '72 ÷ x = 9', solution: 'x = 9 ÷ 72', answer: 'unknown-divisor' },
    { id: 'e10', equation: 'x × 8 = 64', solution: 'x = 64 + 8', answer: 'unknown-factor' },
    { id: 'e11', equation: 'x ÷ 6 = 7', solution: 'x = 7 + 6', answer: 'unknown-dividend' },
    { id: 'e12', equation: '19 + x = 54', solution: 'x = 54 − 19', answer: 'no-error' }
];

let lastErrorIds = new Set();

function initializeErrorTrainer() {
    renderErrorTasks();
    const button = document.getElementById('shuffle-error-btn');
    if (button) button.addEventListener('click', () => renderErrorTasks(true));
}

function renderErrorTasks(animate = false) {
    const grid = document.getElementById('error-tasks-grid');
    if (!grid) return;

    const tasks = pickDistinctSet(errorBank, 4, lastErrorIds);
    lastErrorIds = new Set(tasks.map(task => task.id));

    grid.innerHTML = shuffleArray(tasks).map(task => {
        const correct = errorRuleOptions.find(option => option.value === task.answer);
        const distractors = shuffleArray(errorRuleOptions.filter(option => option.value !== task.answer)).slice(0, 3);
        const options = shuffleArray([correct, ...distractors])
            .map(option => `<option value="${option.value}">${option.label}</option>`)
            .join('');

        return `
            <div class="task-card error-card">
                <div class="error-equation">${task.equation}</div>
                <div class="student-solution"><span>Решение ученика:</span> ${task.solution}</div>
                <p class="error-question">Как нужно рассуждать правильно?</p>
                <select class="task-select" data-answer="${task.answer}" aria-label="Выбери верное правило">
                    <option value="">-- Выбери правило --</option>
                    ${options}
                </select>
                <div class="task-feedback"></div>
            </div>`;
    }).join('');

    initializeSelects(grid);
    if (animate) animateRefresh(grid);
}

// ============================================
// ЗАДАНИЯ 3–5. БАНКИ УРАВНЕНИЙ
// ============================================

const simpleEquationBank = {
    addend: [
        { id: 'sa1', type: 'Сложение', expression: 'x + 15 = 42', answer: '27', h1: 'Определи роль x: здесь x — неизвестное слагаемое.', h2: 'Правило: чтобы найти неизвестное слагаемое, нужно из суммы вычесть известное слагаемое.', h3: 'Первый шаг: из 42 вычти 15. Полученное число и будет значением x.' },
        { id: 'sa2', type: 'Сложение', expression: '18 + x = 53', answer: '35', h1: 'Определи роль x: здесь x — неизвестное слагаемое.', h2: 'Правило: чтобы найти неизвестное слагаемое, нужно из суммы вычесть известное слагаемое.', h3: 'Первый шаг: из 53 вычти 18. Полученное число и будет значением x.' },
        { id: 'sa3', type: 'Сложение', expression: 'x + 24 = 61', answer: '37', h1: 'Определи роль x: здесь x — неизвестное слагаемое.', h2: 'Правило: чтобы найти неизвестное слагаемое, нужно из суммы вычесть известное слагаемое.', h3: 'Первый шаг: из 61 вычти 24. Полученное число и будет значением x.' }
    ],
    minuend: [
        { id: 'sm1', type: 'Вычитание (уменьшаемое)', expression: 'x − 8 = 19', answer: '27', h1: 'Определи роль x: здесь x — неизвестное уменьшаемое.', h2: 'Правило: чтобы найти неизвестное уменьшаемое, нужно к разности прибавить вычитаемое.', h3: 'Первый шаг: к 19 прибавь 8. Полученное число и будет значением x.' },
        { id: 'sm2', type: 'Вычитание (уменьшаемое)', expression: 'x − 17 = 36', answer: '53', h1: 'Определи роль x: здесь x — неизвестное уменьшаемое.', h2: 'Правило: чтобы найти неизвестное уменьшаемое, нужно к разности прибавить вычитаемое.', h3: 'Первый шаг: к 36 прибавь 17. Полученное число и будет значением x.' },
        { id: 'sm3', type: 'Вычитание (уменьшаемое)', expression: 'x − 29 = 44', answer: '73', h1: 'Определи роль x: здесь x — неизвестное уменьшаемое.', h2: 'Правило: чтобы найти неизвестное уменьшаемое, нужно к разности прибавить вычитаемое.', h3: 'Первый шаг: к 44 прибавь 29. Полученное число и будет значением x.' }
    ],
    subtrahend: [
        { id: 'ss1', type: 'Вычитание (вычитаемое)', expression: '35 − x = 12', answer: '23', h1: 'Определи роль x: здесь x — неизвестное вычитаемое.', h2: 'Правило: чтобы найти неизвестное вычитаемое, нужно из уменьшаемого вычесть разность.', h3: 'Первый шаг: из 35 вычти 12. Полученное число и будет значением x.' },
        { id: 'ss2', type: 'Вычитание (вычитаемое)', expression: '64 − x = 29', answer: '35', h1: 'Определи роль x: здесь x — неизвестное вычитаемое.', h2: 'Правило: чтобы найти неизвестное вычитаемое, нужно из уменьшаемого вычесть разность.', h3: 'Первый шаг: из 64 вычти 29. Полученное число и будет значением x.' },
        { id: 'ss3', type: 'Вычитание (вычитаемое)', expression: '91 − x = 47', answer: '44', h1: 'Определи роль x: здесь x — неизвестное вычитаемое.', h2: 'Правило: чтобы найти неизвестное вычитаемое, нужно из уменьшаемого вычесть разность.', h3: 'Первый шаг: из 91 вычти 47. Полученное число и будет значением x.' }
    ],
    factor: [
        { id: 'sf1', type: 'Умножение (множитель)', expression: 'x × 6 = 48', answer: '8', h1: 'Определи роль x: здесь x — неизвестный множитель.', h2: 'Правило: чтобы найти неизвестный множитель, нужно произведение разделить на известный множитель.', h3: 'Первый шаг: 48 раздели на 6. Полученное число и будет значением x.' },
        { id: 'sf2', type: 'Умножение (множитель)', expression: '7 × x = 63', answer: '9', h1: 'Определи роль x: здесь x — неизвестный множитель.', h2: 'Правило: чтобы найти неизвестный множитель, нужно произведение разделить на известный множитель.', h3: 'Первый шаг: 63 раздели на 7. Полученное число и будет значением x.' },
        { id: 'sf3', type: 'Умножение (множитель)', expression: 'x × 9 = 72', answer: '8', h1: 'Определи роль x: здесь x — неизвестный множитель.', h2: 'Правило: чтобы найти неизвестный множитель, нужно произведение разделить на известный множитель.', h3: 'Первый шаг: 72 раздели на 9. Полученное число и будет значением x.' }
    ],
    dividend: [
        { id: 'sd1', type: 'Деление (делимое)', expression: 'x ÷ 5 = 9', answer: '45', h1: 'Определи роль x: здесь x — неизвестное делимое.', h2: 'Правило: чтобы найти неизвестное делимое, нужно частное умножить на делитель.', h3: 'Первый шаг: 9 умножь на 5. Полученное число и будет значением x.' },
        { id: 'sd2', type: 'Деление (делимое)', expression: 'x ÷ 8 = 7', answer: '56', h1: 'Определи роль x: здесь x — неизвестное делимое.', h2: 'Правило: чтобы найти неизвестное делимое, нужно частное умножить на делитель.', h3: 'Первый шаг: 7 умножь на 8. Полученное число и будет значением x.' },
        { id: 'sd3', type: 'Деление (делимое)', expression: 'x ÷ 6 = 12', answer: '72', h1: 'Определи роль x: здесь x — неизвестное делимое.', h2: 'Правило: чтобы найти неизвестное делимое, нужно частное умножить на делитель.', h3: 'Первый шаг: 12 умножь на 6. Полученное число и будет значением x.' }
    ],
    divisor: [
        { id: 'sv1', type: 'Деление (делитель)', expression: '56 ÷ x = 8', answer: '7', h1: 'Определи роль x: здесь x — неизвестный делитель.', h2: 'Правило: чтобы найти неизвестный делитель, нужно делимое разделить на частное.', h3: 'Первый шаг: 56 раздели на 8. Полученное число и будет значением x.' },
        { id: 'sv2', type: 'Деление (делитель)', expression: '81 ÷ x = 9', answer: '9', h1: 'Определи роль x: здесь x — неизвестный делитель.', h2: 'Правило: чтобы найти неизвестный делитель, нужно делимое разделить на частное.', h3: 'Первый шаг: 81 раздели на 9. Полученное число и будет значением x.' },
        { id: 'sv3', type: 'Деление (делитель)', expression: '96 ÷ x = 12', answer: '8', h1: 'Определи роль x: здесь x — неизвестный делитель.', h2: 'Правило: чтобы найти неизвестный делитель, нужно делимое разделить на частное.', h3: 'Первый шаг: 96 раздели на 12. Полученное число и будет значением x.' }
    ]
};

const middleEquationBank = [
    { id: 'me1', type: 'Два действия (сложение + умножение)', expression: '(x + 3) × 4 = 28', answer: '4', h1: 'Посмотри на (x + 3) как на один неизвестный множитель.', h2: 'Сначала примени правило для неизвестного множителя: произведение нужно разделить на известный множитель.', h3: 'Сначала выполни 28 ÷ 4, а затем из полученной суммы вычти 3.' },
    { id: 'me2', type: 'Два действия (вычитание + умножение)', expression: '(x − 2) × 5 = 35', answer: '9', h1: 'Посмотри на (x − 2) как на один неизвестный множитель.', h2: 'Сначала примени правило для неизвестного множителя: произведение нужно разделить на известный множитель.', h3: 'Сначала выполни 35 ÷ 5, а затем к полученной разности прибавь 2.' },
    { id: 'me3', type: 'Два действия (деление + сложение)', expression: 'x ÷ 3 + 5 = 13', answer: '24', h1: 'Посмотри на x ÷ 3 как на неизвестное слагаемое.', h2: 'Сначала примени правило для неизвестного слагаемого: из суммы нужно вычесть известное слагаемое.', h3: 'Сначала выполни 13 − 5, а затем полученное частное умножь на 3.' },
    { id: 'me4', type: 'Два действия (умножение + вычитание)', expression: 'x × 2 − 6 = 14', answer: '10', h1: 'Посмотри на x × 2 как на неизвестное уменьшаемое.', h2: 'Сначала примени правило для неизвестного уменьшаемого: к разности нужно прибавить вычитаемое.', h3: 'Сначала выполни 14 + 6, а затем полученное произведение раздели на 2.' },
    { id: 'me5', type: 'Два действия (деление + вычитание)', expression: '42 ÷ x − 1 = 5', answer: '7', h1: 'Посмотри на 42 ÷ x как на неизвестное уменьшаемое.', h2: 'Сначала примени правило для неизвестного уменьшаемого: к разности нужно прибавить вычитаемое.', h3: 'Сначала выполни 5 + 1. Затем, чтобы найти делитель, 42 раздели на полученное частное.' },
    { id: 'me6', type: 'Два действия (умножение + сложение)', expression: 'x × 3 + 7 = 28', answer: '7', h1: 'Посмотри на x × 3 как на неизвестное слагаемое.', h2: 'Сначала примени правило для неизвестного слагаемого: из суммы нужно вычесть известное слагаемое.', h3: 'Сначала выполни 28 − 7, а затем полученное произведение раздели на 3.' },
    { id: 'me7', type: 'Два действия (сложение + умножение)', expression: '(x + 5) × 3 = 36', answer: '7', h1: 'Посмотри на (x + 5) как на один неизвестный множитель.', h2: 'Сначала найди неизвестный множитель: произведение раздели на известный множитель.', h3: 'Сначала выполни 36 ÷ 3, а затем из полученной суммы вычти 5.' },
    { id: 'me8', type: 'Два действия (вычитание + умножение)', expression: '(x − 4) × 6 = 30', answer: '9', h1: 'Посмотри на (x − 4) как на один неизвестный множитель.', h2: 'Сначала найди неизвестный множитель: произведение раздели на известный множитель.', h3: 'Сначала выполни 30 ÷ 6, а затем к полученной разности прибавь 4.' },
    { id: 'me9', type: 'Два действия (деление + сложение)', expression: 'x ÷ 4 + 6 = 11', answer: '20', h1: 'Посмотри на x ÷ 4 как на неизвестное слагаемое.', h2: 'Сначала найди неизвестное слагаемое: из суммы вычти известное слагаемое.', h3: 'Сначала выполни 11 − 6, а затем полученное частное умножь на 4.' },
    { id: 'me10', type: 'Два действия (умножение + вычитание)', expression: 'x × 5 − 9 = 31', answer: '8', h1: 'Посмотри на x × 5 как на неизвестное уменьшаемое.', h2: 'Сначала найди неизвестное уменьшаемое: к разности прибавь вычитаемое.', h3: 'Сначала выполни 31 + 9, а затем полученное произведение раздели на 5.' },
    { id: 'me11', type: 'Два действия (деление + сложение)', expression: '72 ÷ x + 2 = 10', answer: '9', h1: 'Посмотри на 72 ÷ x как на неизвестное слагаемое.', h2: 'Сначала найди неизвестное слагаемое: из суммы вычти известное слагаемое.', h3: 'Сначала выполни 10 − 2. Затем 72 раздели на полученное частное, чтобы найти делитель.' },
    { id: 'me12', type: 'Два действия (умножение + сложение)', expression: 'x × 4 + 5 = 37', answer: '8', h1: 'Посмотри на x × 4 как на неизвестное слагаемое.', h2: 'Сначала найди неизвестное слагаемое: из суммы вычти известное слагаемое.', h3: 'Сначала выполни 37 − 5, а затем полученное произведение раздели на 4.' }
];

const hardEquationBank = [
    { id: 'he1', type: 'Три действия', expression: '(x + 5) × 2 − 4 = 16', answer: '5', h1: 'Посмотри на (x + 5) × 2 как на неизвестное уменьшаемое.', h2: 'Начинай с последнего действия: чтобы найти неизвестное уменьшаемое, к разности нужно прибавить вычитаемое.', h3: 'Сначала выполни 16 + 4, затем раздели результат на 2, а потом из полученной суммы вычти 5.' },
    { id: 'he2', type: 'Три действия', expression: '(x − 3) ÷ 2 + 7 = 12', answer: '13', h1: 'Посмотри на (x − 3) ÷ 2 как на неизвестное слагаемое.', h2: 'Начинай с последнего действия: чтобы найти неизвестное слагаемое, из суммы нужно вычесть известное слагаемое.', h3: 'Сначала выполни 12 − 7, затем умножь результат на 2, а потом к полученной разности прибавь 3.' },
    { id: 'he3', type: 'Три действия', expression: 'x × 4 − 8 + 2 = 18', answer: '6', h1: 'Посмотри на x × 4 − 8 как на неизвестное слагаемое.', h2: 'Начинай с последнего действия: чтобы найти неизвестное слагаемое, из суммы нужно вычесть известное слагаемое.', h3: 'Сначала выполни 18 − 2, затем к результату прибавь 8, а потом раздели на 4.' },
    { id: 'he4', type: 'Три действия со скобками', expression: '72 ÷ (x + 2) = 8', answer: '7', h1: 'Посмотри на (x + 2) как на неизвестный делитель.', h2: 'Сначала примени правило для неизвестного делителя: делимое нужно разделить на частное.', h3: 'Сначала выполни 72 ÷ 8, а затем из полученной суммы вычти 2.' },
    { id: 'he5', type: 'Три действия', expression: '(x + 4) × 3 − 6 = 24', answer: '6', h1: 'Посмотри на (x + 4) × 3 как на неизвестное уменьшаемое.', h2: 'Сначала найди неизвестное уменьшаемое: к разности прибавь вычитаемое.', h3: 'Сначала выполни 24 + 6, затем раздели результат на 3, а потом вычти 4.' },
    { id: 'he6', type: 'Три действия', expression: '(x − 2) × 4 + 5 = 29', answer: '8', h1: 'Посмотри на (x − 2) × 4 как на неизвестное слагаемое.', h2: 'Сначала найди неизвестное слагаемое: из суммы вычти известное слагаемое.', h3: 'Сначала выполни 29 − 5, затем раздели результат на 4, а потом прибавь 2.' },
    { id: 'he7', type: 'Три действия', expression: '(x + 1) ÷ 3 + 4 = 7', answer: '8', h1: 'Посмотри на (x + 1) ÷ 3 как на неизвестное слагаемое.', h2: 'Сначала найди неизвестное слагаемое: из суммы вычти известное слагаемое.', h3: 'Сначала выполни 7 − 4, затем умножь результат на 3, а потом вычти 1.' },
    { id: 'he8', type: 'Три действия со скобками', expression: '90 ÷ (x + 1) + 1 = 10', answer: '9', h1: 'Посмотри на 90 ÷ (x + 1) как на неизвестное слагаемое.', h2: 'Сначала найди неизвестное слагаемое: из суммы вычти известное слагаемое.', h3: 'Сначала выполни 10 − 1, затем 90 раздели на полученное частное, а потом вычти 1.' },
    { id: 'he9', type: 'Три действия', expression: 'x × 5 + 10 − 7 = 38', answer: '7', h1: 'Посмотри на x × 5 + 10 как на неизвестное уменьшаемое.', h2: 'Сначала найди неизвестное уменьшаемое: к разности прибавь вычитаемое.', h3: 'Сначала выполни 38 + 7, затем вычти 10, а потом раздели результат на 5.' },
    { id: 'he10', type: 'Три действия со скобками', expression: '84 ÷ (x + 3) − 2 = 5', answer: '9', h1: 'Посмотри на 84 ÷ (x + 3) как на неизвестное уменьшаемое.', h2: 'Сначала найди неизвестное уменьшаемое: к разности прибавь вычитаемое.', h3: 'Сначала выполни 5 + 2, затем 84 раздели на полученное частное, а потом вычти 3.' },
    { id: 'he11', type: 'Три действия', expression: '(x − 5) × 2 + 8 = 20', answer: '11', h1: 'Посмотри на (x − 5) × 2 как на неизвестное слагаемое.', h2: 'Сначала найди неизвестное слагаемое: из суммы вычти известное слагаемое.', h3: 'Сначала выполни 20 − 8, затем раздели результат на 2, а потом прибавь 5.' },
    { id: 'he12', type: 'Три действия со скобками', expression: '96 ÷ (x + 4) + 2 = 10', answer: '8', h1: 'Посмотри на 96 ÷ (x + 4) как на неизвестное слагаемое.', h2: 'Сначала найди неизвестное слагаемое: из суммы вычти известное слагаемое.', h3: 'Сначала выполни 10 − 2, затем 96 раздели на полученное частное, а потом вычти 4.' }
];

let lastSimpleIds = new Set();
let lastMiddleIds = new Set();
let lastHardIds = new Set();

function pickSimpleSet() {
    const selected = [];
    Object.values(simpleEquationBank).forEach(group => {
        let candidates = group.filter(item => !lastSimpleIds.has(item.id));
        if (candidates.length < 1) candidates = group;
        selected.push(shuffleArray(candidates)[0]);
    });
    return shuffleArray(selected);
}

function renderEquationCard(task, levelClass = '') {
    return `
        <div class="equation-card ${levelClass}">
            <div class="equation-type">${task.type}</div>
            <div class="equation-problem">${task.expression}</div>
            <button class="hint-toggle" type="button" aria-expanded="false"
                data-hint-step="0"
                data-hint-1="${task.h1}"
                data-hint-2="${task.h2}"
                data-hint-3="${task.h3}">
                <span class="hint-bulb" aria-hidden="true">💡</span>
                <span class="hint-label">Подсказка 1/3</span>
            </button>
            <div class="equation-hint" hidden></div>
            <input type="number" class="equation-input" placeholder="Введи ответ" data-answer="${task.answer}">
            <button class="check-btn">Проверить</button>
            <div class="equation-feedback"></div>
        </div>`;
}

function initializeEquationTrainers() {
    renderSimpleEquations();
    renderMiddleEquations();
    renderHardEquations();

    const simpleButton = document.getElementById('shuffle-simple-btn');
    const middleButton = document.getElementById('shuffle-middle-btn');
    const hardButton = document.getElementById('shuffle-hard-btn');

    if (simpleButton) simpleButton.addEventListener('click', () => renderSimpleEquations(true));
    if (middleButton) middleButton.addEventListener('click', () => renderMiddleEquations(true));
    if (hardButton) hardButton.addEventListener('click', () => renderHardEquations(true));
}

function renderSimpleEquations(animate = false) {
    const grid = document.getElementById('simple-equations-grid');
    if (!grid) return;
    const tasks = pickSimpleSet();
    lastSimpleIds = new Set(tasks.map(task => task.id));
    grid.innerHTML = tasks.map(task => renderEquationCard(task)).join('');
    bindEquationInteractions(grid);
    if (animate) animateRefresh(grid);
}

function renderMiddleEquations(animate = false) {
    const grid = document.getElementById('middle-equations-grid');
    if (!grid) return;
    const tasks = pickDistinctSet(middleEquationBank, 6, lastMiddleIds);
    lastMiddleIds = new Set(tasks.map(task => task.id));
    grid.innerHTML = shuffleArray(tasks).map(task => renderEquationCard(task, 'middle')).join('');
    bindEquationInteractions(grid);
    if (animate) animateRefresh(grid);
}

function renderHardEquations(animate = false) {
    const grid = document.getElementById('hard-equations-grid');
    if (!grid) return;
    const tasks = pickDistinctSet(hardEquationBank, 4, lastHardIds);
    lastHardIds = new Set(tasks.map(task => task.id));
    grid.innerHTML = shuffleArray(tasks).map(task => renderEquationCard(task, 'hard')).join('');
    bindEquationInteractions(grid);
    if (animate) animateRefresh(grid);
}

// ============================================
// ЗАДАНИЯ С ВЫБОРОМ ОТВЕТА
// ============================================

function initializeSelects(root = document) {
    root.querySelectorAll('.task-select').forEach(select => {
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
        feedbackElement.textContent = '✓ Верно! Отличная работа.';
        feedbackElement.classList.remove('incorrect');
        feedbackElement.classList.add('show', 'correct');
        selectElement.disabled = true;
        selectElement.style.opacity = '0.72';
        animateSuccess(selectElement.closest('.task-card'));
    } else {
        stats.mistakes++;
        feedbackElement.textContent = 'Пока неверно. Ещё раз проанализируй компоненты и попробуй снова.';
        feedbackElement.classList.remove('correct');
        feedbackElement.classList.add('show', 'incorrect');
        selectElement.value = '';
    }

    updateResults();
}

// ============================================
// ТРЁХСТУПЕНЧАТЫЕ ПОДСКАЗКИ
// ============================================

function initializeHintToggles(root = document) {
    root.querySelectorAll('.hint-toggle').forEach(toggle => {
        if (toggle.dataset.listenerBound === 'true') return;
        toggle.dataset.listenerBound = 'true';

        toggle.addEventListener('click', function() {
            const card = this.closest('.equation-card');
            const hint = card.querySelector('.equation-hint');
            const currentStep = Number(this.dataset.hintStep || '0');

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
// ПРОВЕРКА УРАВНЕНИЙ
// ============================================

function bindEquationInteractions(root) {
    initializeHintToggles(root);
    initializeEquationInputs(root);
}

function initializeEquationInputs(root = document) {
    root.querySelectorAll('.check-btn').forEach(button => {
        if (button.dataset.listenerBound === 'true') return;
        button.dataset.listenerBound = 'true';
        button.addEventListener('click', function() {
            checkEquation(this);
        });
    });

    root.querySelectorAll('.equation-input').forEach(input => {
        if (input.dataset.listenerBound === 'true') return;
        input.dataset.listenerBound = 'true';
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
    if (resetBtn) resetBtn.addEventListener('click', resetAllTasks);
}

function resetAllTasks() {
    stats = {
        solved: 0,
        independent: 0,
        withHint: 0,
        mistakes: 0
    };

    renderRecognitionTasks(true);
    renderErrorTasks(true);
    renderSimpleEquations(true);
    renderMiddleEquations(true);
    renderHardEquations(true);
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
            duration,
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
        const card = e.target.closest('.task-card, .equation-card');
        if (card) card.style.transform = 'scale(1.02)';
    }
}, true);

document.addEventListener('blur', function(e) {
    if (e.target.classList.contains('equation-input') || e.target.classList.contains('task-select')) {
        const card = e.target.closest('.task-card, .equation-card');
        if (card) card.style.transform = 'scale(1)';
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
