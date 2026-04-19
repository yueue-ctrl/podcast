document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Check if the link is for a different page or an anchor on the same page
            if (href.startsWith('#') || (href.startsWith('index.html#') && window.location.pathname.endsWith('index.html'))) {
                e.preventDefault();
                const targetId = href.split('#')[1];
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            } 
            // For links to other pages (like about.html), let the default browser action proceed.
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

    const sectionObserver = new IntersectionObserver(revealSection, {
        root: null,
        threshold: 0.1,
    });

    sections.forEach(section => {
        if (section) {
            sectionObserver.observe(section);
        }
    });

    // Custom Cursor Logic
    const cursorDot = document.querySelector('.cursor-dot');
    const interactiveElements = document.querySelectorAll('a, button, .icon-container, .episode-card');
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

    window.addEventListener('mousemove', e => {
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;
    });

    function typewriterEffect(element, text, onComplete) {
        let i = 0;
        element.textContent = '';
        element.style.opacity = '1';
        element.classList.add('typing');

        if (typewriterInterval) {
            clearInterval(typewriterInterval);
        }

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
            // Wait for 1.5 seconds before showing the next quote
            typewriterTimeout = setTimeout(playQuoteCarousel, 1500);
        });
    }

    // Handle quote rotation on icon hover
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

    // Standard hover effect for interactive elements
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('hover');
        });
    });

    // Special hover effect for the about paragraph
    const aboutP = document.querySelector('#about p');
    const cursorText = document.querySelector('.cursor-text');
    const words = ["瞧瞧", "See", "Détail", "More", "見る", "展开", "المزيد", "Más"];

    if (aboutP && cursorText) {
        aboutP.addEventListener('mouseenter', () => {
            const randomWord = words[Math.floor(Math.random() * words.length)];
            cursorText.textContent = randomWord;
            cursorDot.classList.add('text-active');
        });

        aboutP.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('text-active');
        });
    }
    
    document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursorDot.style.opacity = '1';
    });

    // --- Hosts & Guests Logic ---
    const hostsContainer = document.querySelector('.hosts-container');
    const viewAllHosts = document.querySelector('.view-all-hosts');
    let originalHostsContent = '';

    const setupInfiniteScroll = () => {
        if (hostsContainer && !hostsContainer.classList.contains('expanded')) {
            if (originalHostsContent === '') {
                originalHostsContent = hostsContainer.innerHTML;
            }
            hostsContainer.innerHTML = originalHostsContent + originalHostsContent;
        }
    };

    setupInfiniteScroll(); // Initial setup

    // Expand/collapse hosts section
    if (viewAllHosts && hostsContainer) {
        viewAllHosts.addEventListener('click', (e) => {
            e.preventDefault();
            hostsContainer.classList.toggle('expanded');

            if (hostsContainer.classList.contains('expanded')) {
                viewAllHosts.textContent = 'View Less';
                hostsContainer.innerHTML = originalHostsContent; // Show original content
            } else {
                viewAllHosts.textContent = 'View All';
                setupInfiniteScroll(); // Re-enable scroll
            }
        });
    }

    // Special hover effect for host profiles
    const hostProfiles = document.querySelectorAll('.host-profile');
    if (hostProfiles.length > 0 && cursorText) {
        hostsContainer.addEventListener('mouseover', (e) => {
            const profile = e.target.closest('.host-profile');
            if (profile) {
                const role = profile.getAttribute('data-role');
                if (role) {
                    cursorText.textContent = role;
                    cursorDot.classList.add('text-active');
                    if (role === 'Host') {
                        cursorDot.classList.add('host-style');
                    }
                }
            }
        });

        hostsContainer.addEventListener('mouseout', (e) => {
            const profile = e.target.closest('.host-profile');
            if (profile) {
                cursorDot.classList.remove('text-active');
                cursorDot.classList.remove('host-style');
            }
        });
    }

    // --- Player Hover Logic ---
    const playerLink = document.querySelector('.player-link');
    const playerWords = ["branding", "extension"];

    if (playerLink && cursorText) {
        playerLink.addEventListener('mouseenter', () => {
            const randomWord = playerWords[Math.floor(Math.random() * playerWords.length)];
            cursorText.textContent = randomWord;
            cursorDot.classList.add('text-active');
        });

        playerLink.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('text-active');
        });
    }
});
