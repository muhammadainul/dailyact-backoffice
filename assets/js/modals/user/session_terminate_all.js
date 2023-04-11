jQuery(document).on("click", ".openTerminateAllDialog", function () {
    var id = jQuery(this).data("id");
    jQuery(".actionBodyTerminateAll").html("<form action='/user/session/deleteall' method='post'>" +
        "<input type='hidden' name='userId' value=" + id + ">" +
        "<button type='submit' class='btn btn-primary' style='margin: 5px;'>Confirm</button>" +
        "<button type='button' class='btn btn-secondary' data-dismiss='modal' style='margin: 5px;'>Cancel</button>" +
        "</form>");
    jQuery("#actionSessionTerminateAll").modal("show");
});