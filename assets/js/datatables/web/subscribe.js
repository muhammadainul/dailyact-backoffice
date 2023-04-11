jQuery(document).ready(function() {
    jQuery("#webtable").DataTable({
        serverSide: true,
        ajax: {
            type: "POST",
            url: "/web/getSubscribe"
        },
        columns: [
            { data: "email", orderable: true },
            { data: "ipAddress", orderable: false },
            { data: "isActive", orderable: false },
            { data: "createdAt", orderable: true }
        ],
        columnDefs: [{
            targets: 3,
            createdCell: (td, cellData, rowData, row, col) => {
                var date = new Date(cellData);
                jQuery(td).html(date);
            }
        }]
    });
});