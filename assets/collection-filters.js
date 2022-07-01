/**
 * Collection Filters
 * 
 * @module collection-filters
 * @version 1.0.0
 * @extends HTMLElement
 */
class CollectionFilters extends HTMLElement {

    /**
     * Collection filters web component.
     * 
     * @constructor
     */
    constructor() {

      super();

      // This variable is used to store data as cache
      this.filterData = [];
      
      this.initEvents();

      this.renderCounts();

      this.renderAllSelectedFilters();
    }

    /**
     * Init component events.
     * 
     * @returns {undefined}
     */
    initEvents() {
      
        this.onActiveFilterClick = this.onActiveFilterClick.bind(this);

        this.debouncedOnSubmit = window.theme.debounce.apply(event => {
            this.onSubmitHandler(event);
        }, 500);
      
        this.querySelector('form').addEventListener('input', this.debouncedOnSubmit.bind(this));
    
        window.addEventListener('popstate', this.onHistoryChange.bind(this));
    }
  
    /**
     * On submit handler event.
     * 
     * @param {object} event Event.
     * @returns {undefined}
     */
    onSubmitHandler(event) {

      event.preventDefault();

      const formData = new FormData(event.target.closest('form'));

      const searchParams = new URLSearchParams(formData).toString();
      
      this.renderPage(searchParams, event);
    }

    /**
     * On active filter click event.
     * 
     * @param {object} event Click event.
     * @returns {undefined}
     */
    onActiveFilterClick(event) {

        event.preventDefault();
        
        this.renderPage(new URL(event.currentTarget.href).searchParams.toString());
    }

    /**
     * Render page content.
     * 
     * @param {string} searchParams URL params.
     * @param {object} event Click event.
     * @param {boolean} updateURLHash update URL hash.
     * @returns {undefined}
     */
    renderPage(searchParams, event, updateURLHash = true) {

        const sections = this.getSections();
  
        document.getElementById('CollectionProductGrid').classList.add('loading');
    
        sections.forEach((section) => {
            
          const url = `${window.location.pathname}?section_id=${section.section}&${searchParams}`;
          
          const filterDataUrl = element => element.url === url;
    
          this.filterData.some(filterDataUrl) ?
            this.renderSectionFromCache(filterDataUrl, event) :
            this.renderSectionFromFetch(url, event);
        });
    
        if (updateURLHash) this.updateURLHash(searchParams);
    }

    /**
     * Get sections.
     * 
     * @returns {undefined}
     */
    getSections() {
        return [
            {
                id: 'collection',
                section: document.getElementById('main-collection-product-grid').dataset.id,
            }
        ]
    }

    /**
     * Render section from fetch.
     * 
     * @param {string} url String url.
     * @param {object} event Event.
     * @returns {undefined}
     */
    renderSectionFromFetch(url, event) {

        fetch(url).then(response => response.text()).then((responseText) => {

            const html = responseText;

            const html_dom = new DOMParser().parseFromString(html, 'text/html');

            this.filterData = [...this.filterData, { html, url }];

            this.renderFilters(html_dom, event);

            this.renderProductGrid(html_dom);

            this.renderProductCount(html_dom);

        });
    }

    /**
     * Render section from catch.
     * 
     * @param {function} filterDataUrl A function.
     * @param {object} event Event.
     * @returns {undefined}
     */
    renderSectionFromCache(filterDataUrl, event) {

        const html = this.filterData.find(filterDataUrl).html;

        const html_dom = new DOMParser().parseFromString(html, 'text/html');

        this.renderFilters(html_dom, event);

        this.renderProductGrid(html_dom);

        this.renderProductCount(html_dom);
    }

    /**
     * Render product grid.
     * 
     * @param {object} html_dom Page html dom.
     * @returns {undefined}
     */
    renderProductGrid(html_dom) {

        let productGrid = document.getElementById('CollectionProductGrid');

        if (productGrid) {

            let newProductGrid = html_dom.getElementById('CollectionProductGrid');

            if (newProductGrid) {
                
                productGrid.innerHTML = newProductGrid.innerHTML;

				document.getElementById('CollectionProductGrid').classList.remove('loading');
            }
        }
    }

    /**
     * Render product count.
     * 
     * @param {object} html_dom Page html dom.
     * @returns {undefined}
     */
     renderProductCount(html_dom) {

      let productQty = document.querySelectorAll('[data-collection-filter-product-qty]');

      let newproductQty = html_dom.querySelector('[data-collection-product-qty]');

      if(newproductQty){
        productQty.forEach(elem => {
          elem.innerHTML = newproductQty.innerHTML;
        });
      }

  }

    /**
     * Render filters.
     * 
     * @param {object} html_dom Page html dom.
     * @returns {undefined}
     */
    renderFilters(html_dom, event) {

        const facetDetailsElements =
          html_dom.querySelectorAll('#CollectionFiltersForm .js-filter');

		const matchesIndex = element => {

			let result = element.dataset.index === event?.target.closest('.js-filter')?.dataset.index;

			return result;
		}

        const facetsToRender = Array.from(facetDetailsElements).filter(element => !matchesIndex(element));
    
        facetsToRender.forEach((element) => {
          document.querySelector(`.js-filter[data-index="${element.dataset.index}"]`).innerHTML = element.innerHTML;
        });
    
        this.renderActiveFacets(html_dom);

        this.renderAdditionalElements(html_dom);
        
        this.renderCounts();

        this.renderAllSelectedFilters();
    }

    /**
     * Render active facets.
     * 
     * @param {object} html_dom Page html dom.
     * @returns {undefined}
     */
    renderActiveFacets(html_dom) {
    
        const activeFacetElementSelectors = ['.active-facets'];

        activeFacetElementSelectors.forEach((selector) => {

            const activeFacetsElement = html_dom.querySelector(selector);

            if (!activeFacetsElement) return;

            document.querySelector(selector).innerHTML = activeFacetsElement.innerHTML;
        });
    }

    /**
     * Render additional elements.
     * 
     * @param {object} html_dom Page html dom.
     * @returns {undefined}
     */
    renderAdditionalElements(html_dom) {

        const mobileElementSelectors = ['.mobile-facets__open', '.mobile-facets__count', '.sorting'];
    
        mobileElementSelectors.forEach((selector) => {

          if (!html_dom.querySelector(selector)) return;

          document.querySelector(selector).innerHTML = html_dom.querySelector(selector).innerHTML;

        });
    }

    /**
     * On history change.
     * 
     * @param {object} event Event.
     * @returns {undefined}
     */
    onHistoryChange(event) {

        const searchParams = event.state?.searchParams || '';

        this.renderPage(searchParams, null, false);
    }

    /**
     * Render counts.
     * 
     * @returns {undefined}
     */
    renderCounts() {

        const count = document.getElementById('activeFacetsCount').dataset.count;

        document.querySelectorAll('[data-filter-count]').forEach(element => {
			element.dataset.filterCount = parseInt(count);
        });
    }

    /**
     * Render all selected filters text.
     * 
     * @returns {undefined}
     */
    renderAllSelectedFilters() {
        var accordionItems = this.querySelectorAll('[data-accordion-item]');

        if(accordionItems) {

            // Load all filters
            accordionItems.forEach((item) => {
                this.updateHeadingText(item);
            });

            this.updatePriceHeading();
        }
    }

    /**
     * Update filter heading text.
     * 
     * @param {object} item Accordion Item.
     * @returns {undefined}
     */
    updateHeadingText(item) {

        // SIZE | COLOR | SORTING | PRODUCT TYPE - options
        let heading = item.querySelector('[data-accordion-heading]');
        let tag = heading.querySelector('[data-accordion-selected-filters]');
        let checkboxInputs = item.querySelectorAll('input[type="checkbox"]');
        checkboxInputs = Array.from(checkboxInputs).filter((input) => input.checked);

        if(checkboxInputs.length) {

            let appliedFilters = '';

            // Load all selected filters
            checkboxInputs.forEach((input, index) => {

                let label = item.querySelector(`label[for='${input.id}']`);

                if(tag && label) {

                    if(index == 0) {
                        //Only one filter selected
                        appliedFilters = `: ${label.innerText}`;
                    }
                    else {
                        //More than one filter selected
                        appliedFilters += ` / ${label.innerText}`;
                    }
                }
            });

            // Apply the filters text
            if(appliedFilters) {
                tag.innerText = appliedFilters;
            }
        }
        else {
            tag.innerText = '';
        }
    }

    /**
     * Update price filter heading text.
     * 
     * @returns {undefined}
     */
    updatePriceHeading() {

        // PRICE options
        let numberInputs = this.querySelectorAll('input[type="number"]');

        if(numberInputs.length) {

            let minInput = numberInputs[0];
            let maxInput = numberInputs[1];

            if(minInput.value && maxInput.value) {

                let item = minInput.closest('[data-accordion-item]')
                let heading = item.querySelector('[data-accordion-heading]');
                let tag = heading.querySelector('[data-accordion-selected-filters]');

                tag.innerText = `: ${minInput.value} - ${maxInput.value}`;
            }
        }
    }

    /**
     * Update URL hash.
     * 
     * @returns {undefined}
     */
    updateURLHash(searchParams) {
      history.pushState({ searchParams }, '', `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`);
    }
}

customElements.define('collection-filters', CollectionFilters);






class PriceRange extends HTMLElement {
    constructor() {
      super();
      this.querySelectorAll('input')
        .forEach(element => element.addEventListener('change', this.onRangeChange.bind(this)));
  
      this.setMinAndMaxValues();
    }
  
    onRangeChange(event) {
      this.adjustToValidValues(event.currentTarget);
      this.setMinAndMaxValues();
    }
  
    setMinAndMaxValues() {
      const inputs = this.querySelectorAll('input');
      const minInput = inputs[0];
      const maxInput = inputs[1];
      if (maxInput.value) minInput.setAttribute('max', maxInput.value);
      if (minInput.value) maxInput.setAttribute('min', minInput.value);
      if (minInput.value === '') maxInput.setAttribute('min', 0);
      if (maxInput.value === '') minInput.setAttribute('max', maxInput.getAttribute('max'));
    }
  
    adjustToValidValues(input) {
      const value = Number(input.value);
      const min = Number(input.getAttribute('min'));
      const max = Number(input.getAttribute('max'));
  
      if (value < min) input.value = min;
      if (value > max) input.value = max;
    }
  }
  
  customElements.define('price-range', PriceRange);






  /**
 * Price Range slider
 * 
 * @module price-range-slider
 * @version 1.0.0
 * @requires module:collection-filters
 * @extends HTMLElement
 */
 class PriceRangeSlider extends HTMLElement {

    /**
     * Price Ranger Slider web component.
     * 
     * @constructor
     */
    constructor() {
        super();
        this.initEvents();
    }

    /**
       * Init component events.
       * 
       * @returns {undefined}
       */
    initEvents() {

        let element = document.createElement('div');
        this.append(element);

        let step = this.dataset.priceRangeSlideStep || 1;
        let min = this.dataset.priceRangeSlideMin || 0;
        let max = this.dataset.priceRangeSlideMax || 100;
        let inputMin = document.querySelector(this.dataset.inputMinId);
        let inputMax = document.querySelector(this.dataset.inputMaxId);
        let startMin, startMax;
        this.filterInputs = document.querySelectorAll(this.dataset.inputMinId +' , '+ this.dataset.inputMaxId);

        if(inputMin.value && inputMax.value) {
            startMin = inputMin.value;
            startMax = inputMax.value;
        }
        else {
            startMin = min;
            startMax = max;
        }

        // Init noUiSlider
        noUiSlider.create(element, {
            start: [startMin, startMax],
            connect: true,
            step: Number(step),
            range: {
                'min': Number(min),
                'max': Number(max)
            },
            handleAttributes: [
              { 'aria-label': 'Lower price' },
              { 'aria-label': 'Upper price' },
            ]

        });

        this.filterInputs.forEach((input, indexInput) => { 
            input.addEventListener('input', () => {
                element.noUiSlider.setHandle(indexInput, input.value);
            })
        });

        element.noUiSlider.on('update', (values, handle) => {
            this.filterInputs[handle].value = values[handle];
        });

        // Dispatch Input event after value is updated
        element.noUiSlider.on('set', (values, handle) => { 

            var event = new Event('input', {
                bubbles: true,
                cancelable: true,
            });
            
            this.filterInputs[handle].dispatchEvent(event);

        });

    }
}

customElements.define('price-range-slider', PriceRangeSlider);





/**
 * Facet remove
 * 
 * @module facet-remove
 * @version 1.0.0
 * @requires module:collection-filters
 * @extends HTMLElement
 */
 class FacetRemove extends HTMLElement {

    /**
     * Facet remove filters web component.
     * 
     * @constructor
     */
    constructor() {

        super();

        this.querySelector('a').addEventListener('click', (event) => {

            event.preventDefault();

            const form = this.closest('collection-filters') || document.querySelector('collection-filters');

            form.onActiveFilterClick(event);
        });
    }
}

customElements.define('facet-remove', FacetRemove);
