jQuery(document).on("click", ".openIndicatorDeleteDialog", function () {
    var indicator = jQuery(this).data("indicator");
    jQuery(".actionBodyIndicatorDelete").html("<form action='/master/indicator/delete' method='post'>" +
        "<input type='hidden' name='indicator' value=" + indicator + ">" +
        "<button type='submit' class='btn btn-primary' style='margin: 5px;'>Confirm</button>" +
        "<button type='button' class='btn btn-secondary' data-dismiss='modal' style='margin: 5px;'>Cancel</button>" +
        "</form>");
    jQuery("#actionIndicatorDelete").modal("show");
});