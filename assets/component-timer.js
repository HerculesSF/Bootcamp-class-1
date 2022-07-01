class componentTimer extends HTMLElement {

    constructor() {

        super();

        this.initCounter();
    }

    /**
	 * Init counter
     * 
     * @return {undefined}
	 */

     initCounter() {
        let counter = document.querySelectorAll('[data-counter]');

        counter.forEach(timer => {
            // Set the date we're counting down to
            let countDownDate = timer.dataset.date.trim();
            countDownDate = countDownDate.replace(/ /g,"T");
            countDownDate = new Date(countDownDate).getTime();

            // Update the count down every 1 second
            setInterval(this.countdown , 1000, countDownDate, timer);
        });
	}

    /**
	 * Init countdown
     *   
     * @param {countDownDate} countDownDate The date we're counting down to.
     * @param {timer} timer A timer object.
     * @return {undefined}
	 */

    countdown(countDownDate, timer) {
        // Get today's date and time
        let now = new Date().getTime();

        // Find the distance between now and the count down date
        let distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        let days = Math.floor(distance / (1000 * 60 * 60 * 24)).toString();
        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString();
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString();
        let seconds = Math.floor((distance % (1000 * 60)) / 1000).toString();
        
        while (hours.length < 2)
            hours = "0" + hours;

        while (minutes.length < 2)
            minutes = "0" + minutes;

        while (seconds.length < 2)
            seconds = "0" + seconds;

        // Display the result in the element
        timer.innerHTML = days + "d " + hours + ":"
        + minutes + ":" + seconds;

        // If the count down is finished, write some text
        if (distance < 0) {
            clearInterval();
            timer.innerHTML = timer.dataset.mensagemTimerOver;
        }
    }
	
}

customElements.define('component-timer', componentTimer);

