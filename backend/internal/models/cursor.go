package models

type Position struct {
	Line   int `json:"line"`
	Column int `json:"column"`
}

type Selection struct {
	Start Position `json:"start"`
	End   Position `json:"end"`
}

type Cursor struct {
	ID        string    `json:"id"`
	SessionID string    `json:"session_id"`
	UserID    string    `json:"user_id"`
	Position  Position  `json:"position"`
	Selection Selection `json:"selection"`
}
