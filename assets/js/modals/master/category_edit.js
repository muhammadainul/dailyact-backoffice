jQuery(document).on("click", ".openCategoryEditDialog", function() {
    jQuery("#fileRemove").click(function() {
        jQuery("#categoryFile").remove();
    });

    jQuery("#saveEditButton").click(function() {
        jQuery("#categoryEditForm").submit();
        jQuery("#saveEditButton").attr("disabled", true);
    });

    var category = jQuery(this).data("category");
    var name     = jQuery(this).data("name");
    jQuery("#categoryId").val(category);
    jQuery("#editCatName").val(name);
    jQuery("#actionEditCategory").modal("show");
});
