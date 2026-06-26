/* 
========================================================================
   DEXTON SOLVEXX - PREMIUM GLOBAL RECRUITMENT BRAND STYLING SYSTEM
   Scroll Animations Controller - js/animations.js
======================================================================== 
*/

document.addEventListener('DOMContentLoaded', () => {
    // Setup Scroll Reveal Targets
    const revealTargets = document.querySelectorAll(
        '.reveal, .reveal-up, .reveal-down, .reveal-left, .reveal-right, .reveal-scale'
    );

    // Options for standard Intersection Observer
    const observerOptions = {
        root: null, // Viewport
        rootMargin: '0px 0px -80px 0px', // Trigger slightly before element completely enters screen
        threshold: 0.1 // 10% of element visible
    };

    // Intersection Callback
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Once animated, we can unobserve if we only want animations to happen once
                observer.unobserve(entry.target);
            }
        });
    };

    // Instantiate Observer
    const revealObserver = new IntersectionObserver(revealCallback, observerOptions);

    // Bind Observer to Targets
    revealTargets.forEach(target => {
        revealObserver.observe(target);
    });

    /* --- Extra Scroll Parallax for Hero Elements --- */
    const parallaxHero = document.querySelector('.hero-parallax-bg');
    if (parallaxHero) {
        window.addEventListener('scroll', () => {
            const scrollVal = window.scrollY;
            parallaxHero.style.transform = `translateY(${scrollVal * 0.12}px)`;
        });
    }
});
