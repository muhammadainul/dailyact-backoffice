jQuery(document).on("click", ".openReportDeleteDialog", function () {
    var id = jQuery(this).data("id");
    jQuery(".actionBodyReportDelete").html("<form action='/master/report/delete' method='post'>" +
        "<input type='hidden' name='reportId' value=" + id + ">" +
        "<button type='submit' class='btn btn-primary' style='margin: 5px;'>Confirm</button>" +
        "<button type='button' class='btn btn-secondary' data-dismiss='modal' style='margin: 5px;'>Cancel</button>" +
        "</form>");
    jQuery("#actionReportDelete").modal("show");
});