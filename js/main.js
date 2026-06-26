/* 
========================================================================
   DEXTON SOLVEXX - PREMIUM GLOBAL RECRUITMENT BRAND STYLING SYSTEM
   Central Utilities & Widgets - js/main.js
======================================================================== 
*/

document.addEventListener('DOMContentLoaded', () => {
    // Force Light theme and Blue palette on first load to apply the new corporate theme
    if (localStorage.getItem('dexton_theme_v3_initialized') !== 'true') {
        localStorage.setItem('dexton_theme_mode', 'light');
        localStorage.setItem('dexton_color_theme', 'blue');
        localStorage.setItem('dexton_theme_v3_initialized', 'true');
    }

    // Apply user selected content theme and primary color palette on load
    applyTheme();
    applyLogoCustomizations();
    applySectionToggles();
    applyPageContentOverrides();

    // Initialize premium Scroll Progress depth indicator (only on non-admin client pages)
    if (!document.body.classList.contains('admin-body')) {
        const scrollProgress = document.createElement('div');
        scrollProgress.className = 'scroll-progress';
        document.body.appendChild(scrollProgress);
        
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
            scrollProgress.style.width = scrolled + "%";
        });
    }
    
    /* --- Numeric Counter Animation --- */
    const statsSection = document.querySelector('.stats-grid');
    const counters = document.querySelectorAll('.stat-number');
    
    if (counters.length > 0) {
        const counterOptions = {
            root: null,
            threshold: 0.1,
            rootMargin: '0px'
        };

        const startCounting = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target); // Trigger count once
                }
            });
        };

        const counterObserver = new IntersectionObserver(startCounting, counterOptions);
        if (statsSection) {
            counterObserver.observe(statsSection);
        } else {
            // Fallback for counters on other pages
            counters.forEach(counter => counterObserver.observe(counter));
        }

        function animateCounters() {
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const suffix = counter.getAttribute('data-suffix') || '';
                const duration = 2000; // 2 seconds duration
                const startTime = performance.now();

                const updateCount = (currentTime) => {
                    const elapsedTime = currentTime - startTime;
                    const progress = Math.min(elapsedTime / duration, 1);
                    
                    // Ease out quadratic progress formula
                    const easeProgress = progress * (2 - progress);
                    const currentCount = Math.floor(easeProgress * target);
                    
                    counter.innerText = currentCount + suffix;

                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    } else {
                        counter.innerText = target + suffix;
                    }
                };

                requestAnimationFrame(updateCount);
            });
        }
    }

    /* --- Back To Top Trigger --- */
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        });

        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* --- FAQ Accordion Logic --- */
    function bindFaqListeners() {
        const faqHeaders = document.querySelectorAll('.faq-header');
        
        faqHeaders.forEach(header => {
            if (header.getAttribute('data-listener-bound') === 'true') return;
            header.setAttribute('data-listener-bound', 'true');
            
            header.addEventListener('click', () => {
                const faqItem = header.parentElement;
                const faqContent = faqItem.querySelector('.faq-content');
                
                // Check if active
                const isActive = faqItem.classList.contains('active');
                
                // Close all FAQ Items first (Accordion style)
                document.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('active');
                    item.querySelector('.faq-content').style.maxHeight = null;
                });
                
                // If it wasn't active, open it
                if (!isActive) {
                    faqItem.classList.add('active');
                    faqContent.style.maxHeight = faqContent.scrollHeight + "px";
                }
            });
        });
    }
    bindFaqListeners();

    /* --- Interactive Contact Form Validation --- */
    const contactForm = document.getElementById('dexton-contact-form');
    
    if (contactForm) {
        const formFields = contactForm.querySelectorAll('input, select, textarea');
        
        // Add live field checking on blur
        formFields.forEach(field => {
            field.addEventListener('blur', () => {
                validateField(field);
            });
            field.addEventListener('input', () => {
                if (field.classList.contains('field-error')) {
                    validateField(field);
                }
            });
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isFormValid = true;
            formFields.forEach(field => {
                if (!validateField(field)) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                // Trigger form loading state
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const origText = submitBtn.innerHTML;
                
                submitBtn.disabled = true;
                submitBtn.innerHTML = `
                    <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" style="animation: spinSlow 1s linear infinite; margin-right: 8px;">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" style="opacity: 0.25;"></circle>
                        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                `;

                // Simulate high-end corporate server communication
                setTimeout(() => {
                    // Collect lead data
                    const leadData = {
                        id: Date.now(),
                        date: new Date().toLocaleString(),
                        name: contactForm.querySelector('[name="name"]')?.value || contactForm.querySelector('#name')?.value || '',
                        email: contactForm.querySelector('[name="email"]')?.value || contactForm.querySelector('#email')?.value || '',
                        phone: contactForm.querySelector('[name="phone"]')?.value || contactForm.querySelector('#phone')?.value || '',
                        company: contactForm.querySelector('[name="company"]')?.value || contactForm.querySelector('#company')?.value || '',
                        service: contactForm.querySelector('[name="interest"]')?.value || contactForm.querySelector('#interest')?.value || contactForm.querySelector('[name="service"]')?.value || contactForm.querySelector('#service')?.value || '',
                        message: contactForm.querySelector('[name="message"]')?.value || contactForm.querySelector('#message')?.value || ''
                    };
                    
                    // Save to localStorage
                    let leads = JSON.parse(localStorage.getItem('dexton_leads') || '[]');
                    leads.push(leadData);
                    localStorage.setItem('dexton_leads', JSON.stringify(leads));

                    // Hide Form and Show Success Animation Panel
                    contactForm.style.display = 'none';
                    const successCard = document.getElementById('contact-success-card');
                    if (successCard) {
                        successCard.style.display = 'block';
                        successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    } else {
                        alert('Thank you! Your strategic consultation request has been received.');
                    }
                    
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = origText;
                    
                    // Reset form fields
                    contactForm.reset();
                }, 1800);
            }
        });

        function validateField(field) {
            const val = field.value.trim();
            const parent = field.parentElement;
            let errorSpan = parent.querySelector('.field-error-msg');
            let isValid = true;
            
            if (!errorSpan) {
                errorSpan = document.createElement('span');
                errorSpan.className = 'field-error-msg';
                errorSpan.style.color = '#EF4444';
                errorSpan.style.fontSize = '0.75rem';
                errorSpan.style.marginTop = '4px';
                errorSpan.style.display = 'block';
                parent.appendChild(errorSpan);
            }

            // Remove previous error classes
            field.classList.remove('field-error');
            errorSpan.textContent = '';

            // Rules validation
            if (field.hasAttribute('required') && val === '') {
                isValid = false;
                errorSpan.textContent = 'This field is required.';
            } else if (field.type === 'email' && val !== '') {
                const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailReg.test(val)) {
                    isValid = false;
                    errorSpan.textContent = 'Please enter a valid business email address.';
                }
            } else if (field.type === 'tel' && val !== '') {
                const telReg = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
                if (!telReg.test(val)) {
                    isValid = false;
                    errorSpan.textContent = 'Please enter a valid telephone number.';
                }
            }

            if (!isValid) {
                field.classList.add('field-error');
                field.style.borderColor = '#EF4444';
            } else {
                field.style.borderColor = '';
            }

            return isValid;
        }
    }

    /* --- INITIALIZE DATABASE IF EMPTY --- */
    const defaultConfig = {
        companyName: "Dexton Solvexx",
        tagline: "Connecting Global Talent. Delivering Workforce Excellence.",
        telephone: "+1 (800) 555-DEXTON\n+44 (20) 7946-0925",
        email: "solutions@dextonsolvexx.com\ninfo@dextonsolvexx.com",
        address: "73-77 Executive Plaza, 5th Floor,\nFinancial District, Singapore 018981"
    };

    if (!localStorage.getItem('dexton_config')) {
        localStorage.setItem('dexton_config', JSON.stringify(defaultConfig));
    }

    if (localStorage.getItem('dexton_testimonials_initialized') !== 'true') {
        const defaultTestimonials = [
            {
                name: "Marcus Sterling",
                role: "CTO, Enterprise Cloud Systems",
                feedback: "Partnering with Dexton Solvexx allowed us to scale our cloud engineering team by 15 developers in less than a month. The candidates are highly skilled, communicate fluently in English, and fit right into our timezone.",
                initials: "MS"
            },
            {
                name: "Alisha Rodriguez",
                role: "VP of Operations, HealthFirst Inc.",
                feedback: "We migrated our back-office accounting and medical billing operations to a dedicated team built by Dexton Solvexx. Our operational costs decreased by 65%, and the compliance and security are second to none.",
                initials: "AR"
            },
            {
                name: "Jonathan Hughes",
                role: "Director of HR, Global FinTech Group",
                feedback: "Their RPO services completely revitalized our global recruitment pipelines. They helped us source elite product designers and marketing executives while keeping our average cost per hire very low.",
                initials: "JH"
            }
        ];
        localStorage.setItem('dexton_testimonials', JSON.stringify(defaultTestimonials));
        localStorage.setItem('dexton_testimonials_initialized', 'true');
    }

    if (localStorage.getItem('dexton_faqs_initialized') !== 'true') {
        const defaultFaqs = [
            {
                question: "What is Recruitment Process Outsourcing (RPO)?",
                answer: "Recruitment Process Outsourcing is a partnership where a specialized provider manages all or part of a company's internal hiring operations. Unlike transactional staffing, Dexton Solvexx acts as an operational extension of your HR wing, designing custom pipelines, employing cutting-edge recruitment technology, and managing compliance structures to drive talent retention."
            },
            {
                question: "How does cross-border contracting and billing operate?",
                answer: "Dexton Solvexx operates as the Employer of Record (EOR) or global contracting vendor depending on the engagement. You receive a single, consolidated monthly business invoice in your local currency. We navigate all international compliance requirements, legal filings, tax compliance systems, and benefits operations in the talent's home region."
            },
            {
                question: "Can we transfer remote staff to direct employment?",
                answer: "Yes, our contracts support direct transfer options. Once candidates complete a defined service tenure with Dexton Solvexx, clients can seamlessly transition individuals to internal hiring structures subject to standard transfer agreement rules."
            },
            {
                question: "How does Dexton Solvexx handle data security and physical hardware?",
                answer: "Data security is critical. All our operations follow strict ISO 27001 parameters and GDPR legal bounds. We structure comprehensive IP protection clauses directly into our customer agreements. Furthermore, we help source, configure, and ship encrypted, MDM-managed computers directly to your offshore workers."
            },
            {
                question: "Are the candidates fluent in professional English?",
                answer: "Absolutely. Sourced candidates face strict verbal, syntactic, and technical communications audits. We only introduce professionals who possess high levels of written and spoken native-equivalent corporate English proficiency, ensuring seamless integration into Western business units."
            },
            {
                question: "What time zones can the offshore candidates support?",
                answer: "Our global talent pool allows us to cover any core timezone. We configure our talent to match your exact working hours, providing coverage across US Eastern, Pacific, UK Greenwhich, Australian Eastern, or European Central times."
            },
            {
                question: "What happens if a placement does not perform as expected?",
                answer: "We offer a solid replacement guarantee. Every permanent placement includes a 90-day structural guarantee. If a candidate underperforms or leaves during this window, we source, qualify, and integrate a suitable replacement at zero additional recruitment cost."
            },
            {
                question: "What typical onboarding periods are required?",
                answer: "Our pre-vetted active network allows us to onboard standard professionals within 1 to 2 weeks. For highly custom, niche executive capabilities or complex engineering setups, sourcing and onboarding typically ranges between 3 to 4 weeks."
            },
            {
                question: "Is there a minimum size for offshore remote teams?",
                answer: "No. We construct remote offshore offices ranging from a single specialized software developer to comprehensive 100+ seat multi-functional business divisions. Our models scale dynamically based on your organic structural needs."
            },
            {
                question: "How do you maintain candidate retention?",
                answer: "Candidate retention is driven by competitive compensation scaling, structured training, clear career roadmaps, and dedicated local HR managers. Dexton Solvexx maintains regular feedback cycles with remote talent, resulting in a 95% retention rate."
            }
        ];
        localStorage.setItem('dexton_faqs', JSON.stringify(defaultFaqs));
        localStorage.setItem('dexton_faqs_initialized', 'true');
    }

    if (!localStorage.getItem('dexton_hero_config')) {
        const defaultHero = {
            title: 'Global Offshore <br><span style="background: linear-gradient(135deg, #0091FF 0%, #1E40AF 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Recruitment Solutions</span> for Growing Businesses',
            subtitle: 'Unlock global scaling by tapping into highly vetted offshore talent across IT, Healthcare, Finance, Engineering, Digital Marketing, and Executive Leadership. We build dedicated offshore remote divisions designed to accelerate business productivity.',
            cta1Text: 'Request Consultation',
            cta1Link: 'contact.html',
            cta2Text: 'Explore Services',
            cta2Link: 'services.html'
        };
        localStorage.setItem('dexton_hero_config', JSON.stringify(defaultHero));
    }

    if (!localStorage.getItem('dexton_stats_config')) {
        const defaultStats = {
            stat1Target: '15000', stat1Suffix: '+', stat1Label: 'Elite Placements Filled',
            stat2Target: '98', stat2Suffix: '%', stat2Label: 'Client Retention Rate',
            stat3Target: '70', stat3Suffix: '%', stat3Label: 'Average Cost Reduction',
            stat4Target: '35', stat4Suffix: '', stat4Label: 'Sourcing Partner Regions'
        };
        localStorage.setItem('dexton_stats_config', JSON.stringify(defaultStats));
    }

    /* --- LIVE CONFIGURATION OVERRIDE ENGINE --- */
    const config = JSON.parse(localStorage.getItem('dexton_config'));
    if (config) {
        // Update logo brand name
        if (config.companyName) {
            const logoTexts = document.querySelectorAll('.logo-text');
            logoTexts.forEach(el => {
                const parts = config.companyName.split(' ');
                if (parts.length > 1) {
                    el.innerHTML = `${parts[0].toUpperCase()} <span>${parts.slice(1).join(' ').toUpperCase()}</span>`;
                } else {
                    el.innerHTML = config.companyName.toUpperCase();
                }
            });

            // Update footer desc
            const footerDesc = document.querySelector('.footer-desc');
            if (footerDesc) {
                footerDesc.textContent = `${config.companyName} is a premier global recruitment process outsourcing and offshore staffing firm. We help enterprise businesses scale by connecting them with vetted top-tier global talent.`;
            }

            // Update footer copyright
            const copyrightEl = document.querySelector('.footer-bottom p');
            if (copyrightEl) {
                copyrightEl.innerHTML = `&copy; 2026 ${config.companyName}. All Rights Reserved. Legally Registered Global Entity.`;
            }
        }

        // Update taglines
        if (config.tagline) {
            const taglines = document.querySelectorAll('.tagline');
            taglines.forEach(el => {
                el.textContent = config.tagline;
            });
        }

        // Update telephone, email, and address in footer contact details
        const footerContactItems = document.querySelectorAll('.footer-contact li');
        if (footerContactItems.length >= 3) {
            // Item 0 is telephone
            if (config.telephone) {
                const phoneSpan = footerContactItems[0].querySelector('span');
                if (phoneSpan) {
                    phoneSpan.innerHTML = config.telephone.replace(/\n/g, '<br>');
                }
            }
            // Item 1 is email
            if (config.email) {
                const emailSpan = footerContactItems[1].querySelector('span');
                if (emailSpan) {
                    emailSpan.innerHTML = config.email.replace(/\n/g, '<br>');
                }
            }
            // Item 2 is address
            if (config.address) {
                const addressSpan = footerContactItems[2].querySelector('span');
                if (addressSpan) {
                    addressSpan.innerHTML = config.address.replace(/\n/g, '<br>');
                }
            }
        }

        // Update Global Headquarters details on contact page
        const isContactPage = window.location.pathname.includes('contact.html');
        if (isContactPage) {
            const headH3s = Array.from(document.querySelectorAll('h3')).filter(h3 => h3.textContent.includes('Global Headquarters'));
            if (headH3s.length > 0) {
                const h3 = headH3s[0];
                const p = h3.nextElementSibling;
                if (p && config.address && config.telephone) {
                    const company = config.companyName || "Dexton Solvexx";
                    p.innerHTML = `${company} Pte. Ltd.<br>${config.address.replace(/\n/g, '<br>')}<br><strong>Tel:</strong> ${config.telephone.replace(/\n/g, '<br>')}`;
                }
            }
        }
    }

    /* --- DYNAMIC CUSTOM BLOG LOAD ENGINE --- */
    const isBlogPage = window.location.pathname.includes('blog.html');
    const blogGrid = document.querySelector('.grid-3');
    if (isBlogPage && blogGrid) {
        const customBlogs = JSON.parse(localStorage.getItem('dexton_custom_blogs') || '[]');
        customBlogs.forEach(blog => {
            const blogArticle = document.createElement('article');
            blogArticle.className = 'glass-panel hover-lift reveal-up';
            blogArticle.style.backgroundColor = 'var(--color-white)';
            blogArticle.style.borderColor = 'var(--color-border)';
            blogArticle.style.overflow = 'hidden';
            blogArticle.style.display = 'flex';
            blogArticle.style.flexDirection = 'column';
            blogArticle.style.height = '100%';
            
            blogArticle.innerHTML = `
              <div style="height: 200px; background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%); display: flex; align-items: center; justify-content: center; color: var(--color-white); font-weight: 800; font-size: 1.25rem; text-align: center; padding: 1rem;">
                ${blog.title}
              </div>
              <div style="padding: 1.75rem; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between; gap: 1.25rem;">
                <div>
                  <span style="font-size: 0.75rem; font-weight: 700; color: var(--color-accent); text-transform: uppercase;">${blog.category}</span>
                  <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--color-bg-dark); line-height: 1.45; margin-top: 0.25rem;">${blog.title}</h3>
                  <p style="font-size: 0.85rem; color: var(--color-grey); line-height: 1.55; margin-top: 0.5rem;">${blog.summary}</p>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--color-border); padding-top: 1rem; font-size: 0.8rem; color: var(--color-grey);">
                  <span>${blog.readtime}</span>
                  <span>${blog.date}</span>
                </div>
              </div>
            `;
            // Insert at the beginning of the grid
            blogGrid.insertBefore(blogArticle, blogGrid.firstChild);
        });
    }

    applyCMSOverrides();

    function applyCMSOverrides() {
        // 1. Hero copy override
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heroCtas = document.querySelector('.hero-ctas');
        
        const heroConfig = JSON.parse(localStorage.getItem('dexton_hero_config'));
        if (heroConfig) {
            if (heroTitle && heroConfig.title) heroTitle.innerHTML = heroConfig.title;
            if (heroSubtitle && heroConfig.subtitle) heroSubtitle.textContent = heroConfig.subtitle;
            if (heroCtas && heroConfig.cta1Text) {
                const ctaButtons = heroCtas.querySelectorAll('a');
                if (ctaButtons.length >= 2) {
                    ctaButtons[0].textContent = heroConfig.cta1Text;
                    if (heroConfig.cta1Link) ctaButtons[0].href = heroConfig.cta1Link;
                    ctaButtons[1].textContent = heroConfig.cta2Text;
                    if (heroConfig.cta2Link) ctaButtons[1].href = heroConfig.cta2Link;
                }
            }
        }
        
        // 2. Stats copy override
        const statsGrid = document.querySelector('.stats-grid');
        const statsConfig = JSON.parse(localStorage.getItem('dexton_stats_config'));
        if (statsGrid && statsConfig) {
            const statItems = statsGrid.querySelectorAll('.stat-item');
            if (statItems.length >= 4) {
                const configs = [
                    { target: statsConfig.stat1Target, suffix: statsConfig.stat1Suffix, label: statsConfig.stat1Label },
                    { target: statsConfig.stat2Target, suffix: statsConfig.stat2Suffix, label: statsConfig.stat2Label },
                    { target: statsConfig.stat3Target, suffix: statsConfig.stat3Suffix, label: statsConfig.stat3Label },
                    { target: statsConfig.stat4Target, suffix: statsConfig.stat4Suffix, label: statsConfig.stat4Label }
                ];
                
                statItems.forEach((item, index) => {
                    const conf = configs[index];
                    const numberEl = item.querySelector('.stat-number');
                    const labelEl = item.querySelector('.stat-label');
                    if (numberEl && conf.target !== undefined) {
                        numberEl.setAttribute('data-target', conf.target);
                        numberEl.setAttribute('data-suffix', conf.suffix || '');
                        numberEl.textContent = '0' + (conf.suffix || '');
                    }
                    if (labelEl && conf.label) {
                        labelEl.textContent = conf.label;
                    }
                });
            }
        }
        
        // 3. Testimonials dynamic render
        const testimonialsContainer = document.getElementById('dynamic-testimonials-container');
        const testimonialsData = JSON.parse(localStorage.getItem('dexton_testimonials'));
        if (testimonialsContainer && testimonialsData && testimonialsData.length > 0) {
            testimonialsContainer.innerHTML = '';
            testimonialsData.forEach((t, index) => {
                const initials = t.initials || t.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
                const delayClass = index === 0 ? '' : index === 1 ? 'delay-100' : 'delay-200';
                const bgVal = index % 3 === 0 ? 'var(--color-primary)' : index % 3 === 1 ? 'var(--color-accent)' : 'var(--color-primary-dark)';
                const textVal = index % 3 === 1 ? 'var(--color-bg-dark)' : 'var(--color-white)';
                
                const card = document.createElement('div');
                card.className = `glass-panel hover-lift reveal-up ${delayClass}`;
                card.style.backgroundColor = 'var(--color-white)';
                card.style.borderColor = 'var(--color-border)';
                card.style.padding = '2.5rem';
                card.style.textAlign = 'left';
                card.style.display = 'flex';
                card.style.flexDirection = 'column';
                card.style.justifyContent = 'space-between';
                card.style.gap = '1.5rem';
                
                card.innerHTML = `
                    <p style="font-size: 0.95rem; color: var(--color-grey); line-height: 1.6; font-style: italic;">
                        "${escapeHtml(t.feedback)}"
                    </p>
                    <div style="display: flex; align-items: center; gap: 1rem; margin-top: auto;">
                        <div style="width: 44px; height: 44px; border-radius: 50%; background-color: ${bgVal}; color: ${textVal}; display: flex; align-items: center; justify-content: center; font-weight: 700; font-family: var(--font-heading);">
                            ${escapeHtml(initials)}
                        </div>
                        <div>
                            <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--color-bg-dark);">${escapeHtml(t.name)}</h4>
                            <p style="font-size: 0.75rem; color: var(--color-accent); font-weight: 600;">${escapeHtml(t.role)}</p>
                        </div>
                    </div>
                `;
                testimonialsContainer.appendChild(card);
            });
        }
        
        // 4. FAQs dynamic render
        const faqContainer = document.getElementById('dynamic-faq-accordion');
        const faqsData = JSON.parse(localStorage.getItem('dexton_faqs'));
        if (faqContainer && faqsData && faqsData.length > 0) {
            faqContainer.innerHTML = '';
            faqsData.forEach(faq => {
                const faqItem = document.createElement('div');
                faqItem.className = 'faq-item';
                faqItem.innerHTML = `
                    <div class="faq-header">
                      <span class="faq-question">${escapeHtml(faq.question)}</span>
                      <div class="faq-icon"></div>
                    </div>
                    <div class="faq-content">
                      <div class="faq-body">
                        ${escapeHtml(faq.answer)}
                      </div>
                    </div>
                `;
                faqContainer.appendChild(faqItem);
            });
            bindFaqListeners();
        }
    }

    function escapeHtml(text) {
        if (!text) return '';
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});

/* --- DYNAMIC SITE-WIDE THEMING SYSTEM ENGINE --- */
function applyTheme() {
    const themeMode = localStorage.getItem('dexton_theme_mode') || 'light'; // Default to Light mode
    const colorPalette = localStorage.getItem('dexton_color_theme') || 'blue'; // Default to Blue palette
    const customPrimary = localStorage.getItem('dexton_custom_primary') || '';
    const customAccent = localStorage.getItem('dexton_custom_accent') || '';

    const bgType = localStorage.getItem('dexton_bg_type') || 'default';
    const customBg = localStorage.getItem('dexton_custom_bg') || '#111827';
    
    const lightBgType = localStorage.getItem('dexton_light_bg_type') || 'default';
    const customLightBg = localStorage.getItem('dexton_custom_light_bg') || '#FFFFFF';

    // 1. Apply Layout Theme Mode (Dark Content / Light Content)
    if (themeMode === 'dark') {
        let bgColor = '#111827';
        let secondaryBgColor = '#0F172A';
        
        if (bgType === 'midnight') {
            bgColor = '#0F172A';
            secondaryBgColor = '#0B0F19';
        } else if (bgType === 'black') {
            bgColor = '#000000';
            secondaryBgColor = '#0A0A0A';
        } else if (bgType === 'custom' && customBg) {
            bgColor = customBg;
            secondaryBgColor = adjustColorBrightness(customBg, -15);
        }

        document.documentElement.style.setProperty('--color-white', bgColor);             // Content backgrounds turn dark
        document.documentElement.style.setProperty('--color-grey-light', secondaryBgColor); // Sidebar backgrounds turn darker
        document.documentElement.style.setProperty('--color-grey-dark', '#FFFFFF');         // Main text elements turn white
        document.documentElement.style.setProperty('--color-grey', '#D1D5DB');              // Secondary/paragraph text turns light grey
        document.documentElement.style.setProperty('--color-bg-dark', '#FFFFFF');            // Heading elements turn white
        document.documentElement.style.setProperty('--color-bg-deep', secondaryBgColor);
        document.documentElement.style.setProperty('--color-section-dark-bg', bgColor);      // Legacy var fallback
        document.documentElement.style.setProperty('--color-border', '#374151');            // Dividers and borders turn dark grey
        
        // Menu & Dropdowns
        document.documentElement.style.setProperty('--color-menu-bg', bgColor);
        document.documentElement.style.setProperty('--color-menu-text', 'rgba(255, 255, 255, 0.8)');
        document.documentElement.style.setProperty('--color-menu-subtext', 'rgba(255, 255, 255, 0.65)');
        document.documentElement.style.setProperty('--color-menu-border', '#374151');
        
        // Footer
        document.documentElement.style.setProperty('--color-footer-bg', bgColor);
        document.documentElement.style.setProperty('--color-footer-text', 'rgba(255, 255, 255, 0.7)');
        document.documentElement.style.setProperty('--color-footer-title', '#FFFFFF');
        document.documentElement.style.setProperty('--color-footer-link', 'rgba(255, 255, 255, 0.65)');
        document.documentElement.style.setProperty('--color-footer-border', 'rgba(255, 255, 255, 0.05)');
        document.documentElement.style.setProperty('--color-footer-divider', '#374151');
        document.documentElement.style.setProperty('--color-social-bg', 'rgba(255, 255, 255, 0.05)');
        document.documentElement.style.setProperty('--color-social-border', 'rgba(255, 255, 255, 0.1)');
        document.documentElement.style.setProperty('--color-social-text', '#FFFFFF');

        // Header Specific Variables (Dark mode styling)
        document.documentElement.style.setProperty('--color-header-text', 'rgba(255, 255, 255, 0.85)');
        document.documentElement.style.setProperty('--color-header-logo-text', '#FFFFFF');
        document.documentElement.style.setProperty('--color-header-tagline', 'rgba(255, 255, 255, 0.65)');
        document.documentElement.style.setProperty('--color-header-border', 'rgba(255, 255, 255, 0.08)');
        document.documentElement.style.setProperty('--color-header-scrolled-bg', convertHexToRgba(bgColor, 0.95));
        document.documentElement.style.setProperty('--color-header-scrolled-border', 'rgba(0, 145, 255, 0.25)');

        // Hero Specific Variables (Dark mode styling)
        document.documentElement.style.setProperty('--color-hero-bg', bgColor);
        document.documentElement.style.setProperty('--color-hero-text', '#FFFFFF');
        document.documentElement.style.setProperty('--color-hero-subtext', 'rgba(255, 255, 255, 0.75)');
        
        let gradStart = adjustColorBrightness(bgColor, -15);
        let gradMid = bgColor;
        let gradEnd = adjustColorBrightness(bgColor, -5);
        document.documentElement.style.setProperty('--color-hero-gradient', `linear-gradient(135deg, ${gradStart} 0%, ${gradMid} 50%, ${gradEnd} 100%)`);

        if (document.body && !document.body.classList.contains('admin-body')) {
            document.body.style.backgroundColor = bgColor;
            document.body.style.color = '#FFFFFF';                                              // Content text becomes white
        }
    } else {
        let bgColor = '#FAF9F6';
        let secondaryBgColor = '#F3EFE9';
        
        if (lightBgType === 'cream') {
            bgColor = '#FAF5EC';
            secondaryBgColor = '#F3EBE0';
        } else if (lightBgType === 'alabaster') {
            bgColor = '#FDFBF7';
            secondaryBgColor = '#F5F2EB';
        } else if (lightBgType === 'white') {
            bgColor = '#FFFFFF';
            secondaryBgColor = '#F9F9F9';
        } else if (lightBgType === 'custom' && customLightBg) {
            bgColor = customLightBg;
            secondaryBgColor = adjustColorBrightness(customLightBg, -5); // slightly darker for section backgrounds
        }

        document.documentElement.style.setProperty('--color-white', bgColor);
        document.documentElement.style.setProperty('--color-grey-light', secondaryBgColor);
        document.documentElement.style.setProperty('--color-grey-dark', '#1F2937');
        document.documentElement.style.setProperty('--color-grey', '#4B5563');
        document.documentElement.style.setProperty('--color-bg-dark', '#111827');
        document.documentElement.style.setProperty('--color-bg-deep', secondaryBgColor);
        document.documentElement.style.setProperty('--color-section-dark-bg', bgColor);   // Legacy var fallback
        document.documentElement.style.setProperty('--color-border', '#E5E7EB');
        
        // Menu & Dropdowns (white bg with dark text in light mode)
        document.documentElement.style.setProperty('--color-menu-bg', bgColor);
        document.documentElement.style.setProperty('--color-menu-text', '#1F2937');
        document.documentElement.style.setProperty('--color-menu-subtext', '#4B5563');
        document.documentElement.style.setProperty('--color-menu-border', '#E5E7EB');
        
        // Footer (light bg with dark text in light mode)
        document.documentElement.style.setProperty('--color-footer-bg', secondaryBgColor);
        document.documentElement.style.setProperty('--color-footer-text', '#4B5563');
        document.documentElement.style.setProperty('--color-footer-title', '#1F2937');
        document.documentElement.style.setProperty('--color-footer-link', '#4B5563');
        document.documentElement.style.setProperty('--color-footer-border', 'rgba(0, 0, 0, 0.08)');
        document.documentElement.style.setProperty('--color-footer-divider', '#E5E7EB');
        document.documentElement.style.setProperty('--color-social-bg', 'rgba(0, 0, 0, 0.05)');
        document.documentElement.style.setProperty('--color-social-border', 'rgba(0, 0, 0, 0.1)');
        document.documentElement.style.setProperty('--color-social-text', '#1F2937');

        // Header Specific Variables (Light mode styling)
        document.documentElement.style.setProperty('--color-header-text', 'rgba(31, 41, 55, 0.85)');
        document.documentElement.style.setProperty('--color-header-logo-text', '#1F2937');
        document.documentElement.style.setProperty('--color-header-tagline', 'rgba(31, 41, 55, 0.65)');
        document.documentElement.style.setProperty('--color-header-border', 'rgba(0, 0, 0, 0.08)');
        document.documentElement.style.setProperty('--color-header-scrolled-bg', convertHexToRgba(bgColor, 0.95));
        document.documentElement.style.setProperty('--color-header-scrolled-border', 'rgba(0, 0, 0, 0.08)');

        // Hero Specific Variables (Light mode styling)
        document.documentElement.style.setProperty('--color-hero-bg', bgColor);
        document.documentElement.style.setProperty('--color-hero-text', '#1F2937');
        document.documentElement.style.setProperty('--color-hero-subtext', '#4B5563');
        
        let gradStart = adjustColorBrightness(bgColor, -6);
        let gradMid = bgColor;
        let gradEnd = adjustColorBrightness(bgColor, -3);
        document.documentElement.style.setProperty('--color-hero-gradient', `linear-gradient(135deg, ${gradStart} 0%, ${gradMid} 50%, ${gradEnd} 100%)`);

        if (document.body && !document.body.classList.contains('admin-body')) {
            document.body.style.backgroundColor = bgColor;
            document.body.style.color = '#1F2937';
        }
    }

    // 2. Apply Dynamic Brand Color Palette
    let primary = '#1E40AF';
    let primaryDark = '#1E3A8A';
    let primaryLight = '#2563EB';
    let accent = '#0091FF';
    let accentGlow = 'rgba(0, 145, 255, 0.4)';

    if (colorPalette === 'custom' && customPrimary && customAccent) {
        primary = customPrimary;
        accent = customAccent;
        primaryDark = adjustColorBrightness(customPrimary, -20);
        primaryLight = adjustColorBrightness(customPrimary, 10);
        accentGlow = convertHexToRgba(customAccent, 0.4);
    } else {
        switch (colorPalette) {
            case 'blue':
                primary = '#1E40AF';       // Royal Blue
                primaryDark = '#1E3A8A';
                primaryLight = '#2563EB';
                accent = '#0091FF';        // Electric Blue
                accentGlow = 'rgba(0, 145, 255, 0.4)';
                break;
            case 'purple':
                primary = '#5B21B6';       // Executive Purple
                primaryDark = '#3B0764';
                primaryLight = '#6D28D9';
                accent = '#8B5CF6';        // Accent Purple
                accentGlow = 'rgba(139, 92, 246, 0.4)';
                break;
            case 'gold':
                primary = '#78350F';       // Rich Gold/Amber
                primaryDark = '#451A03';
                primaryLight = '#92400E';
                accent = '#D97706';        // Bright Amber
                accentGlow = 'rgba(217, 119, 6, 0.4)';
                break;
            case 'red':
                primary = '#991B1B';       // Dynamic Crimson
                primaryDark = '#450A0A';
                primaryLight = '#B91C1C';
                accent = '#EF4444';        // Bright Red
                accentGlow = 'rgba(239, 68, 68, 0.4)';
                break;
            case 'teal':
            default:
                primary = '#1E40AF';       // Corporate Teal
                primaryDark = '#1E3A8A';
                primaryLight = '#2563EB';
                accent = '#0091FF';        // Accent Teal
                accentGlow = 'rgba(0, 145, 255, 0.4)';
                break;
        }
    }

    document.documentElement.style.setProperty('--color-primary', primary);
    document.documentElement.style.setProperty('--color-primary-dark', primaryDark);
    document.documentElement.style.setProperty('--color-primary-light', primaryLight);
    document.documentElement.style.setProperty('--color-accent', accent);
    document.documentElement.style.setProperty('--color-accent-glow', accentGlow);

    // Custom content colors overrides
    const customCardBg = localStorage.getItem('dexton_custom_card_bg');
    const customBodyText = localStorage.getItem('dexton_custom_body_text');
    const customSecText = localStorage.getItem('dexton_custom_sec_text');
    const customBorder = localStorage.getItem('dexton_custom_border');

    if (customCardBg) document.documentElement.style.setProperty('--color-white', customCardBg);
    if (customBodyText) document.documentElement.style.setProperty('--color-grey-dark', customBodyText);
    if (customSecText) document.documentElement.style.setProperty('--color-grey', customSecText);
    if (customBorder) document.documentElement.style.setProperty('--color-border', customBorder);
}

// Utility to convert Hex to RGBA
function convertHexToRgba(hex, alpha) {
    hex = hex.replace('#', '');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Utility to adjust brightness of hex colors
function adjustColorBrightness(hex, percent) {
    let R = parseInt(hex.substring(1, 3), 16);
    let G = parseInt(hex.substring(3, 5), 16);
    let B = parseInt(hex.substring(5, 7), 16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;

    R = (R > 0) ? R : 0;
    G = (G > 0) ? G : 0;
    B = (B > 0) ? B : 0;

    let rHex = R.toString(16).padStart(2, '0');
    let gHex = G.toString(16).padStart(2, '0');
    let bHex = B.toString(16).padStart(2, '0');

    return `#${rHex}${gHex}${bHex}`;
}

// Apply logo customizations dynamically based on shapes and gradients in localStorage
function applyLogoCustomizations() {
    const shape = localStorage.getItem('dexton_logo_shape') || 'arrowhead';
    const gradStart = localStorage.getItem('dexton_logo_grad_start') || '#0091FF';
    const gradEnd = localStorage.getItem('dexton_logo_grad_end') || '#1E40AF';
    const bevelStart = localStorage.getItem('dexton_logo_bevel_start') || '#FFFFFF';
    const bevelEnd = localStorage.getItem('dexton_logo_bevel_end') || '#9CA3AF';

    document.documentElement.style.setProperty('--color-logo-grad-start', gradStart);
    document.documentElement.style.setProperty('--color-logo-grad-end', gradEnd);
    document.documentElement.style.setProperty('--color-logo-bevel-start', bevelStart);
    document.documentElement.style.setProperty('--color-logo-bevel-end', bevelEnd);

    const logoIcons = document.querySelectorAll('.logo-icon');
    
    // Support image overrides
    const logoImageUrl = localStorage.getItem('dexton_logo_image_url');
    if (logoImageUrl && logoIcons.length > 0) {
        logoIcons.forEach(icon => {
            icon.innerHTML = `<image href="${logoImageUrl}" x="0" y="0" height="100" width="100" />`;
        });
    } else if (logoIcons.length > 0) {
        const defsHtml = `
                <defs>
                  <linearGradient id="logoGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="var(--color-logo-grad-start, var(--color-accent))" />
                    <stop offset="100%" stop-color="var(--color-logo-grad-end, var(--color-primary))" />
                  </linearGradient>
                  <linearGradient id="logoGradGold" x1="0" y1="100" x2="100" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="var(--color-logo-bevel-start, #FFFFFF)" />
                    <stop offset="100%" stop-color="var(--color-logo-bevel-end, #9CA3AF)" />
                  </linearGradient>
                  <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
        `;

        let shapeHtml = '';
        if (shape === 'chevron') {
            shapeHtml = `
                <!-- Double Orbiting Rings -->
                <circle cx="50" cy="50" r="44" stroke="url(#logoGrad)" stroke-width="2.5" stroke-dasharray="8 12" class="spin-ring" style="transform-origin: 50px 50px;" />
                <circle cx="50" cy="50" r="38" stroke="url(#logoGradGold)" stroke-width="1.5" stroke-dasharray="4 8" class="spin-ring-reverse" style="transform-origin: 50px 50px;" opacity="0.8" />
                
                <!-- Interlocking Geometric D & S Ribbon -->
                <!-- D Shape Ribbon -->
                <path d="M 34 26 L 34 74" stroke="url(#logoGrad)" stroke-width="6.5" stroke-linecap="round" fill="none" />
                <path d="M 34 26 C 58 26, 58 74, 34 74" stroke="url(#logoGrad)" stroke-width="6.5" stroke-linecap="round" fill="none" />
                
                <!-- S Shape Ribbon Interlocked -->
                <path d="M 66 28 C 48 28, 42 42, 50 50 C 58 58, 52 72, 34 72" stroke="url(#logoGradGold)" stroke-width="6.5" stroke-linecap="round" fill="none" filter="url(#logoGlow)" />
                
                <!-- Central Glowing Connector Core Node -->
                <circle cx="50" cy="50" r="4.5" fill="#FFFFFF" filter="url(#logoGlow)" />
                <circle cx="50" cy="50" r="2.5" fill="var(--color-logo-grad-start, var(--color-accent))" />
            `;
        } else if (shape === 'hexagon') {
            shapeHtml = `
                <!-- Hexagon Shape -->
                <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" stroke="url(#logoGrad)" stroke-width="3" stroke-dasharray="10 5" fill="none" class="spin-ring" style="transform-origin: 50px 50px;" />
                <polygon points="50,18 78,34 78,66 50,82 22,66 22,34" stroke="url(#logoGradGold)" stroke-width="1.5" fill="none" opacity="0.7" />
                
                <!-- Interlocking D & S letters in tech geometry -->
                <!-- D Side (left) -->
                <path d="M 38,30 L 50,30 C 60,30 65,40 65,50 C 65,60 60,70 50,70 L 38,70 Z" stroke="url(#logoGrad)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none" filter="url(#logoGlow)" />
                <path d="M 38,30 L 38,70" stroke="url(#logoGradGold)" stroke-width="5" stroke-linecap="round" fill="none" />
                <!-- S Side (right) -->
                <path d="M 62,35 L 50,35 C 42,35 38,42 45,50 C 52,58 48,65 38,65" stroke="url(#logoGradGold)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                <circle cx="50" cy="50" r="3" fill="#FFFFFF" />
            `;
        } else if (shape === 'nodes') {
            shapeHtml = `
                <!-- Nodes Net Shape -->
                <line x1="25" y1="25" x2="50" y2="15" stroke="url(#logoGrad)" stroke-width="2" />
                <line x1="50" y1="15" x2="75" y2="25" stroke="url(#logoGradGold)" stroke-width="2" />
                <line x1="75" y1="25" x2="75" y2="75" stroke="url(#logoGrad)" stroke-width="2" />
                <line x1="75" y1="75" x2="50" y2="85" stroke="url(#logoGradGold)" stroke-width="2" />
                <line x1="50" y1="85" x2="25" y2="75" stroke="url(#logoGrad)" stroke-width="2" />
                <line x1="25" y1="75" x2="25" y2="25" stroke="url(#logoGradGold)" stroke-width="2" />
                <line x1="25" y1="25" x2="50" y2="50" stroke="url(#logoGrad)" stroke-width="1.5" />
                <line x1="75" y1="25" x2="50" y2="50" stroke="url(#logoGradGold)" stroke-width="1.5" />
                <line x1="75" y1="75" x2="50" y2="50" stroke="url(#logoGrad)" stroke-width="1.5" />
                <line x1="25" y1="75" x2="50" y2="50" stroke="url(#logoGradGold)" stroke-width="1.5" />
                
                <circle cx="25" cy="25" r="4.5" fill="url(#logoGrad)" />
                <circle cx="50" cy="15" r="4.5" fill="url(#logoGradGold)" />
                <circle cx="75" cy="25" r="4.5" fill="url(#logoGrad)" />
                <circle cx="75" cy="75" r="4.5" fill="url(#logoGradGold)" />
                <circle cx="50" cy="85" r="4.5" fill="url(#logoGrad)" />
                <circle cx="25" cy="75" r="4.5" fill="url(#logoGradGold)" />
                <circle cx="50" cy="50" r="7.5" fill="#FFFFFF" filter="url(#logoGlow)" />
                <circle cx="50" cy="50" r="4.5" fill="var(--color-logo-grad-start, var(--color-accent))" />
            `;
        } else {
            shapeHtml = `
                <!-- 3D Bevel Arrowhead Symbol -->
                <!-- Left Wing (D) -->
                <path d="M 27 15 L 77 32 L 43 35 L 27 54 L 38 35 Z" fill="url(#logoGrad)" filter="url(#logoGlow)" />
                <path d="M 27 15 L 43 35 L 27 54 L 33 50 L 45 35 L 33 19 Z" fill="url(#logoGradGold)" />
                
                <!-- Right Wing (S Ribbon) -->
                <path d="M 43 35 L 77 32 L 62 45 L 48 40 Z" fill="url(#logoGradGold)" />
                <path d="M 48 40 L 62 45 L 52 49 L 40 44 Z" fill="url(#logoGrad)" />
            `;
        }

        logoIcons.forEach(icon => {
            icon.innerHTML = defsHtml + shapeHtml;
        });
    }

    // Overwrite logo texts and tagline
    const logoTextFirst = localStorage.getItem('dexton_logo_text_first') || 'DEXTON';
    const logoTextSecond = localStorage.getItem('dexton_logo_text_second') || 'SOLVEXX';
    const logoTagline = localStorage.getItem('dexton_logo_tagline') || 'Connecting Global Talent. Delivering Workforce Excellence.';

    const logoTexts = document.querySelectorAll('.logo-text');
    logoTexts.forEach(el => {
        el.innerHTML = `${logoTextFirst.toUpperCase()} <span>${logoTextSecond.toUpperCase()}</span>`;
    });

    const taglines = document.querySelectorAll('.tagline');
    taglines.forEach(el => {
        el.textContent = logoTagline;
    });
}

// Toggle homepage section visibility based on configurations in localStorage
function applySectionToggles() {
    const isHomepage = document.querySelector('.hero-section') !== null;
    if (!isHomepage) return;

    const activeSections = JSON.parse(localStorage.getItem('dexton_homepage_sections'));
    if (!activeSections) return;

    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.style.display = activeSections.hero ? '' : 'none';
    }

    const statsGrid = document.querySelector('.stats-grid');
    if (statsGrid) {
        const statsSection = statsGrid.closest('section');
        if (statsSection) {
            statsSection.style.display = activeSections.stats ? '' : 'none';
        }
    }

    const tags = document.querySelectorAll('.section-tag');
    tags.forEach(tag => {
        const text = tag.textContent.trim().toLowerCase();
        const section = tag.closest('section');
        if (!section) return;

        if (text === 'value proposition') {
            section.style.display = activeSections.services ? '' : 'none';
        } else if (text === 'market coverage') {
            section.style.display = activeSections.industries ? '' : 'none';
        } else if (text === 'methodology') {
            section.style.display = activeSections.timeline ? '' : 'none';
        } else if (text === 'client feedback') {
            section.style.display = activeSections.testimonials ? '' : 'none';
        } else if (text === 'knowledge base') {
            section.style.display = activeSections.faqs ? '' : 'none';
        } else if (text === 'insights hub') {
            section.style.display = activeSections.blog ? '' : 'none';
        }
    });

    const contactSection = document.getElementById('contact-form-section');
    if (contactSection) {
        contactSection.style.display = activeSections.contact ? '' : 'none';
    }
}

// Dynamic subpage content overrides from localStorage
function applyPageContentOverrides() {
    const filename = window.location.pathname.split('/').pop() || 'index.html';
    const customConfig = JSON.parse(localStorage.getItem(`dexton_page_content_${filename}`));
    if (!customConfig) return;

    // 1. Overwrite Hero section if present
    const heroTitleEl = document.querySelector('.hero-section .hero-title, section:first-of-type h1');
    const heroSubEl = document.querySelector('.hero-section .hero-subtitle, section:first-of-type p');
    const heroTagEl = document.querySelector('.hero-section .section-tag, section:first-of-type .section-tag');

    if (heroTitleEl && customConfig.hero && customConfig.hero.title) {
        heroTitleEl.innerHTML = customConfig.hero.title;
    }
    if (heroSubEl && customConfig.hero && customConfig.hero.subtitle) {
        heroSubEl.textContent = customConfig.hero.subtitle;
    }
    if (heroTagEl && customConfig.hero && customConfig.hero.tag) {
        heroTagEl.textContent = customConfig.hero.tag;
    }

    // 2. Overwrite main body content blocks
    function getMainContentContainer(file) {
        if (file === 'about.html') {
            return document.querySelector('.about-split > div:first-child');
        } else if (file === 'services.html') {
            return document.querySelector('.poppins-override .col-md-9');
        } else if (file === 'industries.html') {
            return document.querySelector('section:nth-of-type(2) .grid-3') || document.querySelector('section:nth-of-type(2) .container');
        } else if (file === 'index.html') {
            return null; // Homepage uses specific CMS widgets
        } else {
            return document.querySelector('section:nth-of-type(2) .container > div');
        }
    }

    const container = getMainContentContainer(filename);
    if (container && customConfig.blocks && customConfig.blocks.length > 0) {
        let html = '';
        customConfig.blocks.forEach(block => {
            html += `
                <h2 style="font-size: 1.8rem; font-weight: 800; color: var(--color-primary); margin-top: 3.5rem; margin-bottom: 1rem;">${block.title}</h2>
                <div style="margin-bottom: 2rem; color: var(--color-grey-dark); font-size: 1.05rem; line-height: 1.8;">${block.text}</div>
            `;
        });
        container.innerHTML = html;
    }
}

