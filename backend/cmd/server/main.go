package main

import (
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"

	"github.com/dukebward/mesh/internal/api/handlers"
)

func main() {
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
