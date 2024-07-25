type CalculatorState = "FNInputting" | "SNInputting" | "ResultDisplaying"
// STATE CHANGES:
// FNInput -> (operatorInput) -> SNInput -> (operatorInput) -> ResultDisplay
// ResultDisplay -> (1)operatorInput | (2)DigitInput -> (1)SNInput[result becomes firstNum] | (2) FNInput

class Calculator {
    calculatorDiv: HTMLElement | null = document.querySelector("#calculator");
    displayValue: HTMLElement | null = document.querySelector("#displayValue");
    firstNumber = ""
    secondNumber = ""
    action = ""
    calculatorState: CalculatorState = "FNInputting"
    actionsMap: { [key: string]: any } = {
        "/": this.divide.bind(this),
        "+": this.add.bind(this),
        "-": this.minus.bind(this),
        "*": this.multiply.bind(this),
        "%": this.percent.bind(this),
    }
    calculate(){
        return this.actionsMap[this.action]()
    }
    buttonsMap: { [key: string]: any }  = {
        b_action: (event: Event) => {
            if(!this.firstNumber){
                this.clear()
                return
            }
            const target = event.target as HTMLElement;
            const action = target.dataset.value as string
            if (action === "=" && !this.action){
                return
            }
            if (action === "+/-"){
                this.changeSign()
                return
            }
            if(this.calculatorState === "FNInputting"){
                this.transit()
                this.action = action
            }
            else if(this.calculatorState === "SNInputting"){
                this.transit()
                if(!this.secondNumber){
                    this.secondNumber = this.firstNumber
                }
                const result = this.calculate()
                this.firstNumber = result
                this.action = ""
                this.updateDisplay(result)
            }
            else if(this.calculatorState === "ResultDisplaying"){
                this.transit();
                this.action = action;
                this.secondNumber = "";
            }
        },
        digit: (event: Event) => {
            const target = event.target as HTMLElement;
            const digit = target.dataset.value as string
            if(this.calculatorState === "FNInputting"){
                if(digit === "." && this.firstNumber.includes(".")){
                    return
                }
                this.firstNumber = this.firstNumber.concat(digit)
                this.updateDisplay(this.firstNumber)
            }
            else if(this.calculatorState === "SNInputting"){
                if(digit === "." && this.secondNumber.includes(".")){
                    return
                }
                this.secondNumber = this.secondNumber.concat(digit)
                this.updateDisplay(this.secondNumber)
            }
            else if(this.calculatorState === "ResultDisplaying"){
                this.clear()
                this.firstNumber = this.firstNumber.concat(digit)
                this.updateDisplay(this.firstNumber)
            }
        },
        b_clear: () => {
            this.clear()
        },
    }
    startButtonListening() {
        if (this.calculatorDiv) {
        this.calculatorDiv.addEventListener("click", event=> {
            const target = event.target as HTMLElement;
            if (target) {
                if (target.dataset.handler && target.dataset.handler in this.buttonsMap) {
                    this.buttonsMap[target.dataset.handler](event)
                }
            }
        })
        }
    }
    updateDisplay(text: string){
        if (this.displayValue) {
            this.displayValue.textContent = text;
        }
    }
    clear(){
        this.secondNumber = ""
        this.firstNumber = ""
        this.action = ""
        this.calculatorState = "FNInputting"
        this.updateDisplay("0")
    }

    divide(){
        return +this.firstNumber / +this.secondNumber
    }
    add(){
        return +this.firstNumber + +this.secondNumber
    }
    minus(){
        return +this.firstNumber - +this.secondNumber
    }
    multiply(){
        return +this.firstNumber * +this.secondNumber
    }
    percent(){
        return +this.firstNumber * (+this.secondNumber/100)
    }

    transit(){
        if(this.calculatorState == "FNInputting") {
            this.calculatorState = "SNInputting"
        } else if(this.calculatorState == "SNInputting"){
            this.calculatorState = "ResultDisplaying"
        }  else if(this.calculatorState == "ResultDisplaying"){
            this.calculatorState = "SNInputting"
        }
    }
    changeSign(){
        if(this.calculatorState == "FNInputting" || this.calculatorState == "ResultDisplaying"){
            this.firstNumber = String(-1 * +this.firstNumber)
            this.updateDisplay(this.firstNumber)
        }
        if(this.calculatorState == "SNInputting"){
            this.secondNumber = String(-1 * +this.secondNumber)
            this.updateDisplay(this.secondNumber)
        }
    }
    logCalculatorState(){
        console.log(`Calculator info: state: ${this.calculatorState} firstNumber: ${this.firstNumber} 
        secondNumber: ${this.secondNumber} action: ${this.action}`)
    }
}

const calculator = new Calculator();
calculator.startButtonListening();

