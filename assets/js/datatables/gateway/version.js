jQuery(document).ready(function() {
    jQuery("#versiontable").DataTable({
        serverSide : true,
        ajax       : {
            type : "POST",
            url  : "/gateway/version/getAll"
        },
        columns: [
            { data: "_id", orderable: false },
            { data: "type", orderable: false },
            { data: "versionName", orderable: true },
            { data: "releaseDate", orderable: true },
            { data: "createdAt", orderable: true },
            { data: "_id", orderable: false }
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
                createdCell : (td, cellData, rowData, row, col) => {
                    var date = new Date(cellData);
                    jQuery(td).html(date);
                }
            },
            {
                targets     : 5,
                createdCell : function(td, cellData, rowData, row, col) {
                    jQuery(td).html(
                        "<button class='openVersionDeleteDialog btn btn-outline-danger' type='button' data-id=" +
                            cellData +
                            " data-toggle='modal'><i class='fa fa-close'></i> Delete</button>"
                    );
                }
            }
        ]
    });
});

jQuery(document).on("click", ".openVersionDeleteDialog", function() {
    var id = jQuery(this).data("id");
    jQuery(".actionVersionDeleteBody").html(
        "<form action='/gateway/version/delete' method='post'>" +
            "<input type='hidden' name='versionId' value=" +
            id +
            ">" +
            "<button type='submit' class='btn btn-primary' style='margin: 5px;'>Confirm</button>" +
            "<button type='button' class='btn btn-secondary' data-dismiss='modal' style='margin: 5px;'>Cancel</button>" +
            "</form>"
    );
    jQuery("#actionVersionDelete").modal("show");
});
