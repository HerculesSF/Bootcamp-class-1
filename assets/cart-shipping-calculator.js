/**
 * Cart Shipping Calculator component
 * 
 * @module cart-shipping-calculator
 * @extends HTMLElement
 */

class cartShippingCalculator extends HTMLElement {

    /**
     * Cart Shipping Calculator Constructor
     * 
     * @constructor
     */
    constructor() {

        super();

        this.initCartShippingCalculator();

        this.initEvents();

    }

    /**
	 * Init Cart Shipping Calculator
     * 
     * @return {undefined}
	 */
    initCartShippingCalculator() {

        this.provinceContainer = this.querySelector('[data-cart-shipping-calculator-province-container]');
        this.countryElem = this.querySelector('[data-cart-shipping-calculator-country]');
        this.provinceElem = this.querySelector('[data-cart-shipping-calculator-province]');
        this.zipElem = this.querySelector('[data-cart-shipping-calculator-zip]');
        this.buttonGetRates = this.querySelector('[data-cart-shipping-calculator-get-rates]');
        this.wrapperResponse = this.querySelector('[data-cart-shipping-calculator-wrapper-response]');

        this.buildProvince(this.countryElem.dataset.default, this.provinceElem.dataset.default);

    }

    /**
	 * Init Events
     * 
     * @return {undefined}
	 */
    initEvents() {

        this.countryElem.addEventListener('change', event => {
            this.buildProvince(this.countryElem.value);
        });

        this.buttonGetRates.addEventListener('click', event => {
            this.getCartShippingRatesForDestination().then( data => {
                this.showShippingRatesFeedback(data);
            });
        });

    }

    /**
	 * Build Province select
     * 
     * @param {string} countryName A country name.
     * @param {string} provinceDefault A province name.
     * @return {undefined}
	 */
    buildProvince(countryName, provinceDefault = '') {

        this.provinceContainer.style.display = "none";

        let countryOption = this.countryElem.querySelector('option[value="'+countryName+'"]');
        if(!countryOption) {
            return;
        }

        if(!this.provinceContainer) {
            return;
        }

        if(!this.provinceElem) {
            return;
        }

        let provinces = countryOption.dataset.provinces;
        if(!provinces) {
            return;
        }

        //Remove Provinces before add new data
        while(this.provinceElem.firstChild){
            this.provinceElem.removeChild(this.provinceElem.firstChild)
        }

        // Add Provinces
        let e = JSON.parse(provinces);
        for (var n = 0; n < e.length; n++) {
            var i;
            ((i = document.createElement("option")).value = e[n][0]), (i.innerHTML = e[n][1]), this.provinceElem.appendChild(i);
        }

        // Set default province value
        if(provinceDefault) {
            this.provinceElem.value = provinceDefault;
        }

        // Show Provinces
        this.provinceContainer.style.display = "";
        
    }

    /**
	 * Show Shipping Rates Feedback
     * @param {string} data A json object.
     * @return {undefined}
	 */
     showShippingRatesFeedback(data) {
        
        let responseHtml = '';

        this.wrapperResponse.classList.remove('no-results');

        let templateShipping = `<ul id="shipping-rates">{{items}}</ul>`;

        let templateShippingItem = `<li>{{rate_name}}: {{rate_price}}</li>`;
        
        let hasShippingRates = data.hasOwnProperty('shipping_rates');

        if(hasShippingRates){

            let itemsHtml = '';

            data.shipping_rates.forEach(item => {
                let itemHtml = templateShippingItem.replaceAll('{{rate_name}}', item.presentment_name);
                itemHtml = itemHtml.replaceAll('{{rate_price}}', theme.money.format(item.price));
                itemsHtml += itemHtml;
            });

            responseHtml = templateShipping.replaceAll('{{items}}',itemsHtml);

        }else{

            let errorHtml = '';

            Object.entries(data).forEach(([key, val]) => {
                val.forEach(value => {
                    errorHtml += '<span> ' + key + ':</span> ' + value + '<br>';
                })
            });

            responseHtml = '<p class="cart-shipping-calculator-error">'+errorHtml+'</p>';

        }

        this.wrapperResponse.innerHTML = responseHtml;

    }

    /**
	 * Get Cart Shipping Rates For Destination
     * 
     * @return {Promise}
	 */
     getCartShippingRatesForDestination() {

        let shippingAddress = {};
        shippingAddress.zip = this.zipElem.value || "";
        shippingAddress.country = this.countryElem.value || "";
        shippingAddress.province = this.provinceElem.value || "";

        let paramQ = 'shipping_address.zip=' + shippingAddress.zip;
        paramQ += '&shipping_address.country=' + shippingAddress.country;
        paramQ += '&shipping_address.province=' + shippingAddress.province;
        paramQ = paramQ.replaceAll('.', '%5B');
        paramQ = paramQ.replaceAll('=', '%5D=');

        let URL = `/cart/shipping_rates.json?${paramQ}`;

        return fetch(URL)
        .then(response => {
            return response.json();
        })
        .then(json => {
            return json;
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    }

}

customElements.define('cart-shipping-calculator', cartShippingCalculator);