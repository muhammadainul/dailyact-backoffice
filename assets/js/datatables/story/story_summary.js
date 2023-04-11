jQuery(document).ready(function () {
    var table = jQuery('#storySummaryTable').DataTable({
        sDom: "<'top'fl>rt<'bottom'ip><'clear'>",
        // responsive: true,
        serverSide: true,
        ajax: {
            type: 'POST',
            url: '/story/getAllStory',
            data: data => {
                // Read values
                // var hashTag  = jQuery("#searchByHashTag").val();
                // var username = jQuery("#searchByUsername").val();
                var start = jQuery('#startDate').val()
                var end = jQuery('#endDate').val()

                // Append to data
                // data.searchByHashTag  = hashTag;
                // data.searchByUsername = username;
                data.startDate = start
                data.endDate = end
                // data.query            = 'kuy';
            }
        },
        orderCellsTop: true,
        fixedHeader: true,
        columns: [
            { data: '_id', orderable: false },
            { data: 'user.username', orderable: false },
            { data: 'files', orderable: false },
            { data: '_id', orderable: false },
            { data: 'viewers', orderable: false },
            { data: 'createdAt', orderable: false }
        ],
        columnDefs: [
            {
                targets: 2,
                createdCell: (td, cellData, rowData, row, col) => {
                    console.log(cellData)
                    if (Array.isArray(cellData) || cellData === null || cellData === undefined) {
                        jQuery(td).html("<h4 align='center'>No Content</h4>")
                    } else {
                        let str = cellData.split('.')
                        let str2 = str[str.length - 1]
                        if (str2 == 'jpg' || str2 == 'JPEG' || str2 == 'png') {
                            jQuery(td).html(
                                "<center><button style='margin: 10px 0px;' class='openViewContentStory btn btn-outline-primary' data-id=" +
                                    cellData +
                                    " type='button' data-toggle='modal'><i class='fa fa-search-plus'></i> View</button></center>"
                            )
                            jQuery('#btnToggleStory').change(function () {
                                var checkBtn = $(this).prop('checked')
                                console.log(checkBtn)
                                if (checkBtn) {
                                    jQuery(td).html('<img src=' + cellData + " style='width: 200px; height: auto'>")
                                } else if (!checkBtn) {
                                    jQuery(td).html(
                                        "<center><button style='margin: 10px 0px;' class='openViewContentStory btn btn-outline-primary' data-id=" +
                                            cellData +
                                            " type='button' data-toggle='modal'><i class='fa fa-search-plus'></i> View</button></center>"
                                    )
                                }
                            })
                        } else {
                            jQuery(td).html(
                                "<center><button style='margin: 10px 0px;' class='openViewContentStory btn btn-outline-primary' data-id=" +
                                    cellData +
                                    " type='button' data-toggle='modal'><i class='fa fa-search-plus'></i> View</button></center>"
                            )
                            jQuery('#btnToggleStory').change(function () {
                                var checkBtn = $(this).prop('checked')
                                // console.log(checkBtn);
                                if (checkBtn) {
                                    jQuery(td).html(
                                        "<video width='200px' height='200px' controls autoplay><source src=" + cellData + " type='video/mp4'></video>"
                                    )
                                } else if (!checkBtn) {
                                    jQuery(td).html(
                                        "<center><button style='margin: 10px 0px;' class='openViewContentStory btn btn-outline-primary' data-id=" +
                                            cellData +
                                            " type='button' data-toggle='modal'><i class='fa fa-search-plus'></i> View</button></center>"
                                    )
                                }
                            })
                        }
                    }
                }
            },
            {
                targets: 3,
                createdCell: (td, cellData, rowData, row, col) => {
                    let array = '<center>'
                    let indicator = rowData.indicator
                    if (indicator != undefined) {
                        for (const o of indicator) {
                            if (o == 'SOCIAL') {
                                array = array + "<img src='../images/indicator/social-purple.png' style='width: 30px; height: 30px;'> "
                            } else if (o == 'HOBBY') {
                                array = array + "<img src='../images/indicator/hobby-pink.png' style='width: 30px; height: 30px;'> "
                            } else if (o == 'OTHER') {
                                array = array + "<img src='../images/indicator/other-green.png' style='width: 30px; height: 30px;'> "
                            } else if (o == 'SPORTS') {
                                array = array + "<img src='../images/indicator/sport-blue.png' style='width: 30px; height: 30px;'> "
                            } else if (o == 'WORKS') {
                                array = array + "<img src='../images/indicator/works-red.png' style='width: 30px; height: 30px;'> "
                            } else if (o == 'TRAVELS') {
                                array = array + "<img src='../images/indicator/travel-yellow.png' style='width: 30px; height: 30px;'> "
                            }
                        }
                    }
                    array = array + '</center>'
                    jQuery(td).html(array)
                }
            },
            {
                targets: 4,
                createdCell: (td, cellData, rowData, row, col) => {
                    jQuery(td).html(cellData.length)
                }
            },
            {
                targets: 5,
                createdCell: (td, cellData, rowData, row, col) => {
                    var date = new Date(cellData)
                    jQuery(td).html(date)
                }
            }
        ]
    })
    table.on('draw', function () {
        jQuery('#btnToggleStory').trigger('change')
        jQuery('#btnToggleStory').trigger('change')
    })
    jQuery('#buttonFilterStory').click(() => {
        table.draw()
    })
})
