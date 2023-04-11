jQuery(document).ready(function() {
    var table = jQuery("#posttable").DataTable({
        sDom       : "<'top'li>rt<'bottom'p><'clear'>",
        serverSide : true,
        ajax       : {
            type : "POST",
            url  : "/post/getAllPost",
            data : data => {
                // Read values
                var hashTag  = jQuery("#searchByHashTag").val();
                var username = jQuery("#searchByUsername").val();
                var start    = jQuery("#startDate").val();
                var end      = jQuery("#endDate").val();

                // Append to data
                data.searchByHashTag  = hashTag;
                data.searchByUsername = username;
                data.startDate        = start;
                data.endDate          = end;
            }
        },
        orderCellsTop : true,
        fixedHeader   : true,
        columns       : [
            { data: "files", orderable: false },
            { data: "caption.value", orderable: false },
            { data: "user.username", orderable: false },
            { data: "likesCount", orderable: true },
            { data: "createdAt", orderable: true }
        ],
        columnDefs: [
            {
                targets     : 0,
                createdCell : (td, cellData, rowData, row, col) => {
                    jQuery(td).html(
                        "<center><button style='margin: 10px 0px;' class='openViewContent btn btn-outline-primary' data-id='" + cellData + " type='button' data-toggle='modal'><i class='fa fa-search-plus'></i> View</button></center>");
                    jQuery('#btnToggle').change(function() {
                        var checkBtn = $(this).prop('checked');
                        // console.log(checkBtn);
                        if (checkBtn){
                            jQuery(td).html("<img src=" + cellData + " width='360px' height='auto'>");
                        } else if (!checkBtn) {
                            jQuery(td).html(
                                "<center><button style='margin: 10px 0px;' class='openViewContent btn btn-outline-primary' data-id='" + cellData + " type='button' data-toggle='modal'><i class='fa fa-search-plus'></i> View</button></center>");
                        }
                    });
                }
            },
            {
                targets     : 4,
                createdCell : (td, cellData, rowData, row, col) => {
                    var date = new Date(cellData);
                    jQuery(td).html(date);
                }
            }
        ]
    });
    table.on('draw', function() {
        jQuery("#btnToggle").trigger('change');
        jQuery("#btnToggle").trigger('change');
    });
    jQuery("#buttonFilterPost").click(() => {
        table.draw();
    });
    jQuery('#formPost').on('keyup keypress', function(e) {
        var keyCode = e.keyCode || e.which;
		if (keyCode === 13) { 
            e.preventDefault();
            document.getElementById("buttonFilterPost").click();
        }
    });
    // jQuery('#btnToggle').change(function() {
    //     // $('#console-event').html('Toggle: ' + $(this).prop('checked'))
    //     var checkBtn = $(this).prop('checked');
    //     if (checkBtn){
    //         console.log('checked');
    //     } else {
    //         console.log('unchecked');
    //     }
    // });

});
