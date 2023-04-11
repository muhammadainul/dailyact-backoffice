jQuery(document).ready(function () {
    jQuery("#favoritetable").DataTable({
        order:  [[ 4, "desc"]],
        serverSide : true,
        ajax       : {
            type : "POST",
            url  : "/tenfavs/list",
        },
        columns: [
            { data: "image", orderable: false },
            { data: "title", orderable: true },
            { data: "count", orderable: true },
            { data: "isVerified", orderable: false },
            { data: "createdAt", orderable: true },
            {
                data: {
                    _id        : "_id",
                    title      : "title",
                    interests  : "interests",
                    isVerified : "isVerified",
                },
                orderable : false,
            },
        ],
        columnDefs: [
            {
                targets     : 0,
                createdCell : (td, cellData, rowData, row, col) => {
                    if (cellData == null) {
                        jQuery(td).html("<img src=" + cellData + " alt='no image yet.'>");
                    } else if (cellData.s3[0]) {
                        jQuery(td).html("<img src=" + cellData.s3[0].filename + " alt='no image yet.'>");
                    } else {
                        jQuery(td).html("<img src=" + cellData.filename + " alt='no image yet.'>");
                    }
                },
            },
            {
                targets     : 3,
                createdCell : (td, cellData, rowData, row, col) => {
                    if (cellData === true) {
                        jQuery(td).html("<center><button class='btn btn-outline-success'><i class='fa fa-check-circle'></i></button></center>");
                    } else {
                        jQuery(td).html("<center><button class='btn btn-outline-danger'><i class='fa fa-times-circle'></i></button></center>");
                    }
                },
            },
            {
                targets     : 4,
                createdCell : (td, cellData, rowData, row, col) => {
                    var date = new Date(cellData);
                    jQuery(td).html(date);
                },
            },
            {
                targets     : 5,
                createdCell : function (td, cellData, rowData, row, col) {
                    jQuery(td).html(
                        "<center><button class='openTenFavsEditDialog btn btn-outline-success' type='button' data-id='" +
                            cellData._id +
                            "' data-title='" +
                            cellData.title +
                            "' data-interests='" +
                            cellData.interests +
                            "' data-isVerified='" +
                            cellData.isVerified +
                            "' data-toggle='modal'><i class='fa fa-magic'></i> Edit</button></center>"
                    );
                },
            },
        ],
    });
});
