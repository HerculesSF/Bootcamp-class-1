/**
 * Swatches selector component
 * 
 * @todo Change this component to swatchSelector.
 * @module swatches-selector
 * @version 1.0.0
 * @extends HTMLElement
 */
class swatchComponent extends HTMLElement {

    /**
     * Product swatch selector web component.
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
     * Render component in the DOM
     * 
     * @param {object} product Product data.
     * @returns {undefined}
     */
    render(product) {

        let html = this.getTemplate(),
            content = '';

        if (html && !this.querySelector('[data-option]')) {
            
            if (product.options.length > 1 && product.options[0].values.length > 1) {

                product.options.forEach((option, index) => {

                    let position = index + 1;

                    content = content + `<div class="swatches__swatch" data-option="${option.name}" data-position="${position}">`;
                    content = content + `<div class="swatches__swatch-label">${option.name}:</div>`;

                    content = content + `<div class="swatches__swatch-image"><div class="swatches__swatch-loading swatches__swatch-loading--image loading">loading</div></div>`;

                    content = content + `</div>`;
                });

                this.innerHTML = content;
            } 
        }

        this.loadSwatches(product);

        this.selectFirstVariantAvailable(product);

        this.initEvents(product);
    }

    /**
     * Get component template
     * 
     * @returns {string} Component HTML template.
     */
    getTemplate() {

        return window.theme.swatchSelector.template ? window.theme.swatchSelector.template : '';
    }

    /**
     * Init component events.
     * 
     * @param {object} product Product data.
     * @returns {undefined}
     */
    initEvents(product) {

        // On swatch change

        this.querySelectorAll('[data-swatch-input]').forEach(element => {

            element.addEventListener('change', event => {
                this.onSwatchChange(event.target, product);
            });
        });

        // On variant selector ready

        let variantSelector = document.querySelector('variant-selector[data-handle="'+this.dataset.handle+'"]');

        variantSelector.addEventListener('ready', event => {

            variantSelector.querySelector('select').addEventListener('change', event => {
                this.updateSwatchValues();
            });

            this.selectFirstVariantAvailable(product);
            this.disableOutOfStockVariants();
        });

        // After varaint selector ready event

        if (variantSelector.classList.contains('ready')) {

            variantSelector.querySelector('select').addEventListener('change', event => {
                this.updateSwatchValues();
            });
            
            this.selectFirstVariantAvailable(product);
            this.disableOutOfStockVariants();
        }
    }

    /**
     * Load swatch inputs from a product
     * 
     * @param {object} product Product data.
     * @returns {undefined|boolean}
     */
    loadSwatches(product) {

        if (!window.theme.product.hasVariants(product))
            return false;

        product.options.forEach((option) => {

            if (this.getImageSwatchOptions().includes( option.name.toUpperCase() )) {

                this.loadSwatchImage(option, product);

            } else {

                this.loadSwatchText(option, product);
            }
        });
    }

    /**
     * Get array of the custom option to be used as an image swatch.
     * 
     * @returns {Array} Array of the custom options.
     */
    getImageSwatchOptions() {

        if (typeof this.imageSwatchOptions == 'undefined') {

            this.imageSwatchOptions = window.theme.swatchSelector.imageTypes.toUpperCase().split('|');

            return this.imageSwatchOptions;

        } else {

            return this.imageSwatchOptions;
        }
    }

    /**
     * Get swatch element from DOM.
     * 
     * @returns {object} Swatch element.
     */
    getSwatchElement(optionName) {

        return this.querySelector('[data-option="' + optionName.replaceAll(' ', '-') + '"]');
    }

    /**
     * Render swatch as an image.
     * 
     * @param {object} product Product data.
     * @param {object} option Product option data.
     * @returns {undefined|boolean}
     */
    loadSwatchImage(option, product) {

        let element     = this.getSwatchElement(option.name),
            swatches    = window.theme.swatches.getSwatches(product, option.name),
            label       = this.getSwatchLabelTemplate(),
            finalHtml   = '';

        element.classList.add('swatches__swatch--image');
        element.classList.add('swatches__swatch--image-' + option.name.replaceAll(' ', '-'));

        label = label.replaceAll('{{ option_name }}', option.name);

        option.values.forEach(value => {

            let html    = this.getSwatchImageTemplate(),
                image   = swatches.find(item => {return item.value == value}),
                id      = 'option-' + option.name.toLowerCase().replaceAll(' ', '-') + '-' + value.toLowerCase().replaceAll(' ', '-');

            if(!image.src)
                return false;

            html = html.replaceAll("{{ value }}", value);
            html = html.replaceAll("{{ name }}", option.name);
            html = html.replaceAll("{{ id }}", id);
            html = html.replaceAll("{{ src }}", image.src);

            finalHtml = finalHtml + html;
        });

        element.innerHTML = label + finalHtml;
    }

    /**
     * Render swatch as a text.
     * 
     * @todo Merge this fuction with loadSwatchImage.
     * @param {object} product Product data.
     * @param {object} option Product option data.
     * @returns {undefined|boolean}
     */
    loadSwatchText(option, product) {

        let element     = this.getSwatchElement(option.name),
            label       = this.getSwatchLabelTemplate(),
            finalHtml   = '';

        if (element) {

            let additionalClass = (option.values.length == 0) ? 'hidden' : '';
            element.classList.add('swatches__swatch--text');
            element.classList.add('swatches__swatch--text-' + option.name.replaceAll(' ', '-'));
    
            label = label.replaceAll('{{ option_name }}', option.name);
    
            option.values.forEach(value => {
    
                let html    = this.getSwatchTextTemplate(),
                    id      = 'option-' + option.name.toLowerCase().replaceAll(' ', '-') + '-' + value.toLowerCase().replaceAll(' ', '-');
    
                html = html.replaceAll("{{ value }}", value);
                html = html.replaceAll("{{ name }}", option.name);
                html = html.replaceAll("{{ id }}", id);
                html = html.replaceAll("{{ additionalClass }}", additionalClass);
    
                finalHtml = finalHtml + html;
            });
    
            element.innerHTML = label + finalHtml;
        }
    }

    /**
     * Get swatch label html template.
     * 
     * @todo Move this template to a liquid file.
     * @returns {string} HTML template.
     */
    getSwatchLabelTemplate() {

        return '<div class="swatches__swatch-label">{{ option_name }}: <strong data-swatch-label="{{ option_name }}"></strong></div>';
    }

    /**
     * Get swatch image html template.
     * 
     * @todo Move this template to a liquid file.
     * @returns {string} HTML template.
     */
    getSwatchImageTemplate() {

        return '<div class="image-swatches__swatch">' +
                    '<input type="radio" id="{{ id }}" name="{{ name }}" value="{{ value }}" aria-label="{{ value }}" data-swatch-input="{{ name }}">' + 
                    '<label for="{{ id }}">{{ value }}</label>' + 
                    '<img src="{{ src }}" alt="{{ value }}"/>' + 
                '</div>';
    }

    /**
     * Get swatch text html template.
     * 
     * @todo Move this template to a liquid file.
     * @returns {string} HTML template.
     */
    getSwatchTextTemplate() {

        return '<div class="image-swatches__swatch {{ additionalClass }}">' +
                    '<input type="radio" id="{{ id }}" name="{{ name }}" value="{{ value }}" aria-label="{{ value }}" data-swatch-input="{{ name }}">' + 
                    '<label for="{{ id }}">{{ value }}</label>' + 
                '</div>';
    }

    /**
     * On swatch change.
     * 
     * @param {object} swatchInput Swatch input dom element.
     * @param {object} product Product data.
     * @returns {undefined}
     */
    onSwatchChange(swatchInput, product) {

        this.updateOptionLabel(swatchInput);

        let variant = this.getSelectedVariant(product);

        this.updateVariantSelector(variant);

        this.disableOutOfStockVariants();

    }

    /**
     * Get selected variant from swatch inputs.
     * 
     * @param {object} product Product data.
     * @returns {object} Product variant data.
     */
    getSelectedVariant(product) {

        // Create object with selected options 
        let selectedOptions = {};

        // Save the selected options in to the object
        this.querySelectorAll('[data-option]').forEach(element => {

            let input = element.querySelector('[data-swatch-input]:checked');

            if (input) {
                selectedOptions['option'+element.dataset.position] = input.value;
            }
        });

        // Find a product variant based on the selected options
        return product.variants.find((item) => {

            return ((item.option1 == selectedOptions.option1) && (item.option2 == selectedOptions.option2) && (item.option3 == selectedOptions.option3))
        });
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

    /**
     * Update swatch option label with the current selected value.
     * 
     * @param {object} input Swatch input.
     * @returns {undefined}
     */
    updateOptionLabel(input) {
        this.querySelector('[data-swatch-label="' + input.name + '"]').innerHTML  = input.value;
    }

    /**
     * Select the first variant available from a product in the variant selector component.
     * 
     * @param {object} product Product data.
     * @returns {undefined}
     */
    selectFirstVariantAvailable(product) {

        let firstAvailableOption = document.querySelector('variant-selector[data-handle="'+this.dataset.handle+'"] option[data-enabled]');

        if (firstAvailableOption) {
            
            let variant = product.variants.find(item => {return item.id == firstAvailableOption.dataset.variantId});
    
            this.selectVariant(variant);
        }
    }

    /**
     * Select variant from a product in the variant selector component.
     * 
     * @todo Try to improve this code to reduce the code quantity.
     * @param {object} variant Product variant data.
     * @returns {undefined}
     */
    selectVariant(variant) {

        if (variant) {

            let inputOption1 = this.querySelector('[data-option][data-position="1"] input[value="'+variant.option1+'"]');

            if (inputOption1) {
                inputOption1.checked = true;
                this.updateOptionLabel(inputOption1);
            }

            let inputOption2 = this.querySelector('[data-option][data-position="2"] input[value="'+variant.option2+'"]');

            if (inputOption2) {
                inputOption2.checked = true;
                this.updateOptionLabel(inputOption2);
            }

            let inputOption3 = this.querySelector('[data-option][data-position="3"] input[value="'+variant.option3+'"]');

            if (inputOption3) {
                inputOption3.checked = true;
                this.updateOptionLabel(inputOption3);
            }
        }
    }

    /**
     * Disable out of stock variant swatches.
     * 
     * @returns {undefined}
     */
    disableOutOfStockVariants() {
        
        let firstSelectedOption = {},
            secondSelectedOption = {},
            variantSelector = this.getVariantSelector();

        this.querySelectorAll('[data-option]').forEach(element => {

            element.querySelectorAll('[data-swatch-input]').forEach(input => {

                let selector   = '',
                    inputValue = input.value.replaceAll(' ','-'),
                    inputName  = input.name.replaceAll(' ','-');
                
                switch(element.dataset.position) {

                    case "1":

                        selector = '[data-swatches-option-'+inputName+'="'+inputValue+'"][data-enabled]';

                        if(input.checked){
                            firstSelectedOption.name = inputName;
                            firstSelectedOption.value = inputValue;
                        }
                      
                        break;

                    case "2":

                        selector = '[data-swatches-option-'+firstSelectedOption.name+'="'+firstSelectedOption.value+'"][data-swatches-option-'+inputName+'="'+inputValue+'"][data-enabled]';
                        
                        if(input.checked) {
                            secondSelectedOption.name = inputName;
                            secondSelectedOption.value = inputValue;
                        }
                    
                        break;

                    default: 

                        selector = '[data-swatches-option-'+firstSelectedOption.name+'="'+firstSelectedOption.value+'"][data-swatches-option-'+secondSelectedOption.name+'="'+secondSelectedOption.value+'"][data-swatches-option-'+inputName+'="'+inputValue+'"][data-enabled]';

                        break;
                }

                let optionsVariantSelector = variantSelector.querySelectorAll(selector);

                if (optionsVariantSelector.length == 0) {

                    input.classList.add('disabled');

                } else {
                    
                    input.classList.remove('disabled');

                }
            });
        });
    }

    /**
     * Update swatch inputs.
     * 
     * @returns {undefined}
     */
    updateSwatchValues() {

    }
}

customElements.define('component-swatch', swatchComponent);
