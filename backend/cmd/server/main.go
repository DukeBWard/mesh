package main

import (
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/google/uuid"

	"github.com/dukebward/mesh/internal/api/handlers"
	"github.com/dukebward/mesh/internal/db"
	"github.com/dukebward/mesh/internal/models"
)

func testDB() {

	userID, err := uuid.NewUUID()
	if err != nil {
		log.Printf("uuid error")
		return
	}
	// create a test user
	testUser := models.User{
		ID:       userID.String(),
		Email:    "test@example.com",
		Password: "testpass123",
	}

	result := db.GetDB().Create(&testUser)
	if result.Error != nil {
		log.Printf("Test user creation failed: %v\n", result.Error)
	} else {
		log.Printf("Test user created successfully with ID: %v\n", testUser.ID)

		// Try to retrieve the user
		var foundUser models.User
		result = db.GetDB().Where("email = ?", "test@example.com").First(&foundUser)
		if result.Error != nil {
			log.Printf("Failed to find test user: %v\n", result.Error)
		} else {
			log.Printf("Found test user with ID: %v\n", foundUser.ID)
		}
	}
}

func main() {
	// init db
	if _, err := db.InitDB(); err != nil {
		log.Fatal("Failed to initialize database:", err)
	}

	// db conn test
	testDB()

	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// API routes
	r.Route("/api", func(r chi.Router) {
		// Auth routes
		r.Route("/auth", func(r chi.Router) {
			r.Post("/signup", handlers.Signup)
			r.Post("/login", handlers.Login)
		})

		// Protected routes will go here later
		// r.Group(func(r chi.Router) {
		//     r.Use(middleware.AuthRequired)
		//     r.Route("/sessions", func(r chi.Router) {
		//         // Session routes
		//     })
		// })
	})

	log.Println("Server starting on :8080")
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
