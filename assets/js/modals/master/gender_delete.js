jQuery(document).on("click", ".openGenderDeleteDialog", function () {
    var gender = jQuery(this).data("gender");
    jQuery(".actionBodyGenderDelete").html("<form action='/master/gender/delete' method='post'>" +
        "<input type='hidden' name='gender' value=" + gender + ">" +
        "<button type='submit' class='btn btn-primary' style='margin: 5px;'>Confirm</button>" +
        "<button type='button' class='btn btn-secondary' data-dismiss='modal' style='margin: 5px;'>Cancel</button>" +
        "</form>");
    jQuery("#actionGenderDelete").modal("show");
});