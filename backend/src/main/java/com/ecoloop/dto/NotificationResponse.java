package com.ecoloop.dto;

import java.time.LocalDateTime;

public class NotificationResponse {
    private Long id;
    private String title;
    private String message;
    private boolean read;
    private String type;
    private LocalDateTime createdAt;

    public NotificationResponse() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Long id; private String title; private String message; boolean read; private String type; private LocalDateTime createdAt;
        public Builder id(Long id) { this.id = id; return this; }
        public Builder title(String t) { this.title = t; return this; }
        public Builder message(String m) { this.message = m; return this; }
        public Builder read(boolean r) { this.read = r; return this; }
        public Builder type(String t) { this.type = t; return this; }
        public Builder createdAt(LocalDateTime c) { this.createdAt = c; return this; }
        public NotificationResponse build() {
            NotificationResponse n = new NotificationResponse();
            n.setId(id); n.setTitle(title); n.setMessage(message); n.setRead(read); n.setType(type); n.setCreatedAt(createdAt);
            return n;
        }
    }
}
