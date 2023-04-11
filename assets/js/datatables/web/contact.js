jQuery(document).ready(function() {
    jQuery("#webtable").DataTable({
        serverSide: true,
        ajax: {
            type: "POST",
            url: "/web/getContact"
        },
        columns: [
            { data: "name", orderable: false },
            { data: "email", orderable: true },
            { data: "subject", orderable: false },
            { data: "message", orderable: false },
            { data: "createdAt", orderable: true }
        ],
        columnDefs: [{
            targets: 4,
            createdCell: (td, cellData, rowData, row, col) => {
                var date = new Date(cellData);
                jQuery(td).html(date);
            }
        }]
    });
});