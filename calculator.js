// STATE CHANGES:
// FNInput -> (operatorInput) -> SNInput -> (operatorInput) -> ResultDisplay
// ResultDisplay -> (1)operatorInput | (2)DigitInput -> (1)SNInput[result becomes firstNum] | (2) FNInput
var Calculator = /** @class */ (function () {
    function Calculator() {
        var _this = this;
        this.calculatorDiv = document.querySelector("#calculator");
        this.displayValue = document.querySelector("#displayValue");
        this.firstNumber = "";
        this.secondNumber = "";
        this.action = "";
        this.calculatorState = "FNInputting";
        this.actionsMap = {
            "/": this.divide.bind(this),
            "+": this.add.bind(this),
            "-": this.minus.bind(this),
            "*": this.multiply.bind(this),
            "%": this.percent.bind(this),
        };
        this.buttonsMap = {
            b_action: function (event) {
                if (!_this.firstNumber) {
                    _this.clear();
                    return;
                }
                var target = event.target;
                var action = target.dataset.value;
                if (action === "=" && !_this.action) {
                    return;
                }
                if (action === "+/-") {
                    _this.changeSign();
                    return;
                }
                if (_this.calculatorState === "FNInputting") {
                    _this.transit();
                    _this.action = action;
                }
                else if (_this.calculatorState === "SNInputting") {
                    _this.transit();
                    if (!_this.secondNumber) {
                        _this.secondNumber = _this.firstNumber;
                    }
                    var result = _this.calculate();
                    _this.firstNumber = result;
                    _this.action = "";
                    _this.updateDisplay(result);
                }
                else if (_this.calculatorState === "ResultDisplaying") {
                    _this.transit();
                    _this.action = action;
                    _this.secondNumber = "";
                }
            },
            digit: function (event) {
                var target = event.target;
                var digit = target.dataset.value;
                if (_this.calculatorState === "FNInputting") {
                    if (digit === "." && _this.firstNumber.includes(".")) {
                        return;
                    }
                    _this.firstNumber = _this.firstNumber.concat(digit);
                    _this.updateDisplay(_this.firstNumber);
                }
                else if (_this.calculatorState === "SNInputting") {
                    if (digit === "." && _this.secondNumber.includes(".")) {
                        return;
                    }
                    _this.secondNumber = _this.secondNumber.concat(digit);
                    _this.updateDisplay(_this.secondNumber);
                }
                else if (_this.calculatorState === "ResultDisplaying") {
                    _this.clear();
                    _this.firstNumber = _this.firstNumber.concat(digit);
                    _this.updateDisplay(_this.firstNumber);
                }
            },
            b_clear: function () {
                _this.clear();
            },
        };
    }
    Calculator.prototype.calculate = function () {
        return this.actionsMap[this.action]();
    };
    Calculator.prototype.startButtonListening = function () {
        var _this = this;
        if (this.calculatorDiv) {
            this.calculatorDiv.addEventListener("click", function (event) {
                var target = event.target;
                if (target) {
                    if (target.dataset.handler && target.dataset.handler in _this.buttonsMap) {
                        _this.buttonsMap[target.dataset.handler](event);
                    }
                }
            });
        }
    };
    Calculator.prototype.updateDisplay = function (text) {
        if (this.displayValue) {
            this.displayValue.textContent = text;
        }
    };
    Calculator.prototype.clear = function () {
        this.secondNumber = "";
        this.firstNumber = "";
        this.action = "";
        this.calculatorState = "FNInputting";
        this.updateDisplay("0");
    };
    Calculator.prototype.divide = function () {
        return +this.firstNumber / +this.secondNumber;
    };
    Calculator.prototype.add = function () {
        return +this.firstNumber + +this.secondNumber;
    };
    Calculator.prototype.minus = function () {
        return +this.firstNumber - +this.secondNumber;
    };
    Calculator.prototype.multiply = function () {
        return +this.firstNumber * +this.secondNumber;
    };
    Calculator.prototype.percent = function () {
        return +this.firstNumber * (+this.secondNumber / 100);
    };
    Calculator.prototype.transit = function () {
        if (this.calculatorState == "FNInputting") {
            this.calculatorState = "SNInputting";
        }
        else if (this.calculatorState == "SNInputting") {
            this.calculatorState = "ResultDisplaying";
        }
        else if (this.calculatorState == "ResultDisplaying") {
            this.calculatorState = "SNInputting";
        }
    };
    Calculator.prototype.changeSign = function () {
        if (this.calculatorState == "FNInputting" || this.calculatorState == "ResultDisplaying") {
            this.firstNumber = String(-1 * +this.firstNumber);
            this.updateDisplay(this.firstNumber);
        }
        if (this.calculatorState == "SNInputting") {
            this.secondNumber = String(-1 * +this.secondNumber);
            this.updateDisplay(this.secondNumber);
        }
    };
    Calculator.prototype.logCalculatorState = function () {
        console.log("Calculator info: state: ".concat(this.calculatorState, " firstNumber: ").concat(this.firstNumber, " \n        secondNumber: ").concat(this.secondNumber, " action: ").concat(this.action));
    };
    return Calculator;
}());
var calculator = new Calculator();
calculator.startButtonListening();
