


window.onload = function() {

    //webSocket.onmessage = (msg) => updateChatRoom(msg);

    $("#btn-register").click(registerUser);
    $("#btn-login").click(login);

}

function registerUser()
{
    let userName = $("#newUserName").val();
    let password = $("#newPassword").val();
    let age = 20;
    let school = "rice";
    let interests = "food";

    $.post("/registerUser", {userName : userName, password : password, age : age, school: school,interests : interests },
        function(data) {
        console.log("register User");
        console.log(data);
        }, "json")
}

let webSocket;
function login()
{
    let userName = $("#userName").val();
    let password = $("#password").val();

    $.post("/login", {userName: userName, password: password},
        function(data) {
        console.log("login user");
        currentUserId = data;
        console.log(data);
        if(data != null)
        {
            webSocket = new WebSocket("ws://" + location.hostname + ":" + location.port + "/chatapp" + "?userId=" + data);
        }
        }, "json")
}
