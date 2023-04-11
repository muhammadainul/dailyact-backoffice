jQuery(document).on('click', '.openViewContentStory', function () {
    jQuery('#viewContentStory').modal('show')
    let myVal = $(this).attr('data-id')
    let str = myVal.split('.')
    let str2 = str[str.length - 1]
    if (str2 == 'jpg' || str2 == 'JPEG' || str2 == 'png') {
        jQuery('#postContent').html('<center><img src=' + myVal + " width='320px' height='auto'></center>")
    } else {
        jQuery('#postContent').html("<center><video width='200px' height='200px' controls autoplay><source src=" + myVal + '></video></center>')
    }
})
