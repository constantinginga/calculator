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
// Split screen into array
let screenValues = screen.innerHTML.split(''),
    newNumber = '', operatorPresent;

numbers.forEach(number => {
    number.addEventListener('click', e => {
        operatorPresent = false;
        if (!operatorPresent) {
            newNumber += number.id;
        }
        screen.innerHTML += number.id;
    });
});

operators.forEach(operator => {
    operator.addEventListener('click', e => {
        operatorPresent = true;
        screenValues.push(+newNumber);
        newNumber = '';
        if (!(operator.id == 'clr' || operator.id == 'bkspc')) {
            screenValues.push(operator.id);
            screen.innerHTML += ` ${operator.id} `;
        }
        console.log(screenValues[screenValues.length - 1]);
    });
});


clr.addEventListener('click', e => {
    screen.innerHTML = '';
    screenValues = [];
});


equal.addEventListener('click', e => {
    // add last number to array
    if (newNumber !== '' && screenValues.length !== 1) {
        screenValues.push(+newNumber);
    }
    checkValidExpression();
    console.log(screenValues);
});

// prevent user from inputting more than one operator in a row
// add power operator to index
// clean up code and spread into functions, remove unnecessary parantheses
// Implement view history feature (make numpad disappear and show history on full screen)
// Make keys flash on click

function checkValidExpression() {
    // perform calculations if an operator is present and it isn't the last value
    if (Number.isNaN(+screenValues[screenValues.length - 1])) {
        screenValues.pop();
    }
    console.log(screenValues);
    // if there is only number, show it, else calculate
    (screenValues.length === 1) ? screen.innerHTML = screenValues[0] : calculate();
}

function calculate() {
    let result;
    while (screenValues.length !== 1) {
        index = [screenValues.indexOf('*'), screenValues.indexOf('/')];
        if (index[0] !== -1 && screenValues.length > 3) {
            result = operate(screenValues[index[0] - 1], screenValues[index[0] + 1], screenValues[index[0]]);
            screenValues.splice(index[0] - 1, 3, result);
        } else if (index[1] !== -1 && screenValues.length > 3) {
            result = operate(screenValues[index[1] - 1], screenValues[index[1] + 1], screenValues[index[1]]);
            screenValues.splice(index[1] - 1, 3, result);
        }
        result = operate(screenValues[0], screenValues[2], screenValues[1]);
        screenValues.splice(0, 3, result);
    };
    newNumber = result;
    screen.innerHTML = +screenValues.join();
    screenValues = [];
}