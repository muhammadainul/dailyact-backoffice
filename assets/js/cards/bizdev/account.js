jQuery(document).ready(function() {
    if (typeof Storage !== "undefined") {
        if(user) {
            var count = 0;

            if(localStorage["bizdev_user"]) {
                var arr = JSON.parse(localStorage.getItem("bizdev_user"));
                arr.forEach(data => {
                    if(data.userId == (user._id).toString()) {
                        data.access_token = user.session.access_token
                        count++;
                    }
                })
            } else {
                var arr = [];
            }
            if(count == 0) {
                arr.push({
                    userId: (user._id).toString(),
                    access_token: user.session.access_token
                });
                localStorage.setItem("bizdev_user", JSON.stringify(arr));
            } else {
                localStorage.setItem("bizdev_user", JSON.stringify(arr));
            }
        }
    }
});
