jQuery(document).on("click", ".openCategoryDeleteDialog", function () {
    var category = jQuery(this).data("category");
    jQuery(".actionBodyCategoryDelete").html("<form action='/master/category/delete' method='post'>" +
        "<input type='hidden' name='categoryId' value=" + category + ">" +
        "<button type='submit' class='btn btn-primary' style='margin: 5px;'>Confirm</button>" +
        "<button type='button' class='btn btn-secondary' data-dismiss='modal' style='margin: 5px;'>Cancel</button>" +
        "</form>");
    jQuery("#actionCategoryDelete").modal("show");
});
