/**
 * Price component
 * 
 * @module price-component
 * @version 1.0.0
 * @extends HTMLElement
 */
 class priceComponent extends HTMLElement {

    /**
     * Product price web component.
     * 
     * @constructor
     */
    constructor() {

        super();

        this.initEvents();
    }

    /**
     * Init events.
     * 
     * @returns {undefined}
     */
    initEvents() {

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
            this.update(event.detail.variant);
        }
    }

    /**
     * Update price.
     * 
     * @returns {undefined}
     */
    update(variant) {

        if (variant) {

            this.querySelector('[data-price]').innerHTML = theme.money.format(variant.price);

            if (variant.compare_at_price) {

                this.querySelector('[data-compareatprice]').innerHTML = theme.money.format(variant.compare_at_price);
            
            } else {

                this.querySelector('[data-compareatprice]').innerHTML = '';
            }
        }
    }
}

customElements.define('price-component', priceComponent);
