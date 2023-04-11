jQuery(document).ready(function() {
    var table = jQuery("#referraltable").DataTable({
        sDom       : "<'top'li>rt<'bottom'p><'clear'>",
        serverSide : true,
        ajax       : {
            type : "POST",
            url  : "/gateway/referral/getAll",
            data : data => {
                // Read values
                var referrer     = jQuery("#searchByReferrer").val();
                var utm_source   = jQuery("#searchByUTM_Source").val();
                var utm_medium   = jQuery("#searchByUTM_Medium").val();
                var utm_term     = jQuery("#searchByUTM_Term").val();
                var utm_content  = jQuery("#searchByUTM_Content").val();
                var utm_campaign = jQuery("#searchByUTM_Campaign").val();
                var start        = jQuery("#startDate").val();
                var end          = jQuery("#endDate").val();

                // Append to data
                data.searchByReferrer     = referrer;
                data.searchByUTM_Source   = utm_source;
                data.searchByUTM_Medium   = utm_medium;
                data.searchByUTM_Term     = utm_term;
                data.searchByUTM_Content  = utm_content;
                data.searchByUTM_Campaign = utm_campaign;
                data.startDate            = start;
                data.endDate              = end;
            }
        },
        orderCellsTop : true,
        fixedHeader   : true,
        columns       : [
            { data: "referrer", orderable: false },
            { data: "utm_source", orderable: false },
            { data: "utm_medium", orderable: false },
            { data: "utm_term", orderable: false },
            { data: "utm_content", orderable: false },
            { data: "utm_campaign", orderable: false },
            { data: "createdAt", orderable: true }
        ],
        columnDefs: [
            {
                targets     : 6,
                createdCell : (td, cellData, rowData, row, col) => {
                    var date = new Date(cellData);
                    jQuery(td).html(date);
                }
            }
        ]
    });
    jQuery("#buttonFilterReferral").click(() => {
        table.draw();
    });
});
