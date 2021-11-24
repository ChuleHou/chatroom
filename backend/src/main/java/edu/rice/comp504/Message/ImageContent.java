package edu.rice.comp504.Message;

public class ImageContent implements IContent{

    private String content;

    public ImageContent(String strContent) {
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
