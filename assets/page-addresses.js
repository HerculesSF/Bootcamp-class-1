class pageAddress extends HTMLElement {

    constructor() {

        super();

        this.toggleNewAddress();
        this.toggleEditAddress();
        this.modalDeleteAddress();
    }

    /**
     *  Init New Address Form toggle
     * 
     * @return {undefined}
    */
     toggleNewAddress() {
        document.querySelectorAll('[data-address-new-toggle]').forEach(button => {
            button.addEventListener('click', () => {

                let newAddressForm = document.querySelector('[data-address-new-form]');
                let newAddressButton = document.querySelector('[data-address-new-btn]');

                newAddressForm.classList.toggle('active');
                newAddressButton.focus();

            });
        });
	}

    /**
     *  Init Edit Address Form toggle
     * 
     * @return {undefined}
    */
    toggleEditAddress() {

        document.querySelectorAll('[data-address-edit-toggle]').forEach(button => {
            button.addEventListener('click', event => {

                let formId = event.target.dataset.formId;
                let editAddress = document.querySelector(`[data-edit-address-form="${formId}"]`);
                let editButton = document.querySelector(`[data-address-edit-toggle][data-form-id="${formId}"]`);

                editAddress.classList.toggle('active');
                editButton.focus();

            });
        });

    }

    /**
     *  Init Modal Delete Address
     * 
     * @return {undefined}
    */
    modalDeleteAddress()  {

        document.querySelectorAll('[data-address-delete-btn]').forEach(button => {
            button.addEventListener('click', event => {

                const confirmMessage = event.target.getAttribute('data-confirm-message');

                if (!window.confirm(confirmMessage || 'Are you sure you wish to delete this address?')) {
                    event.preventDefault();
                }

            });
        });

    }

}

customElements.define('page-address', pageAddress);

