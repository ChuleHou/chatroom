package edu.rice.comp504.ChatRoom;

import edu.rice.comp504.User.User;

import java.util.ArrayList;

public interface IRoomFac {
    public ChatRoom make(String roomName, RoomType type, int roomSize, ArrayList<String> category, User admin);
}
