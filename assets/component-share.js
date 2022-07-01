/**
 * Share component
 * 
 * @module share
 * @version 1.0.0
 * @extends HTMLElement
 */

 if (!customElements.get('component-share')) {

  class buttonShare extends HTMLElement {

      constructor() {
        super();

        this.elements = {

          shareButton: this.querySelector('[data-share-btn]'),
          shareSummary: this.querySelector('[data-share-summary]'),
          successMessage: this.querySelector('[data-share-message]'),
          urlInput: this.querySelector('[data-share-input]')

        }
        
        this.mainDetailsToggle = this.querySelector('details');
        this.urlToShare = this.elements.urlInput?.value || document.location.href;

        this.initEvents();
      }

    /**
     * Init events
     * 
     * @returns {undefined}
     */

    initEvents() {

      this.mainDetailsToggle.addEventListener('focusout', this.onFocusOut.bind(this));
      
      if (navigator.share) {

        this.mainDetailsToggle.setAttribute('hidden', '');
        this.elements.shareButton.classList.remove('hidden');
        this.elements.shareButton.addEventListener('click', () => { navigator.share({ url: this.urlToShare, title: document.title }) });
    
      } else {

        this.addAccessibilityAttributes();
        this.mainDetailsToggle.addEventListener('toggle', this.toggleDetails.bind(this));
        this.mainDetailsToggle.querySelector('[data-share-copy]').addEventListener('click', this.copyToClipboard.bind(this));

      }

    }

    /**
     *  add Accessibility Attributes on Share btn
     * 
     * @returns {undefined}
     */

    addAccessibilityAttributes() {

      this.elements.shareSummary.setAttribute('role', 'button');
      this.elements.shareSummary.setAttribute('aria-expanded', 'false');
      this.elements.shareSummary.setAttribute('aria-controls', this.elements.shareSummary.nextElementSibling.id);
    
    }

    /**
     *  toggle Share Details
     * 
     * @returns {undefined}
     */

    toggleDetails() {

      if (!this.mainDetailsToggle.open) {

        this.elements.successMessage.classList.add('hidden');
        this.elements.shareSummary.focus();

      }

      this.elements.shareSummary.setAttribute('aria-expanded', this.mainDetailsToggle.open);

    }

    /**
     *  copy url To Clipboard
     * 
     * @returns {undefined}
     */

    copyToClipboard() {

      navigator.clipboard.writeText(this.elements.urlInput.value).then(() => {

        this.elements.successMessage.classList.remove('hidden');

      });

    }

    /**
     *  close share details on Focus Out
     * 
     * @returns {undefined}
     */
    
    onFocusOut() {

      setTimeout(() => {

        if (!this.contains(document.activeElement)) this.close();

      });

    }

    /**
     *  close share details
     * 
     * @returns {undefined}
     */

    close() {

      this.mainDetailsToggle.removeAttribute('open')

    }
    
  }

  customElements.define('component-share', buttonShare);

}
