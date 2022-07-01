/**
 * Gallery component
 * 
 * @module gallery
 * @version 1.0.0
 * @extends HTMLElement
 */
class galleryComponent extends HTMLElement {

    /**
     * Product gallery web component.
     * 
     * @constructor
     */
    constructor() {

        super();

        /**
         * Gallery element.
         * 
         * @var {Object}
         */
        this.gallery = this.querySelector('[data-gallery]');

        /**
         * Thumbnails element.
         * 
         * @var {Object}
         */
        this.thumbnails = this.querySelector('[data-thumbnail-slider]');

        this.initCells();
        this.initSlider();
        this.initEvents();
        this.initPhotoSwipeEvents();
    }

    /**
     * Init gallery cells array to handle image visibility on change variant.
     * 
     * @returns {undefined}
     */
    initCells() {

        /**
         * Gallery cells array
         * 
         * @var {Array}
         */
        this.cells = [];

        /**
         * Number of visible cells in the gallery based of the variant selected.
         * 
         * @var {Array}
         */
        this.activeCells = 0;

        this.gallery.querySelectorAll('[data-gallery-item]').forEach(item => {

            let index = item.dataset.galleryItemIndex;

            this.cells[index] = {
                index: parseInt(index),
                status: true,
                alt: item.dataset.galleryItem,
                element: item
            };
        });
    }

    /**
	 * Init gallery slider.
     * 
     * @returns {undefined}
	 */
    initSlider() {

        this.querySelectorAll('.swiper-lazy-loading').forEach(element => {
            element.classList.remove('swiper-lazy-loading');
        });

        this.slider = new Swiper(this.gallery, {
            preloadImages: true,
            lazy: {
                loadPrevNext: true,
            },
            autoHeight: true,
            pagination: {
                el: '.swiper-gallery-pagination',
                dynamicBullets: true
            },
            scrollbar: {
                el: '.swiper-scrollbar',
            },
            on: {
                init: () => {

                    if (!this.thumbnails)
                        return false;

                    this.items = this.thumbnails.querySelectorAll('[data-thumbnail-item]');

                    this.initThumbnails();

                    if (typeof window.theme.carousel != 'undefined')
                        window.theme.carousel.loadInfinityDots(this);
                },
                slideChange: index => {

                    if (!this.thumbnails)
                        return false;

                    this.activeThumbnail(index);

                    if (typeof window.theme.carousel != 'undefined')
                        window.theme.carousel.loadInfinityDots(this);
                }
            }
        });
    }

    /**
     * Init gallery events.
     * 
     * @returns {undefined}
     */
     initEvents() {

        // On variant change
        window.addEventListener('variant-change', event => {
            if( event.detail.product.id == this.dataset.galleryProductId){
                this.swapImages(event.detail.product, event.detail.variant);
            }
        });
    }

    /**
     * Init gallery thumbnails.
     * 
     * @returns {undefined}
     */
     initThumbnails() {

        //Mark the first element as active
        this.thumbnails.querySelector('[data-thumbnail-item]').classList.add("active");

        this.items.forEach(element => {

            element.addEventListener('click', event => {

                event.preventDefault();

                let index = element.dataset.thumbnailIndex;

                this.activeThumbnail(index);

                this.slider.slideTo(index, 500);

            }, false);
        });
	}

    /**
     * Active thumbnail by index.
     * 
     * @param {integer} index Thumbnail index.
     * @returns {undefined}
     */
	activeThumbnail(index) {

        // Remove all actived elements
        this.items.forEach((element) => {
            element.classList.remove("active");
        });

        let thumbnail = this.thumbnails.querySelector("[data-thumbnail-index='" + index + "']");

        if (thumbnail) {
            thumbnail.classList.add("active");
        }
	}

    /**
     * Swap gallery images by variant.
     * 
     * @param {object} product Product data.
     * @param {object} variant Variant data.
     * @returns {undefined}
     */
     swapImages(product, variant) {

        let alt = this.getCurrentAlt(product, variant);

        this.destroySlider();

        if (alt) {

            this.activeCells = 0;

            this.cells.forEach(cell => {

                if (cell.alt && cell.alt.toLowerCase() == alt) {

                    this.enableImage(cell.index);
                    this.activeCells++;
                    
                } else {

                    this.disableImage(cell.index);
                }
            });

            this.updateThumbnailsVisibility(alt);

        } else {

            this.showAllImages();
        }

        this.initSlider();
    }

    /**
     * Get image alt from current variant active.
     * 
     * @param {object} product Product data.
     * @param {object} variant Variant data.
     * @returns {string} Image alt.
     */
     getCurrentAlt(product, variant) {

        let currentAlt = null;

        if (product.media) {
        
            product.media.forEach(image => {

                if (image.alt && variant) {

                    let alt       = image.alt.toLowerCase(),
                        altArray  = alt.split('/'),
                        reference = (altArray[1]) ? altArray[1].trim() : null;

                    if (variant.title.toLowerCase().includes(reference) && !alt.includes('swatch')) {
                        currentAlt = alt;
                    }
                }
            });

            return currentAlt;

        } 
    }

    /**
     * Destroy gallery slider.
     * 
     * @returns {undefined}
     */
    destroySlider() {

        this.slider.destroy();
    }

    /**
     * Disable image by gallery cell index.
     * 
     * @param {integer} index Gallery cell index.
     * @returns {undefined}
     */
    disableImage(index) {
        
        this.cells[index].status = false;

        let element = this.querySelector('[data-gallery-item-index="'+ index +'"]');

        if (element) {
            element.remove();
        }
    }

    /**
     * Enable image by gallery cell index.
     * 
     * @param {integer} index Gallery cell index.
     * @returns {undefined}
     */
    enableImage(index) {

        this.cells[index].status = true;

        if (!this.querySelector('[data-gallery-item-index="' + index + '"]')) {

            this.gallery.querySelector('[data-gallery-wrapper]').append(this.cells[index].element);
        }
    }

    /**
     * Enable thumbnail element.
     * 
     * @param {object} thumbnail Thumbnail element.
     * @param {integer} index Thumbnail index.
     * @returns {undefined}
     */
    enableThumbnail(thumbnail, index) {
        thumbnail.style.display = 'block';
        thumbnail.dataset.thumbnailIndex = index;
    }

    /**
     * Disable thumbnail element.
     * 
     * @param {object} thumbnail Thumbnail element.
     * @returns {undefined}
     */
    disableThumbnail(thumbnail) {
        thumbnail.dataset.thumbnailIndex = -1;
        thumbnail.style.display = 'none';
    }

    /**
     * Active thumbnail by a custom click event.
     * 
     * @param {object} thumbnail Thumbnail element.
     * @returns {undefined}
     */
    triggerThumbnailClick(thumbnail) {
        let event = new CustomEvent('click', {});
        thumbnail.dispatchEvent(event);
        return true;
    }

    /**
     * Show all galerry images.
     * 
     * @param {object} thumbnail Thumbnail element.
     * @returns {undefined}
     */
    showAllImages() {

        // Disable all images
        this.cells.forEach((cell, index) => {
            this.disableImage(index);
        });

        // Display all images except swatches
        this.cells.forEach((cell, index) => {
            if (cell.alt && cell.alt.toLowerCase().includes('swatch')) {
                this.disableImage(index);
            } else {
                this.enableImage(index);
            }
        });

        // Display all thumbnails except swatches
        this.updateThumbnailsVisibility();
    }

    /**
     * Update thumbnails visibility by image alt.
     * 
     * @param {string} alt Image alt.
     * @returns {undefined}
     */
     updateThumbnailsVisibility(alt) {
        
        let activeThumbnail = false, index = 0;

        document.querySelectorAll('[data-thumbnail-item]').forEach(thumbnail => {

            if (thumbnail.dataset.thumbnailItem) {

                // Display thumbnails via alt
                if (alt) {

                    if (thumbnail.dataset.thumbnailItem.toLowerCase() == alt.toLowerCase()) {

                        this.enableThumbnail(thumbnail, index);
    
                        index++;
        
                        if (!activeThumbnail)
                            activeThumbnail = this.triggerThumbnailClick(thumbnail);

                    } else {

                        this.disableThumbnail(thumbnail);

                    }

                } else {

                    // Display all thumbnails except swatches
                    if (!thumbnail.dataset.thumbnailItem.toLowerCase().includes('swatch')) {
        
                        this.enableThumbnail(thumbnail, index);
            
                        index++;
    
                        if (!activeThumbnail)
                            activeThumbnail = this.triggerThumbnailClick(thumbnail);
                    }
                }

            } else {

                this.disableThumbnail(thumbnail);
            }
        });
    }

    /**
     * Init PhotoSwipe events.
     * 
     * @returns {undefined}
     */
     initPhotoSwipeEvents() {
        // Init zoom image
        let zoomImage = document.querySelectorAll('[data-pswp-img]');

        this.initZoomImage(zoomImage);

        // On screen change
        window.addEventListener('screen-breakpoint', event => {
            this.initZoomImage(zoomImage);
        });
    }
    
    
    /**
    * Start zoom with PhotoSwipe gallery on product image
    * 
    * @param {object} zoomImage Images that will init zoom.
    * @returns {undefined}
    */

     initZoomImage(zoomImage) {
        if(window.screenMode == 'tablet' || window.screenMode == 'desktop'  || window.screenMode == 'desktop-large' ) {
            //active on tablet, desktop and desktop-large devices by clicking the zoom button
            let zoomBtn = document.querySelector('[data-zoom]');

            if(zoomBtn && !zoomBtn.classList.contains('zoom-active') ){
                zoomBtn.classList.add('zoom-active');

                //init the zoom PhotoSwipe starting with the selected image
                zoomBtn.addEventListener('click', (event) => {
                    let image = document.querySelectorAll('[data-thumbnail-item]');

                    let indexImg;
                    image.forEach((element, index) => {
                        if (element.classList.contains('active')) {
                            indexImg = index;
                        }
                    });

                    this.initPhotoSwipe(zoomImage, indexImg);
                });
            }
        } else {

            // active on mobile by clicking the image
            zoomImage.forEach((element, index) => {
                if (!element.classList.contains('zoom-active')) {
                    element.classList.add('zoom-active');

                    //init the zoom PhotoSwipe starting with the selected image
                    element.addEventListener('click', (event) => {
                        this.initPhotoSwipe(zoomImage, index);
                    });
                }
            });
        }
    }

    /**
     * Init the PhotoSwipe
     * 
     * @param {object} zoomImage Images that will init PhotoSwipe.
     * @param {integer} index Image index where the PhotoSwipe will start.
     * @returns {undefined}
     */

    initPhotoSwipe(zoomImage, index) {
        let items = [];

        zoomImage.forEach((element) => {
            let img = { 
                src: element.dataset.pswpSrc,
                w: element.dataset.pswpWidth,
                h: element.dataset.pswpHeight
            };
            items.push(img);
        });

        let pswpElement = document.querySelector('.pswp');

        let options = {
            tapToClose: true,
            fullscreenEl: false,
            shareEl: false,
            index: index
        };
        let gallery = new PhotoSwipe( pswpElement, window.PhotoSwipeUI_Default, items, options);
        gallery.init();
    }
}

customElements.define('component-gallery', galleryComponent);
