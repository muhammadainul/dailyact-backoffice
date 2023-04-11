jQuery(document).on("click", ".openRejectVerification", function () {
    jQuery("#reasonRejectConfirmation").modal("show");

    // jQuery("[name='reason']").validate()({
    //     rules: {
    //         reason: {
    //             required: true
    //         }
    //     }
    // });
    jQuery('#reason').keyup(function() {
        var minLength = 5;
        var empty = false;
        jQuery('#reasonError').show();
        jQuery('#reason').each(function() {
            var charLength = jQuery(this).val().length;
            if (jQuery(this).val() == "" && charLength < minLength) {
                empty = true;
            }
        });

        if (empty) {
            jQuery('#rejectConfirmButton').attr('disabled', true);
        } else {
            jQuery('#rejectConfirmButton').removeAttr('disabled');
            jQuery('#reasonError').hide();
        }
    });

    jQuery("#rejectConfirmButton").click(function() {
        jQuery("#approveConfirm").submit();
        
        jQuery("#verificationId").val();
        jQuery("#reason").val();

    });

    jQuery(".openActionConfirmation").click(function() {
        jQuery("#actionRejectConfirmation").modal('show');
        jQuery('#reasonRejectConfirmation').modal('hide')

        setTimeout(function () {
            window.location.href= '/verification/list';
         }, 3000);
    });
});