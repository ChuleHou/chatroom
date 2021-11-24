package edu.rice.comp504.Message;

import edu.rice.comp504.ChatRoom.ChatRoom;
import edu.rice.comp504.ChatRoom.ChatRoomService;
import edu.rice.comp504.User.User;

public class MessageFac {

    // makes a message object per request
    public static Message make(int chatRoomId, String strContent, ContentType type, User sender) {

        Message msg;
        IContent content;
        ChatRoom room = ChatRoomService.getONLY().getRoomById(chatRoomId);

        switch (type) {
            case TEXT:
                content = new TextContent(strContent);
                msg = new TextMessage(room, sender, content);
                break;
            case IMAGE:
                content = new ImageContent(strContent);
                msg = new ImageMessage(room, sender, content);
                break;
            case EMOJI:
                content = new EmojiContent(strContent);
                msg = new EmojiMessage(room, sender, content);
                break;
            default:
                //TODO add nullMessage class?
                msg = null;
        }
        return msg;
    }

}
