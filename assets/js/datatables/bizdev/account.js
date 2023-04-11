jQuery(document).ready(function() {
    jQuery("#bizdevtable").DataTable({
        order : [[ 3, "desc"]],
        serverSide : true,
        ajax       : {
            type : "POST",
            url  : "/user/getAllBizDevUser"
        },
        columns: [
            { data: "detail.pp", orderable: false },
            { data: "id", orderable: false },
            { data: "username", orderable: true },
            { data: "detail.createdAt", orderable: true },
            { data: "id", orderable: false }
        ],
        columnDefs: [
            {
                targets     : 0,
                createdCell : function(td, cellData, rowData, row, col) {
                    jQuery(td).html(
                        "<div class='round-img'><img class='rounded-circle' src='/images/avatar/1.jpg' alt='avatar'></div>"
                    );
                }
            },
            {
                targets     : 3,
                createdCell : (td, cellData, rowData, row, col) => {
                    var date = new Date(cellData);
                    jQuery(td).html(date);
                }
            },
            {
                targets     : 4,
                createdCell : function(td, cellData, rowData, row, col) {
                    jQuery(td).html(
                        "<center><button style='margin: 5px 0px;' class='openPostDialog btn btn-outline-success' type='button' data-toggle='modal' data-user='" + cellData + "'><i class='fa fa-clone'></i> New Post</button>" +
                        "<br><button style='margin: 5px 0px;' class='openLogoutDialog btn btn-outline-danger' type='button' data-toggle='modal' data-user='" + cellData + "'><i class='fa fa-sign-out'></i> Sign Out</button></center>"
                    );
                }
            }
        ]
    });

    if (typeof Storage !== "undefined") {
        if (!localStorage["da-token"]) {
            jQuery.post("/token/get", {}, (data) => {
                localStorage["da-token"] = data.token_code;
            });
        }
        console.log(localStorage["da-token"])
        jQuery("#accountButton").html(
            "<button class='openRegisterAccountDialog btn btn-outline-success' type='button' data-toggle='modal' data-token='" + localStorage["da-token"] + "'><i class='fa fa-plus'></i> Register Account</button>" +
            "<button style='margin: 0px 10px;' class='openLoginAccountDialog btn btn-outline-primary' type='button' data-toggle='modal' data-token='" + localStorage["da-token"] + "'><i class='fa fa-sign-in'></i> Login Account</button><br><br>"
        )
    }
});
