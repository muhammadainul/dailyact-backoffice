jQuery(document).on("click", ".openLoginAccountDialog", function () {
    var token = jQuery(this).data("token");
    jQuery("#formToken1").html("<input type='hidden' id='token' name='token' value='" + token + "' required></input>")
    jQuery("#actionLoginAccount").modal("show");
});

jQuery(document).on("click", ".buttonLogin", function () {
    var email = jQuery("#emailLogin").val();
    var token = jQuery("#token").val();

    jQuery.ajax({
        type: "POST",
        url: "/bizdev/login",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "token": token,
            "email": email
        }),
        success: function (data) {
            // ... do something with the data ...
        }
    });

    jQuery("#formEmail").html(
        "<label for='email' class=' form-control-label'>Email</label>" +
        "<input type='email' placeholder='contoh@example.com' class='form-control' id='email' name='email' value='" + email + "' required></input>"
        )
    jQuery("#formToken2").html("<input type='hidden' id='token' name='token' value='" + token + "' required></input>")
    jQuery("#actionLoginOTPAccount").modal("show");
    jQuery("#actionLoginAccount").modal("hide");
});