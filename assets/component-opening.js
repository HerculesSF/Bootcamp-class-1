/**
 * Opening screen component
 * 
 * @module opening-screen
 * @version 1.0.0
 * @extends HTMLElement
 */

class componentOpening extends HTMLElement {

    constructor() {

        super();

        this.initEvents();
    }

    /**
     * Init events
     * 
     * @returns {undefined}
     */
    initEvents() {

        this.querySelectorAll('[data-menu]').forEach(menuLvl1 => {
            
            let classLvl1 = menuLvl1.dataset.menu;

            console.log('menuLvl1: ', menuLvl1, classLvl1);

            this.toggleBackground(classLvl1, menuLvl1);
            
            menuLvl1.parentElement.querySelectorAll('[data-menu-level2]').forEach(menuLvl2 => {

                let classLvl2 = menuLvl2.dataset.menuLevel2;

                console.log('menuLvl2:', menuLvl2, classLvl2);

                this.toggleBackground(classLvl2, menuLvl2);

                console.log('----------');

                console.log(menuLvl2);
                console.log(menuLvl2.parentElement);
                console.log(menuLvl2.parentElement.querySelectorAll('[data-menu-level3]'));

                menuLvl2.parentElement.querySelectorAll('[data-menu-level3]').forEach(menuLvl3 => {

                    let classLvl3 = menuLvl3.dataset.menuLevel3;

                    this.toggleBackground(classLvl3, menuLvl3);
                });
            });
        });
    }

    /**
     * Toggle Background Image in the opening screen
     *   
     * @param {string} background A background class.
     * @param {object} element A element object.
     * @returns {undefined}
     */
    toggleBackground(background, element) {

        console.log(background, element);

        // Active the default image
        document.querySelector('.menu-image').classList.add('active');

        hoverintent(element, () => {
            this.active(background);
        }, () => {
            this.disable(background);
        });
        
        // add background on focus
        element.addEventListener('focus', event => {
            this.active(background);
        });
    }

    /**
     * Active background
     *   
     * @param {string} reference A background class.
     * @returns {undefined}
     */
    active(reference) {

        if (document.querySelector('.menu-image[data-handle="'+reference+'"]')) {

            let body = document.querySelector('.index-container');

            body.classList.remove(body.dataset.reference);
            body.dataset.reference = reference;
            body.classList.add(reference);

            document.querySelectorAll('.menu-image').forEach(item => {
                item.classList.remove('active');
            });

            document.querySelector('.menu-image[data-handle="'+reference+'"]').classList.add('active');
        }
    }

    /**
     * Disable background
     *   
     * @param {string} reference A background class.
     * @returns {undefined}
     */
    disable(reference) { }
}

customElements.define('component-opening', componentOpening);
