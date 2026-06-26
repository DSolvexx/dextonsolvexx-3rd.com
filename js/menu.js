/* 
========================================================================
   DEXTON SOLVEXX - PREMIUM GLOBAL RECRUITMENT BRAND STYLING SYSTEM
   Navigation & Menu Interaction - js/menu.js
======================================================================== 
*/

document.addEventListener('DOMContentLoaded', () => {
    /* --- DYNAMIC SITE-WIDE MENU & SERVICES REBUILD ENGINE --- */
    function rebuildDynamicMenus() {
        let menuPages = JSON.parse(localStorage.getItem('dexton_menu_pages'));
        if (!menuPages) {
            menuPages = [
                { name: "Home", link: "index.html", visible: true },
                { name: "About Us", link: "about.html", visible: true },
                { name: "Services", link: "services.html", visible: true, isDropdown: true },
                { name: "Industries", link: "industries.html", visible: true, isDropdown: true },
                { name: "Blog", link: "blog.html", visible: true },
                { name: "Contact", link: "contact.html", visible: true }
            ];
            localStorage.setItem('dexton_menu_pages', JSON.stringify(menuPages));
        }

        let menuServices = JSON.parse(localStorage.getItem('dexton_menu_services'));
        if (!menuServices) {
            menuServices = [
                { name: "Offshore Recruitment", link: "offshore-recruitment.html", visible: true, group: "none" },
                { name: "Full Cycle Recruitment", link: "rpo-services.html", visible: true, group: "offshore" },
                { name: "Candidate Sourcing & Vetting", link: "talent-acquisition.html", visible: true, group: "offshore" },
                { name: "Market Sourcing & Mapping", link: "workforce-planning.html", visible: true, group: "offshore" },
                { name: "RPO Administrative Support", link: "services.html#rpo", visible: true, group: "offshore" },
                { name: "Finance & Accounting", link: "services.html#offshore", visible: true, group: "backoffice" },
                { name: "Virtual Staffing Services", link: "contract-staffing.html", visible: true, group: "direct" },
                { name: "Executive Search", link: "executive-search.html", visible: true, group: "direct" },
                { name: "Permanent Staffing", link: "permanent-staffing.html", visible: true, group: "direct" },
                { name: "Global Hiring Solutions", link: "global-hiring.html", visible: true, group: "direct" }
            ];
            localStorage.setItem('dexton_menu_services', JSON.stringify(menuServices));
        }

        // 1. Rebuild Desktop Header Menu (.nav-menu)
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            let navHtml = '';
            menuPages.forEach(page => {
                if (!page.visible) return;
                
                if (page.name === 'Services') {
                    let servicesDropdownHtml = `
                        <div class="nav-item dropdown-parent">
                          <a href="${page.link}" class="nav-link">Services <svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M1 3.5 L5 7.5 L9 3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
                          <div class="dropdown-menu">
                    `;
                    
                    // Offshore Recruitment Root
                    const offshoreRoot = menuServices.find(s => s.group === 'none' && s.name.includes('Offshore'));
                    if (offshoreRoot && offshoreRoot.visible) {
                        servicesDropdownHtml += `
                            <div class="dropdown-submenu">
                              <a href="${offshoreRoot.link}" class="dropdown-item"><span class="dropdown-link dropdown-link-arrow">${offshoreRoot.name}</span></a>
                              <div class="dropdown-menu">
                        `;
                        menuServices.forEach(s => {
                            if (s.group === 'offshore' && s.visible) {
                                servicesDropdownHtml += `<a href="${s.link}" class="dropdown-item"><span class="dropdown-link">${s.name}</span></a>`;
                            }
                        });
                        servicesDropdownHtml += `</div></div>`;
                    }

                    // Back Office Services
                    servicesDropdownHtml += `
                        <div class="dropdown-submenu">
                          <a href="services.html#offshore" class="dropdown-item"><span class="dropdown-link dropdown-link-arrow">Back Office Services</span></a>
                          <div class="dropdown-menu">
                    `;
                    menuServices.forEach(s => {
                        if (s.group === 'backoffice' && s.visible) {
                            servicesDropdownHtml += `<a href="${s.link}" class="dropdown-item"><span class="dropdown-link">${s.name}</span></a>`;
                        }
                    });
                    servicesDropdownHtml += `</div></div>`;

                    // Standalone items
                    menuServices.forEach(s => {
                        if (s.group === 'direct' && s.visible) {
                            servicesDropdownHtml += `<a href="${s.link}" class="dropdown-item"><span class="dropdown-link">${s.name}</span></a>`;
                        }
                    });

                    servicesDropdownHtml += `</div></div>`;
                    navHtml += servicesDropdownHtml;

                } else if (page.name === 'Industries') {
                    navHtml += `
                        <div class="nav-item dropdown-parent">
                          <a href="${page.link}" class="nav-link">Industries <svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M1 3.5 L5 7.5 L9 3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
                          <div class="dropdown-menu">
                            <a href="industries.html#it" class="dropdown-item"><span class="dropdown-link">Information Technology</span></a>
                            <a href="industries.html#healthcare" class="dropdown-item"><span class="dropdown-link">Healthcare & Life Sciences</span></a>
                            <a href="industries.html#engineering" class="dropdown-item"><span class="dropdown-link">Engineering & Manufacturing</span></a>
                            <a href="industries.html#finance" class="dropdown-item"><span class="dropdown-link">Finance & Banking</span></a>
                            <a href="industries.html#logistics" class="dropdown-item"><span class="dropdown-link">Logistics & Supply Chain</span></a>
                            <a href="industries.html#retail" class="dropdown-item"><span class="dropdown-link">Retail & E-commerce</span></a>
                          </div>
                        </div>
                    `;
                } else {
                    navHtml += `<div class="nav-item"><a href="${page.link}" class="nav-link">${page.name}</a></div>`;
                }
            });
            navMenu.innerHTML = navHtml;
        }

        // 2. Rebuild Mobile Side Menu (.mobile-nav-links)
        const mobileNavLinks = document.querySelector('.mobile-nav-links');
        if (mobileNavLinks) {
            let mobileHtml = '';
            menuPages.forEach(page => {
                if (!page.visible) return;
                
                if (page.name === 'Services') {
                    let servicesMobileHtml = `
                        <li>
                          <a href="#" class="mobile-nav-link mobile-nav-link-parent">Services <svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M1 3.5 L5 7.5 L9 3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
                          <div class="mobile-sub-menu">
                            <a href="${page.link}" class="mobile-sub-link">Services Directory</a>
                    `;

                    // Offshore Sourcing
                    const offshoreRoot = menuServices.find(s => s.group === 'none' && s.name.includes('Offshore'));
                    if (offshoreRoot && offshoreRoot.visible) {
                        servicesMobileHtml += `
                            <div class="mobile-sub-parent">
                              <a href="#" class="mobile-sub-link mobile-sub-link-parent">${offshoreRoot.name} <svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M1 3.5 L5 7.5 L9 3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
                              <div class="mobile-child-menu">
                                <a href="${offshoreRoot.link}" class="mobile-child-link">Offshore Sourcing Overview</a>
                        `;
                        menuServices.forEach(s => {
                            if (s.group === 'offshore' && s.visible) {
                                servicesMobileHtml += `<a href="${s.link}" class="mobile-child-link">${s.name}</a>`;
                            }
                        });
                        servicesMobileHtml += `</div></div>`;
                    }

                    // Back Office
                    servicesMobileHtml += `
                        <div class="mobile-sub-parent">
                          <a href="#" class="mobile-sub-link mobile-sub-link-parent">Back Office Services <svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M1 3.5 L5 7.5 L9 3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
                          <div class="mobile-child-menu">
                    `;
                    menuServices.forEach(s => {
                        if (s.group === 'backoffice' && s.visible) {
                            servicesMobileHtml += `<a href="${s.link}" class="mobile-child-link">${s.name}</a>`;
                        }
                    });
                    servicesMobileHtml += `</div></div>`;

                    // Standalone
                    menuServices.forEach(s => {
                        if (s.group === 'direct' && s.visible) {
                            servicesMobileHtml += `<a href="${s.link}" class="mobile-sub-link">${s.name}</a>`;
                        }
                    });

                    servicesMobileHtml += `</div></li>`;
                    mobileHtml += servicesMobileHtml;

                } else if (page.name === 'Industries') {
                    mobileHtml += `
                        <li>
                          <a href="#" class="mobile-nav-link mobile-nav-link-parent">Industries <svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M1 3.5 L5 7.5 L9 3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
                          <div class="mobile-sub-menu">
                            <a href="industries.html" class="mobile-sub-link">All Industries</a>
                            <a href="industries.html#it" class="mobile-sub-link">Information Technology</a>
                            <a href="industries.html#healthcare" class="mobile-sub-link">Healthcare & Life Sciences</a>
                            <a href="industries.html#engineering" class="mobile-sub-link">Engineering & Manufacturing</a>
                            <a href="industries.html#finance" class="mobile-sub-link">Finance & Banking</a>
                            <a href="industries.html#logistics" class="mobile-sub-link">Logistics & Supply Chain</a>
                            <a href="industries.html#retail" class="mobile-sub-link">Retail & E-commerce</a>
                          </div>
                        </li>
                    `;
                } else {
                    mobileHtml += `<li><a href="${page.link}" class="mobile-nav-link">${page.name}</a></li>`;
                }
            });
            mobileNavLinks.innerHTML = mobileHtml;
        }

        // 3. Rebuild Footer Link Lists (.footer-links)
        const footerLinksLists = document.querySelectorAll('.footer-links');
        if (footerLinksLists.length >= 2) {
            let quickLinksHtml = '';
            menuPages.forEach(page => {
                if (page.visible) {
                    quickLinksHtml += `<li><a href="${page.link}">${page.name}</a></li>`;
                }
            });
            footerLinksLists[0].innerHTML = quickLinksHtml;

            let keyServicesHtml = '';
            menuServices.forEach(s => {
                if (s.visible && (s.group === 'none' || s.group === 'direct')) {
                    keyServicesHtml += `<li><a href="${s.link}">${s.name}</a></li>`;
                }
            });
            footerLinksLists[1].innerHTML = keyServicesHtml;
        }
    }
    rebuildDynamicMenus();

    // Select Key Elements
    const header = document.querySelector('header.site-header');
    const mobileTrigger = document.querySelector('.mobile-trigger');
    const mobileDrawer = document.querySelector('.mobile-drawer');
    const drawerOverlay = document.querySelector('.mobile-drawer-overlay');
    const mobileParentLinks = document.querySelectorAll('.mobile-nav-link-parent');

    /* --- Sticky Header Trigger --- */
    const handleScroll = () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    // Initial check and event binding
    handleScroll();
    window.addEventListener('scroll', handleScroll);

    /* --- Mobile Menu Drawer Controls --- */
    // Initialize ARIA accessibility attributes on load
    if (mobileTrigger && mobileDrawer) {
        mobileTrigger.setAttribute('role', 'button');
        mobileTrigger.setAttribute('aria-haspopup', 'true');
        mobileTrigger.setAttribute('aria-expanded', 'false');
        mobileTrigger.setAttribute('aria-label', 'Toggle Navigation Menu');
        mobileDrawer.setAttribute('aria-hidden', 'true');
    }

    const toggleMobileMenu = () => {
        mobileTrigger.classList.toggle('active');
        mobileDrawer.classList.toggle('active');
        drawerOverlay.classList.toggle('active');
        
        const isExpanded = mobileDrawer.classList.contains('active');
        mobileTrigger.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
        mobileDrawer.setAttribute('aria-hidden', isExpanded ? 'false' : 'true');
        
        // Disable body scroll when menu is active
        if (isExpanded) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    };

    if (mobileTrigger) {
        mobileTrigger.addEventListener('click', toggleMobileMenu);
    }
    if (drawerOverlay) {
        drawerOverlay.addEventListener('click', toggleMobileMenu);
    }
    
    // Bind close button if present inside the drawer
    const mobileCloseBtn = document.querySelector('.mobile-drawer-close');
    if (mobileCloseBtn) {
        mobileCloseBtn.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile drawer on resize if expanded to desktop range (>= 1024px)
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024 && mobileDrawer && mobileDrawer.classList.contains('active')) {
            toggleMobileMenu();
        }
    });

    /* --- Mobile Menu Accordions --- */
    if (mobileParentLinks) {
        mobileParentLinks.forEach(parentLink => {
            parentLink.addEventListener('click', (e) => {
                e.preventDefault();
                const parentLi = parentLink.parentElement;
                const subMenu = parentLi.querySelector('.mobile-sub-menu');
                
                parentLink.classList.toggle('active');
                
                if (subMenu) {
                    subMenu.classList.toggle('open');
                    if (subMenu.classList.contains('open')) {
                        subMenu.style.maxHeight = subMenu.scrollHeight + "px";
                    } else {
                        subMenu.style.maxHeight = null;
                    }
                }
            });
        });
    }

    const subParentLinks = document.querySelectorAll('.mobile-sub-link-parent');
    if (subParentLinks) {
        subParentLinks.forEach(subParentLink => {
            subParentLink.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const parentDiv = subParentLink.parentElement;
                const childMenu = parentDiv.querySelector('.mobile-child-menu');
                
                subParentLink.classList.toggle('active');
                
                if (childMenu) {
                    childMenu.classList.toggle('open');
                    if (childMenu.classList.contains('open')) {
                        childMenu.style.maxHeight = childMenu.scrollHeight + "px";
                        // Also adjust parent sub-menu height so it grows to fit the child
                        const parentSubMenu = parentDiv.closest('.mobile-sub-menu');
                        if (parentSubMenu) {
                            parentSubMenu.style.maxHeight = (parentSubMenu.scrollHeight + childMenu.scrollHeight) + "px";
                        }
                    } else {
                        childMenu.style.maxHeight = null;
                        const parentSubMenu = parentDiv.closest('.mobile-sub-menu');
                        if (parentSubMenu) {
                            parentSubMenu.style.maxHeight = (parentSubMenu.scrollHeight - childMenu.scrollHeight) + "px";
                        }
                    }
                }
            });
        });
    }

    /* --- Auto Active Link Selection --- */
    const currentUrl = window.location.pathname.split('/').pop() || 'index.html';
    const navItems = document.querySelectorAll('.nav-item, .mobile-nav-links li');
    
    navItems.forEach(item => {
        const link = item.querySelector('a');
        if (link) {
            const href = link.getAttribute('href');
            if (href === currentUrl) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        }
    });
});
