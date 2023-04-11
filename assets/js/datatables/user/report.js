jQuery(document).ready(function() {
    jQuery("#usertable").DataTable({
        "order" : [[ 3, "desc" ]],
        serverSide : true,
        ajax       : {
            type : "POST",
            url  : "/user/report/get"
        },
        columns: [
            { data: "object._id", orderable: false },
            { data: "object.username", orderable: true },
            { data: "reason", orderable: false },
            { data: "createdAt", orderable: true },
            { data: "object._id", orderable: false }
        ],
        columnDefs: [
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
                        "<button class='openActionDialog btn btn-outline-primary' type='button' data-id=" +
                        cellData +
                        " data-toggle='modal'><i class='fa fa-magic'></i> Action</button>"
                    );
                }
            }
        ]
    });
});
