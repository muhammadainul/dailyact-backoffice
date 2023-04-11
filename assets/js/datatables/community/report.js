jQuery(document).ready(function() {
    jQuery("#communitytable").DataTable({
        "order" : [[ 4, "desc"]],
        serverSide : true,
        ajax       : {
            type : "POST",
            url  : "/community/report/get"
        },
        columns: [
            { data: "object._id", orderable: false },
            { data: "object.name", orderable: false },
            { data: "object.description", orderable: false },
            { data: "reason", orderable: false },
            { data: "createdAt", orderable: true },
            { data: "object._id", orderable: false }
        ],
        columnDefs: [
            {
                targets     : 4,
                createdCell : (td, cellData, rowData, row, col) => {
                    var date = new Date(cellData);
                    jQuery(td).html(date);
                }
            },
            {
                targets     : 5,
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
