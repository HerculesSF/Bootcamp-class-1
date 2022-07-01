/**
 * Product card component
 * 
 * @module product-card
 * @version 1.0.0
 * @extends HTMLElement
 */

customElements.component = 'product-card';

if (!customElements.get(customElements.component)) {
 
    class ProductCard extends HTMLElement {

        /**
         * Variant selector web component
         * 
         * @constructor
         */
        constructor() {

            super();

            this.initEvents();
        }
         
        /**
         * Init component events
         * 
         * @param {object} product Product data.
         * @returns {undefined}
         */
        initEvents() {

            this.initHover();
            this.initPercentage();
            this.initLazyLoad();
        }

        /**
         * Init hover event
         * 
         * @returns {undefined}
         */
        initHover() {

            hoverintent(this, () => {

                this.classList.add('hover');
    
            }, () => {
    
                this.classList.remove('hover');
            });
        }

        /**
         * Init lazy load event
         * 
         * @returns {undefined}
         */
        initLazyLoad() {

            let observer = new IntersectionObserver((entries, observer) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        observer.unobserve(entry.target);

                        this.loadAddToCart(entry.target.dataset.handle);
                    }
                });

            }, {
                rootMargin: '100px'
            });

            observer.observe(this);
        }

        /**
         * Init porcentage tags
         * 
         * @returns {undefined}
         */
        initPercentage() {

            let percentageTag = this.querySelector(".label__percentage");

            if (percentageTag) {

                window.theme.product.loadProduct(this.dataset.handle, true).then(product => {

                    let productEvent = window.shopEvents[window.theme.handleize(product.vendor)];
    
                    if(typeof productEvent != 'undefined') {
    
                        if(!productEvent.hide_percentage) {
    
                            //Show Percentage Tag
                            percentageTag.classList.remove("hidden");
                        }
                        
                    } else {
    
                        //Show Percentage Tag
                        percentageTag.classList.remove("hidden");
                    }

                });
            }
        }

        /**
         * Init component events
         * 
         * @param {object} product Product data.
         * @returns {undefined}
         */
        loadAddToCart(handle) {
            
            window.theme.product.loadProduct(handle, true).then(product => {

                let content = '';

                content = content + '<component-addtocart data-handle="' + product.handle + '">';

                content = content + '<form class="product-card__form" action="/cart/add" method="post" id="product_card_form_' + product.handle + '" accept-charset="UTF-8" enctype="multipart/form-data" novalidate="novalidate" data-product-form>';

                content = content + '<input type="hidden" name="form_type" value="product">';

                content = content + '<input type="hidden" value="' + product.vendor + '" name="properties[Vendor]">';

                content = content + '<input type="hidden" name="utf8" value="✓">';

                content = content + '<input type="hidden" name="quantity" value="1">';

                content = content + '<variant-selector data-handle="' + product.handle + '"></variant-selector>';

                // content = content + '<component-swatch data-handle="' + product.handle + '"></component-swatch>';

                content = content + '<quick-variant-selector data-handle="' + product.handle + '" data-product-options="size,Size"></quick-variant-selector>';

                // content = content + '<price-component data-handle="' + product.handle + '" >[[productPrice]]</price-component>';

                content = content + '<div data-handle="' + product.handle + '"><button type="submit" name="add" class="btn btn-link">Add to cart</button></div>';

                content = content + '<div data-error-message></div>';

                content = content + '</component-addtocart>';

                this.querySelector('[data-addtocart-form]').innerHTML = content;

                this.initAddToCardEvents();
            });
        }

        /**
         * Init add to cart events.
         * 
         * @returns {undefined}
         */
        initAddToCardEvents() {

            let quickAddToCart = this.querySelector('quick-variant-selector');

            quickAddToCart.addEventListener('ready', event => {

                let quickAddToCartTooltip = this.querySelector('quick-variant-selector component-tooltip');
                
                if (quickAddToCartTooltip) {

                    quickAddToCartTooltip.addEventListener('open', event => {
                        this.classList.add('tooltip-active');
                    });
        
                    quickAddToCartTooltip.addEventListener('close', event => {
                        this.classList.remove('tooltip-active');
                    });
                }
            });
        }
    }
 
    customElements.define(customElements.component, ProductCard);
}
 