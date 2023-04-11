jQuery(document).ready(function($) {
    "use strict";

    $.ajax({
        method: "POST",
        url: "/bizdev/statistic",
        dataType: "json",
        success: function(result) {
            // console.log(result);
            $("#totaluserCounts").html(result.total_users);
            $("#totalfavoriteCounts").html(result.total_favs);
            $("#totalstoryCounts").html(result.total_stories);
            $("#totalpostCounts").html(result.total_posts);
            $("#totallikeCounts").html(result.total_likes);
            $("#totalcommentCounts").html(result.total_comments);
            $("#totalhashtagCounts").html(result.total_hashtags);

            for (let o of result.total_indicators) {
                if (o._id == "SOCIAL") $("#socialCounts").html(o.total);
                else if (o._id == "HOBBY") $("#hobbyCounts").html(o.total);
                else if (o._id == "TRAVELS") $("#travelCounts").html(o.total);
                else if (o._id == "SPORTS") $("#sportCounts").html(o.total);
                else if (o._id == "WORKS") $("#workCounts").html(o.total);
                else if (o._id == "OTHER") $("#otherCounts").html(o.total);
            }

            let ids = [
                "#totaluserCounts",
                "#totalfavoriteCounts",
                "#totalstoryCounts",
                "#totalpostCounts",
                "#totallikeCounts",
                "#totalcommentCounts",
                "#totalhashtagCounts",
                "#socialCounts",
                "#hobbyCounts",
                "#travelCounts",
                "#sportCounts",
                "#workCounts",
                "#otherCounts"
            ];
            for (let o of ids) {
                $(o).each(function () {
                    var $this = $(this);
                    jQuery({ Counter: 0 }).animate({ Counter: $this.text() }, {
                        duration: 1000,
                        easing: "swing",
                        step: function () {
                        $this.text(Math.ceil(this.Counter));
                        }
                    });
                });
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // console.log("Could not get posts, server response: " + textStatus + ": " + errorThrown);
        }
    })
});
