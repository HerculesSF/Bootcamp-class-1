/**
 * Coming Soon Event form component
 * 
 * @module coming-soon-form
 * @version 1.0.0
 * @extends HTMLElement
 */
 class comingSoonFormComponent extends HTMLElement {

    /**
     * Coming Soon Event form web component.
     * 
     * @constructor
     */
    constructor() {

        super();
        
        this.initDataLayerEvents();
    }

    /**
     * Init data layer events.
     * 
     * @returns {undefined}
     */
    initDataLayerEvents() {

        window.dataLayer = window.dataLayer || [];

        window.addEventListener('load', () => {

            const comingSoonForm = this.querySelector('form');

            // Check form
            if(comingSoonForm) {

                comingSoonForm.addEventListener('submit', event => {
    
                    event.preventDefault();
                    const eventId = window.eventId;
    
                    // Check event ID
                    if(eventId) {
    
                        window.dataLayer.push({
                            "event": "ComingSoonNotify",
                            "eventId": eventId,
                            "email": event.target.email.value,
                            "firstName": event.target.first_name.value,
                            "lastName": event.target.last_name.value
                        });

                        //Show confirmation message on form
                        this.showConfirmText();

                        // Clear all fields
                        event.target.reset();
                    }
                });
            }
        } , false);
    }

    /**
     * Show confirmation message on form
     * 
     * @returns {undefined}
     */
     showConfirmText() {

        let confirmDiv = this.querySelector('[data-confirm-message]');

        if(confirmDiv) {
            confirmDiv.classList.add("success");
        }
    }
}

customElements.define('coming-soon-form', comingSoonFormComponent);
