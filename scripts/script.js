function add(arr) {
    return arr.reduce((total, number) => {
        return total += number;
    }, 0);
}


function subtract(arr) {
    return arr.reduce((total, number) => {
        return total -= number;
    });
}


function multiply(arr) {
    return arr.reduce((total, number) => {
        return total *= number;
    }, 1);
}


function divide(arr) {
    return arr.reduce((total, number) => {
        return total /= number;
    });
}


function operate(a, b, operator) {
    return (operator === '+') ? add([a, b])
        : (operator === '-') ? subtract([a, b])
        : (operator === '*') ? multiply([a, b])
        : (operator === '/') ? divide([a, b])
        : 'Unexpected error';
}

const screen = document.querySelector('#screen');
const numbers = document.querySelectorAll('.num');
const operators = document.querySelectorAll('.oper');
const equal = document.querySelector('#equal');
const clr = document.querySelector('#clr');
const bkspc = document.querySelector('#bkspc');
const historyBtn = document.querySelector('#history');
let screenValues = screen.innerHTML.split(''),
    newNumber = '', operatorPresent, history = [];


numbers.forEach(number => {
    number.addEventListener('click', e => {
        operatorPresent = false;
        if (!operatorPresent) newNumber += number.id;
        screen.innerHTML += number.id;
    });
});


operators.forEach(operator => {
    operator.addEventListener('click', e => {
        // don't allow more than one operator in a row
        if (!operatorPresent) {
            if (newNumber !== '') {
                // add number to array
                screenValues.push(+newNumber);
                // reset variable for next number
                newNumber = '';
            }
            // add the operator
            screenValues.push(operator.id);
            screen.innerHTML += ` ${operator.id} `;
            operatorPresent = true;
        }
    });
});


clr.addEventListener('click', clearScreen);
bkspc.addEventListener('click', removeLastValue);
equal.addEventListener('click', calculate);
historyBtn.addEventListener('click', e => {
    console.log(history);
})

// add power operator to index
// Implement view history feature (make numpad disappear and show history on full screen)
// Make keys flash on click

function formatExpression() {
    // remove operator if it's the last element
    if (Number.isNaN(+screenValues[screenValues.length - 1])) screenValues.pop();
}

// perform operations in the correct order
function evaluateExpression() {
    history.push(screenValues.join(' '));
    let result;
    while (screenValues.length !== 1) {
        // if these operators are present, evaluate them first
        index = [screenValues.indexOf('*'), screenValues.indexOf('/')];
        if (index[0] !== -1 && screenValues.length > 3) {
            result = operate(screenValues[index[0] - 1], screenValues[index[0] + 1], screenValues[index[0]]);
            screenValues.splice(index[0] - 1, 3, result);
        } else if (index[1] !== -1 && screenValues.length > 3) {
            result = operate(screenValues[index[1] - 1], screenValues[index[1] + 1], screenValues[index[1]]);
            screenValues.splice(index[1] - 1, 3, result);
        }
        // replace each two operands and operator with result
        result = operate(screenValues[0], screenValues[2], screenValues[1]);
        screenValues.splice(0, 3, result);
    };
}

function clearScreen(e) {
    screen.innerHTML = '';
    screenValues = [];
    newNumber = '';
}

function updateValues() {
    newNumber = screenValues.join();
    screen.innerHTML = +newNumber;
    screenValues = [];
}

function calculate(e) {
    // add last number to array
    if (newNumber !== '' && screenValues.length !== 1) screenValues.push(+newNumber);
    formatExpression();
    // if there is only number, show it, else calculate
    (screenValues.length === 1) ? screen.innerHTML = screenValues[0] : evaluateExpression();
    updateValues();
}

function removeLastValue(e) {
    if (!screenValues.length) {
        // remove last digit from number
        newNumber = newNumber.slice(0, -1);
        screen.innerHTML = newNumber;
    } else {
        if (newNumber === '') {
            screenValues.pop();
            operatorPresent = false;
        } else {
            newNumber = newNumber.slice(0, -1);
        }
        screen.innerHTML = `${screenValues.join(' ')} ${newNumber}`;
    }
}
