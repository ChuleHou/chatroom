package edu.rice.comp504.Message;

public class EmojiContent implements IContent{

    private String content;

    public EmojiContent(String strContent) {
        content = strContent;
    }

    @Override
    public ContentType getContentType() {
        return null;
    }

    @Override
    public String getMessage() {
        return null;
    }
}
