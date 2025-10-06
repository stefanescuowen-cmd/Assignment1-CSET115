const display = document.getElementById('display');

const formulaDisplay = document.getElementById('formula-display');

let currentFunction = null;
let current ='0';
let previous = null;
let operator=null;
let justCalculated = false;
let memory = 0;


function updateDisplay(){
    display.textContent = current === '' ? '0' : current;;
    display.style.color = current === 'Error' ? 'red' : 'black';
    updateFormulaDisplay();
}


function updateFormulaDisplay(){
    let displayText = '';

if(currentFunction){
    switch(currentFunction){
            case '√' :
            displayText = `√(${current})`;
            break;

            case 'sqr' :
            displayText = `(${current}²)`;
            break;

            case '1/' :
            displayText = `1/(${current})`;
            break;

            case '%' :
            displayText = `${current}%`;
            break;

            case '% of' :
            displayText = `${current}% of ${previous}`;
            break;
    }
}

    else if(previous !== null && operator !== null){
        displayText = `${previous} ${operator} ${current}`;
    }
    else{
        displayText = current;
    }
    formulaDisplay.textContent = displayText;
}


function inputDigit(digit){
    if(current === 'Error' || justCalculated || current === ''){
        current = digit;
        justCalculated = false;
    }
    else{
        current = current ==='0' ? digit : current + digit;
    }
    updateDisplay()
}


function inputDecimal(){
    if(current === 'Error') current = '0';
    if (!current.includes('.')){
        current += '.';
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
    if(current === 'Error') current = '0';
    if (current.length > 1) current = current.slice(0, -1);
    else current = '0';
    updateDisplay();
}


function negate(){
    if(current === 'Error') return;
    if (current !== '0'){
        current = current.charAt(0) === '-' ? current.slice(1) : '-' + current;
    }
    else if(previous !== null && operator !== null){
        current = '-0';
    }
    justCalculated = false;
        updateDisplay();
}


function percent(){
    if(current === 'Error') return;
    let result;
    if(previous !== null && operator !== null){
        result = (previous * Number(current)) / 100;
        currentFunction = '% of';
        addToHistory(`${Number(current)}% of ${previous} = ${result}`)
    }
    else{
        result = Number(current) / 100;
        currentFunction = '%';
        addToHistory(`${current}% = ${result}`)
    }
    current = String(result);
    justCalculated = false;
    updateDisplay();
    currentFunction = null;
}


function reciprocal(){
    if(current === 'Error') return;
    if (Number(current) === 0){
        current = 'Error'
    }
    else{
        let result = 1 / Number(current);
        currentFunction = '1/';
        addToHistory(`1/(${current}) = ${result}`)
        current = String(result);
    }
    justCalculated = true;
    updateDisplay();
    currentFunction = null;
}


function square(){
    if(current === 'Error') return;
    let result = Number(current) ** 2;
    currentFunction = 'sqr'
    addToHistory(`${current}² = ${result}`);
    current = String(result);
    justCalculated = true;
    updateDisplay();
    currentFunction = null;
}


function sqrt(){
    if(current === 'Error') return;
    if(Number(current) < 0){
        current = 'Error'
    }
    else{
        let result = Math.sqrt(Number(current));
        currentFunction = '√';
        addToHistory(`√(${current}) = ${result}`);
        current = String(result);
    }
    justCalculated = true;
    updateDisplay();
    currentFunction = null;
}


function handleOperator(op){
    if(current === 'Error') current = '0';
    if (operator && previous !== null && !justCalculated){
        calculate();
    }
    else{
        previous = Number(current);
    }
    operator = op;
    current = '';
}


function calculate(){
    if (!operator || previous === null || current === 'Error') return;
    let result;
    
    if (operator === '/' && (Number(previous) === 0 || Number(current) === 0)){
        result = 'Error'
    } else{
    switch(operator){
        case '+': result = previous + Number(current); break;
        case '-': result = previous - Number(current); break;
        case '*': result = previous * Number(current); break;
        case '/': result = previous / Number(current); break;
        default: return;
    }

}
    if (result !== 'Error'){
    addToHistory(`${previous} ${operator} ${current} = ${result}`);
    }
    
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


document.addEventListener('keydown', (e) => {
    const key = e.key;

if (!isNaN(key)){
    inputDigit(key);
}

else if (key === '.'){
    inputDecimal();
}

else if(['+', '-', '*', '/'].includes(key)){
    handleOperator(key);
}

else if (key === 'Enter' || key === '='){
    if (operator && previous === null){
        previous = Number(current);
        current = '0';
    }
    calculate();
}

else if (key === 'Escape'){
    allClear();
} 

else if(key === 'c'){
    clearEntry();
}

else if (key === 'Backspace'){
    backspace();
}

else if (key === '%'){
    percent();
}

else if (key === '_' || key === '~' || key === 'n'){
    negate();
}

else if(key === 'r' || key === '^'){
    reciprocal();
}

else if(key === 's'){
    square();
}

else if(key === 'q'){
    sqrt();
}

updateFormulaDisplay();
});