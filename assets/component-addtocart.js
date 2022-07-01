/**
 * Add to Cart component
 * 
 * @module component-addtocart
 * @version 2.0.0
 * @extends HTMLElement
 */
 class addToCartComponent extends HTMLElement {

    /**
     * Add to Cart web component.
     * 
     * @constructor
     */
    constructor() {

        super();

        if (this.dataset.handle) {

            window.theme.product.loadProduct(this.dataset.handle, true).then(product => {
    
                this.initSubmitButton(product);
                this.initEvents(product);
            });

        } else {

            console.log('Missing product handle', this);
        }
    }

    /**
     * Init component events.
     * 
     * @param {object} product Product data.
     * @returns {undefined}
     */
    initEvents(product) {

        // On submit add to cart form

        const form = this.getForm();

        if (form) {

            form.addEventListener('submit', event => this.onFormSubmit(event) );
        }

        // On variant selector ready

        const variantSelector = document.querySelector('variant-selector[data-handle="'+this.dataset.handle+'"]');

        if (variantSelector) {

            variantSelector.addEventListener('ready', event => this.OnVariantSelectorReady(event, product) );

            if (variantSelector.classList.contains('ready')) {

                this.OnVariantSelectorChange(variantSelector.querySelector('select'), product);
            }
        }
    }

    /**
    * Toggle button if product select variant is out of stock.
    * 
    * @param {object} select Product select variant.
    * @returns {undefined}
    */
    toggleButton(select) {

        let optionSelected = select.children[select.selectedIndex],
            outOfStockContent = this.querySelector('[data-outofstock-content]'),
            btn = this.getSubmitButton();
            
        if (optionSelected) {

            if (optionSelected.dataset.disabled === '') {

                optionSelected = false;

            } else {
                
                optionSelected = true;
            }

        } else {

            optionSelected = false;
        }

        if (optionSelected) {

            outOfStockContent.classList.remove('active');
            btn.disabled = false;

        } else {

            outOfStockContent.classList.add('active');
            btn.disabled = true;
        }
    }

    /**
     * Get component template
     * 
     * @returns {string} Component HTML template.
     */
    getTemplate() {

        return window.theme.addToCart.template ? window.theme.addToCart.template : '';
    }

    /**
     * Init add to cart button features
     * 
     * @param {object} product Product data.
     * @returns {undefined}
     */
    initSubmitButton(product) {

        let html = this.getTemplate(),
            btn  = this.getSubmitButton();

        if (html && btn) {

            btn.classList.add('product-addtocart__button');
            btn.classList.add('btn-icon');
            btn.classList.add('btn-icon-before');
            btn.classList.add('btn-loading');

            if (product.available) {

                btn.classList.add('active');

            } else {

                btn.disabled = true;
            }

            // Inject HTML
            btn.innerHTML = html;
        }
    }

    getForm() {

        return this.querySelector('form');
    }

    getSubmitButton() {

         return this.querySelector('button[type="submit"]');
    }

    onFormSubmit(event) {

        const form = event.target;

        event.preventDefault();
    
        let button   = form.querySelector('[type="submit"]'),
            validate = this.validateFieldRequired(form),
            message  = form.querySelector('[data-error-message]');

        if (!validate) {

            button.setAttribute('disabled', true);
            
            window.theme.cart.addByForm(form).then(result => {

                button.removeAttribute('disabled');


                message.innerHTML = '';
                message.classList.remove("enabled");

            }).catch(error => {

                console.log(error.message);
                button.removeAttribute('disabled');
                
                message.innerHTML = '';
                
                message.append(error.message);
                message.classList.add("enabled");
            });
        }
    }

    OnVariantSelectorReady(event, product) {

        let select = event.target.querySelector('select');

        this.OnVariantSelectorChange(select, product);
    }

    OnVariantSelectorChange(select, product) {

        this.toggleButton(select, product);

        // Check if the select variant changes
        select.addEventListener('change', event => this.toggleButton(event.target, product) );
    }

    validateFieldRequired(form) {

		const fields = form.querySelectorAll("[required]");

		let foundError = false;

		for (let field of fields) {

			foundError = field.validity.valueMissing;

			if (foundError) {
				field.classList.add("invalid");
			}
		}

		return foundError;
	}
}

customElements.define('component-addtocart', addToCartComponent);
