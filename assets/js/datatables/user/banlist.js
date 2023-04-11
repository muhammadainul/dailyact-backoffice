jQuery(document).ready(function() {
    jQuery("#usertable").DataTable({
        serverSide: true,
        ajax: {
            type: "POST",
            url: "/user/getAllUserEnable"
        },
        columns: [
            { data: "detail.pp", orderable: false },
            { data: "id", orderable: false },
            { data: "username", orderable: true },
            { data: "detail.createdAt", orderable: true },
            { data: "enabled", orderable: false },
            { data: "id", orderable: false }
        ],
        columnDefs: [{
            targets: 0,
            createdCell: function (td, cellData, rowData, row, col) {
                jQuery(td).html("<div class='round-img'><img class='rounded-circle' src=" + cellData + " alt='avatar'></div>");
            }
        },
        {
            targets: 3,
            createdCell: (td, cellData, rowData, row, col) => {
                var date = new Date(cellData);
                jQuery(td).html(date);
            }
        },
        {
            targets: 4,
            createdCell: function (td, cellData, rowData, row, col) {
                if(cellData === true) {
                    jQuery(td).html("<center><button class='btn btn-outline-success'><i class='fa fa-check-circle'></i></button></center>");
                } else {
                    jQuery(td).html("<center><button class='btn btn-outline-danger'><i class='fa fa-times-circle'></i></button></center>");
                }
            }
        },
        {
            targets: 5,
            createdCell: function (td, cellData, rowData, row, col) {
                jQuery(td).html("<button class='openActionDialog btn btn-outline-primary' type='button' data-id=" + cellData + " data-toggle='modal'><i class='fa fa-magic'></i> Action</button>");
            }
        }]
    });
});

jQuery(document).on("click", ".openActionDialog", function () {
    var id = jQuery(this).data("id");
    jQuery(".actionBody").html("<form action='/user/update/ban' method='post'>" +
        "<input type='hidden' name='userId' value=" + id + ">" +
        "<button type='submit' class='btn btn-primary' style='margin: 5px;'>Confirm</button>" +
        "<button type='button' class='btn btn-secondary' data-dismiss='modal' style='margin: 5px;'>Cancel</button>" +
        "</form>");
    jQuery("#actionBanUser").modal("show");
});