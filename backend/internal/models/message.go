package models

import (
	"time"
)

type MessageType string

const (
	MessageTypeChat   MessageType = "chat"
	MessageTypeSystem MessageType = "system"
)

type Message struct {
	ID        string      `json:"id" gorm:"primaryKey;type:uuid"`
	SessionID string      `json:"session_id" gorm:"type:uuid;not null;index"`
	UserID    string      `json:"user_id" gorm:"type:uuid;not null;index"`
	Type      MessageType `json:"type" gorm:"type:varchar(20);not null"`
	Content   string      `json:"content" gorm:"type:text;not null"`
	CreatedAt time.Time   `json:"created_at" gorm:"autoCreateTime"`
}
