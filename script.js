// ============ CALCULADORA PADRÃO ============
let firstOperand = '';
let secondOperand = '';
let currentOperation = null;
let shouldResetScreen = false;

const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operator]');
const equalsButton = document.getElementById('equalsBtn');
const clearButton = document.getElementById('clearBtn');
const deleteButton = document.getElementById('deleteBtn');
const pointButton = document.getElementById('pointBtn');
const lastOperationScreen = document.getElementById('lastOperationScreen');
const currentOperationScreen = document.getElementById('currentOperationScreen');

window.addEventListener('keydown', handleKeyboardInput);
equalsButton.addEventListener('click', evaluate);
clearButton.addEventListener('click', clear);
deleteButton.addEventListener('click', deleteNumber);
pointButton.addEventListener('click', appendPoint);

numberButtons.forEach((btn) =>
  btn.addEventListener('click', () => appendNumber(btn.textContent))
);
operatorButtons.forEach((btn) =>
  btn.addEventListener('click', () => setOperation(btn.textContent))
);

// Feedback tátil em dispositivos touch
document.querySelectorAll('.btn').forEach((btn) => {
  btn.addEventListener('touchstart', () => btn.classList.add('touch-active'), { passive: true });
  btn.addEventListener('touchend', () => btn.classList.remove('touch-active'));
  btn.addEventListener('touchcancel', () => btn.classList.remove('touch-active'));
});

function appendNumber(number) {
  if (currentOperationScreen.textContent === '0' || shouldResetScreen) resetScreen();
  currentOperationScreen.textContent += number;
}

function resetScreen() {
  currentOperationScreen.textContent = '';
  shouldResetScreen = false;
}

function clear() {
  currentOperationScreen.textContent = '0';
  lastOperationScreen.textContent = '';
  firstOperand = '';
  secondOperand = '';
  currentOperation = null;
}

function appendPoint() {
  if (shouldResetScreen) resetScreen();
  if (currentOperationScreen.textContent === '') currentOperationScreen.textContent = '0';
  if (currentOperationScreen.textContent.includes('.')) return;
  currentOperationScreen.textContent += '.';
}

function deleteNumber() {
  currentOperationScreen.textContent = currentOperationScreen.textContent.toString().slice(0, -1);
  if (currentOperationScreen.textContent === '') currentOperationScreen.textContent = '0';
}

function setOperation(operator) {
  if (currentOperation !== null) evaluate();
  firstOperand = currentOperationScreen.textContent;
  currentOperation = operator;
  lastOperationScreen.textContent = `${firstOperand} ${currentOperation}`;
  shouldResetScreen = true;
}

function evaluate() {
  if (currentOperation === null || shouldResetScreen) return;
  if (currentOperation === '÷' && currentOperationScreen.textContent === '0') {
    alert("Não é possível dividir por 0!");
    return;
  }
  secondOperand = currentOperationScreen.textContent;
  currentOperationScreen.textContent = roundResult(
    operate(currentOperation, firstOperand, secondOperand)
  );
  lastOperationScreen.textContent = `${firstOperand} ${currentOperation} ${secondOperand} =`;
  currentOperation = null;
}

function roundResult(number) {
  return Math.round(number * 1000) / 1000;
}

function handleKeyboardInput(e) {
  if (e.key >= 0 && e.key <= 9) appendNumber(e.key);
  if (e.key === '.') appendPoint();
  if (e.key === '=' || e.key === 'Enter') evaluate();
  if (e.key === 'Backspace') deleteNumber();
  if (e.key === 'Escape') clear();
  if (['+', '-', '*', '/'].includes(e.key)) setOperation(convertOperator(e.key));
}

function convertOperator(keyboardOperator) {
  if (keyboardOperator === '/') return '÷';
  if (keyboardOperator === '*') return '×';
  if (keyboardOperator === '-') return '−';
  if (keyboardOperator === '+') return '+';
}

function add(a, b) { return a + b; }
function substract(a, b) { return a - b; }
function multiply(a, b) { return a * b; }
function divide(a, b) { return a / b; }

function operate(operator, a, b) {
  a = Number(a);
  b = Number(b);
  switch (operator) {
    case '+': return add(a, b);
    case '−': return substract(a, b);
    case '×': return multiply(a, b);
    case '÷': return b === 0 ? null : divide(a, b);
    default: return null;
  }
}

// ============ JUROS COMPOSTOS ============
const tabBasic = document.getElementById('tabBasic');
const tabJuros = document.getElementById('tabJuros');
const basicCalc = document.getElementById('basicCalc');
const jurosPanel = document.getElementById('jurosPanel');
const calcularJuros = document.getElementById('calcularJuros');
const jurosResult = document.getElementById('jurosResult');

tabBasic.addEventListener('click', () => switchTab('basic'));
tabJuros.addEventListener('click', () => switchTab('juros'));

function switchTab(tab) {
  if (tab === 'basic') {
    tabBasic.classList.add('active');
    tabJuros.classList.remove('active');
    basicCalc.style.display = 'block';
    jurosPanel.classList.remove('active');
  } else {
    tabJuros.classList.add('active');
    tabBasic.classList.remove('active');
    basicCalc.style.display = 'none';
    jurosPanel.classList.add('active');
  }
}

calcularJuros.addEventListener('click', () => {
  const capital = parseFloat(document.getElementById('capital').value) || 0;
  const taxa = parseFloat(document.getElementById('taxa').value) / 100 || 0;
  const periodo = parseInt(document.getElementById('periodo').value) || 0;
  const aporte = parseFloat(document.getElementById('aporte').value) || 0;

  if (periodo <= 0) {
    jurosResult.style.display = 'block';
    jurosResult.innerHTML = '⚠️ Informe um período válido (maior que 0).';
    return;
  }

  // Montante com juros compostos + aportes mensais
  // Fórmula: M = C*(1+i)^n + PMT * [((1+i)^n - 1) / i]
  let montante;
  if (taxa === 0) {
    montante = capital + aporte * periodo;
  } else {
    const fator = Math.pow(1 + taxa, periodo);
    montante = capital * fator + aporte * ((fator - 1) / taxa);
  }

  const totalInvestido = capital + aporte * periodo;
  const juros = montante - totalInvestido;

  const fmt = (v) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  jurosResult.style.display = 'block';
  jurosResult.innerHTML = `
    <div>Total investido: <strong>${fmt(totalInvestido)}</strong></div>
    <div>Juros ganhos: <strong>${fmt(juros)}</strong></div>
    <div>Montante final: <strong>${fmt(montante)}</strong></div>
  `;
});
// Botão Limpar — Juros Compostos
const limparJuros = document.getElementById('limparJuros');

limparJuros.addEventListener('click', () => {
  // Limpa os campos
  document.getElementById('capital').value = '1000';
  document.getElementById('taxa').value = '1';
  document.getElementById('periodo').value = '12';
  document.getElementById('aporte').value = '';

  // Esconde o resultado
  jurosResult.style.display = 'none';
  jurosResult.innerHTML = '';

  // Foca no primeiro campo (bom para UX)
  document.getElementById('capital').focus();
});