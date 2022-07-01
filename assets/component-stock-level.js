/**
 * Stock level component
 * 
 * @module stock-level
 * @version 1.0.0
 * @extends HTMLElement
 */
 class stockLevel extends HTMLElement {

    /**
     * Stock level web component.
     * 
     * @constructor
     */
    constructor() {

        super();

        window.theme.product.loadProduct(this.dataset.handle, true).then(product => {

            this.initEvents(product);
        });

    }

    /**
     * Init events.
     * 
     * @returns {undefined}
     * @param {object} product A product object.
     */
    initEvents(product) {

        this.render(product.variants[0]);

        // On variant change
        window.addEventListener('variant-change', this.onVariantChange.bind(this));
    }

    /**
     * On variant change.
     * 
     * @param {object} event Event.
     * @returns {undefined}
     */
    onVariantChange(event) {
        
        if(event.detail.product.handle == this.dataset.handle){
            this.render(event.detail.variant);
        }
    }

    /**
     * Render Stock level
     * 
     * @param {object} variant Object selected variant
     * @returns {undefined}
    */
    render(variant) {

        let inventoryWrapper = document.querySelector('stocklevel-component[data-handle="'+this.dataset.handle+'"]');

        if(variant && variant.available) {
            
            if ( window.theme.variantStock[variant.id] <= 10 && window.theme.variantStock[variant.id] > 0 ) {
                let inventoryHtml = `<span> Only ${ window.theme.variantStock[variant.id]} left!</span>`;
                inventoryWrapper.innerHTML = inventoryHtml;
            } else {
                inventoryWrapper.innerHTML = '';
            }
        } else {
            inventoryWrapper.innerHTML = '';
        }

    }
}

customElements.define('stocklevel-component', stockLevel);
