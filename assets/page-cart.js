class pageCart extends HTMLElement {

    constructor() {

        super();

        this.initListenQuantity();
    }

    /**
	 * Listen when update the input quantity
     * 
     * @return {undefined}
	 */
	initListenQuantity() {
        document.querySelectorAll('[data-cart-page-item-id]').forEach(element => {
            element.addEventListener('change', event => {

				var productId = event.target.dataset.cartPageItemId;
				
				if(productId) {
					window.theme.cart.update(productId, event.target.value).then((result) => {
						this.reloadCartData(productId, event.target.value);
					});
				}
            });
        });
	}

	/**
	 * Reload cart data (Prices)
     * 
     * @return {undefined}
	 */
	reloadCartData(id, qty_added) {

        fetch('/cart.js', { credentials: 'same-origin' }).then(function(response) {
			return response.json();
		}).then(function(cart) {

			this.updateFreeShippingBar();
			window.theme.cart._setCartQuantity(cart.item_count);
			this.setPricesPage(cart, id);
			this.checkAvailabilityStock(cart, id, qty_added);

			if(qty_added <= 0) {
				//remove product from cart
				window.location.href = '/cart';
			}

		}.bind(this)).catch(function(error) {
			console.log(error);
		});
	}

	/**
	 * Update prices on the page
     * 
     * @return {undefined}
	 */
	 setPricesPage(cart, id) {
		cart.items.forEach(item => {
	
			if(id == item.id) {
				var total_per_product = window.theme.money.format(item.final_line_price);

				document.querySelectorAll("[data-product-final-price='" + item.id + "']").forEach(element => {

					// Updating price(subtotal) on the table
					element.innerText = total_per_product;
				});
			}
		});

		// Updating subtotal
		var subtotal = document.querySelector("[data-subtotal]");
		subtotal.innerText = window.theme.money.format(cart.total_price);
	}

	/**
	 * Update the progress bar (Free Shipping App)
     * 
     * @return {undefined}
	 */
	 updateFreeShippingBar() {

		if (typeof window.updateFSPB != 'undefined') {
			window.updateFSPB();
		}
	 }

	/**
	 * Check if product has unavailability stock
     * 
     * @return {undefined}
	 */
	checkAvailabilityStock(cart, id, qty_added) {
		let message = document.querySelector('[data-error-message]');

		if(!message) return null;

		cart.items.forEach(item => {
			if(id == item.id) {

				if(qty_added > item.quantity) {
					message.innerHTML = "";
					message.append("All " + item.quantity + " " + item.title + " are in your cart.");
					message.classList.add("active");

					let input = document.querySelectorAll('[data-cart-page-item-id=\"' + item.id + '\"]');

					if(input) {
						input.forEach(element => {
							element.value = item.quantity;
						});
					}
				}
				else {
					message.innerHTML = "";
					message.classList.remove("active");
				}
			}
		});
	}
}

customElements.define('page-cart', pageCart);