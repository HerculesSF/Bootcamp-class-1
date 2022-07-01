/**
 * Left Menu component
 * 
 * @module left-menu
 * @version 1.0.0
 * @extends HTMLElement
 */
class mainLeftMenu extends HTMLElement {

    /**
     * Left menu web component
     * 
     * @constructor
     */
    constructor() {

        super();

        this.closeMenu();
        this.initToggle();
        this.initFocusTrap();
    }

    /**
     * Init left menu toggle buttons
     * 
     * @returns {undefined}
     */
    initToggle() {

        document.querySelectorAll('[data-left-menu-open]').forEach(element => {
            element.addEventListener('click', event => {
                event.preventDefault();
                this.openMenu();
            });
        });

        // Close menu on close button or overlay
        document.querySelectorAll('[data-left-menu-close]').forEach(element => {
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
	 * Open left menu
     * 
     * @returns {undefined}
	 */
    openMenu() {

        if (window.screenMode == 'desktop-large') {
            this.classList.remove('hidden');

            document.querySelector('.site-header').classList.add('left-menu-active');

            document.querySelector('.left-menu__overlay').classList.add('active');

            this.setAttribute('aria-hidden', 'false');

            this.openStatus = true;

            setTimeout(() => {
                this.classList.add('active');
                this.activeFocusTrap();
                this.querySelector('[data-left-menu-close]').focus();
            }, 50); 
        }
    }

    /**
	 * Close left menu
     * 
     * @returns {undefined}
	 */
    closeMenu() {
        if (window.screenMode == 'desktop-large') {
            this.disableFocusTrap();

            this.classList.remove('active');

            document.querySelector('.site-header').classList.remove('left-menu-active');

            document.querySelector('.left-menu__overlay').classList.remove('active');

            // We need to use set time out to avoid issues with menu animation
            setTimeout(() => {
                this.setAttribute('aria-hidden', 'true');
                this.classList.add('hidden');
            }, 500); 
        }
    }

    /**
	 * Enable global overlay
     * 
     * @returns {undefined}
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
	 * Init left menu focus trap
     * 
     * @returns {undefined}
	 */
     initFocusTrap() {

        this.focusTrap = focusTrap.createFocusTrap(this, {});
     }

     /**
	 * Disable left menu focus trap
     * 
     * @returns {undefined}
	 */
    disableFocusTrap() {

        if (this.focusTrap) {
            this.focusTrap.deactivate();
        }
    }

    /**
	 * Ative left menu focus trap
     * 
     * @returns {undefined}
	 */
    activeFocusTrap() {

        if (this.focusTrap) {
            this.focusTrap.activate();
        }
    }
}

customElements.define('left-menu', mainLeftMenu);
