jQuery(document).on("click", ".openViewContent", function () {
    jQuery("#viewContent").modal("show");
    var myVal = $(this).attr('data-id');
    jQuery("#postImage").html("<center><img src=" + myVal + " 'width=320px' 'height=240px'></center>");
});