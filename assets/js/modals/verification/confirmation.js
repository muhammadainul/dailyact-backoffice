jQuery(document).on('click', '.openApproveConfirmation', function () {
    jQuery('#viewApproveConfirmation').modal('show')
    
    jQuery("#approved").click(function() {
        jQuery("#approveConfirm").submit();

        jQuery("#approved").val();
        // jQuery("#approved").val(true);
        // jQuery("#verificationId").val(); 
        // jQuery("#saveEditButton").attr("disabled", true);
    });
    jQuery(".openActionConfirmation").click(function() {
        jQuery("#actionApproveConfirmation").modal('show');
        jQuery('#viewApproveConfirmation').modal('hide')

        setTimeout(function () {
            window.location.href= '/verification/list';
         }, 3000);
    });
});
