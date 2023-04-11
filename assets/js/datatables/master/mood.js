jQuery(document).ready(function() {
    jQuery("#mastertable").DataTable({
        serverSide: true,
        ajax: {
            type: "POST",
            url: "/master/mood/list"
        },
        columns: [
            { data: "_id", orderable: false },
            { data: "mood", orderable: true },
            { data: "createdAt", orderable: true },
            { data: "mood", orderable: false }
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
                jQuery(td).html("<button class='openMoodDeleteDialog btn btn-outline-danger' type='button' data-mood='" + cellData + "' data-toggle='modal'><i class='fa fa-close'></i> Delete</button>");
            }
        }]
    });
});