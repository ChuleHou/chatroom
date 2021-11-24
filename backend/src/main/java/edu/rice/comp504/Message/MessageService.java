package edu.rice.comp504.Message;

import com.google.gson.JsonObject;
import edu.rice.comp504.ChatAdapter;
import edu.rice.comp504.ChatRoom.ChatRoom;
import edu.rice.comp504.ChatRoom.ChatRoomService;
import edu.rice.comp504.User.User;
import edu.rice.comp504.User.UserDB;
import org.eclipse.jetty.websocket.api.Session;

import java.lang.reflect.Array;
import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;

public class MessageService {
    private static Logger log = Logger.getLogger(Logger.GLOBAL_LOGGER_NAME);

    private List<Message> messageList;
    private Set<String> hateSpeechDictionary;
    private Map<User, Integer> hateSpeechCount;
    private ChatRoomService chatRoomService;

    private static MessageService ONLY;

    public static MessageService getONLY()
    {
        if (ONLY == null)
        {
            ONLY = new MessageService();
        }
        return ONLY;
    }


    /**
     * create message service with message manipulation methods.
     */
    private MessageService() {
        this.messageList = new ArrayList<>();

        // todo: fill dictionary
        this.hateSpeechDictionary = new HashSet<>(Arrays.asList("hate speech"));
        this.hateSpeechCount = new HashMap<>();
    }

    public void setChatRoomService(ChatRoomService service)
    {
        chatRoomService = service;
    }

    /**
     * @param message message that needs to broadcast.
     * @param sender message sender.
     * @param room chat room of this message.
     */
    public void broadcastMessage(Message message, User sender, ChatRoom room) {
        ArrayList<User> blockedUser = room.getBlackList();
        for (User user: blockedUser) {
            System.out.println(user.getUserID());
        }
        if (blockedUser.contains(sender)) {
            log.log(Level.INFO, "blocked user cannot broadcast message.");
            return;
        }

        ArrayList<User> userInRoom = room.getUsers();

        System.out.println("All user in room" + room.getRoomName());
        for (User user:userInRoom) {
            System.out.println(user.getUserName());
        }
        message.setRcvGroup(userInRoom);
        message.setSender(sender);
        message.setRoom(room);
        messageList.add(message);
        checkMessage(sender, message);

        JsonObject jo = new JsonObject();
        // add message type property to json
        switch (message.getContent().getContentType()) {
            case TEXT:
                jo.addProperty("messageType", "text");
                break;
            case IMAGE:
                jo.addProperty("messageType", "image");
                break;
            case EMOJI:
                jo.addProperty("messageType", "emoji");
        }
        jo.addProperty("message", message.getContent().getMessage());

        // send message to the receiver group
        for (User rcvUser:message.getRcvGroup()) {
            Session userSession = UserDB.getSessionFromUserId(rcvUser.getUserID());
            try {
                userSession.getRemote().sendString(jo.toString());
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

//    /**
//     * @param message message that needs to be send.
//     * @param sender message sender.
//     * @param room chat room of this message.
//     * @param receiver message receiver.
//     */
//    public void sendMessage(Message message, User sender, ChatRoom room, User receiver) {
//        ArrayList<User> userInRoom = room.getUsers();
//        if (!userInRoom.contains(sender)) {
//            log.log(Level.INFO, sender.getUserName() + " is not in this room.");
//            return;
//        }
//        if (!userInRoom.contains(receiver)) {
//            log.log(Level.INFO, receiver.getUserName() + " is not in this room.");
//            return;
//        }
//        ArrayList<User> blockedUser = room.getBlackList();
//        if (blockedUser.contains(sender)) {
//            log.log(Level.INFO, sender.getUserName() + " is in the black list.");
//            return;
//        }
//        log.log(Level.INFO, "message is successfully send.");
//        ArrayList<User> rcvGroup = new ArrayList<>();
//        rcvGroup.add(sender);
//        rcvGroup.add(receiver);
//        message.setRcvGroup(rcvGroup);
//        message.setSender(sender);
//        message.setRoom(room);
//        messageList.add(message);
//        checkMessage(sender, message);
//
//    }

    /**
     * @param user a specific user.
     * @param room a specific chat room.
     * @return all message user received in a specific chat room.
     */
    public List<Message> getMessageWithUserAndRoom(User user, ChatRoom room) {
        List<Message> result = new ArrayList<>();
        for (Message message : messageList) {
            if (message.getRoom().equals(room) || message.getRoomID() == room.getRoomID()) {
                ArrayList<User> rcvGroup = message.getRcvGroup();
                if (rcvGroup.contains(user)) {
                    result.add(message);
                }
            }
        }
        return result;
    }

    /**
     * @param recallMessage message that needs to be recalled.
     */
    public void recallMessage(Message recallMessage) {
        // remove this message from list. Therefore, all people previously received this message
        // will not have this message.
        messageList.remove(recallMessage);
    }

    /**
     * @param delMessage message that needs to be deleted.
     * @param user to whom this message be deleted.
     */
    public void deleteMessage(Message delMessage, User user) {
        // remove user from message's receive group. Therefore, only this people will not have
        // this message.
        for (Message message : messageList) {
            if (message.equals(delMessage) || message.getMessageID() == delMessage.getMessageID()) {
                ArrayList<User> rcvGroup = message.getRcvGroup();
                rcvGroup.remove(user);
                return;
            }
        }
    }

    /**
     * @param oldMessage old message.
     * @param newMessage new message.
     */
    public void editMessage(Message oldMessage, Message newMessage) {
        for (int i = 0; i < messageList.size(); i++) {
            Message message = messageList.get(i);
            if (message.equals(oldMessage) || message.getMessageID() == oldMessage.getMessageID()) {
                messageList.set(i, newMessage);
                return;
            }
        }
    }

    /**
     * @param sender message sender.
     * @param message check if message contains hate speech.
     */
    public void checkMessage(User sender, Message message) {

        if (!message.getType().equals(ContentType.TEXT)) {
            return;
        }
        final Integer hateSpeechThreshold = 3;
        TextMessage textMessage = (TextMessage)message;
        TextContent content = (TextContent)textMessage.getContent();
        String contentInfo = content.getMessage();
        for (String hateSpeech : hateSpeechDictionary) {
            if (!contentInfo.contains(hateSpeech)) {
                continue;
            }
            hateSpeechCount.put(sender, hateSpeechCount.getOrDefault(sender, 0) + 1);
            if (hateSpeechCount.get(sender).compareTo(hateSpeechThreshold) > 0) {
                chatRoomService.blockUserForAllRoom(sender);
                return;
            }
        }
    }

}
