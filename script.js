document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor Logic
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorText = document.querySelector('.cursor-text');

    // --- Typewriter Effect for Homepage Icon ---
    const iconContainer = document.querySelector('.icon-container');
    const quoteText = document.querySelector('.quote-text');
    const quotes = [
        "Minimalism, sharpened.",
        "Less, but for whom?",
        "Design is never neutral."
    ];
    let quoteIndex = 0;
    let isHovering = false;
    let typewriterTimeout;
    let typewriterInterval;

    function typewriterEffect(element, text, onComplete) {
        let i = 0;
        element.textContent = '';
        element.style.opacity = '1';
        element.classList.add('typing');

        if (typewriterInterval) clearInterval(typewriterInterval);

        typewriterInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typewriterInterval);
                element.classList.remove('typing');
                if (onComplete) onComplete();
            }
        }, 80);
    }

    function playQuoteCarousel() {
        if (!isHovering) return;
        const currentQuote = quotes[quoteIndex];
        quoteIndex = (quoteIndex + 1) % quotes.length;
        typewriterEffect(quoteText, currentQuote, () => {
            typewriterTimeout = setTimeout(playQuoteCarousel, 1500);
        });
    }

    if (iconContainer && quoteText) {
        iconContainer.addEventListener('mouseenter', () => {
            isHovering = true;
            playQuoteCarousel();
        });

        iconContainer.addEventListener('mouseleave', () => {
            isHovering = false;
            clearTimeout(typewriterTimeout);
            clearInterval(typewriterInterval);
            quoteText.style.opacity = '0';
            quoteText.textContent = '';
            quoteText.classList.remove('typing');
        });
    }

    // Position tracking
    window.addEventListener('mousemove', e => {
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;
    });

    // Fade out when leaving window
    document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        cursorDot.style.opacity = '1';
    });

    // Standard hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .icon-container, .episode-card, .host-profile');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('hover');
        });
    });

    // Special text hover effect for 'About' paragraph
    const aboutP = document.querySelector('#about p');
    const aboutWords = ["瞧瞧", "See", "Détail", "More", "見る", "展开", "المزيد", "Más"];
    if (aboutP && cursorText) {
        aboutP.addEventListener('mouseenter', () => {
            const randomWord = aboutWords[Math.floor(Math.random() * aboutWords.length)];
            cursorText.textContent = randomWord;
            cursorDot.classList.add('text-active');
        });
        aboutP.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('text-active');
        });
    }

    // Special text hover effect for Host/Guest profiles
    const handleHostMouseOver = (e) => {
        const profile = e.target.closest('.host-profile');
        if (profile && cursorText) {
            const role = profile.getAttribute('data-role');
            if (role) {
                cursorText.textContent = role;
                cursorDot.classList.add('text-active');
                if (role === 'Host') {
                    cursorDot.classList.add('host-style');
                }
            }
        }
    };

    const handleHostMouseOut = () => {
        if (cursorText) {
            cursorDot.classList.remove('text-active');
            cursorDot.classList.remove('host-style'); // Also remove host-style on mouse out
        }
    };

    // Apply to hosts section on index page
    const hostsContainer = document.querySelector('.hosts-container');
    if (hostsContainer) {
        hostsContainer.addEventListener('mouseover', handleHostMouseOver);
        hostsContainer.addEventListener('mouseout', handleHostMouseOut);
    }

    // Apply to hosts/guests section on episode pages
    const episodeHostsGuests = document.querySelector('#episode-hosts-guests');
    if (episodeHostsGuests) {
        episodeHostsGuests.addEventListener('mouseover', handleHostMouseOver);
        episodeHostsGuests.addEventListener('mouseout', handleHostMouseOut);
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#') || (href.startsWith('index.html#') && window.location.pathname.endsWith('index.html'))) {
                e.preventDefault();
                const targetId = href.split('#')[1];
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Intersection Observer for revealing sections on scroll
    const sections = document.querySelectorAll('section');
    const revealSection = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    };
    const sectionObserver = new IntersectionObserver(revealSection, { root: null, threshold: 0.1 });
    sections.forEach(section => {
        if (section) {
            sectionObserver.observe(section);
        }
    });

    // --- Hosts & Guests Logic on index.html ---
    const viewAllHosts = document.querySelector('.view-all-hosts');
    let originalHostsContent = '';

    const setupInfiniteScroll = () => {
        if (hostsContainer && !hostsContainer.classList.contains('expanded')) {
            if (originalHostsContent === '') {
                originalHostsContent = hostsContainer.innerHTML;
            }
            // Duplicate content for seamless scroll effect
            hostsContainer.innerHTML = originalHostsContent + originalHostsContent;
        }
    };

    if (hostsContainer) {
        setupInfiniteScroll(); // Initial setup
    }

    if (viewAllHosts && hostsContainer) {
        viewAllHosts.addEventListener('click', (e) => {
            e.preventDefault();
            hostsContainer.classList.toggle('expanded');

            if (hostsContainer.classList.contains('expanded')) {
                viewAllHosts.textContent = 'View Less';
                hostsContainer.innerHTML = originalHostsContent; // Show original content, no duplication
            } else {
                viewAllHosts.textContent = 'View All';
                setupInfiniteScroll(); // Re-enable infinite scroll
            }
        });
    }
});
