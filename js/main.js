(function () {
    function prefersReducedMotion() {
        return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function initTilt3D() {
        if (prefersReducedMotion()) {
            return;
        }
        var cards = Array.from(document.querySelectorAll('.tilt-3d'));
        cards.forEach(function (card) {
            if (card.dataset.tiltReady === '1') {
                return;
            }
            card.dataset.tiltReady = '1';
            card.addEventListener('mousemove', function (event) {
                var rect = card.getBoundingClientRect();
                var x = (event.clientX - rect.left) / rect.width - 0.5;
                var y = (event.clientY - rect.top) / rect.height - 0.5;
                var rotateY = x * 14;
                var rotateX = -y * 14;
                card.style.transform = 'perspective(1100px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
            });
            card.addEventListener('mouseleave', function () {
                card.style.transform = '';
            });
        });
    }

    function initMobileMenu() {
        var toggle = document.querySelector('[data-mobile-menu-toggle]');
        var panel = document.querySelector('[data-mobile-menu-panel]');

        if (!toggle || !panel) {
            return;
        }

        if (toggle.dataset.menuReady === '1') {
            return;
        }

        toggle.dataset.menuReady = '1';

        function setOpen(isOpen) {
            panel.classList.toggle('hidden', !isOpen);
            toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        }

        toggle.addEventListener('click', function () {
            setOpen(panel.classList.contains('hidden'));
        });

        panel.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                setOpen(false);
            });
        });

        document.addEventListener('click', function (event) {
            if (panel.classList.contains('hidden')) {
                return;
            }

            if (panel.contains(event.target) || toggle.contains(event.target)) {
                return;
            }

            setOpen(false);
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth >= 768) {
                setOpen(false);
            }
        });
    }

    function runRevealAnimation() {
        if (prefersReducedMotion()) {
            return;
        }

        if (window.innerWidth < 768) {
            return;
        }

        var elements = Array.from(document.querySelectorAll('body *')).filter(function (el) {
            var tag = el.tagName;
            if (!tag || ['SCRIPT', 'STYLE', 'LINK', 'META', 'NOSCRIPT', 'HEAD', 'TITLE', 'HTML', 'BODY'].includes(tag)) {
                return false;
            }
            return el.getClientRects().length > 0;
        });

        elements.forEach(function (el) {
            var delay = 0;
            var keepTransform = el.classList.contains('tilt-3d') || el.classList.contains('image-3d-effect') || el.classList.contains('image-3d-frame') || el.classList.contains('image-3d');
            var frames = keepTransform
                ? [
                    { opacity: 0, filter: 'blur(6px)' },
                    { opacity: 1, filter: 'blur(0)' }
                ]
                : [
                    { opacity: 0, transform: 'translateY(42px) scale(0.985)', filter: 'blur(6px)' },
                    { opacity: 1, transform: 'translateY(0) scale(1)', filter: 'blur(0)' }
                ];

            el.animate(frames, {
                duration: 700,
                easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                delay: delay,
                fill: 'both'
            });
        });
    }

    function startEffects() {
        runRevealAnimation();
        initTilt3D();
        initMobileMenu();
    }

    if (document.readyState === 'complete') {
        startEffects();
    } else {
        window.addEventListener('load', startEffects, { once: true });
    }

    window.addEventListener('pageshow', function (event) {
        if (event.persisted) {
            startEffects();
        }
    });
})();