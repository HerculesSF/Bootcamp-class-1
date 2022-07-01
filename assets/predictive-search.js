/**
 * Predictive Search component
 * 
 * @module predictive-search
 * @version 1.0.0
 * @extends HTMLElement
 */

 customElements.component = 'predictive-search';

 if(!customElements.get(customElements.component)) {
  class PredictiveSearch extends HTMLElement {

    /**
     * Predictive search component
     * 
     * @constructor
     */
    constructor() {
      super();
  
      this.input = this.querySelector('input[type="search"]');

      this.predictiveSearchResults = this.querySelector('#predictive-search');
  
      this.input.addEventListener('input', window.theme.debounce.apply(event => {
        this.onChange(event);
      }, 300).bind(this));

      this.input.addEventListener('focus', this.onFocus.bind(this));

      this.addEventListener('blur', this.onFocusOut.bind(this));
      
    }
  
    /**
     * on Change
     * 
     * @returns {undefined}
     */
    onChange() {
      const searchTerm = this.input.value.trim();
  
      if (!searchTerm.length) {
        this.close();
        return;
      }
  
      this.getSearchResults(searchTerm);
    }
  
    /**
     * Get search results
     * 
     * @param {string} searchTerm Search Term
     * @returns {undefined}
     */
    getSearchResults(searchTerm) {
      fetch(`${window.predictive_search_url}?q=${searchTerm}&resources[type]=product,collection,article,page&resources[limit]=4&section_id=predictive-search`)
        .then((response) => {
          if (!response.ok) {
            var error = new Error(response.status);
            this.close();
            throw error;
          }
          return response.text();
        })
        .then((text) => {
          const resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#shopify-section-predictive-search').innerHTML;
          this.predictiveSearchResults.innerHTML = resultsMarkup;
          this.open();
        })
        .catch((error) => {
          this.close();
          throw error;
        });
    }
  
    /**
     * Open predictive search
     * 
     * @returns {undefined}
     */
    open() {
      this.predictiveSearchResults.style.display = 'block';
      this.setAttribute('open', true);  
    }
  
    /**
     * Close predictive search
     * 
     * @returns {undefined}
     */
    close() {
      this.predictiveSearchResults.style.display = 'none';
      this.removeAttribute('open');
    }

    /**
     * Get Query
     * 
     * @returns {string}
     */
    getQuery() {
      return this.input.value.trim();
    }

    /**
     * On Focus
     * 
     * @returns {undefined}
     */
    onFocus() {
      const searchTerm = this.getQuery();
  
      if (!searchTerm.length) return;
  
      if (this.getAttribute('open') === 'true') {
        this.open();
      } else {
        this.getSearchResults(searchTerm);
      }
    } 
  
    /**
     * On Focus out
     * 
     * @returns {undefined}
     */
    onFocusOut() {
      setTimeout(() => {
        if (!this.contains(document.activeElement)) {
          this.close();
        }          
      });
    }
    
  }
  
  customElements.define(customElements.component, PredictiveSearch);
}
