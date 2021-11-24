package edu.rice.comp504.Message;

public enum ContentType {
    TEXT("text"), IMAGE("image"), EMOJI("emoji");

    private String text;

    ContentType(String text) {
        this.text = text;
    }

    public String getText() {
        return this.text;
    }

    public static ContentType fromString(String text) {
        for (ContentType type : ContentType.values()) {
            if (type.text.equalsIgnoreCase(text)) {
                return type;
            }
        }
        return null;
    }
}
