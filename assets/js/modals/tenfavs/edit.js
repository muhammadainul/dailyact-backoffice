jQuery(document).on("click", ".openTenFavsEditDialog", function() {
    jQuery("#fileFavRemove").click(function() {
        jQuery("#tenfavsFile").remove();
    });

    jQuery("#saveEditFavButton").click(function() {
        jQuery("#tenfavsEditForm").submit();
        jQuery("#saveEditFavButton").attr("disabled", true);
    });

    var id         = jQuery(this).data("id");
    var title      = jQuery(this).data("title");
    var interests  = jQuery(this).data("interests");
    var isVerified = jQuery(this).data("isverified");
    jQuery("#tenfavsId").val(id);
    jQuery("#editFavoriteTitle").val(title);
    jQuery("#editFavoriteCategory").val(interests);
    console.log(isVerified)
    if (isVerified == true) {
        jQuery("#isVerifiedTrue").prop("checked", true);
        jQuery("#isVerifiedFalse").prop("checked", false);
    } else {
        jQuery("#isVerifiedTrue").prop("checked", false);
        jQuery("#isVerifiedFalse").prop("checked", true);
    }
    jQuery("#actionEditFavorite").modal("show");
});
