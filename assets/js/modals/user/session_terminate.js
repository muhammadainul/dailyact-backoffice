jQuery(document).on("click", ".openTerminateDialog", function () {
    var id = jQuery(this).data("id");
    jQuery(".actionBodyTerminate").html("<form action='/user/session/delete' method='post'>" +
        "<input type='hidden' name='sessionId' value=" + id + ">" +
        "<button type='submit' class='btn btn-primary' style='margin: 5px;'>Confirm</button>" +
        "<button type='button' class='btn btn-secondary' data-dismiss='modal' style='margin: 5px;'>Cancel</button>" +
        "</form>");
    jQuery("#actionSessionTerminate").modal("show");
});