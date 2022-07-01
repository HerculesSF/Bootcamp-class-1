/**
 * Menu component
 * 
 * @module menu
 * @version 1.0.0
 * @extends HTMLElement
 */
class mainMenu extends HTMLElement {

    /**
     * Menu web component
     * 
     * @constructor
     */
    constructor() {

        super();

        this.closeMenu();
        this.initToggle();
        this.initFocusTrap();
        this.initSubmenu();
    }

    /**
     * Init menu toggle buttons
     * 
     * @return {undefined}
     */
    initToggle() {

        document.querySelectorAll('[data-menu-open]').forEach(element => {

            element.addEventListener('click', event => {
                event.preventDefault();
                this.openMenu();
                this.activeToggle = event.target;
            });
        });

        document.querySelectorAll('[data-menu-close]').forEach(element => {

            element.addEventListener('click', event => {
                event.preventDefault();
                this.closeMenu();
            });
        });

        // Close menu on window resize
        window.addEventListener('screen-breakpoint', this.closeMenu.bind(this));

        // Close menu on press escape
        window.addEventListener('escape', this.closeMenu.bind(this));
    }

    /**
	 * Open menu
     * 
     * @return {undefined}
	 */
    openMenu() {

        this.classList.remove('hidden');

        document.querySelector('.site-header').classList.add('menu-active');

        document.querySelector('.menu__overlay').classList.add('active');

        this.setAttribute('aria-hidden', 'false');

        this.openStatus = true;

        setTimeout(() => {

            this.classList.add('active');

            this.activeFocusTrap();

            this.querySelector('[data-menu-close]').focus();

        }, 50); 
    }

    /**
	 * Close menu
     * 
     * @return {undefined}
	 */
    closeMenu() {
        
        this.closeAllSubmenus();

        this.disableSubmenuFocusTrap();

        this.disableFocusTrap();

        this.classList.remove('active');

        document.querySelector('.site-header').classList.remove('menu-active');

        document.querySelector('.menu__overlay').classList.remove('active');

        if (window.screenMode == 'desktop-large') {

            this.setAttribute('aria-hidden', 'false');
            this.classList.remove('hidden');
            this.openStatus = true;

        } else {

            // We need to use set time out to avoid issues with menu animation
            setTimeout(() => {

                this.setAttribute('aria-hidden', 'true');

                if (this.openStatus && this.activeToggle) {
                    this.activeToggle.focus();
                }

                this.openStatus = false;

                this.classList.add('hidden');

            }, 500);
        } 
    }

    /**
	 * Init submenus
     * 
     * @return {undefined}
	 */
     initSubmenu() {

        this.closeAllSubmenus();

        // Open submenu on click
        document.querySelectorAll('[data-menu-submenu-target]').forEach((element) => {

            element.addEventListener('click', (event) => {

                if (window.isTouch || (window.screenMode == 'tablet' || window.screenMode == 'mobile')) {
                    event.preventDefault();
                }

                this.activeSubmenu = event.target;

                let submenu = document.querySelector('[data-menu-submenu="'+ element.dataset.menuSubmenuTarget + '"]');

                this.openSubmenu(submenu);
            });
        });

        // Open submenu on hover only on desktop
        document.querySelectorAll('[data-menu-level1-link]').forEach((element) => {

            if (element.dataset.menuSubmenuTargetHover) {

                hoverintent(element, () => {

                    if (window.screenMode == 'desktop-large') {

                        this.removeActiveClassHover();

                        element.classList.add('active-menu');
    
                        let submenu = document.querySelector('[data-menu-submenu="'+ element.dataset.menuSubmenuTargetHover + '"]');
    
                        this.openSubmenu(submenu, true).then(result => {});
                    }
                }, () => {} );

            } else {

                hoverintent(element, () => {

                    if (window.screenMode == 'desktop-large') {
    
                        this.closeAllSubmenus();
                    }

                }, () => {} );
            }
        });

        // Close submenu on click
        document.querySelectorAll('[data-menu-submenu-close-target]').forEach((element) => {

            element.addEventListener('click', (event) => {

                event.preventDefault();

                let submenu = document.querySelector('[data-menu-submenu="'+ element.dataset.menuSubmenuCloseTarget + '"]');

                this.closeSubmenu(submenu).then(result => {

                    this.disableSubmenuFocusTrap();

                    if (this.activeSubmenu) {
                        this.activeSubmenu.focus();
                        this.activeSubmenu = null;
                    }
                });

                this.disableGlobalOverlay();
            });
        });

        // Close submenu on leave hover only on desktop
        document.querySelector('.site-header').addEventListener('mouseleave', (event) => {
                
            if (window.screenMode == 'desktop-large') {
                this.closeAllSubmenus();
                this.disableSubmenuFocusTrap();
            }
        });
     }

     /**
	 * Open a submenu
     * 
     * @param {object} submenu A submenu object.
     * @param {boolean} disable_focus Disable focus change after open the submenu.
     * @return {Promise} Boolean value.
	 */
    openSubmenu(submenu, disable_focus = false) {

        return new Promise((resolve, reject) => {

            // Close all submenus opened
            this.closeAllSubmenus(submenu);

            // Handle submenu attributes
            submenu.classList.add('active');
            submenu.classList.add('animation');
            submenu.setAttribute('aria-hidden', 'false');
            submenu.classList.remove('hidden');

            // Handle global attributes
            this.classList.add('active-submenu');
            document.querySelector('body').classList.add('active-menu');

            if (window.screenMode != 'desktop-large') {

                // Fix scroll position to top
                this.querySelector('.menu__navigation-wrapper').scrollTop = 0;
            }

            this.enableGlobalOverlay();
            
            // We need to use set time out to avoid issues with animation
            setTimeout(() => {

                if (!disable_focus) {
                    this.initSubmenuFocusTrap(submenu);
                    this.activeSubmenuFocusTrap();
                    submenu.querySelector('[data-menu-submenu-close-target]').focus();
                }

                resolve(true);
            }, 100);
        });
    }

    /**
	 * Close a submenu
     * 
     * @param {object} submenu A submenu object.
     * @return {Promise} Boolean value.
	 */
     closeSubmenu(submenu) {

        return new Promise((resolve, reject) => {

            // Handle submenu attributes
            submenu.classList.remove('active');

            // Handle global attributes
            this.classList.remove('active-submenu');
            document.querySelector('body').classList.remove('active-menu');

            // We need to use set time out to avoid issues with animation
            setTimeout(() => {

                // Handle submenu attributes
                submenu.setAttribute('aria-hidden', 'true');
                submenu.classList.remove('animation');
                submenu.classList.add('hidden');
                resolve(true);
            }, 150);
        });

     }

     /**
	 * Close all submenus
     * 
     * @param {object} submenuActived The active submenu.
     * @return {undefined}
	 */
    closeAllSubmenus(submenuActived) {

        let submenus = document.querySelectorAll('[data-menu-submenu]');

        submenus.forEach(submenu => {

            if (submenuActived) {

                // This condition will avoid to close the active submenu
                if (submenuActived.dataset.menuSubmenu != submenu.dataset.menuSubmenu) {
                    this.closeSubmenu(submenu);
                }

            } else {
            
                this.closeSubmenu(submenu);
                this.removeActiveClassHover();
            }
        });

        this.disableGlobalOverlay();
    }

    /**
	 * Enable global overlay
     * 
     * @return {undefined}
	 */
     enableGlobalOverlay() {
        if (window.screenMode == 'desktop-large') {

            let overlay = document.querySelector('[data-global-overlay]');

            if (overlay) {
                overlay.classList.add('active');
            }
        }
     }

     /**
	 * Disable global overlay
     * 
     * @return {undefined}
	 */
    disableGlobalOverlay() {
        if (window.screenMode == 'desktop-large') {
            document.querySelector('[data-global-overlay]').classList.remove('active');
        }
    }

    /**
	 * Init menu focus trap
     * 
     * @return {undefined}
	 */
     initFocusTrap() {

        this.focusTrap = focusTrap.createFocusTrap(this, { allowOutsideClick: true });
     }

     /**
	 * Disable menu focus trap
     * 
     * @return {undefined}
	 */
    disableFocusTrap() {

        if (this.focusTrap) {
            this.focusTrap.deactivate();
        }
    }

    /**
	 * Ative menu focus trap
     * 
     * @return {undefined}
	 */
    activeFocusTrap() {

        if (this.focusTrap) {
            this.focusTrap.activate();
        }
    }

    /**
     * Init submenu focus trap
     * 
     * @return {undefined}
     */
    initSubmenuFocusTrap(submenu) {
        this.submenuFocusTrap = focusTrap.createFocusTrap(submenu, { clickOutsideDeactivates: true });
    }

    /**
     * Active submenu focus trap
     * 
     * @return {undefined}
     */
    activeSubmenuFocusTrap() {

        if (this.submenuFocusTrap) {

            this.disableFocusTrap();
            this.submenuFocusTrap.activate();
        }
    }

    /**
     * Disable submenu focus trap
     * 
     * @return {undefined}
     */
    disableSubmenuFocusTrap() {

        if (this.submenuFocusTrap) {
            
            this.submenuFocusTrap.deactivate();
            this.submenuFocusTrap = null;

            if (window.screenMode != 'desktop-large') {
                this.activeFocusTrap();
            }
        }
    }

    /**
     * Remove all 'active' classes from menu opened
     * 
     * @return {undefined}
     */
     removeActiveClassHover() {
        let hovermenus = document.querySelectorAll('[data-menu-submenu-target-hover]');

        // Remove all 'active' classes from menu opened
        hovermenus.forEach(hovermenu => {
            hovermenu.classList.remove('active-menu');
        });
        
    }

}

customElements.define('main-menu', mainMenu);
