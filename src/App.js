import { useReducer } from 'react';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';
import './App.css';


// ACTIONS are defined to aid in the use Reducer hook

export const ACTIONS = {
  ADD: 'add-digit',
  CLEAR: 'clear',
  DELETE: 'delete-digit',
  CHOOSE: 'choose-operation',
  EVALUATE: 'evaluate'
}

// this reducer helps to either append a digit in the operand, choose an operation, or clear or delete output

function reducer(state, {type, payload}){
  switch(type){

    case ACTIONS.ADD:

      if(state.overwrite)
        return{
          ...state,
          currentOperand: payload.digit,
          overwrite: false
        }
        
      if(payload.digit === '0' && state.currentOperand === '0') 
        return state

        if(payload.digit === '.' && state.currentOperand.includes(".")) 
        return state
      
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }

    case ACTIONS.CLEAR:

      return {}

    case ACTIONS.CHOOSE:

      if(state.currentOperand == null && state.previousOperand == null)
        return state

      if(state.currentOperand == null){
        return{
          ...state,
          operation: payload.operation
        }
      }

      if(state.previousOperand == null){
        return{
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        }
      }

      return{
        ...state,
        previousOperand: evaluate(state),
        currentOperand: null,
        operation: payload.operation
      }

    case ACTIONS.EVALUATE:

      if(state.operation == null || state.currentOperand == null || state.previousOperand == null){
        return state
      }

      return{
        ...state,
        overwrite : true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state)
      }

    case ACTIONS.DELETE:
        if(state.overwrite)
          return {}

        if(state.currentOperand == null)
          return state

        if(state.currentOperand.length === 1)
          return { 
            ...state,
             currentOperand: null
          }

        return{
          ...state,
          currentOperand: state.currentOperand.slice(0,-1)
        }
  }
}


// this formatter is used to add commas to make the number readable

const FORMAT = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0
})


function formatOperand(operand){

  if(operand == null)
    return
  
  const [int, dec] = operand.split(".")

  if(dec == null)
    return FORMAT.format(int)

  return `${FORMAT.format(int)}.${dec}`
}

// evaluate function that is called in reducer

function evaluate({currentOperand, previousOperand, operation}){

  const prev = parseFloat(previousOperand)
  const curr = parseFloat(currentOperand)

  if(isNaN(prev) || isNaN(curr))
    return ""

  let answer = ""

  switch(operation){

    case "+":
      answer = prev + curr;
      break;

    case "-":
      answer = prev - curr;
      break;

    case "*":
      answer = prev * curr;
      break;

    case "/":
      answer = prev / curr;
      break;
  } 
  return answer.toString();
}


// main App 

function App() {

  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {})

  return (
    <div className="calculator">
      <div className = "output">
        <div className='previous-operand'>{formatOperand(previousOperand)} {operation}</div>
        <div className='current-operand'>{formatOperand(currentOperand)}</div>
      </div>
      <button className ="span-two" onClick = {() => {dispatch({type: ACTIONS.CLEAR})}}>AC</button>
      <button onClick = { () => dispatch({ type: ACTIONS.DELETE})}>DEL</button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />

      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />

      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />

      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className ="span-two" onClick = {() => dispatch ({ type: ACTIONS.EVALUATE})}>=</button>
    </div>
  );
  
}

export default App;



