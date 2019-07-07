$(document).ready(function(){
     
     var clientId = "100213440141-8u9oeef4v2jgqt1okhsr2lho6ut01g8q.apps.googleusercontent.com";

     var redirect_uri = "http://localhost/fileupload/upload.htm";

     var scope = "https://www.googleapis.com/auth/drive";

     var redirect_url = "";

     // the event listener is as follows:

     $("#login").click(function(){

        signIn(clientId,redirect_uri,scope,redirect_url);

     });
	 
     function signIn(clientId, redirect_uri, scope, redirect_url){

        //the proper redirect uri should be sent along with the client id and scope. Scope defines what kind of
		//resources we are asking permission to access
        redirect_url = "https://accounts.google.com/o/oauth2/v2/auth?redirect_uri="+redirect_uri
        +"&prompt=consent&response_type=code&client_id="+clientId+"&scope="+scope
        +"&access_type=offline";

        window.location = redirect_url;
     }

});