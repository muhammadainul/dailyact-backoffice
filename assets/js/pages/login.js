jQuery(document).ready(function() {
    "use strict";

    var theForm = $("form");
    var theSubmit = $(":submit");

    let setCookie = (cname, cvalue, exMins) => {
        var d = new Date();
        d.setTime(d.getTime() + exMins * 60 * 1000);
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    };

    // this will delete the cookie.
    // setCookie("cookieNameToDelete", "", 0);

    theSubmit.on("click", e => {
        e.preventDefault();
        // console.log("submit clicked");
        theSubmit.attr("disabled", true);

        var formData = theForm.serializeArray();
        // console.log(formData);
        let data = {
            username: formData[0].value,
            password: formData[1].value
        };
        // console.log(data);
        $.ajax({
            type: "POST",
            data: JSON.stringify(data),
            contentType: "application/json",
            url: "http://localhost:3019/login"
        }).done(res => {
            // console.log(res.data);
            let { access_token, refresh_token } = res.data.local;
            let toStore = { access_token, refresh_token };
            window.localStorage.setItem("dailyact", JSON.stringify(toStore));
            console.log(JSON.parse(window.localStorage.getItem("dailyact")));
            theSubmit.attr("disabled", false);

            // setCookie("access_token", access_token);

            $.ajax({
                type: "GET",
                contentType: "application/json",
                url: "http://localhost:3019/page/index",
                headers: {
                    Authorization: "Bearer " + toStore.access_token,
                    "Content-Type": "application/json"
                },
                dataType: "html"
            }).done(res => {
                // console.log(res);
                $("html").html(res);
            });
        });
    });
});
