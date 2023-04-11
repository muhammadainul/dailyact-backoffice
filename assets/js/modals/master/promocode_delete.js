jQuery(document).on("click", ".openPromoCodeDeleteDialog", function () {
    var code = jQuery(this).data("code");
    jQuery(".actionBodyPromoCodeDelete").html("<form action='/master/promocode/delete' method='post'>" +
        "<input type='hidden' name='code' value=" + code + ">" +
        "<button type='submit' class='btn btn-primary' style='margin: 5px;'>Confirm</button>" +
        "<button type='button' class='btn btn-secondary' data-dismiss='modal' style='margin: 5px;'>Cancel</button>" +
        "</form>");
    jQuery("#actionPromoCodeDelete").modal("show");
});