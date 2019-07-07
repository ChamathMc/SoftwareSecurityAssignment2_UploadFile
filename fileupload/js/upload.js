$(document).ready(function(){

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
	//the client id and client secret from google app created by ms18908848@my.sliit.lk
	var client_id = "100213440141-8u9oeef4v2jgqt1okhsr2lho6ut01g8q.apps.googleusercontent.com";
	const client_secret = "GBJClf5DE0tHe5-mjl139naH";
    const redirect_uri = "http://localhost/fileupload/upload.htm";
    const scope = "https://www.googleapis.com/auth/drive";
    var access_token= "";

    //ajax code; this will run in background
    $.ajax({
        type: 'POST',
        url: "https://www.googleapis.com/oauth2/v4/token",
        data: {code:code, redirect_uri:redirect_uri, client_secret:client_secret, client_id:client_id, scope:scope, grant_type:"authorization_code"},
        dataType: "json",
        success: function(resultData) {
           localStorage.setItem("accessToken",resultData.access_token);
           localStorage.setItem("refreshToken",resultData.refreshToken);
           localStorage.setItem("expires_in",resultData.expires_in);
           window.history.pushState({}, document.title, "/fileupload/" + "upload.htm");           
        }
  });

    function stripQueryStringAndHashFromPath(url) {
        return url.split("?")[0].split("#")[0];
    }   

    var Upload = function (file) {
        this.file = file;
    };
    
    Upload.prototype.getType = function() {
        localStorage.setItem("type",this.file.type);
        return this.file.type;
    };
    Upload.prototype.getSize = function() {
        localStorage.setItem("size",this.file.size);
        return this.file.size;
    };
    Upload.prototype.getName = function() {
        return this.file.name;
    };
    Upload.prototype.doUpload = function () {
        var that = this;
        var formData = new FormData();
        formData.append("file", this.file, this.getName());
        formData.append("upload_file", true);
		//Using ajax, use the access token received by the signed in google account
        $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", "Bearer" + " " + localStorage.getItem("accessToken"));
            },
            url: "https://www.googleapis.com/upload/drive/v2/files",
            data:{
                uploadType:"media"
            },
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) {
                    myXhr.upload.addEventListener('progress', that.progressHandling, false);
                }
                return myXhr;
            },
            success: function (data) {
                console.log(data);
            },
            error: function (error) {
                console.log(error);
            },
            async: true,
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            timeout: 60000
        });
    };
    
    Upload.prototype.progressHandling = function (event) {
        var percent = 0;
        var position = event.loaded || event.position;
        var total = event.total;
        var progress_bar_id = "#progress-wrp";
        if (event.lengthComputable) {
            percent = Math.ceil(position / total * 100);
        }
        $(progress_bar_id + " .progress-bar").css("width", +percent + "%");
        $(progress_bar_id + " .status").text(percent + "%");
    };

    $("#upload").on("click", function (e) {
        var file = $("#files")[0].files[0];
        var upload = new Upload(file);
        upload.doUpload();
    });    
});