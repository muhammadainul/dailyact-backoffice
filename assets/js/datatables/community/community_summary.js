jQuery(document).ready(function() {
    var table = jQuery("#communitySummaryTable").DataTable({
        sDom       : "<'top'lf>rt<'bottom'ip><'clear'>",
        responsive: true,
        serverSide : true,
        ajax       : {
            type : "POST",
            url  : "/community/getAllCommunity",
            data : data => {
                // Read values
                // var hashTag  = jQuery("#searchByHashTag").val();
                // var username = jQuery("#searchByUsername").val();
                var start    = jQuery("#startDate").val();
                var end      = jQuery("#endDate").val();

                // Append to data
                // data.searchByHashTag  = hashTag;
                // data.searchByUsername = username;
                data.startDate        = start;
                data.endDate          = end;
                // data.query            = 'com';
            }
        },
        orderCellsTop : true,
        fixedHeader   : true,
        columns       : [
            { data: "_id", orderable: false },
            { data: "pp", orderable: false },
            { data: "name", orderable: false },
            { data: "statistics.total_members", orderable: false },
            { data: "_id", orderable: true }
        ],
        columnDefs: [
            {
                targets     : 1,
                createdCell : (td, cellData, rowData, row, col) => {
                    if (cellData === null || cellData === undefined){
                        jQuery(td).html("<h4 align='center'>No Image</h4>");
                    } else {
                        jQuery(td).html("<img src=" + cellData.s3[0].filename + " alt='image-community' style='width: 200px; height: auto'>");
                        console.log(cellData.s3[0].filename);
                    }
                }
            },
            {
                targets     : 3,
                createdCell : (td, cellData, rowData, row, col) => {
                    jQuery(td).html(cellData.length);
                    console.log(cellData.length);
                }
            },
            {
                targets     : 4,
                createdCell : (td, cellData, rowData, row, col) => {
                    jQuery(td).html("<button class='btn btn-primary'><a href='/community/detail/" + cellData + "'style='color: white;'>View</a></button></td>");
                    console.log(cellData);
                }
            }
        ]
    });
    jQuery("#buttonFilterCommunity").click(() => {
        table.draw();
    });
});
