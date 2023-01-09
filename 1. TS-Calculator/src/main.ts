import "./style.css";

type Operator = '+' | '-' | 'x' | '÷' | '=';  
type ComputedValue = {
  [key in Exclude<Operator, '='>]: (num1: number, num2: number) => number;
}

interface CalculatorInterface {
  tempValue: number | string;
  tempOperator?: Operator | string;
  render(inputValue: string | number): void;
  reset(): void;
  calculate(operator: Operator | string): void;
  initEvent(): void;
}

const VALID_NUMBER_OF_DIGITS = 3;
const INIT_VALUE = 0;
const resultEl = <HTMLDivElement>document.querySelector('#result');
  
const validatNumberLength = (value: string | number) => {
  return String(value).length < VALID_NUMBER_OF_DIGITS;
};

const isZero = (value: string) => Number(value) === 0;

const getComputedValue: ComputedValue = {
  '+' : (num1, num2) => num1 + num2,
  '-' : (num1, num2) => num1 - num2,
  'x' : (num1, num2) => num1 * num2,
  '÷' : (num1, num2) => num1 / num2,
}; 


const Calculator: CalculatorInterface = {
  tempValue: INIT_VALUE,
  tempOperator: undefined,
  render(inputValue : string | number) {
    const prevValue = resultEl.innerText;

    if(!validatNumberLength(prevValue)) {
      alert('3자리 이상의 숫자를 입력할 수 없습니다.');
      return;
    }

    if (resultEl) {
      resultEl.innerText = isZero(prevValue) ?  String(inputValue) : String(prevValue + inputValue);
    }
  },
  reset() {
    resultEl.innerText = String(INIT_VALUE);
  },

  calculate(operator: Operator | string) {
    const isReadyCalculate = operator === '=';
    const isTempCalculate = ['+' , '-' , 'x' , '÷'].includes(operator);

    if (isTempCalculate) {

      this.tempOperator = operator;
      this.tempValue = Number(resultEl.innerText);

      resultEl.innerText = String(INIT_VALUE);

      return;
    }

    if (this.tempOperator && isReadyCalculate) {
      const resultValue = getComputedValue[this.tempOperator as Exclude<Operator, '='>](Number(this.tempValue), Number(resultEl.innerText));

      resultEl.innerText = String(resultValue);
    }

  },

  initEvent() {
    const buttonContainerEl = document.querySelector('.contents');

  buttonContainerEl?.addEventListener('click', ({ target }) => {
    const buttonText = (target as HTMLButtonElement).innerText;

    if (buttonText === 'AC') {
      this.reset()
    } else if (!isNaN(Number(buttonText))) {
      this.render(Number(buttonText));
    } else if (isNaN(Number(buttonText))) {
      this.calculate(buttonText);
    }
  })
  },
} 

Calculator.render(INIT_VALUE);
Calculator.initEvent();