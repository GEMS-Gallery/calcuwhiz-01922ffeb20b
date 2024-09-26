import { backend } from 'declarations/backend';

let display = document.getElementById('display');
let buttons = document.querySelectorAll('button');
let clearBtn = document.getElementById('clear');
let equalsBtn = document.getElementById('equals');

let currentValue = '';
let operator = '';
let waitingForSecondOperand = false;

buttons.forEach(button => {
    button.addEventListener('click', () => {
        if (button.classList.contains('num')) {
            inputNumber(button.innerText);
        } else if (button.classList.contains('op')) {
            inputOperator(button.innerText);
        }
    });
});

clearBtn.addEventListener('click', clearDisplay);
equalsBtn.addEventListener('click', calculate);

function inputNumber(num) {
    if (waitingForSecondOperand) {
        display.value = num;
        waitingForSecondOperand = false;
    } else {
        display.value = display.value === '0' ? num : display.value + num;
    }
}

function inputOperator(op) {
    if (operator && waitingForSecondOperand) {
        operator = op;
        return;
    }
    if (currentValue === '') {
        currentValue = display.value;
    } else if (operator) {
        calculate();
    }
    operator = op;
    waitingForSecondOperand = true;
}

async function calculate() {
    if (waitingForSecondOperand || !operator) return;

    let secondOperand = display.value;
    let result;

    try {
        switch (operator) {
            case '+':
                result = await backend.add(parseFloat(currentValue), parseFloat(secondOperand));
                break;
            case '-':
                result = await backend.subtract(parseFloat(currentValue), parseFloat(secondOperand));
                break;
            case '*':
                result = await backend.multiply(parseFloat(currentValue), parseFloat(secondOperand));
                break;
            case '/':
                if (secondOperand === '0') {
                    throw new Error('Division by zero');
                }
                result = await backend.divide(parseFloat(currentValue), parseFloat(secondOperand));
                if (result === null) {
                    throw new Error('Division by zero');
                }
                break;
        }
        display.value = result;
        currentValue = result;
        operator = '';
        waitingForSecondOperand = false;
    } catch (error) {
        display.value = 'Error';
        currentValue = '';
        operator = '';
        waitingForSecondOperand = false;
    }
}

function clearDisplay() {
    display.value = '0';
    currentValue = '';
    operator = '';
    waitingForSecondOperand = false;
}
