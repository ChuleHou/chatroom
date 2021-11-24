package edu.rice.comp504.User;

import edu.rice.comp504.ChatRoom.ChatRoom;
import edu.rice.comp504.ChatRoom.ChatRoomService;
import edu.rice.comp504.Message.Message;
import edu.rice.comp504.Message.MessageService;
import edu.rice.comp504.Message.TextContent;
import edu.rice.comp504.Message.TextMessage;
import org.eclipse.jetty.websocket.api.Session;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.logging.Level;
import java.util.logging.Logger;

public class UserService {
    private Map<String, String> userInfo;


    private MessageService messageService;
    private ChatRoomService chatRoomService;
    private static Logger log = Logger.getLogger(Logger.GLOBAL_LOGGER_NAME);

    private static UserService ONLY;

    public static UserService getONLY()
    {
        if (ONLY == null)
        {
            ONLY = new UserService();
        }

        return ONLY;
    }

    /**
     * User service for chat room user and admin.
     */
    private UserService() {
        userInfo = new HashMap<>();
    }

    public void setMessageService(MessageService service)
    {
        messageService = service;
    }

    public void setChatRoomService(ChatRoomService service)
    {
        chatRoomService = service;
    }

    /**
     * @param session user session.
     * @param userName username input.
     * @param password password input.
     * @return User if successfully logged in, else null.
     */
    public User login(Session session, String userName, String password) {
        if (!userInfo.containsKey(userName)) {
            log.log(Level.INFO, "Username does not exist.");
            return null;
        }
        String expectedPassword = userInfo.get(userName);
        if (!expectedPassword.equals(password)) {
            log.log(Level.INFO, "Username does not match password.");
            return null;
        }
        log.log(Level.INFO, userName + " successfully logged in.");
        return UserDB.getUserFromSession(session);
    }

    public User Login(String userName, String password) {
        if (!userInfo.containsKey(userName)) {
            log.log(Level.INFO, "Username does not exist.");
            return null;
        }
        String expectedPassword = userInfo.get(userName);
        if (!expectedPassword.equals(password)) {
            log.log(Level.INFO, "Username does not match password.");
            return null;
        }
        log.log(Level.INFO, userName + " successfully logged in.");
        int userId = UserDB.getUserIdFromUserName(userName);
        return UserDB.getUserFromUserId(userId);
    }

    public User checkPassword(String userName, String password) {
        String realPassword = userInfo.get(userName);
        if(Objects.equals(password, realPassword))
        {
            int userId = UserDB.getUserIdFromUserName(userName);
            return UserDB.getUserFromUserId(userId);
        }
        else
        {
            return null;
        }
    }


    /**
     * @param session user session.
     * @param userName username input.
     * @param password password input.
     * @param age age input.
     * @param school school input.
     * @param interests interests input.
     * @return User if successfully registered, else null.
     */
    public User register(Session session, String userName, String password, int age, String school, ArrayList<String> interests) {
        if (userInfo.containsKey(userName)) {
            log.log(Level.INFO, "Username already exists");
            return null;
        }
        userInfo.put(userName, password);

        User user = new User(userName, age, school, interests);
        //UserDB.addSessionUser(session, user);
        UserDB.addUserWithSession(session, user);
        log.log(Level.INFO, userName + " successfully registered.");
        return user;
    }

    public User register(String userName, String password, int age, String school, ArrayList<String> interests) {
        if (userInfo.containsKey(userName)) {
            log.log(Level.INFO, "Username already exists");
            return null;
        }
        userInfo.put(userName, password);

        User user = new User(userName, age, school, interests);
        UserDB.addUserWithOutSession(user);
        log.log(Level.INFO, userName + " successfully registered.");
        return user;
    }

    /**
     * @param user user that wants to join room.
     * @param roomID id of a specific chat room.
     */
    public void joinChatRoom(User user, int roomID) {
        ChatRoom room = ChatRoomService.getONLY().getRoomById(roomID);
        if (room == null) {
            log.log(Level.INFO, "Room is not valid.");
            return;
        }
        ArrayList<ChatRoom> joinedRoom = user.getRooms();
        if (joinedRoom.contains(room)) {
            log.log(Level.INFO, "Room already joined.");
            return;
        }

        if (chatRoomService.addUser(roomID, user)) {
            joinedRoom.add(room);
            log.log(Level.INFO, user.getUserName() + " successfully joined room.");
        }
        user.joinRoom(room);

    }

    /**
     * @param user user that wants to leave room.
     * @param room a specific chat room.
     * @param reason reason that user want to leave(voluntarily left, connection closed, forced to leave).
     */
    public void leaveChatRoom(User user, ChatRoom room, String reason) {
        if (room == null) {
            log.log(Level.INFO, "Room is not valid.");
            return;
        }
        Message leaveMessage = new TextMessage(room, user, new TextContent(reason));
        messageService.broadcastMessage(leaveMessage, user, room);
        ArrayList<ChatRoom> joinedRoom = user.getRooms();
        joinedRoom.remove(room);

        log.log(Level.INFO, user.getUserName() + " successfully leaved room.");
    }

    /**
     * @param inviter admin to send invitation.
     * @param invitee user to join.
     * @param room a specific chat room.
     */
    public void inviteUser(User inviter, User invitee, ChatRoom room) {
        ArrayList<ChatRoom> adminRoom = inviter.getAdminRooms();
        if (!adminRoom.contains(room)) {
            log.log(Level.INFO, inviter.getUserName() + " is not an admin for this room.");
            return;
        }
        ArrayList<ChatRoom> joinedRoom = invitee.getRooms();
        if (joinedRoom.contains(room)) {
            log.log(Level.INFO, invitee.getUserName() + " already joined this room.");
            return;
        }
        joinedRoom.add(room);
        log.log(Level.INFO, inviter.getUserName() + " successfully invited " + invitee.getUserName() + " to this room.");
    }

    /**
     * @param user user that want to be an admin.
     * @param room a specific chat room.
     */
    public void addAdminToRoom(User user, ChatRoom room) {
        ArrayList<ChatRoom> adminRoom = user.getAdminRooms();
        if (adminRoom.contains(room)) {
            log.log(Level.INFO, user.getUserName() + " is already an admin in this room.");
            return;
        }
        adminRoom.add(room);
        log.log(Level.INFO, user.getUserName() + " is now an admin for room" + room.getRoomName() + ".");
    }
}
