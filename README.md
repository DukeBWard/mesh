# mesh
Live code collaboration tool written in Next.js and Golang.  Using for self learning!

## Implementation Status

### 1. Define the Core Scope & Setup
- [x] Set up repository with basic project structure
- [x] Define data models for users, sessions, and messages
- [x] Set up Golang backend with database connection (PostgreSQL)
- [x] Set up Next.js frontend structure
- [ ] Complete API contracts and documentation
- [ ] Set up CI/CD pipeline

### 2. User Authentication & Management
- [x] Implement user signup with UUID generation
- [x] Implement user login with JWT authentication
- [x] Add password hashing and security
- [ ] Add user profile management
- [ ] Implement refresh tokens for improved security
- [ ] Add email verification

### 3. Session Management
- [x] Set up session model in the database
- [ ] Implement API for creating collaborative sessions
- [ ] Implement API for joining sessions
- [ ] Implement session permissions and access control

### 4. Real-Time Collaborative Code Editor
- [ ] Integrate code editor component in the frontend
- [ ] Set up WebSocket server for real-time collaboration
- [ ] Implement synchronization algorithm (OT or CRDT)
- [ ] Add syntax highlighting and language support
- [ ] Implement live cursor indicators

### 5. Remote Debugging Integration
- [ ] Set up containerized code execution environment
- [ ] Implement debugger proxy
- [ ] Create debugging controls UI
- [ ] Enable setting breakpoints and stepping through code
- [ ] Implement variable state inspection

### 6. Communication Features
- [ ] Add real-time chat within sessions
- [ ] Implement collaborative annotations
- [ ] Set up voice/video chat (optional)

### 7. Testing & Deployment
- [ ] Implement automated tests
- [ ] Set up staging environment
- [ ] Optimize performance
- [ ] Documentation and user guides

# rough outline 


### 1. Define the Core Scope & Setup
- **Architecture & Tooling:**
  - Set up repository, CI/CD, and basic project structure (Golang backend and Next.js frontend).
  - Define data models, session management, and API contracts.
- **Environment Setup:**
  - Prepare development environments for container orchestration and local testing.

### 2. Build the Real-Time Collaborative Code Editor
- **Frontend (Next.js):**
  - Integrate a robust code editor component (e.g., Monaco or CodeMirror).
  - Implement the basic UI for editing, including syntax highlighting and live cursor indicators.
- **Backend (Golang):**
  - Set up a WebSocket server for real-time collaboration.
  - Implement a basic synchronization algorithm (using OT or CRDT) to handle concurrent editing.

### 3. Implement User Session & Authentication Management
- **Authentication:**
  - Add basic user authentication (e.g., using JWT) to manage user access.
- **Session Handling:**
  - Build APIs for creating, joining, and leaving collaboration sessions.

### 4. Develop Basic Remote Debugging Integration
- **Containerized Code Execution:**
  - Integrate container orchestration (using Docker APIs with Golang) to run code in an isolated container.
- **Debugger Proxy:**
  - Implement a connection to a remote debugger (e.g., using Go's Delve) to allow setting breakpoints and stepping through code.
- **Frontend Debugger UI:**
  - Create a minimal UI for debugging controls (set breakpoints, step through code, inspect variable states).

### 5. Integrate Real-Time Communication Enhancements (Optional MVP Extras)
- **Advanced Collaboration Features:**
  - Add live annotations such as collaborative cursors and inline comments.
- **Voice/Video Chat Integration:**
  - Experiment with adding voice/video functionality using a WebRTC-based solution (this can be deferred until core features are stable).

### 6. MVP Testing, Feedback, and Iteration
- **Testing:**
  - Perform real-world testing with multiple users to stress test real-time synchronization and debugging.
- **Deployment:**
  - Set up a staging environment for user testing.
  - Iterate based on feedback and performance tuning.

---


# basic mvp structure
```
             ┌──────────────────────────────────────────────────┐
             │         Next.js Frontend (Code Editor UI)        │
             │  - Code Editor (Monaco/CodeMirror)               │
             │  - Debugging Controls (breakpoints, stepping)    │
             │  - Real-time UI updates (WebSocket client)       │
             └─────────────┬────────────────────────────────────┘
                           │ REST API / WebSockets
                           ▼
            ┌─────────────────────────────────────────────┐
            │           Golang Backend API              │
            │ - User Auth & Session Management          │
            │ - Real-time sync (CRDT/OT logic over WS)    │
            │ - Debugger Proxy & Container Manager      │
            └─────────────┬───────────────────────────────┘
                           │
                           │ Container Orchestration API
                           ▼
              ┌────────────────────────────────────────┐
              │  Containerized Runtime Environment     │
              │ - Ephemeral code execution (Docker)    │
              │ - Remote debugger attached (e.g., Delve) │
              └────────────────────────────────────────┘
```