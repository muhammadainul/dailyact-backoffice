jQuery(document).ready(function() {
    jQuery("#mastertable").DataTable({
        serverSide: true,
        ajax: {
            type: "POST",
            url: "/master/promocode/list"
        },
        columns: [
            { data: "_id", orderable: false },
            { data: "code", orderable: true },
            { data: "start", orderable: true },
            { data: "end", orderable: true },
            { data: "code", orderable: false }
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
            createdCell: (td, cellData, rowData, row, col) => {
                var date = new Date(cellData);
                jQuery(td).html(date);
            }
        },
        {
            targets: 4,
            createdCell: function (td, cellData, rowData, row, col) {
                jQuery(td).html("<button class='openPromoCodeDeleteDialog btn btn-outline-danger' type='button' data-code='" + cellData + "' data-toggle='modal'><i class='fa fa-close'></i> Delete</button>");
            }
        }]
    });
});