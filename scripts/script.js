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


const screen = document.querySelector('#screen'),
    numbers = document.querySelectorAll('.num'),
    operators = document.querySelectorAll('.oper'),
    equal = document.querySelector('#equal'),
    clr = document.querySelector('#clr'),
    bkspc = document.querySelector('#bkspc'),
    historyBtn = document.querySelector('#history');
let screenValues = screen.innerHTML.split(''),
    newNumber = '', operatorPresent, history = [], numberId, operatorId, historyMode = false,
    temp = document.querySelector('#calc-container'),
    btnPosition = document.getElementById('0'),
    btnContainer = document.querySelector('#calc-numpad');


clr.addEventListener('click', clearScreen);
bkspc.addEventListener('click', removeLastValue);
equal.addEventListener('click', calculate);
historyBtn.addEventListener('click', e => showHistory());


numbers.forEach(number => {
    number.addEventListener('click', e => {
        number.classList.add('flash');
        numberId = number.id;
        addNumber();
    });
    number.addEventListener('transitionend', removeTransition);
});


operators.forEach(operator => {
    operator.addEventListener('click', e => {
        operatorId = operator.id;
        addOperator();
    });
});


// remove operator if it's the last element
function formatExpression() {
    if (Number.isNaN(+screenValues[screenValues.length - 1])) screenValues.pop();
}


// perform operations in the correct order
function evaluateExpression() {
    if (screenValues.length != 0) {
        // if max history length, remove the oldest expression
        if (history.length === 9) history.shift();
        // add new expression to array
        history.push(screenValues.join(' '));
    }
    let result;
    while (screenValues.length > 1) {
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
    // prevent division by zero
    if ((!Number.isFinite(screenValues[0]) || Number.isNaN(screenValues[0])) && screenValues.length != 0) screenValues = `Error`;
}


function clearScreen(e) {
    screen.innerHTML = '';
    screenValues = [];
    newNumber = '';
}


function updateValues() {
    // if there's an error, show it and remove from history
    if (screenValues.includes('Error')) {
        screen.innerHTML = screenValues;
        newNumber = '';
        history.pop();
    } else {
        if (screenValues.length != 0) 
        (screenValues.includes('.')) ? newNumber = round(+screenValues.join(), 10) : newNumber = screenValues[0];
        if (newNumber.toString().length > 10) newNumber = newNumber.toExponential(5);
        screen.innerHTML = newNumber;
        // if history array is not empty and doesn't contain a result already, add result
        if (history.length !== 0 && screenValues.length != 0) 
        if (!history[history.length - 1].includes('=')) history[history.length - 1] += ` = ${newNumber}`;
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


// backspace functionality
function removeLastValue(e) {
    if (!screenValues.length) {
        // remove last digit from number
        newNumber = newNumber.toString().slice(0, -1);
        screen.innerHTML = newNumber;
    } else {
        // if the screen has more than one value
        if (newNumber === '') {
            // if it's an operator, remove it and allow for another one
            screenValues.pop();
            operatorPresent = false;
        } else {
            // if it's a number, remove its last digit
            newNumber = newNumber.slice(0, -1);
        }
        screen.innerHTML = `${screenValues.join(' ')} ${newNumber}`;
    }
}


// keyboard support
window.addEventListener('keydown', e => {
    // select correct number or operator
    const number = document.querySelector(`div[class="num"][id="${e.key}"]`);
    const operator = document.querySelector(`div[class="oper"][id="${e.key}"]`);
    if (number) {
        number.classList.add('flash');
        number.addEventListener('transitionend', removeTransition);
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
    if (numberId !== '.' || numberId === '.' && !newNumber.toString().includes('.') && newNumber.toString().length != 0) {
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


function removeTransition(e) {
    if (e.propertyName !== 'transform') return;
    e.target.classList.remove('flash');
}


// history functionality
function showHistory() {
    // toggle history mode
    (!historyMode) ? historyMode = true : historyMode = false;
    const body = document.getElementsByTagName('body')[0];
    const script = document.getElementsByTagName('script')[0];
    // create new container for history list
    let calcContainer = document.createElement('div');
    calcContainer.id = 'calc-container';
    calcContainer.classList.add('fade');
    temp.classList.remove('fade');
    // split container into grid with 10 rows
    calcContainer.style.cssText = `display: grid; grid-template-rows: repeat(10, 1fr); align-items: center; padding: 1rem 3rem;`;
    // fill grid with history elements and empty divs (if necessary)
    let emptyDivs = 0;
    if (history.length !== 9) emptyDivs = 9 - history.length;
    for (let i = 0; i < history.length; i++) {
        const historyElement = document.createElement('div');
        historyElement.style.cssText = `color: var(--white); font-size: 3rem; padding: .5rem; border-bottom: 1px solid var(--border-white);`;
        historyElement.innerHTML = history[i];
        calcContainer.appendChild(historyElement);
    }
    for (let i = 0; i < emptyDivs; i++) {
        const emptyDiv = document.createElement('div');
        calcContainer.appendChild(emptyDiv);
    }
    // insert history button on the last row
    historyBtn.style.cssText = `justify-content: left`;
    calcContainer.appendChild(historyBtn);
    // remove calculator and add the newly created history page
    if (historyMode) {
        body.removeChild(temp);
        body.insertBefore(calcContainer, script);    
    }
    // go back to calculator
    if (!historyMode) {
        temp.classList.add('fade');
        calcContainer.classList.remove('fade');
        historyBtn.style.cssText = `justify-content: center`;
        btnContainer.insertBefore(historyBtn, btnPosition);
        body.removeChild(document.querySelector('#calc-container'));
        body.insertBefore(temp, script);
    }
}