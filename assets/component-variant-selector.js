/**
 * Variant selector component
 * 
 * @module variant-selector
 * @version 1.0.0
 * @extends HTMLElement
 */

customElements.component = 'variant-selector';

if (!customElements.get(customElements.component)) {

    class VariantSelector extends HTMLElement {

        /**
         * Variant selector web component
         * 
         * @constructor
         */
        constructor() {

            super();

            window.theme.product.loadProduct(this.dataset.handle, true).then(product => {

                this.render(product);
            });
        }
        
        /**
         * Init component events
         * 
         * @param {object} product Product data.
         * @returns {undefined}
         */
        initEvents(product) {

            let select = this.querySelector('select');

            if (select) {

                // Trigger event on it to select the first variant available
                theme.variant.triggerVariantChange(select.value, product);

                select.addEventListener('change', event => {
                    theme.variant.triggerVariantChange(event.target.value, product);
                });
            }
        }

        /**
         * Render component in the DOM
         * 
         * @param {object} product Product data.
         * @returns {undefined}
         */
        render(product) {
            
            if (this.getTemplate()) {

                let html = this.getTemplate();

                // Load options

                let options = '';

                product.variants.forEach(variant => {

                    let reference = '';

                    product.options.forEach((option, index) => {

                        // We are using this data to handle out of stock swatches
                        reference = reference + ` data-swatches-option-${option.name.replace(/ /g, '-')}="${variant.options[index].replace(/ /g, '-')}"`;
                    });
                    
                    if (variant.available) {

                        options = options + `<option data-variant-id="${variant.id}" ${reference} value="${variant.id}" data-enabled>${variant.title}</option>`;
                    
                    } else {

                        options = options + `<option data-variant-id="${variant.id}" ${reference} value="${variant.id}" data-disabled>${variant.title} - Sold Out</option>`;
                    }
                });

                html = html.replace(/{{options}}/g, options);

                // Inject HTML

                this.innerHTML = html;

                this.initEvents(product);
                this.triggerRender(product);
            }
        }

        /**
         * Get component template
         * 
         * @returns {string} Component HTML template.
         */
        getTemplate() {

            return window.theme.variantSelector.template ? window.theme.variantSelector.template : '';
        }

        /**
         * Trigger render
         * 
         * @param {object} product Product data.
         * @returns {object} Event Trigger ready.
         */
        triggerRender(product) {

            this.classList.add('ready');

            let event = new CustomEvent('ready', {'detail': {
                product: product
            }});
    
            this.dispatchEvent(event);
    
            return event;
        }

    }

    customElements.define(customElements.component, VariantSelector);
}
