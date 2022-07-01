/**
 * Quick View component
 * 
 * @module quick-view
 * @version 1.0.0
 * @extends HTMLElement
 */

 customElements.component = 'quick-view';

if(!customElements.get(customElements.component)){
    class quickView extends HTMLElement {

        /**
         * Quick view web component
         * 
         * @constructor
         */
        constructor() {
    
            super();
    
            this.initEvents();
            this.initFocusTrap();

            window.addEventListener('init-quickview', event => {

                this.initEvents();
                this.initFocusTrap();

            });
            
            window.theme.quickView = this;
        }

        /**
         * Init component events.
         * 
         * @returns {undefined}
         */
        initEvents() {
    
            this.initOpenEvents();
            this.initCloseEvents();
        }

        /**
         * Init quick view open events
         * 
         * @returns {undefined}
         */
        initOpenEvents() {
            let btnsOpen = document.querySelectorAll('[data-quick-view-handle]');

            btnsOpen.forEach(btn => {
                if(!btn.classList.contains('js-active')) {
                    btn.classList.add('js-active');
                    btn.addEventListener('click', event => {
                        event.preventDefault();
                        this.open(btn.dataset.quickViewHandle);
                    });
                }

            });
        }

        /**
         * Init quick view open events
         * 
         * @returns {undefined}
         */
        initCloseEvents() {
            this.querySelectorAll('[data-quick-view-close]').forEach(element => {
                element.addEventListener('click', event => {
                    event.preventDefault();
                    this.close();
                });
            });
        }

        /**
         * Init the product slider 
         * 
         * @returns {undefined}
         */
        initSlider() {

            let slider = this.querySelector('[data-slide-init]');

            if(slider && this.enable_carousel) {

                this.slider = new Swiper(slider, {
                    preloadImages: true,
                    lazy: {
                        loadPrevNext: true,
                    },
                    autoHeight: true,
                    pagination: {
                        el: '.swiper-pagination',
                        dynamicBullets: true
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    on: {
                        init: () => {
                            this.classList.add("active-slider");
                            this.classList.add("loaded");
                        },
                        slideChange: index => {}
                    }
                });

            } else {
                this.classList.add("loaded");
            }
        }

        /**
         * Destroy the product slider 
         *  
         * @returns {undefined}
         */
         destroySlider() {
            if (this.slider && this.enable_carousel) {
                this.slider.destroy();
                this.enable_carousel = false;
                this.classList.remove("active-slider");
            }
        }

        /**
         * Open quick view
         * 
         * @param {string} handle Product handle.
         * @returns {undefined}
         */
        open(handle) {

            document.querySelector('body').classList.add('quick-view-active');
            document.querySelector('.quick-view__overlay').classList.add('active');

            window.theme.product.loadProduct(handle, true).then(product => {

                let quickView = document.querySelector('[data-quick-view-container]');

                let content = this.loadContent(product);
                
                quickView.innerHTML += content;

                this.initSlider();

                this.initCloseEvents();

                setTimeout(() => {
                    this.classList.add('active');
                    this.setAttribute('aria-hidden', 'false');
                    this.activeFocusTrap();
                    this.initQtySelector(); 
                }, 500); 
            });
        }

        /**
         * Close quick view
         * 
         * @returns {undefined}
         */
        close() {

            this.classList.remove('loaded');
            this.classList.remove('active');

            this.disableFocusTrap();

            setTimeout(() => {

                this.destroySlider();

                let content = document.querySelector('.quick-view__content');

                if (content) {
                    content.remove();
                    this.setAttribute('aria-hidden', 'true');
                }

                document.querySelector('body').classList.remove('quick-view-active');
                
                document.querySelector('.quick-view__overlay').classList.remove('active');

            }, 350);
        }

        /**
         * Load quick view content
         * 
         * @param {object} product Product data.
         * @returns {string} HTML code
         */
        loadContent(product) {
            let content = quickViewTemplate.quick_view_content_layout;

            let productImages = '';

            product.images.forEach(image => {
                productImages += `<div class="swiper-slide quick-view__carousel-item"><img src="${image.src}" alt="${image.alt}" loading="lazy"/></div>`;
            });

            if(product.images.length > 1) {
                this.enable_carousel = true;
            }

            content = content.replace(/{{productImage}}/g, productImages);
            
            content = content.replace(/{{productTitle}}/g, product.title);

            let product_price = `<span class="quick-view__price-current" data-price>${product.variants[0].price}</span>`;

            if (product.variants[0].compare_at_price > 0) {
                product_price += `<span class="quick-view__price-compared" data-compareatprice>${product.variants[0].compare_at_price}</span>`;
            }
            
            content = content.replace(/{{productPrice}}/g, product_price);
            
            content = content.replace(/{{productId}}/g, product.id);
            
            content = content.replace(/{{variant}}/g, product.variants[0].id);

            content = content.replace(/{{productHandle}}/g, product.handle);

            return content;
        }

        /**
         * Init quick view focus trap
         * 
         * @returns {undefined}
         */
        initFocusTrap() {
            this.focusTrap = focusTrap.createFocusTrap(this, {});
        }

        /**
         * Disable quick view focus trap
         *  
         * @returns {undefined}
         */
        disableFocusTrap() {
            if (this.focusTrap) {
                this.focusTrap.deactivate();
            }
        }

        /**
         * Ative quick view focus trap
         * 
         * @returns {undefined}
         */
        activeFocusTrap() {
            if (this.focusTrap) {
                this.focusTrap.activate();
            }
        }

        /**
         * Init quantity selector
         * 
         * @return {undefined}
         */

        initQtySelector() {

            let QtySelector = this.querySelectorAll('[data-quantity-selector]');
    
            QtySelector.forEach(element => {
    
                element.querySelector('[data-quantity-selector-minus]').addEventListener('click', event => {
    
                    event.preventDefault();
    
                    let input = event.target.parentElement.querySelector('input');
    
                    this.decreaseQtySelector(input);
                });
    
                element.querySelector('[data-quantity-selector-plus]').addEventListener('click', event => {
    
                    event.preventDefault();
    
                    let input = event.target.parentElement.querySelector('input');
    
                    this.increaseQtySelector(input);
                });
            });
        }

        /**
         * Decrease input value
         * 
         * @param {input} input A input for the quantity selector.
         * @return {undefined}
         */

        decreaseQtySelector(input) {

            let value = parseInt(input.value);

            if (value > 0) {

                value--;

                input.value = value;

                let event = new CustomEvent('change', {'detail': input });

                input.dispatchEvent(event);
            }
        }

        /**
         * Increase input value
         * 
         * @param {input} input A input for the quantity selector.
         * @return {undefined}
         */

         increaseQtySelector(input) {

            let value = parseInt(input.value);

            value++;

            input.value = value;

            let event = new CustomEvent('change', {'detail': input });
                
            input.dispatchEvent(event);
        }

    }

    customElements.define(customElements.component, quickView);    
}


