(function () {
    var DOT = '.',
        NUMBERS = '0123456789';

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
    var currentString = '';
    var newNumber = true;
    var lastOperator = null;
    var currentOperator = null;
    var themeClass = '';

    function each (arrayLike, callback) {
        Array.prototype.forEach.call(arrayLike, callback);
    }

    function runAction (action) {

        if ((NUMBERS + DOT).indexOf(action) !== -1) {
            if (action !== DOT || action === DOT && currentString.indexOf(DOT) === -1) {
                if (newNumber) {
                    currentString = '';
                    newNumber = false;
                }
                currentString += action;
                lastOperator = currentOperator;
            }
        }
        else {

            each(operators, function (o) {
                if (o.action === action) {
                    currentOperator = o;
                }
            });

            if (lastOperator) {
                if (!lastOperator.binary) {
                    result = lastOperator.callback(parseFloat(currentString));
                }
                else {
                    result = lastOperator.callback(result, parseFloat(currentString));

                }
                currentString = result;

                lastOperator = null;
            }
            else {
                result = parseFloat(currentString);
            }

            newNumber = true;

        }
        console.log(lastOperator, currentOperator, currentString, result);
        console.log(result);
        return currentString;
    }

    function getThemeClass(theme) {
        return theme === 'dark' ? 'dark-theme' : 'light-theme';
    }


    Polymer({
        getResult: function () {
            return result;
        },
        getCurrentValue: function () {
            return currentString;
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
                    display.innerHTML = runAction(action);
                });
            });
            display.innerHTML = currentString;
        }
    });
})();
