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
     * picked. Unary operators (e.g. sqrt) should be executed immediately.
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
            callback: function (a) { return a; }
        }
    ];

    var result = 0;
    var displayedValue = '0';
    var newNumber = true;
    var lastOperator = null;
    var currentOperator = null;

    function each (arrayLike, callback) {
        Array.prototype.forEach.call(arrayLike, callback);
    }

    function buttonClicked (action) {

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

            each(operators, function (o) {
                if (o.action === action) {
                    currentOperator = o;
                }
            });


            if (lastOperator && (currentOperator.binary || currentOperator.action === '=')) {
                if (currentOperator.action === '=') {
                    currentOperator = null;
                }
                result = lastOperator.callback(result, parseFloat(displayedValue));
                displayedValue = result;
                lastOperator = null;
            }
            else if (!currentOperator.binary) {
                result = currentOperator.callback(parseFloat(displayedValue));
                displayedValue = result;
                lastOperator = null;
                currentOperator = null;
            }
            else {
                result = parseFloat(displayedValue);
            }

            newNumber = true;

        }
        return displayedValue;
    }

    function getThemeClass(theme) {
        return theme === 'dark' ? 'dark-theme' : 'light-theme';
    }


    Polymer({
        getResult: function () {
            return result;
        },
        getCurrentValue: function () {
            return displayedValue;
        },
        themeChanged: function (oldValue, newValue) {
            var container = this.shadowRoot.querySelector('.container');
            container.classList.remove(getThemeClass(oldValue));
            container.classList.add(getThemeClass(newValue));
        },
        ready: function() {
            console.log('ready');
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
