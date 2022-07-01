/**
 * Scroll Button component
 * 
 * @module scroll-button
 * @version 1.0.0
 * @extends HTMLElement
 */

class ScrollButton extends HTMLElement {

    constructor() {

        super();

        this.initEvents();
    }

    /**
	 * Init events
     * 
     * @return {undefined}
	 */

     initEvents() {

        let sections = document.querySelectorAll('[data-section]');
        let button = this.querySelector('button');

        if(sections.length > 1) {
            
            button.classList.add("active");

            button.addEventListener('click', () => window.scrollTo({
                top: (sections[0].scrollHeight + 50),
                behavior: 'smooth',
            }));
        }
	}
	
}

customElements.define('scroll-button', ScrollButton);

