/**
 * Event subtitle
 * 
 * @module event-subtitle
 * @version 1.0.0
 * @extends HTMLElement
 */
class eventSubtitle extends HTMLElement {

    /**
     * Event subtitle web component
     * 
     * @constructor
     */
    constructor() {

        super();

        const intersectionObserver = this.dataset.IntersectionObserver;

        if(intersectionObserver == 'true') {
            
            const handleIntersection = (entries, observer) => {

                if (!entries[0].isIntersecting) return;
    
                // init the component
                this.initSubtitle();
    
                // Stop observing the component
                observer.unobserve(this);
            }
    
            // Start observing the component
            new IntersectionObserver(handleIntersection.bind(this)).observe(this);
        }
        else {
            // init the component
            this.initSubtitle();
        }
    }

    /**
     * Init subtitle label
     * 
     * @return {undefined}
     */
    initSubtitle() {

        const handleEventName = this.dataset.eventName;

        // Check the event name
        if(handleEventName) {

            let event = window.shopEvents[handleEventName];

            if (typeof event != 'undefined') {

                this.setSubtitle(event);
            }
        }
    }

    /**
     * Set subtitle label
     * 
     * @param {Object} event Current event data.
     * @return {undefined}
     */
    setSubtitle(event) {

        const liveLabel = this.dataset.liveLabel;

        if(liveLabel == 'true') {

            if(event.status == 'live') {

                this.innerHTML = "Now Live";
        
                if(event.end_date) {

                    let eventEndDate = new Date(event.end_date);

                    if(window.theme.shopifyDate) {

                        let shopifyCurrentDate = new Date(window.theme.shopifyDate.month + "/" + window.theme.shopifyDate.day + "/" + window.theme.shopifyDate.year);
                        let result = this.formatToDays(eventEndDate - shopifyCurrentDate);

                        if(result <= 2) {
                            this.innerHTML = "Last Chance";
                        }
                    }
                }
            }
        }
        
        if(event.status == 'coming-soon') {

            const comingSoonLabel = this.dataset.comingSoonDate;

            if(comingSoonLabel == 'true') {
                this.innerHTML = 'Coming Soon <span>Opens ' + this.formatDate(event.start_date) + '</span>';
            }
            else {
                this.innerHTML = 'Coming Soon';
            }
        }
    }


    /**
     * Transform to days
     * 
     * @param {Number} diffDates Difference between dates.
     * @return {Number}
     */
    formatToDays(diffDates) {
        var result = 0;

        if(diffDates) {
            result = diffDates / (24 * 60 * 60 * 1000);
        }
        
        return result;
    }

    /**
     * Format event date - 22nd February (example format)
     * 
     * @param {String} eventStartDate Current event data.
     * @return {String}
     */
    formatDate(eventStartDate) {

        if(eventStartDate) {

            let dateValue = new Date(eventStartDate);
            let month = new Intl.DateTimeFormat(Shopify.locale, { month: 'long' }).format(dateValue);
            let day = new Intl.DateTimeFormat(Shopify.locale, { day: '2-digit' }).format(dateValue)

            if(day == '1' || day == '21' || day == '31') {
                day += 'st';
            }
            else if(day == '2' || day == '22') {
                day += 'nd';
            }
            else if(day == '3' || day == '23') {
                day += 'rd';
            }
            else {
                day += 'th';
            }

            eventStartDate = `${day} ${month}`;
        }

        return eventStartDate;
    }
}

customElements.define('event-subtitle', eventSubtitle);
