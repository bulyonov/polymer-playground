/**
 * There are two ways to implement a simple calculator:
 * 1. Concatenate all input and use "eval" function to run the code when a new operator comes in.
 * 2. Remember the previous result, existing input and operator and run them separately (seems to be safer).
 * I picked the second way.
 */

(function () {
    var DOT = '.',
        NUMBERS = '0123456789';

    /**
     * The list of operators.
     *
     * All operators can have one or two arguments. Depending on the amount of arguments, the way how they are executed
     * is different: binary operators are executed only after the second argument is added and the next operator is
     * picked. Unary operators (e.g. sqrt) should be executed immediately using the value which is currently shown.
     *
     * Thus, we need to work with these operators separately.
     */
    var operators = [
        {
            action: '+',
            binary: true,
            callback: function(a, b) { return a + b; }
        },
        {
            action: '-',
            binary: true,
            callback: function(a, b) {return a - b; }
        },
        {
            action: '/',
            binary: true,
            callback: function(a, b) { return a / b; }
        },
        {
            action: '*',
            binary: true,
            callback: function (a, b) { return a * b; }
        },
        {
            action: 'sqrt',
            binary: false,
            callback: function (a) { return Math.sqrt(a); }
        },
        {
            action: 'sqr',
            binary: false,
            callback: function (a) { return a * a; }
        },
        {
            action: '=',
            binary: false,
            finish: true,
            callback: function (a) { return a; }
        }
    ];

    /**
     * The result of last calculation.
     */
    var lastEvaluationResult = 0;

    /**
     * The value to display.
     */
    var displayedValue = '0';

    /**
     * True if the number is new (e.g. when the input should be restarted).
     */
    var newNumber = true;

    /**
     * Last operator. Object or null.
     */
    var lastOperator = null;

    /**
     * Current operator. Object or null.
     */
    var currentOperator = null;

    /**
     * Each function for better loops for array-like structures.
     */
    function each (arrayLike, callback) {
        Array.prototype.forEach.call(arrayLike, callback);
    }

    function buttonClicked (action) {
        // Add one more number (or dot) to the displayed value.
        if ((NUMBERS + DOT).indexOf(action) !== -1) {
            if (action !== DOT || action === DOT && displayedValue.indexOf(DOT) === -1) {
                if (newNumber) {
                    displayedValue = '';
                    newNumber = false;
                }
                displayedValue += action;
                lastOperator = currentOperator;
            }
        }
        else {
            // Find the appropriate operator.
            each(operators, function (o) {
                if (o.action === action) {
                    currentOperator = o;
                }
            });


            // If current operator is binary or user clicked "=" button, run the previous operator.
            if (lastOperator && (currentOperator.binary || currentOperator.finish)) {
                if (currentOperator.finish) {
                    currentOperator = null;
                }
                lastEvaluationResult = lastOperator.callback(lastEvaluationResult, parseFloat(displayedValue));
                displayedValue = lastEvaluationResult;
                lastOperator = null;
            }
            // If current operator has only one argument, run the operator immediately.
            else if (!currentOperator.binary) {
                lastEvaluationResult = currentOperator.callback(parseFloat(displayedValue));
                displayedValue = lastEvaluationResult;
                lastOperator = null;
                currentOperator = null;
            }
            // Don't do anything.
            else {
                lastEvaluationResult = parseFloat(displayedValue);
            }

            newNumber = true;

        }
        return displayedValue;
    }

    /**
     * Return the appropriate theme for the calculator.
     */
    function getThemeClass(theme) {
        return theme === 'dark' ? 'dark-theme' : 'light-theme';
    }


    Polymer({
        /**
         * Return a result of last evaluation.
         */
        getResult: function () {
            return lastEvaluationResult;
        },
        /**
         * Return a current value from a display.
         */
        getCurrentValue: function () {
            return displayedValue;
        },
        /**
         * Update a class of the container each time when the attibute is changed.
         */
        themeChanged: function (oldValue, newValue) {
            var container = this.shadowRoot.querySelector('.container');
            container.classList.remove(getThemeClass(oldValue));
            container.classList.add(getThemeClass(newValue));
        },
        ready: function() {
            var elements = this.shadowRoot.querySelectorAll('.button');
            var display = this.shadowRoot.querySelector('.display');
            each(elements, function (button) {
                var action = button.getAttribute('x-action');
                if (!action) {
                    return;
                }
                button.addEventListener('click', function () {
                    display.innerHTML = buttonClicked(action);
                });
            });
            display.innerHTML = displayedValue;
        }
    });
})();
