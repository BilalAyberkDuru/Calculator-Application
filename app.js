const calculatorDisplay = document.querySelector('.calculator-result-screen');
const calculatorHistory = document.querySelector('.calculator-history');
const calculatorKeys = document.querySelector('.calculator-keys');
const themeButton = document.querySelector('.theme-button');
const body = document.body;

let firstValue = '';
let operatorValue = '';
let waitingForSecondValue = false;

localStorage.setItem('theme', 'dark');

themeButton.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    
    if (body.classList.contains('light-theme')) {
        localStorage.setItem('theme', 'light');
    } else {
        localStorage.setItem('theme', 'dark');
    }
});

calculatorKeys.addEventListener('click', function(e) {
    if (!e.target.matches('button')) return;

    const key = e.target;
    const keyValue = key.value;
    const displayValue = calculatorDisplay.value;
    const { type } = key.dataset;

    if (keyValue === '-' && waitingForSecondValue) {
        calculatorDisplay.value = '-';
        waitingForSecondValue = false;
        return;
    }

    if (key.classList.contains('operator')) {
        handleOperator(keyValue);
        return;
    }

    if (key.classList.contains('decimal')) {
        inputDecimal();
        return;
    }

    if (key.classList.contains('clear')) {
        clear();
        return;
    }

    inputNumber(keyValue);
});

function handleOperator(operator) {
    const currentValue = parseFloat(calculatorDisplay.value);

    if (operator === '+/-') {
        calculatorDisplay.value = currentValue * -1;
        return;
    }

    if (operatorValue && waitingForSecondValue) {
        operatorValue = operator;
        return;
    }

    if (!firstValue) {
        firstValue = currentValue;
    } else if (operatorValue) {
        const result = calculate(firstValue, currentValue, operatorValue);
        calculatorDisplay.value = result;
        calculatorHistory.value = `${firstValue} ${operatorValue} ${currentValue} = ${result}`;
        firstValue = result;
    }

    waitingForSecondValue = true;
    operatorValue = operator;
}

function calculate(first, second, operator) {
    switch (operator) {
        case '+':
            return first + second;
        case '-':
            return first - second;
        case '*':
            return first * second;
        case '/':
            return first / second;
        case '%':
            return (first * second) / 100;
        default:
            return second;
    }
}

function inputNumber(num) {
    if (waitingForSecondValue) {
        calculatorDisplay.value = num;
        waitingForSecondValue = false;
    } else {
        calculatorDisplay.value = calculatorDisplay.value === '0' ? num : calculatorDisplay.value + num;
    }
}

function inputDecimal() {
    if (waitingForSecondValue) {
        calculatorDisplay.value = '0.';
        waitingForSecondValue = false;
        return;
    }

    if (!calculatorDisplay.value.includes('.')) {
        calculatorDisplay.value += '.';
    }
}

function clear() {
    calculatorDisplay.value = '0';
    calculatorHistory.value = '';
    firstValue = '';
    operatorValue = '';
    waitingForSecondValue = false;
}

calculatorDisplay.value = '0';