// Code added to the app Volume & Discounted Pricing 

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
}

function showAppikonNotificatioBar(notificationMessage, selector, placement) {
                
    let popup = getCookie("popup");

    if(popup != "false") {

        if(notificationMessage && notificationMessage.trim()) {
            var notificationBarElement = "<div id='appikon-notification-bar'><div id='appikon-close-notification'>X</div>" + notificationMessage.trim() + "</div>"
            // Remove old notification
            $('#appikon-notification-bar').remove();

            if(selector) {
                var selectorElement = $(selector).first();
                if(selectorElement.length){
                    "before" == placement.toLowerCase() ? selectorElement.before(notificationBarElement) : selectorElement.after(notificationBarElement)
                }
            } else {
                window.appikonDiscount.settings.global.headerSelector.split(",").forEach(function (t) {
                    t = $.trim(t)
                    "#shopify-section-header" == t ? $(t).after(notificationBarElement) : "main" == t ? $(t).prepend(notificationBarElement) : $(t).before(notificationBarElement)
                })
            }

            $("#appikon-notification-bar").length > 0 && $("#appikon-notification-bar").show();

        }

    }

    let closeBtn = document.querySelector("#appikon-close-notification");
    let timerActive = "{{ settings.popup_timer-active }}";
    
    if(closeBtn && timerActive == "true") {
        closeBtn.addEventListener('click', event => {

            let days = "{{ settings.popup_timer }}";
            days = parseInt(days);

            if (days != null && days != 0) {

                document.cookie = "popup=false; expires="+ days ;

            } 

        });
    } 
}