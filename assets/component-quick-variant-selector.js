/**
 * Quick variant selector component
 * 
 * @module component-quick-variant-selector
 * @version 1.0.0
 * @extends HTMLElement
 */
 class quickVariantSelector extends HTMLElement {

    /**
     * Quick variant selector web component.
     * 
     * @constructor
     */
    constructor() {

        super();

        if (this.dataset.handle) {

            if (this.dataset.productOptions) {

                this.productOptions = this.dataset.productOptions.split(',');

                window.theme.product.loadProduct(this.dataset.handle, true).then(product => {

                    this.productOptions.forEach(option => {

                        // Save options
                        this.options = this.getOptionsList(product, option);
                    });

                    this.render(this.options, product);
                });

            } else {

                console.log('Missing product options', this);
            }

        } else {

            console.log('Missing product handle', this);
        }
    }

    /**
     * Update variant selector web component.
     * 
     * @param {object} product Product data.
     * @param {string} optionName Product option name.
     * @returns {undefined}
     */
    getOptionsList(product, optionName) {
    
        let optionsList = null;

        if (typeof product.options_by_name[optionName] != 'undefined' ) {
    
            optionsList = [];

            let firstOptionAvailable = null,
                mainOptionIndex = product.options_by_name.Size.option.position;

            product.variants.forEach(variant => {

                if (variant.available) {

                    if (!firstOptionAvailable) {
                        firstOptionAvailable = variant;
                    }

                    if (mainOptionIndex == 1 && firstOptionAvailable.option2 == variant.option2 && firstOptionAvailable.option3 == variant.option3) {

                        optionsList.push({
                            variant: variant,
                            variantId: variant.id,
                            optionValue: variant.option1
                        });
                    }

                    if (mainOptionIndex == 2 && firstOptionAvailable.option1 == variant.option1 && firstOptionAvailable.option3 == variant.option3) {

                        optionsList.push({
                            variant: variant,
                            variantId: variant.id,
                            optionValue: variant.option2
                        });
                    }

                    if (mainOptionIndex == 3 && firstOptionAvailable.option1 == variant.option1 && firstOptionAvailable.option2 == variant.option2) {

                        optionsList.push({
                            variant: variant,
                            variantId: variant.id,
                            optionValue: variant.option3
                        });
                    }
                }
            });
        }

        return optionsList;
    }

    /**
     * Render component.
     * 
     * @param {Array} options Options array.
     * @returns {undefined}
     */
    render(options) {

        if (options) {

            let html = '';

            this.dataset.status = true;

            html = html + '<component-tooltip>';

            let icon = '<svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-select" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" fill="none" stroke="none"/><path fill-rule="evenodd" clip-rule="evenodd" d="M17.0007 17.5872L23.2927 11.2933C23.4805 11.1055 23.7351 11 24.0007 11C24.2662 11 24.5209 11.1055 24.7087 11.2933C24.8965 11.481 25.002 11.7357 25.002 12.0013C25.002 12.2668 24.8965 12.5215 24.7087 12.7093L16.7087 20.7093C16.6158 20.8024 16.5054 20.8763 16.384 20.9267C16.2625 20.9771 16.1322 21.003 16.0007 21.003C15.8692 21.003 15.7389 20.9771 15.6174 20.9267C15.4959 20.8763 15.3856 20.8024 15.2927 20.7093L7.29269 12.7093C7.10492 12.5215 6.99943 12.2668 6.99943 12.0013C6.99943 11.7357 7.10492 11.481 7.29269 11.2933C7.48046 11.1055 7.73514 11 8.00069 11C8.26624 11 8.52092 11.1055 8.70869 11.2933L15.0007 17.5873C16.0007 18.5012 16.0007 18.5012 17.0007 17.5872Z" stroke="none"/></svg>';

            html = html + '<button aria-label="Open add to bag options" data-tooltip-trigger class="btn btn-link">Add to Bag'+icon+'</button>';

            html = html + '<ul data-tooltip-content>';
    
            options.forEach(option => {
                
                html = html + '<li>';
                html = html + '<button class="btn btn-link" data-variant-id="'+option.variantId+'" aria-label="Add '+option.optionValue+' to bag">'+option.optionValue+'</button>';
                html = html + '</li>';
            });
    
            html = html + '</ul>';

            html = html + '</component-tooltip>';
    
            this.innerHTML = html;

            this.initEvents();

            this.triggerRender();
        }
    }

    /**
     * Trigger render event
     * 
     * @returns {undefined}
     */
    triggerRender() {

        this.classList.add('ready');

        let event = new CustomEvent('ready', {'detail': {}});

        this.dispatchEvent(event);

        return event;
    }

    /**
     * Init events
     * 
     * @returns {undefined}
     */
    initEvents() {

        this.querySelectorAll('button[data-variant-id]').forEach(btn => {

            btn.addEventListener('click', event => {

                let variant = this.getVariant(event.target.dataset.variantId);

                this.updateVariantSelector(variant);

                this.closeTooltip();
                
            });
        });
    }

    /**
     * Close tooltip
     * 
     * @param {integer} variantId Variant Id.
     * @returns {undefined}
     */
    closeTooltip() {

        let event = new CustomEvent('close', {'detail': {}});

        this.querySelector('component-tooltip').dispatchEvent(event);

        return event;
    }
 
    /**
     * Get variant
     * 
     * @param {integer} variantId Variant Id.
     * @returns {undefined}
     */
    getVariant(variantId) {

        let variant = null;

        this.options.forEach(option => {

            if (option.variantId == variantId) {

                variant = option.variant;
            }
        });

        return variant;
    }

    /**
     * Update variant selector web component.
     * 
     * @param {object} variant Product variant data.
     * @returns {undefined}
     */
    updateVariantSelector(variant) {

        let variantSelector = document.querySelector('variant-selector[data-handle="' + this.dataset.handle + '"] select');

        if (variantSelector) {

            variantSelector.value = (variant) ? variant.id : '';

            variantSelector.dispatchEvent(new Event("change"));
        }
    }

    /**
     * Get variant selector web component.
     * 
     * @returns {object} Variant selector web component from DOM.
     */
    getVariantSelector() {
        return document.querySelector('variant-selector[data-handle="' + this.dataset.handle + '"] select');
    }
}

customElements.define('quick-variant-selector', quickVariantSelector);
