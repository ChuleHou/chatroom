package edu.rice.comp504.adapter;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import edu.rice.comp504.ChatRoom.ChatRoom;
import edu.rice.comp504.ChatRoom.ChatRoomService;
import edu.rice.comp504.Message.*;
import edu.rice.comp504.User.User;
import edu.rice.comp504.User.UserDB;
import edu.rice.comp504.User.UserService;
import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketClose;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketConnect;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketMessage;
import org.eclipse.jetty.websocket.api.annotations.WebSocket;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@WebSocket
public class WebSocketAdapter {


    @OnWebSocketConnect
    public void onConnect(Session session) {
        // add user to all chatroom
        //User connectedUser = UserDB.getUserFromSession(session);
        //String userId = "no found";
        //Map<String, List<String>> params = session.getUpgradeRequest().getParameterMap();
        //if(params != null && params.containsKey("userId"))
        //{
        //    userId = params.get("userId").get(0);
        //}
        //int userIdNumber = Integer.parseInt(userId);
        //User targetUser = UserDB.getUserFromUserId(userIdNumber);
        //UserDB.addUserWithSession(session, targetUser);

        //System.out.println(userId);

    }

    @OnWebSocketClose
    public void onClose(Session session, int statusCode, String reason)
    {
        // remove user from all chat room
        UserDB.removeUser(session);

    }

    @OnWebSocketMessage
    public void onMessage(Session session, String message)
    {   // parse the message and get user, content, content type
        System.out.println(".....................");System.out.println(message);
        JsonObject jsonObject = new JsonParser().parse(message).getAsJsonObject();
        String messageType = jsonObject.get("messageType").getAsString();
        if(Objects.equals(messageType, "SetUpSession"))
        {
            System.out.println(message);
            String userName = jsonObject.get("userName").getAsString();

            int userId = UserDB.getUserIdFromUserName(userName);

            System.out.println("Set up session for user: " + userId);
            System.out.println("User before set up session: ");
            UserDB.checkSession();

            User targetUser = UserDB.getUserFromUserId(userId);
            UserDB.addUserWithSession(session, targetUser);

            System.out.println("User after set up session: ");
            UserDB.checkSession();
        }
        else if(Objects.equals(messageType, "TestSession"))
        {
            User user = UserDB.getUserFromSession(session);
            System.out.println(user.getUserName());
        }
        else if(Objects.equals(messageType, "TextMessage"))
        {
            User sender = UserDB.getUserFromSession(session);
            System.out.println("sender is" + sender.getUserName());
            //TODO: name --> id
            int chatRoomId = jsonObject.get("chatRoomId").getAsInt();
            String strContent = jsonObject.get("content").getAsString();
            ContentType type = ContentType.fromString(jsonObject.get("type").getAsString());

            // Create message
            MessageFac.make(chatRoomId, strContent, type, sender);

            ChatRoom targetChatRoom = ChatRoomService.getONLY().getRoomById(chatRoomId);
            System.out.println("Get room with id: " + targetChatRoom.getRoomID());
            System.out.println("Get room with name: " + targetChatRoom.getRoomName());
            System.out.println("target Chatroom is:" + targetChatRoom.getRoomID());
            IContent content = new TextContent(strContent);

            Message newMessage = new TextMessage(content);
            System.out.println("BroadcastMessage from:" + sender.getUserName() +  "to" + targetChatRoom.getRoomName());
            MessageService.getONLY().broadcastMessage(newMessage, sender, targetChatRoom);
        }


    }
}
