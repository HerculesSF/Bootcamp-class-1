/**
 * Related Products component
 * 
 * @module related-products
 * @extends HTMLElement
 */

class relatedProducts extends HTMLElement {

    /**
     * Related Products constructor
     * 
     * @constructor
     */
    constructor() {

        super();

        const handleIntersection = (entries, observer) => {

            if (!entries[0].isIntersecting) return;

            let related = document.querySelector('related-products[data-id="' + this.dataset.id + '"]');

            observer.unobserve(related);

            let section = related.querySelector('[data-related-products]');

            fetch(related.dataset.url)

            .then(response => response.text())

            .then(text => {

                this.loadRelatedProducts(text, section);

                window.addEventListener('screen-breakpoint', event => {
                    if(!section.classList.contains('active'))
                        this.loadRelatedProducts(text, section);
                });

            })
            .catch(e => {console.error(e);});

        }

        new IntersectionObserver(handleIntersection.bind(this)).observe(this);

    }

    /**
     * Load related products
     * 
     * @param {string} html Product recommendations HTML
     * @param {object} section A related products section object.
     * @returns {undefined}
     */
    loadRelatedProducts(html, section) {

        let container = document.createElement("div"); 

        container.innerHTML = html;

        container = container.querySelector('related-products[data-id="' + this.dataset.id + '"]');

        let qty = 0;

        let relatedContainer = container.querySelector('[data-related-container]');

        if(relatedContainer){

            qty = relatedContainer.dataset.qty;

            relatedContainer.classList.add('container');

        }

        if((window.screenMode == 'mobile' && qty >= 2) || (qty >= 4) ){

            section.classList.add('active');

            section.parentElement.innerHTML = container.querySelector('[data-related-products]').innerHTML;

            const event = new CustomEvent('init-quickview');

            window.dispatchEvent(event);

        } else {

            this.classList.add('hidden');
        }
    }
}

customElements.define('related-products', relatedProducts);
