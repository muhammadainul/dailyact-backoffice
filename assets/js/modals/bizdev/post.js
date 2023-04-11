jQuery(document).on("click", ".openPostDialog", function() {
    var userId  = jQuery(this).data("user");
    jQuery("#actionPost").modal("show");

    jQuery("#indicatorRemove").click(function() {
        jQuery("#indicatorDiv2").remove();
    });

    jQuery("form#postForm").submit(function(e) {
        console.log("PENCET");
        e.preventDefault();
        var formData = new FormData(this);
        formData.append("longitude", "0");
        formData.append("latitude", "0");
        formData.append("postType", "GALLERY");
        formData.append("disableComments", false);

        if (formData.get("indicator[0]") == "NONE") return alert("You must select Indicator 1.");
        if (formData.get("indicator[1]") == "NONE") return alert("You must select Indicator 2.");
        if (formData.get("indicator[0]") == formData.get("indicator[1]")) return alert("Indicator 1 and Indicator 2 cannot be the same indicator.");
        if (formData.get("mood") == "NONE") return alert("You must select Mood.");
        
        if(userId) {
            // var arr    = JSON.parse(localStorage.getItem("bizdev_user"));
            // var result = arr.filter(data => data.userId == userId);

            formData.append("datoken", localStorage["da-token"]);
            formData.append("userId", userId);
    
            // console.log("tes", { arr, userId, result })
            // for (var pair of formData.entries()) {
            //     console.log(pair[0]+ ', ' + pair[1]); 
            // }
    
            console.log("UPLOAD");
            jQuery.ajax({
                url: "/bizdev/post",
                type: "POST",
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                success: function(data) {
                    console.log("success", data)
                    window.location.replace("/bizdev/account");
                },
                error: function (textStatus, errorThrown) {
                    console.log("error", { textStatus, errorThrown })
                }
            });

            jQuery("#buttonPost").attr("disabled", true)
        }
    });
});