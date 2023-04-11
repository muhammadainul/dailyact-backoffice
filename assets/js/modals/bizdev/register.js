jQuery(document).on("click", ".openRegisterAccountDialog", function () {
    var token = jQuery(this).data("token");
    jQuery("#formToken").html("<input type='hidden' id='token' name='token' value='" + token + "' required></input>")
    jQuery("#actionRegisterAccount").modal("show");
});