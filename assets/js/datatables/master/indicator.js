jQuery(document).ready(function() {
    jQuery("#mastertable").DataTable({
        serverSide: true,
        ajax: {
            type: "POST",
            url: "/master/indicator/list"
        },
        columns: [
            { data: "_id", orderable: false },
            { data: "indicator", orderable: true },
            { data: "createdAt", orderable: true },
            { data: "indicator", orderable: false }
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
                jQuery(td).html("<button class='openIndicatorDeleteDialog btn btn-outline-danger' type='button' data-indicator='" + cellData + "' data-toggle='modal'><i class='fa fa-close'></i> Delete</button>");
            }
        }]
    });
});