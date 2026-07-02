(function () {
    "use strict";

    function attachCopyButtons() {
        var blocks = document.querySelectorAll('.entry-content pre');
        blocks.forEach(function (pre) {
            var btn = document.createElement('button');
            btn.className = 'copy-code-btn';
            btn.textContent = 'Copy';

            btn.addEventListener('click', function () {
                var code = pre.querySelector('code');
                var text = code ? code.innerText : pre.innerText;
                navigator.clipboard.writeText(text).then(function () {
                    btn.textContent = 'Copied!';
                    btn.classList.add('copied');
                    setTimeout(function () {
                        btn.textContent = 'Copy';
                        btn.classList.remove('copied');
                    }, 2000);
                });
            });

            pre.appendChild(btn);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attachCopyButtons);
    } else {
        attachCopyButtons();
    }
})();
