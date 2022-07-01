/**
 * Product gallery component
 * 
 * @module product-gallery-component
 * @version 1.0.0
 * @extends HTMLElement
 */
 class productGalleryComponent extends HTMLElement {

    /**
     * Product gallery web component.
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

        if (window.isTouch) {

            this.addEventListener('click', event => {

                if (this.classList.contains('active')) {
                    this.destroy();
                } else {
                    this.load();
                }
            });

        } else {

            hoverintent(this, () => {

                this.classList.add('hover');
                
                this.load();
    
            }, () => {
    
                this.classList.remove('hover');
    
                this.destroy();
            });
        }
    }

    /**
     * Load component.
     * 
     * @returns {undefined}
     */
    load() {

        if (!this.classList.contains('active')) {

            this.classList.add('loading-gallery');
            this.classList.add('active');

            window.theme.product.loadProduct(this.dataset.handle).then(product => {

                this.render(product);

                this.classList.remove('loading-gallery');

                this.addLink(product); 
            });
        }
    }

    /**
     * Render component.
     * 
     * @param {object} product Product data.
     * @returns {undefined}
     */
    render(product) {

        if (product.images.length > 1) {

            this.injectImages(product);

            this.initSlider();
        }
    }

    /**
     * Inject images.
     * 
     * @param {object} product Product data.
     * @returns {undefined}
     */
    injectImages(product) {

        if (!this.dataset.inject) {
            
            let div = document.createElement('div');

            if (this.offsetHeight == 0) {

                div.style.height = this.parentElement.offsetHeight + 'px';

            } else {

                div.style.height = this.offsetHeight + 'px';
            }

            div.classList.add('product-gallery__images');
            div.classList.add('hidden');
            div.classList.add('swiper');

            let html = '';

            html = html + '<div class="swiper-wrapper">';

            product.images.forEach(image => {

                if (this.dataset.size) {
                    
                    let src = image.src,
                        ext = window.theme.file.getExtension(src);

                    image.src = src.replace(new RegExp(ext), '_' + this.dataset.size + '_crop_top' + ext);
                }

                html = html + `<div style="width: 100%; display: block;" class="swiper-slide product-gallery__images-item"><img src='${image.src}' alt='${product.title}'/></div>`;
            });

            html = html + '</div>';
            html = html + '<div class="swiper-pagination"></div><div class="swiper-button-prev transparent-button"></div><div class="swiper-button-next transparent-button"></div>';

            div.innerHTML = html;
    
            this.append(div);

            this.dataset.inject = true;
        }
    }

    /**
     * Init slider.
     * 
     * @returns {undefined}
     */
    initSlider() {

        this.slider = new Swiper( this.querySelector('.product-gallery__images'), {
            preloadImages: true,
            watchSlidesVisibility: true,
            watchSlidesProgress: true,
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
                init: (slide) => {
                    
                    let element = this.querySelector('.product-gallery__images');

                    element.classList.remove('hidden');

                    element.classList.add('active');

                    if (window.isTouch) {
                        
                        this.classList.add('slide-active');

                    } else {

                        setTimeout(() => {

                            if (this.classList.contains('hover')) {
                                this.classList.add('slide-active');
                            }

                        }, 400);
                    }
                },
                slideChange: index => {}
            }
        });
    }

    /**
     * Destroy compoent.
     * 
     * @returns {undefined}
     */
    destroy() {

        this.classList.remove('active');

        if (this.querySelector('.product-gallery__images')) {

            let element = this.querySelector('.product-gallery__images');

            element.classList.remove('active');

            this.classList.remove('slide-active');

            // We need to use set time out to avoid issues with accordion animation
            setTimeout(() => {
                element.classList.add('hidden');
        
                if (this.slider) {
                    this.slider.destroy();
                    this.classList.remove('slide-active');
                }
            }, 400);
        }
    }

     /**
     * add Link to PDP
     * 
     * @param {object} product Product data.
     * @returns {undefined}
     */
      addLink(product) {

        this.querySelectorAll("img").forEach(image => {

            image.addEventListener('click', () => {
                
                window.location.href = window.location.protocol + "//" + window.location.host + "/products/" + product.handle;
            
            });

        });

    }
}

customElements.define('product-gallery-component', productGalleryComponent);
