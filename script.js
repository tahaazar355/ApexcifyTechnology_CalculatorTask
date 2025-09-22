(function () {
    const exprEl = document.getElementById('expression');
    const resEl = document.getElementById('result');
    let expression = '';

    function sanitizeForEval(input) {
        let s = input.replace(/×/g, '*').replace(/÷/g, '/').replace(/[^0-9+\-*/().%\s]/g, '');
        return s;
    }

    function tryEval(input) {
        const cleaned = sanitizeForEval(input).replace(/%/g, '/100');
        if (!/^[0-9+\-*/().\s]+$/.test(cleaned)) return null;
        try {
            const val = Function('return (' + cleaned + ')')();
            if (typeof val === 'number' && isFinite(val)) return val;
            return null;
        } catch (e) {
            return null;
        }
    }

    function updateScreen() {
        exprEl.textContent = expression || '0';
        const value = tryEval(expression);
        if (value === null) {
            resEl.textContent = '';
            resEl.classList.add('small');
        } else {
            const text = Number.isInteger(value) ? value.toString() : value.toString();
            resEl.textContent = '= ' + text;
            resEl.classList.remove('small');
        }
    }

    function append(char) {
        if (/[+\-*/]/.test(char)) {
            if (expression === '' && char !== '-') return;
            if (/[+\-*/]$/.test(expression) && char !== '-') {
                expression = expression.slice(0, -1) + char;
                updateScreen();
                return;
            }
        }
        expression += char;
        updateScreen();
    }

    function backspace() { expression = expression.slice(0, -1); updateScreen(); }
    function clearAll() { expression = ''; updateScreen(); }
    function evaluateNow() {
        const val = tryEval(expression);
        if (val === null) return;
        expression = String(val);
        updateScreen();
    }

    document.querySelectorAll('button.key').forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.dataset.key;
            if (key === 'clear') return clearAll();
            if (key === 'back') return backspace();
            if (key === '=') return evaluateNow();
            if (key === '%') return append('%');
            if (key === '*') return append('*');
            if (key === '/') return append('/');
            append(key);
        });
    });

    window.addEventListener('keydown', (e) => {
        const k = e.key;
        if (k === 'Escape') { e.preventDefault(); clearAll(); return; }
        if (k === 'Backspace') { e.preventDefault(); backspace(); return; }
        if (k === 'Enter' || k === '=') { e.preventDefault(); evaluateNow(); return; }
        if (k === '%') { append('%'); return; }
        if (/^[0-9+\-*/().]$/.test(k)) {
            append(k);
            e.preventDefault();
        }
    });

    updateScreen();
    document.querySelectorAll('button.key').forEach(b => b.setAttribute('tabindex', '0'));
})();
