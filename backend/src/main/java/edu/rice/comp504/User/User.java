package edu.rice.comp504.User;

import edu.rice.comp504.ChatRoom.ChatRoom;

import java.util.ArrayList;

public class User {

    private int userID;
    private String userName;
    private int age;
    private String school;
    private ArrayList<String> interests;
    private ArrayList<ChatRoom> rooms;
    private ArrayList<ChatRoom> adminRooms;

    public User(String userName, int age, String school, ArrayList<String> interests) {
        this.userName = userName;
        this.age = age;
        this.school = school;
        this.interests = interests;
        rooms = new ArrayList<>();
        adminRooms = new ArrayList<>();
        userID = UserDB.genNextUserId();
    }

    // Getters & Setters

    public int getUserID() {
        return userID;
    }

    public String getUserName() {
        return userName;
    }

    public int getAge() {
        return age;
    }

    public String getSchool() {
        return school;
    }

    public ArrayList<String> getInterests() {
        return interests;
    }

    public ArrayList<ChatRoom> getRooms() {
        return rooms;
    }

    public ArrayList<ChatRoom> getAdminRooms() {
        return adminRooms;
    }

    public void addAdminRoom(ChatRoom adminRoom)
    {
        adminRooms.add(adminRoom);
    }

    public void joinRoom(ChatRoom room)
    {
        rooms.add(room);
    }

}
