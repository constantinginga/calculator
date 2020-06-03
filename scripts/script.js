// Implement view history feature (make numpad disappear and show history on full screen)
// Add animations (Make keys flash on click)


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


function pwr(base, p) {
    return base**p;
}


function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}


function operate(a, b, operator) {
    return (operator === '+') ? add([a, b])
        : (operator === '-') ? subtract([a, b])
        : (operator === '*') ? multiply([a, b])
        : (operator === '/') ? divide([a, b])
        : (operator === '^') ? pwr(a, b)
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
    newNumber = '', operatorPresent, history = [], numberId, operatorId;


numbers.forEach(number => {
    number.addEventListener('click', e => {
        numberId = number.id;
        addNumber();
    });
});


operators.forEach(operator => {
    operator.addEventListener('click', e => {
        operatorId = operator.id;
        addOperator();
    });
});


clr.addEventListener('click', clearScreen);
bkspc.addEventListener('click', removeLastValue);
equal.addEventListener('click', calculate);
historyBtn.addEventListener('click', e => {
    showHistory();
})


function formatExpression() {
    // remove operator if it's the last element
    if (Number.isNaN(+screenValues[screenValues.length - 1])) screenValues.pop();
}


// perform operations in the correct order
function evaluateExpression() {
    history.push(screenValues.join(' '));
    let result;
    while (screenValues.length !== 1) {
        // do operations in the correct order
        index = [screenValues.indexOf('*'), screenValues.indexOf('/'), screenValues.indexOf('^')];
        if (index[2] !== -1 && screenValues.length > 3) {
            result = operate(screenValues[index[2] - 1], screenValues[index[2] + 1], screenValues[index[2]]);
            screenValues.splice(index[2] - 1, 3, result);
        } else if (index[0] !== -1 && screenValues.length > 3) {
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
    if (!Number.isFinite(screenValues[0]) || Number.isNaN(screenValues[0])) screenValues = `Error`;
}


function clearScreen(e) {
    screen.innerHTML = '';
    screenValues = [];
    newNumber = '';
}


function updateValues() {
    if (screenValues.includes('Error')) {
        screen.innerHTML = screenValues;
        newNumber = '';
        history.pop();
    } else {
        newNumber = round(+screenValues.join(), 10);
        screen.innerHTML = +newNumber;
        // if history array is not empty and doesn't contain a result already, add result
        if (history.length !== 0) 
        if (!history[history.length - 1].includes('=')) history[history.length - 1] += ` = ${+newNumber}`;
    }
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
        newNumber = newNumber.toString().slice(0, -1);
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

// keyboard support
window.addEventListener('keydown', e => {
    const number = document.querySelector(`div[class="num"][id="${e.key}"]`);
    const operator = document.querySelector(`div[class="oper"][id="${e.key}"]`);
    if (number) {
        numberId = number.id;
        addNumber();
    } else if (operator) {
        operatorId = operator.id;
        addOperator();
    } else if (e.code === 'Equal') calculate();
    else if (e.code === 'KeyC' || e.code === 'Escape') clearScreen();
    else if (e.code === 'Backspace') removeLastValue();
    else if (e.code === 'KeyH') showHistory();
    else return;
});


function addNumber() {
    operatorPresent = false;
    if (!operatorPresent)
    if (numberId !== '.' || numberId === '.' && !newNumber.toString().includes('.')) {
        newNumber += numberId;
        if (screen.innerHTML.includes('Error')) screen.innerHTML = '';
        screen.innerHTML += numberId;
    }
}

function addOperator() {
    // don't allow more than one operator in a row
    if (!operatorPresent) {
        if (newNumber !== '') {
            // add number to array
            screenValues.push(+newNumber);
            // reset variable for next number
            newNumber = '';
        }
        // add the operator if it's not the first value
        if (screenValues.length !== 0) {
        screenValues.push(operatorId);
        if (screen.innerHTML.includes('Error')) screen.innerHTML = '';
        screen.innerHTML += ` ${operatorId} `;
        operatorPresent = true;
        }
    }
}

function showHistory() {
    console.log(history);
}