package edu.rice.comp504;

import com.github.tsohr.JSONObject;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import edu.rice.comp504.ChatRoom.ChatRoom;
import edu.rice.comp504.ChatRoom.ChatRoomService;
import edu.rice.comp504.ChatRoom.RoomType;
import edu.rice.comp504.Message.MessageService;
import edu.rice.comp504.User.TokenService;
import edu.rice.comp504.User.User;
import edu.rice.comp504.User.UserDB;
import edu.rice.comp504.User.UserService;
import edu.rice.comp504.adapter.WebSocketAdapter;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Objects;

import static spark.Spark.*;
import static spark.Spark.init;

public class ChatAppController {

    /**
     * Chat App entry point.
     * @param args The command line arguments
     */
    public static void main(String[] args) {

        Gson gson = new Gson();
        port(getHerokuAssignedPort());
        staticFiles.location("/public");

        webSocket("/chatapp", WebSocketAdapter.class);

        // init
        ChatRoomService.getONLY().setUserService(UserService.getONLY());
        MessageService.getONLY().setChatRoomService(ChatRoomService.getONLY());
        UserService.getONLY().setMessageService(MessageService.getONLY());
        UserService.getONLY().setChatRoomService(ChatRoomService.getONLY());
        // init

        // Add user, chatRoom and other class for testing only
        // ************************delete this block at the end********************
        //ArrayList<String> userInterest = new ArrayList<>();
        //userInterest.add("food");
        //userInterest.add("cat");

        //UserService.getONLY().register("user1", "123", 18,"Rice", userInterest);
        //System.out.println(UserDB.getUserFromUserId(1).getUserID());




        // ************************************************************************

        get("/", (request, response) -> {
            response.redirect("public/index.html");
            return null;
        });



         post("/createChatRoom", (request, response) -> {

             JSONObject jsonObj = new JSONObject(request.body());
             //String username = jsonObj.getString("userName");

             // retrieve information from post request
            String chatRoomName = jsonObj.getString("chatRoomName");
            String roomType = jsonObj.getString("chatRoomType");
            int roomSize = Integer.parseInt(jsonObj.getString("chatRoomSize"));
            ArrayList<String> categories = new ArrayList<>(Arrays.asList(jsonObj.getString("chatRoomCategory")));
            String username = jsonObj.getString("userName");
            // get user based on user id
            int userId=UserDB.getUserIdFromUserName(username);
             User existingUser = UserDB.getUserFromUserId(userId);

             ChatRoom newChatRoom;
            if(Objects.equals(roomType, "PUBLIC"))
            {
                newChatRoom = ChatRoomService.getONLY().make(chatRoomName, RoomType.PUBLIC,roomSize,categories,existingUser);
            }
            else
            {
                newChatRoom = ChatRoomService.getONLY().make(chatRoomName, RoomType.PRIVATE,roomSize,categories,existingUser);
            }
            System.out.println("Chatroom created name: " + newChatRoom.getRoomName());

            existingUser.joinRoom(newChatRoom);

             System.out.println("All user in room " + newChatRoom.getRoomName() + "when just created");
             ArrayList<User> users = newChatRoom.getUsers();
             for (User eachUser:users) {
                 System.out.println("User is :" + eachUser.getUserName());
             }

             JsonObject object = new JsonObject();
             object.addProperty("code",0);
             object.addProperty("data",gson.toJson(newChatRoom));

             return object;
        });

         post("/addUser", (request, response) -> {



             //int userId = Integer.parseInt(request.queryParams("userName"));
             JSONObject jsonObj = new JSONObject(request.body());
             String username = jsonObj.getString("userName");
             int userId=UserDB.getUserIdFromUserName(username);

             String chatRoomName = jsonObj.getString("chatRoomName");

             int chatRoomId=1;//=tarsferfrom(chatRoomName)  //Todo

             User targetUser = UserDB.getUserFromUserId(userId);

             System.out.println("All user in room " + chatRoomName + "before add user " + userId);
             ChatRoom targetChatRoom = ChatRoomService.getONLY().getRoomById(chatRoomId);
             ArrayList<User> users = targetChatRoom.getUsers();
             for (User eachUser:users) {
                 System.out.println("User is :" + eachUser.getUserName());
             }


             ChatRoomService.getONLY().addUser(chatRoomId, targetUser);



             System.out.println("All user in room " + chatRoomId + "after add user " + userId);
             targetChatRoom = ChatRoomService.getONLY().getRoomById(chatRoomId);
             users = targetChatRoom.getUsers();
             for (User eachUser:users) {
                 System.out.println("User is :" + eachUser.getUserName());
             }
             JsonObject object = new JsonObject();
             object.addProperty("code",0);
             object.addProperty("data",gson.toJson(targetUser));
             return object;

         });

         post("/getAllChatroom", (request, response) -> {
             JSONObject jsonObj = new JSONObject(request.body());
             String username = jsonObj.getString("userName");
             int userId=UserDB.getUserIdFromUserName(username);

             User targetUser = UserDB.getUserFromUserId(userId);

             JsonObject object = new JsonObject();
             object.addProperty("code",0);
             object.addProperty("data",gson.toJson(targetUser.getRooms()));
             return object;
         });

         post("/deleteUserFromRoom", (request, response) -> {
             JSONObject jsonObj = new JSONObject(request.body());
             String username = jsonObj.getString("userName");
             int userId=UserDB.getUserIdFromUserName(username);
             String roomName=jsonObj.getString("chatRoomName");
             int roomId = 1;//TODO:transfer from(roomname);


             User targetUser = UserDB.getUserFromUserId(userId);
             ChatRoom targetChatroom = ChatRoomService.getONLY().getRoomById(roomId);
             UserService.getONLY().leaveChatRoom(targetUser, targetChatroom, "removed");
             return gson.toJson(targetUser);
         });

         post("/deleteUserRoom", (request, response)-> {
             int userId = Integer.parseInt(request.queryParams("userId"));
             User targetUser = UserDB.getUserFromUserId(userId);
             ArrayList<ChatRoom> userChatRoom = targetUser.getRooms();
             for (ChatRoom chatRoom: userChatRoom) {
                 int chatRoomId = chatRoom.getRoomID();
                 ChatRoomService.getONLY().removeChatRoom(chatRoomId);
             }
             return gson.toJson(targetUser);
         });

         post("/getUserInTopicRoom", (request, response) -> {
             ArrayList<User> outUsers = new ArrayList<>();
             String topic = request.queryParams("topic");
             ArrayList<ChatRoom> chatRooms = ChatRoomService.getONLY().getChatRoomWithTopic(topic);
             for (ChatRoom room: chatRooms) {
                 for (User user:room.getUsers()) {
                     if(!outUsers.contains(user))
                     {
                         outUsers.add(user);
                     }
                 }
             }
             return gson.toJson(outUsers);
         });

        post("/register", (request, response) -> {
            JSONObject jsonObj = new JSONObject(request.body());
            String userName = jsonObj.getString("userName");


            String password =  jsonObj.getString("password");

            int age = Integer.parseInt( jsonObj.getString("age"));
            String school =  jsonObj.getString("schoole");
            String in = jsonObj.getString("interests");
            ArrayList<String> interestes = new ArrayList<>();
            interestes.add(in);
            User newUser = UserService.getONLY().register(userName, password, age, school, interestes);

            JsonObject object = new JsonObject();
            if(newUser!=null) {

                JsonObject object2 = new JsonObject();
                String token = TokenService.getToken(userName, password);
                object2.addProperty("token", token);
                object2.addProperty("userData", gson.toJson(newUser));
                object.addProperty("code", 0);
                object.addProperty("data", gson.toJson(object2));
            }
            else {
                String token = TokenService.getToken(userName, password);

                object.addProperty("code", 1);
                object.addProperty("msg", "user already exists");
            }
            return gson.toJson(object);


        });

        post("/login", (request, response) -> {
            JSONObject jsonObj = new JSONObject(request.body());
            String userName = jsonObj.getString("userName");

            String password = jsonObj.getString("password");
            User targetUser = UserService.getONLY().Login(userName, password);

            JsonObject object = new JsonObject();
            if(targetUser != null)
            {
                JsonObject object2 = new JsonObject();
                String token =  TokenService.getToken(userName,password);
                object2.addProperty("token",token);
                object2.addProperty("userData",gson.toJson(targetUser));
                object.addProperty("code", 0);
                object.addProperty("data", gson.toJson(object2));
                return gson.toJson(object);

            }
            else{
                object.addProperty("code", 1);
                object.addProperty("msg", "unmatched information");
                return gson.toJson(object);
            }

            //return "login fail";

        });

        post("/getUserId", (request, response) -> {
            String userName = request.queryParams("userName");
            String password = request.queryParams("password");
            User targetUser = UserService.getONLY().checkPassword(userName, password);
            return gson.toJson(targetUser.getUserID());
        });

        // return a user list given a chat room list
        post("/getUserByRoomName", (request, response) -> {
            JSONObject jsonObj = new JSONObject(request.body());
            String roomName = jsonObj.getString("roomName");
            ChatRoom chatRoom = ChatRoomService.getONLY().getRoomByName(roomName);
            return gson.toJson(chatRoom.getUsers());
        });






        options("/*",
                (request, response) -> {

                    String accessControlRequestHeaders = request
                            .headers("Access-Control-Request-Headers");
                    if (accessControlRequestHeaders != null) {
                        response.header("Access-Control-Allow-Headers",
                                accessControlRequestHeaders);
                    }

                    String accessControlRequestMethod = request
                            .headers("Access-Control-Request-Method");
                    if (accessControlRequestMethod != null) {
                        response.header("Access-Control-Allow-Methods",
                                accessControlRequestMethod);
                    }

                    return "OK";
                });

        before((request, response) -> response.header("Access-Control-Allow-Origin", "*"));







         // post register

        // new user

        // add to userDB


        // post login

        // post













        init();
    }

    /**
     * Get the heroku assigned port number.
     * @return The heroku assigned port number
     */
    private static int getHerokuAssignedPort() {
        ProcessBuilder processBuilder = new ProcessBuilder();
        if (processBuilder.environment().get("PORT") != null) {
            return Integer.parseInt(processBuilder.environment().get("PORT"));
        }
        return 4567; // return default port if heroku-port isn't set.
    }

    private RoomType roomTypeStringToEnum(String roomTypeString)
    {
        if(Objects.equals(roomTypeString, "PUBLIC"))
        {
            return RoomType.PUBLIC;
        }
        else
        {
            return RoomType.PRIVATE;
        }
    }
}

