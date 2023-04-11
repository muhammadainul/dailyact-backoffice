jQuery(document).ready(function() {
    jQuery("#mastertable").DataTable({
        serverSide: true,
        ajax: {
            type: "POST",
            url: "/master/posttype/list"
        },
        columns: [
            { data: "_id", orderable: false },
            { data: "postType", orderable: true },
            { data: "createdAt", orderable: true },
            { data: "postType", orderable: false }
        ],
        columnDefs: [{
            targets: 2,
            createdCell: (td, cellData, rowData, row, col) => {
                var date = new Date(cellData);
                jQuery(td).html(date);
            }
        },
        {
            targets: 3,
            createdCell: function (td, cellData, rowData, row, col) {
                jQuery(td).html("<button class='openPostTypeDeleteDialog btn btn-outline-danger' type='button' data-posttype='" + cellData + "' data-toggle='modal'><i class='fa fa-close'></i> Delete</button>");
            }
        }]
    });
});