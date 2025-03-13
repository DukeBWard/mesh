package models

import (
	"time"
)

type SessionStatus string

const (
	SessionStatusActive SessionStatus = "active"
	SessionStatusPaused SessionStatus = "paused"
	SessionStatusEnded  SessionStatus = "ended"
)

type Session struct {
	ID        string        `json:"id" gorm:"primaryKey;type:uuid"`
	Name      string        `json:"name" gorm:"not null"`
	OwnerID   string        `json:"owner_id" gorm:"type:uuid;not null"`
	Status    SessionStatus `json:"status" gorm:"type:varchar(20);not null;default:'active'"`
	Language  string        `json:"language" gorm:"type:varchar(50);not null"`
	Content   string        `json:"content" gorm:"type:text"`
	Version   int64         `json:"version" gorm:"not null;default:0"` // For conflict resolution
	CreatedAt time.Time     `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time     `json:"updated_at" gorm:"autoUpdateTime"`
}
