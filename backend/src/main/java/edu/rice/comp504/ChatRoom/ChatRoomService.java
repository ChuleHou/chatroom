package edu.rice.comp504.ChatRoom;

import edu.rice.comp504.Message.Message;
import edu.rice.comp504.User.User;
import edu.rice.comp504.User.UserService;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Level;
import java.util.logging.Logger;

public class ChatRoomService implements IRoomFac {
    private UserService userService;
    private Map<Integer, ChatRoom> chatRoomList = new ConcurrentHashMap<>();
    private int nextRoomId;
    private static Logger log = Logger.getLogger(Logger.GLOBAL_LOGGER_NAME);

    public static ChatRoomService ONLY;

    private static int nextChatRoomId = 1;

    public static ChatRoomService getONLY()
    {
        if (ONLY == null)
        {
            ONLY = new ChatRoomService();
        }
        return ONLY;
    }
    /**
     * create chat room service.
     */
    private ChatRoomService() {
        nextRoomId = 1;
    }

    private int getNextRoomId() {
        return nextRoomId++;
    }

    public int genNextChatRoomId()
    {
        return nextChatRoomId++;
    }

    // set user Service after chatRoomService is created
    public void setUserService(UserService service)
    {
        userService = service;
    }

    /**
     * Add user to room
     * @param roomid room id
     * @param user user.
     * @return true if successfully joined, else false.
     */
    public boolean addUser(Integer roomid, User user) {
        ChatRoom room = chatRoomList.get(roomid);
        ArrayList<User> userInRoom = room.getUsers();
        if (userInRoom.contains(user)) {
            log.log(Level.INFO, user.getUserName() + " is already in this room.");
            return false;
        }
        if (room.getUsers().size() == room.getRoomSize()) {
            log.log(Level.INFO, "Room is full.");
            return false;
        }
        // add user to user list in room
        userInRoom.add(user);
        log.log(Level.INFO, room.getRoomName() + " successfully added " + user.getUserName() + ".");
        return true;
    }



    /**
     * @param room room which needs to set admin.
     * @param user user to set.
     */
    public void setAdmin(ChatRoom room, User user) {
        ArrayList<User> adminInRoom = room.getAdmins();
        if (adminInRoom.contains(user)) {
            log.log(Level.INFO, user.getUserName() + " is already an admin in this room.");
            return;
        }
        adminInRoom.add(user);
        userService.addAdminToRoom(user, room);
    }

    /**
     * @param room a specific room that needs to block a user.
     * @param user blocked user.
     */
    public void blockUser(ChatRoom room, User user) {
        System.out.println("block user");
        ArrayList<User> blockedUser = room.getBlackList();

        System.out.println("block user" + user.getUserID());

        if (blockedUser.contains(user)) {
            log.log(Level.INFO, user.getUserName() + " is already blocked from this room.");
            return;
        }
        blockedUser.add(user);
    }

    /**
     * @param user blocked user from all chat rooms.
     */
    public void blockUserForAllRoom(User user) {
        for (ChatRoom room : chatRoomList.values()) {
            blockUser(room, user);
        }
    }

    public ChatRoom getRoomById(int roomId) {
        return chatRoomList.get(roomId);
    }

    public ChatRoom getRoomByName(String roomName)
    {
        for (ChatRoom chatroom:chatRoomList.values()) {
            if(chatroom.getRoomName() == roomName)
            {
                return chatroom;
            }
        }
        return null;
    }

    /**
     * @param roomName room name input.
     * @param type type input.
     * @param roomSize room size input.
     * @param category category input.
     * @param admin admin of this new chat room.
     * @return new chat room.
     */
    @Override
    public ChatRoom make(String roomName, RoomType type, int roomSize, ArrayList<String> category, User admin) {
        ChatRoom chatRoom = new ChatRoom(roomName, type, roomSize, category, admin);
        chatRoomList.put(getNextRoomId(), chatRoom);
        return chatRoom;
    }

    public void removeChatRoom(int chatRoomId)
    {
        chatRoomList.remove(chatRoomId);
    }

    public ArrayList<ChatRoom> getChatRoomWithTopic(String topic)
    {
        ArrayList<ChatRoom> outChatRoom = new ArrayList<>();
        for (ChatRoom room: chatRoomList.values()) {
            if(room.getCategory().contains(topic))
            {
                outChatRoom.add(room);
            }
        }
        return outChatRoom;
    }

//    public ChatRoom getChatRoomById(int chatRoomId)
//    {
//        for (ChatRoom room : chatRoomList) {
//            if(room.getRoomID() == chatRoomId)
//            {
//                return room;
//            }
//        }
//        return null;
//    }
}
