$(document).ready(function() {
    "use strict";
    $("[data-userid]").click(function() {
        var $this = $(this);
        console.log($this);
        var userId = $this.data("userid");
        console.log(userId);
    });
});
