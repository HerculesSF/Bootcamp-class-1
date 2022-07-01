/**
 * Tooltip component
 * 
 * @module variant-selector
 * @version 1.0.0 
 * @extends HTMLElement
 */

 customElements.component = 'component-tooltip';

 if (!customElements.get(customElements.component)) {
 
    class componentTooltip extends HTMLElement {
 
        /**
         * Variant selector web component
         * 
         * @constructor
         */
        constructor() {

            super();

            this.close(true);

            this.createFocusTrap(this);

            this.initEvents();
        }

        /**
         * Init component events
         * 
         * @returns {undefined}
         */
        initEvents() {

            this.addEventListener('close', event => this.close(true) );

            this.querySelector('[data-tooltip-trigger]').addEventListener('click', event => {

                event.preventDefault();

                if (this.isOpen) {

                    this.close();

                } else {

                    this.open();
                }
            });
        }

        /**
         * Open tooltip
         * 
         * @returns {undefined}
         */
        open() {

            this.isOpen = true;

            let contentElement = this.getContentElement();

            if (contentElement) {
                this.classList.add('active');
                contentElement.style.display = '';
                contentElement.setAttribute('aria-hidden', false);
            }

            this.activeFocusTrap();

            this.triggerEvent('open');
        }

        /**
         * Get content element
         * 
         * @returns {undefined}
         */
        getContentElement() {
            
            if (!this.contentElement) {
                this.contentElement = this.querySelector('[data-tooltip-content]');
            }

            return this.contentElement;
        }

        /**
         * Close tooltip
         * 
         * @returns {undefined}
         */
        close(cancelEvent = false) {

            this.isOpen = false;

            let contentElement = this.getContentElement();

            if (contentElement) {
                this.classList.remove('active');
                contentElement.style.display = 'none';
                contentElement.setAttribute('aria-hidden', true);
            }

            this.disableFocusTrap();

            if (!cancelEvent) {
                this.triggerEvent('close');
            }
        }

        /**
         * Create focus trap
         * 
         * @returns {undefined}
         */
        createFocusTrap() {
            
            this.focusTrap = focusTrap.createFocusTrap(this, { 
                clickOutsideDeactivates: true,
                onDeactivate: () => {
                    this.close();
                }
            });
        }

        /**
         * Create focus trap
         * 
         * @returns {undefined}
         */
        activeFocusTrap() {

            if (this.focusTrap) {
                this.focusTrap.activate();
            }
        }

        /**
         * Disable focus trap
         * 
         * @returns {undefined}
         */
        disableFocusTrap() {

            if (this.focusTrap) {
                this.focusTrap.deactivate();
            }
        }

        /**
         * Trigger event
         * 
         * @returns {undefined}
         */
        triggerEvent(eventName) {

            let event = new CustomEvent(eventName, {'detail': {}});
    
            this.dispatchEvent(event);
    
            return event;
        }
    }
 
    customElements.define(customElements.component, componentTooltip);
}
 