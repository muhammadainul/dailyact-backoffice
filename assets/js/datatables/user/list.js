jQuery(document).ready(function() {
    jQuery("#usertable").DataTable({
        serverSide: true,
        ajax: {
            type: "POST",
            url: "/user/getAllUser"
        },
        columns: [
            { data: "detail.pp", orderable: false },
            { data: "id", orderable: false },
            { data: "username", orderable: true },
            { data: "detail.birthday", orderable: false },
            { data: "detail.createdAt", orderable: true },
            { data: "id", orderable: false }
        ],
        columnDefs: [{
            targets: 0,
            createdCell: function (td, cellData, rowData, row, col) {
                jQuery(td).html("<div class='round-img'><img class='rounded-circle' src='/images/avatar/1.jpg' alt='avatar'></div>");
            }
        },
        {
            targets: 3,
            createdCell: (td, cellData, rowData, row, col) => {
                var date = new Date(cellData);
                jQuery(td).html(date);
                console.log(date);
            }
        },
        {
            targets: 4,
            createdCell: (td, cellData, rowData, row, col) => {
                var date = new Date(cellData);
                jQuery(td).html(date);
            }
        },
        {
            targets: 5,
            createdCell: function (td, cellData, rowData, row, col) {
                jQuery(td).html("<center><a href='/user/profile/" + cellData + "' class='btn btn-outline-primary' style='margin:5px 0px;'><i class='fa fa-magic'></i> Details</a>" +
                    "<br><a href='/user/session/" + cellData + "' class='btn btn-outline-success' style='margin:5px 0px;'><i class='fa fa-clone'></i> Session</a></center>");
                console.log(cellData);
            }
        }]
    });
});