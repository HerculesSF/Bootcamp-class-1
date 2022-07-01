class pageLogin extends HTMLElement {

    constructor() {

        super();

        this.addBtnForgotPasswordBehavior();
        //this.checkUrlHash();
    }

    /**
	 * Listen forgot password button
     * 
     * @return {undefined}
	 */
     addBtnForgotPasswordBehavior() {
        let btn = document.querySelector('[data-recover-password-btn]');
        if (!btn) {
            return;
        }
        btn.addEventListener("click", this.showRecoverPasswordForm.bind(this));
	}

    /**
	 * Show recover password form
     * 
     * @return {undefined}
	 */
     showRecoverPasswordForm() {
        let recoverForm = document.querySelector('[data-recover-password-form]');
        let loginForm = document.querySelector('[data-customer-login-form]')
        if (!recoverForm) {
            return;
        }

        recoverForm.classList.add('active');
        loginForm.classList.remove('active');
    }

    /**
	 * Check the current URL
     * 
     * @return {undefined}
	 */
    checkUrlHash() {
        var hash = window.location.hash;
        if (hash === '#recover') {
            this.showRecoverPasswordForm();
        }
    }

}

customElements.define('page-login', pageLogin);