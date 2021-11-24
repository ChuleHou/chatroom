package edu.rice.comp504.Message;

import edu.rice.comp504.ChatRoom.ChatRoom;
import edu.rice.comp504.User.User;

import java.util.ArrayList;

public class ImageMessage extends Message{

    /**
     * @param content message content.
     */
    public ImageMessage(IContent content) {
        super(content, ContentType.EMOJI);
    }

    /**
     * @param room chat room that this text message sent to.
     * @param sender user that send the text message.
     * @param content message content.
     * broadcast this message to every user in the room.
     */
    public ImageMessage(ChatRoom room, User sender, IContent content) {
        super(room, sender, room.getUsers(), content, ContentType.EMOJI);
    }

    /**
     * @param room chat room that this text message sent to.
     * @param sender user that send the text message.
     * @param receiver user list that receive the text message.
     * @param content message content.
     * broadcast this message to a specific subset of user in the room.
     */
    public ImageMessage(ChatRoom room, User sender, ArrayList<User> receiver, IContent content) {
        super(room, sender, receiver, content, ContentType.EMOJI);
    }
}
