
const webSocket = new WebSocket("ws://" + location.hostname + ":" + location.port + "/chatapp" + "?userId=1");

var userId;
window.onload = function() {


    webSocket.onmessage = (msg) => updateChatRoom(msg);

    $("#btn-createRoom").click(createChatRoom);
    $("#joinButton2").click(()=> sendMessage("msg"));
    $("#btn-joinRoom").click(joinRoom);
    $("#btn-askUserId").click(setUpSession);

    $("#btn-sendMessage").click(()=>sendMessage($("#input-messageInput").val()));
}

let currentUserId;
function joinRoom()
{
    let userName = $("#userName").val();
    let password = $("#password").val();
    let roomNum = $("#roomId").val();

    $.post("/addUser", {userId : currentUserId, chatRoomId: roomNum},function(data){

        console.log(data);

    },"json")
}

function setUpSession()
{
    var obj = new Object();
    obj.messageType = "SetUpSession";
    let userName = $("#userName").val();
    let password = $("#password").val();
    obj.userName = userName;
    obj.password = password;
    webSocket.send(JSON.stringify(obj));
    $.post("/getUserId", {userName : userName , password : password}, function(data)
    {
        currentUserId = data;
    }, "json");
}

function sendMessage(msg) {
    if(msg !== "")
    {
        let targetChatRoomId = $("#chatRoomId").val();
        var obj = new Object();
        obj.messageType = "TextMessage";
        obj.chatRoomId = targetChatRoomId;
        obj.type = "text";
        obj.content = $("#input-messageInput").val();
        webSocket.send(JSON.stringify(obj));
    }
    $("#input-messageInput").val("");

}

function testSession()
{
    var obj = new Object();
    obj.messageType = "TestSession";
    webSocket.send(JSON.stringify(obj));
}


function updateChatRoom(message) {


    console.log(message);
    // for all message, do
    $("#testMessage").append(message.data);
}



function createChatRoom() {
    let value = $("#roomName").val();
    let value2 = "PUBLIC";
    let value3 = "5";
    let value4 = "food";
    let value5 = currentUserId;


    $.post("/createChatRoom", {chatRoomName: value,
        chatRoomType: value2, chatRoomSize : value3,
        chatRoomCategory: value4, userId: value5},
        function(data) {


        console.log("create a chatRoom");
        console.log(data);

    }, "json")
}

function parseMessage()
{

}


