jQuery(document).ready(function() {
    var table = jQuery("#userVeriftable").DataTable({
        sDom       : "<'top'li>rt<'bottom'p><'clear'>",
        serverSide: true,
        ajax: {
            type: "POST",
            url: "/verification/getAllVerification",
            data: data => {
                // Read values
                var username = jQuery("#searchByUsername").val();
                var status = jQuery("#searchByStatus").val();

                if (status == 'All') status = ['Pending', 'In Review', 'Approved', 'Rejected'];
                else status = [status];
                
                // Append to data
                data.searchByUsername = username;
                data.searchByStatus = status;
            }
        },
        orderCellsTop : true,
        fixedHeader   : true,
        columns: [
            { data: "_id", orderable: false },
            { data: "user.username", orderable: false },
            { data: "known_as", orderable: true },
            { data: "phone", orderable: false },
            { data: "category", orderable: false },
            { data: "status", orderable: false },
            { data: "createdAt", orderable: true },
            { data: "_id", orderable: true }
        ],
        columnDefs: [
        {
            targets: 1,
            createdCell: (td, cellData, rowData, row, col) => {
            }
        },
        {
            targets: 5,
            createdCell: (td, cellData, rowData, row, col) => {
                if (cellData == 'In Review') {
                    jQuery(td).html("<span class='badge badge-success'>" + cellData + "</span>");
                } else if (cellData == 'Pending') {
                    jQuery(td).html("<span class='badge badge-warning'>" + cellData + "</span>");
                } else if (cellData == 'Approved') {
                    jQuery(td).html("<span class='badge badge-primary'>" + cellData + "</span>");
                } else if (cellData == 'Rejected') {
                    jQuery(td).html("<span class='badge badge-danger'>" + cellData + "</span>");
                }
            }
        },
        {
            targets: 6,
            createdCell: (td, cellData, rowData, row, col) => {
                var date = new Date(cellData);
                jQuery(td).html(date);
            }
        },
        {
            targets: 7,
            createdCell: function (td, cellData, rowData, row, col) {
                if (rowData.status == 'Approved' || rowData.status == 'Rejected') {    
                    jQuery(td).html("<center><a href='/verification/review/" + cellData + "' class='btn btn-outline-primary disabled' aria-disabled='true' style='margin:5px 0px;' readonly><i class='fa fa-magic'></i> Review</a></button>" +
                    "</center>");
                } else {
                    jQuery(td).html("<center><a href='/verification/review/" + cellData + "' class='btn btn-outline-primary' style='margin:5px 0px;'><i class='fa fa-magic'></i> Review</a>" +
                    "</center>");
                }
            }
        }]
    });
    jQuery("#buttonFilterVerification").click(() => {
        table.draw();
    });
});