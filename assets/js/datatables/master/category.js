jQuery(document).ready(function() {
    jQuery("#mastertable").DataTable({
        serverSide: true,
        ajax: {
            type: "POST",
            url: "/master/category/list"
        },
        columns: [
            { data: "file", orderable: false },
            { data: "name", orderable: true },
            { data: "url", orderable: false },
            { data: "createdAt", orderable: true },
            { data: { _id: "_id", name: "name" }, orderable: false }
        ],
        columnDefs: [{
            targets: 0,
            createdCell: (td, cellData, rowData, row, col) => {
                if (cellData == null){
                    jQuery(td).html("<img src=" + cellData + " alt='image-category'>");
                } else if (cellData.s3[1]) {
                    jQuery(td).html("<img src=" + cellData.s3[1].filename + " alt='image-category'>");
                } else {
                    jQuery(td).html("<img src=" + cellData.filename + " alt='image-category'>");
                }
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
                jQuery(td).html(
                    "<center><button style='margin: 10px 0px' class='openCategoryEditDialog btn btn-outline-success' type='button' data-category='" + cellData._id + "' data-name='" + cellData.name + "' data-toggle='modal'><i class='fa fa-magic'></i> Edit</button>" +
                    "<button class='openCategoryDeleteDialog btn btn-outline-danger' type='button' data-category='" + cellData._id + "' data-toggle='modal'><i class='fa fa-close'></i> Delete</button></center>"
                );
            }
        }]
    });
});
