package edu.rice.comp504.Message;

public class TextContent implements IContent {
    private String content;

    public TextContent(String content) {
        this.content = content;
    }

    @Override
    public String getMessage() {
        return content;
    }

    @Override
    public ContentType getContentType() {
        return ContentType.TEXT;
    }
}
