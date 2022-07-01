document.addEventListener("DOMContentLoaded", function () {

    document.querySelectorAll('[loading="lazy"]').forEach(function(element) {

        element.addEventListener('load', function() {

            element.parentElement.classList.add('loaded');
        });
    });
});
