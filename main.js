(function() {
    var wrapper = document.getElementById('wrapper');
    var main = document.getElementById('main');
    var panels = Array.from(main.querySelectorAll('.panel'));
    var nav = document.getElementById('nav');
    var navLinks = Array.from(nav.querySelectorAll('a'));

    window.addEventListener('load', function() {
        window.setTimeout(function() {
            document.body.classList.remove('is-preload');
        }, 100);
    });

    navLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            var href = this.getAttribute('href');
            if (href === '#' || href.charAt(0) !== '#' ) return;
            if (!main.querySelector(href)) return;
            event.preventDefault();
            event.stopPropagation();
            if (window.location.hash !== href)
                window.location.hash = href;
        });
    });

    (function() {
        var panel, link;
        if (window.location.hash && window.location.hash !== '#') {
            panel = main.querySelector(window.location.hash);
            link = nav.querySelector('a[href="' + window.location.hash + '"]');
        }
        if (!panel) {
            panel = panels[0];
            link = navLinks[0];
        }
        panels.forEach(function(p) {
            if (p !== panel) {
                p.classList.add('inactive');
                p.style.display = 'none';
            }
        });
        if (link) link.classList.add('active');
        window.scrollTo(0, 0);
    })();

    window.addEventListener('hashchange', function(event) {
        var panel, link;
        if (window.location.hash && window.location.hash !== '#') {
            panel = main.querySelector(window.location.hash);
            link = nav.querySelector('a[href="' + window.location.hash + '"]');
        } else {
            panel = panels[0];
            link = navLinks[0];
        }
        if (!panel) return;
        panels.forEach(function(p) {
            p.classList.add('inactive');
        });
        navLinks.forEach(function(l) {
            l.classList.remove('active');
        });
        if (link) link.classList.add('active');
        var currentHeight = main.offsetHeight;
        main.style.maxHeight = currentHeight + 'px';
        main.style.minHeight = currentHeight + 'px';
        setTimeout(function() {
            panels.forEach(function(p) {
                p.style.display = 'none';
            });
            panel.style.display = '';
            var newHeight = panel.offsetHeight;
            main.style.maxHeight = newHeight + 'px';
            main.style.minHeight = newHeight + 'px';
            window.scrollTo(0, 0);
            var delay = window.matchMedia("(max-width: 736px)").matches ? 0 : 500;
            setTimeout(function() {
                panel.classList.remove('inactive');
                main.style.maxHeight = '';
                main.style.minHeight = '';
            }, delay);
        }, 250);
    });

    var contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", function(event) {
            event.preventDefault();
            var status = document.getElementById("my-form-status");
            var btn = document.getElementById("submit-btn");
            var data = new FormData(event.target);
            btn.value = "Sending...";
            btn.disabled = true;
            fetch(event.target.action, {
                method: contactForm.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    status.innerHTML = "Message sent successfully!";
                    status.style.color = "var(--c-accent)";
                    status.style.fontWeight = "bold";
                    contactForm.reset();
                    btn.value = "Send Message";
                    btn.disabled = false;
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            status.innerHTML = data["errors"].map(error => error["message"]).join(", ")
                        } else {
                            status.innerHTML = "Oops! There was a problem submitting your form";
                        }
                        status.style.color = "red";
                        btn.value = "Send Message";
                        btn.disabled = false;
                    })
                }
            }).catch(error => {
                status.innerHTML = "Oops! There was a problem submitting your form";
                status.style.color = "red";
                btn.value = "Send Message";
                btn.disabled = false;
            });
        });
    }
})();