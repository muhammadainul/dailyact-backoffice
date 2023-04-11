jQuery(document).on("click", ".openMoodDeleteDialog", function () {
    var mood = jQuery(this).data("mood");
    jQuery(".actionBodyMoodDelete").html("<form action='/master/mood/delete' method='post'>" +
        "<input type='hidden' name='mood' value=" + mood + ">" +
        "<button type='submit' class='btn btn-primary' style='margin: 5px;'>Confirm</button>" +
        "<button type='button' class='btn btn-secondary' data-dismiss='modal' style='margin: 5px;'>Cancel</button>" +
        "</form>");
    jQuery("#actionMoodDelete").modal("show");
});