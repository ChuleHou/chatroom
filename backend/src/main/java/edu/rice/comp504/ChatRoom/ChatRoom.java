package edu.rice.comp504.ChatRoom;

import edu.rice.comp504.Message.Message;
import edu.rice.comp504.User.User;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ChatRoom {

    private int roomID;
    private String roomName;
    private RoomType type;
    private int roomSize;
    private ArrayList<String> category;
    private ArrayList<User> users;
    private ArrayList<User> blackList;
    private ArrayList<User> admins;
//    private Map<User, List<Message>> messageList;


    public ChatRoom(String roomName, RoomType type, int roomSize, ArrayList<String> category, User admin) {
        roomID = ChatRoomService.getONLY().genNextChatRoomId();
        this.roomName = roomName;
        this.type = type;
        this.roomSize = roomSize;
        this.category = category;
        this.users = new ArrayList<>();
        this.blackList = new ArrayList<>();
        this.admins = new ArrayList<>();
//        this.messageList = new HashMap<>();
        users.add(admin);
        admins.add(admin);
    }

    public void blockUser(User user) {
        this.blackList.add(user);
    }

    // Getters & Setters

    public int getRoomSize() {
        return roomSize;
    }

    public int getRoomID() {
        return roomID;
    }

    public String getRoomName() {
        return roomName;
    }

    public RoomType getType() {
        return type;
    }

    public ArrayList<String> getCategory() {
        return category;
    }

    public ArrayList<User> getUsers() {
        return users;
    }

    public ArrayList<User> getBlackList() {
        return blackList;
    }

    public ArrayList<User> getAdmins() {
        return admins;
    }

    public void addUser(User user) { this.users.add(user); }

//    public Map<User, List<Message>> getMessageList() {
//        return messageList;
//    }
}
