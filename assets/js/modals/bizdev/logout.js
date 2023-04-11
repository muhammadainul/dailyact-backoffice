jQuery(document).on("click", ".openLogoutDialog", function () {
    var userId = jQuery(this).data("user");
    jQuery(".actionBodyLogoutAccount").html("<form id='logoutForm' action='/bizdev/logout' method='post'>" +
        "<input type='hidden' name='userId' value=" + userId + ">" +
        "<input type='hidden' name='token' value=" + localStorage["da-token"] + ">" +
        "<button type='submit' class='btn btn-primary' style='margin: 5px;'>Confirm</button>" +
        "<button type='button' class='btn btn-secondary' data-dismiss='modal' style='margin: 5px;'>Cancel</button>" +
        "</form>");
    jQuery("#actionLogoutAccount").modal("show");

    // jQuery("form#logoutForm").submit(function() {
    //     var arr = JSON.parse(localStorage.getItem("bizdev_user"));
    //     var newArr = arr.filter(data => data.userId != userId);
    //     localStorage.setItem("bizdev_user", JSON.stringify(newArr));
    // });
});