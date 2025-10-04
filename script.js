const display = document.getElementById('display');
let current ='0';
let previous = null;
let operator=null;
let justCalculated = false;
let memory = 0;


function updateDisplay(){
    display.textContent = current;
}

function inputDigit(digit){
    if(justCalculated){
        current = digit;
        justCalculated = false;
    }
    else{
        current = current ==='0' ? digit : current + digit;
    }
    updateDisplay()
}


function inputDecimal(){
    if (!current.includes('.')){
        current += '.'
    }
    updateDisplay()
}


function clearEntry(){
    current = '0';
    updateDisplay();
}


function allClear(){
    current = '0';
    previous = null;
    operator = null;
    justCalculated = false;
    updateDisplay();
}


function backspace(){
    if (current.length > 1) current = current.slice(0, -1);
    else current = '0';
    updateDisplay();
}


function negate(){
    if (current !== '0'){
        current = current.charAt(0) === '-' ? current.slice(1) : '-' + current;
        updateDisplay();
    }
}


function percent(){
    current = String(Number(current) / 100);
    updateDisplay();
}


function reciprocal(){
    current = Number(current) === 0 ? 'Error' : String(1 / Number(current));
    justCalculated = true;
    updateDisplay();
}


function square(){
    current = String(Number(current) ** 2);
    justCalculated = true;
    updateDisplay();
}


function sqrt(){
    current = Number(current) < 0 ? 'Error' : String(Math.sqrt(Number(current)));
    justCalculated = true;
    updateDisplay();
}


function handleOperator(op){
    if (operator && previous !== null && !justCalculated){
        calculate();
    }
    else{
        previous = Number(current);
    }
    operator = op;
    current = '0';
}


function calculate(){
    if (!operator || previous === null) return;
    let result;
    switch(operator){
        case '+': result = previous + Number(current); break;
        case '-': result = previous - Number(current); break;
        case '*': result = previous * Number(current); break;
        case '/': result = Number(current) === 0 ? 'Error' : previous / Number(current); break;
    }

    addToHistory(`${previous} ${operator} ${current} = ${result}`)

    current = String(result);
    previous = null;
    operator = null;
    justCalculated = true;
    updateDisplay();
}


function addToHistory(entry){
    const historyList = document.getElementById('history-list');
    const li = document.createElement('li');
    li.textContent = entry;
    historyList.prepend(li);
}


function memoryClear(){ memory = 0; }
function memoryRecall(){ current = String(memory); updateDisplay(); }
function memoryStore(){ memory = Number(current); }
function memoryPlus(){ memory += Number(current); }
function memoryMinus(){ memory -= Number(current); }


document.querySelectorAll('.keypad button').forEach(btn =>{
    const action = btn.getAttribute('data-action');
    const value = btn.getAttribute('data-value');

    btn.addEventListener('click', () => {
        switch(action){
            case 'digit' : inputDigit(value); break;
            case 'decimal' : inputDecimal(); break;
            case 'ce' : clearEntry(); break;
            case 'c' : allClear(); break;
            case 'back' : backspace(); break;
            case 'negate' : negate(); break;
            case 'percent' : percent(); break;
            case 'reciprocal' : reciprocal(); break;
            case 'square' : square(); break;
            case 'sqrt' : sqrt(); break;
            case 'operator' : handleOperator(value); break;
            case 'equals' : calculate(); break;
        }
    });
});


document.getElementById('mc').addEventListener('click', memoryClear);
document.getElementById('mr').addEventListener('click', memoryRecall);
document.getElementById('ms').addEventListener('click', memoryStore);
document.getElementById('mplus').addEventListener('click', memoryPlus);
document.getElementById('mminus').addEventListener('click', memoryMinus);
document.getElementById('clear-history').addEventListener("click", () =>{
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = "";
});