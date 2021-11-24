package edu.rice.comp504.Message;

import edu.rice.comp504.ChatRoom.ChatRoom;
import edu.rice.comp504.User.User;

import java.util.ArrayList;
import java.util.Date;

public abstract class Message {

    private int messageID;
    private int roomID;
    private int senderID;
    private ChatRoom room;
    private User sender;
    private ArrayList<User> rcvGroup;
    private Date time;
    private ContentType type;
    private IContent content;

    public Message(IContent content, ContentType type) {
        this.content = content;
        this.type = type;
    }

    public Message(ChatRoom room, User sender, ArrayList<User> receiver, IContent content, ContentType type) {
        this.room = room;
        this.roomID = room.getRoomID();
        this.sender = sender;
        this.senderID = sender.getUserID();
        this.rcvGroup = receiver;
        this.content = content;
        this.type = type;
    }

    public int getMessageID() {
        return messageID;
    }

    public void setMessageID(int messageID) {
        this.messageID = messageID;
    }

    public int getRoomID() {
        return roomID;
    }

    public void setRoomID(int roomID) {
        this.roomID = roomID;
    }

    public int getSenderID() {
        return senderID;
    }

    public void setSenderID(int senderID) {
        this.senderID = senderID;
    }

    public ChatRoom getRoom() {
        return room;
    }

    public void setRoom(ChatRoom room) {
        this.room = room;
    }

    public User getSender() {
        return sender;
    }

    public void setSender(User sender) {
        this.sender = sender;
    }

    public ArrayList<User> getRcvGroup() {
        return rcvGroup;
    }

    public Date getTime() {
        return time;
    }

    public void setTime(Date time) {
        this.time = time;
    }

    public ContentType getType() {
        return type;
    }

    public void setType(ContentType type) {
        this.type = type;
    }

    public void setContent(IContent content) {
        this.content = content;
    }

    public void setRcvGroup(ArrayList<User> rcvGroup) {
        this.rcvGroup = rcvGroup;
    }

    public IContent getContent() {
        return content;
    }

}
