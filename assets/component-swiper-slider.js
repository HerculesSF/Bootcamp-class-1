/**
 * Swiper slider component
 * 
 * @module swiper-slider
 * @version 1.0.0
 * @extends HTMLElement
 */

customElements.component = 'swiper-slider';

if (!customElements.get(customElements.component)) {
 
    class SwiperSlider extends HTMLElement {
 
        /**
         * Variant selector web component
         * 
         * @constructor
         */
        constructor() {

            super();

            this.initSlider();
        }

        /**
         * Init options
         * 
         * @return {undefined}
         */
        initOptions() {

            let slidesPerViewMobile = (this.dataset.viewMobile) ? this.dataset.viewMobile : 1.1,
                slidesPerViewMobileExtra = (this.dataset.viewMobileExtra) ? this.dataset.viewMobileExtra : 2.1,
                slidesPerViewTablet = (this.dataset.viewTablet) ? this.dataset.viewTablet : 3.1,
                slidesPerViewTabletExtra = (this.dataset.viewTabletExtra) ? this.dataset.viewTabletExtra : 3,
                slidesPerViewDesktop = (this.dataset.viewDesktop) ? this.dataset.viewDesktop : 4;

            let defaultOptions = {
                slidesPerView: slidesPerViewMobile,
                watchSlidesVisibility: true,
                watchSlidesProgress: true,
                spaceBetween: 10,
                pagination: {
                    el: '.swiper-pagination',
                    dynamicBullets: true
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },
                scrollbar: {
                    el: '.swiper-scrollbar'
                },
                breakpoints: {
                    600: {
                      slidesPerView: slidesPerViewMobileExtra
                    },
                    750: {
                      slidesPerView: slidesPerViewTablet,
                      spaceBetween: 10
                    },
                    900: {
                      slidesPerView: slidesPerViewTabletExtra,
                      spaceBetween: 20
                    },
                    1200: {
                        slidesPerView: slidesPerViewDesktop,
                        spaceBetween: 20
                    },
                    1500: {
                        slidesPerView: slidesPerViewDesktop,
                        spaceBetween: 20
                    }
                },
                on: {
                    init: () => { },
                    slideChange: index => { }
                }
            };

            let options = (this.dataset.options) ? JSON.parse(this.dataset.options) : {};

            this.options = {...defaultOptions, ...options};
        
            this.options;
        }

        /**
         * Init slider
         * 
         * @return {undefined}
         */
        initSlider() {

            this.initOptions();

            this.slider = new Swiper(this, this.options);
        }
    }
 
    customElements.define(customElements.component, SwiperSlider);
}
 