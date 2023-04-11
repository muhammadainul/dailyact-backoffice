jQuery(document).on("click", ".openPostTypeDeleteDialog", function () {
    var posttype = jQuery(this).data("posttype");
    jQuery(".actionBodyPostTypeDelete").html("<form action='/master/posttype/delete' method='post'>" +
        "<input type='hidden' name='postType' value=" + posttype + ">" +
        "<button type='submit' class='btn btn-primary' style='margin: 5px;'>Confirm</button>" +
        "<button type='button' class='btn btn-secondary' data-dismiss='modal' style='margin: 5px;'>Cancel</button>" +
        "</form>");
    jQuery("#actionPostTypeDelete").modal("show");
});