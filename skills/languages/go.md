---
description: Go idioms, concurrency patterns, and best practices
category: languages
auto_load:
  - when: "go.mod"
    in: ["files"]
  - when: "go.sum"
    in: ["files"]
related_skills:
  - architecture/microservices.md
---

# Go

Idioms, patterns, and best practices for Go development.

---

## Core Principles

| Principle | Description |
|-----------|-------------|
| **Simplicity** | Straightforward, readable code |
| **Explicit** | No magic, clear intent |
| **Composition** | Favor composition over inheritance |
| **Errors are values** | Handle errors explicitly |

---

## Error Handling

### Explicit Error Returns

```go
// ✅ Good: Return errors explicitly
func GetUser(id string) (*User, error) {
    user, err := db.FindUser(id)
    if err != nil {
        return nil, fmt.Errorf("get user %s: %w", id, err)
    }
    return user, nil
}

// Usage
user, err := GetUser("123")
if err != nil {
    log.Printf("failed to get user: %v", err)
    return
}
```

### Custom Errors

```go
// Sentinel errors
var ErrNotFound = errors.New("not found")
var ErrUnauthorized = errors.New("unauthorized")

// Error types
type ValidationError struct {
    Field   string
    Message string
}

func (e *ValidationError) Error() string {
    return fmt.Sprintf("%s: %s", e.Field, e.Message)
}

// Wrapping for context
if err != nil {
    return fmt.Errorf("save order: %w", err)
}

// Checking wrapped errors
if errors.Is(err, ErrNotFound) {
    // Handle not found
}
```

---

## Interfaces

### Small Interfaces

```go
// ✅ Good: Single-method interfaces
type Reader interface {
    Read(p []byte) (n int, err error)
}

type Writer interface {
    Write(p []byte) (n int, err error)
}

// Compose when needed
type ReadWriter interface {
    Reader
    Writer
}
```

### Accept Interfaces, Return Structs

```go
// ✅ Good: Accept interface
func ProcessData(r io.Reader) error {
    data, err := io.ReadAll(r)
    // ...
}

// ✅ Good: Return concrete type
func NewUserService(db *sql.DB) *UserService {
    return &UserService{db: db}
}
```

---

## Concurrency

### Goroutines and Channels

```go
// ✅ Good: Use channels for communication
func fetchAll(urls []string) []Result {
    results := make(chan Result, len(urls))
    
    for _, url := range urls {
        go func(u string) {
            data, err := fetch(u)
            results <- Result{URL: u, Data: data, Err: err}
        }(url)  // Pass variable to avoid closure issue
    }
    
    var out []Result
    for range urls {
        out = append(out, <-results)
    }
    return out
}
```

### Context for Cancellation

```go
func ProcessWithTimeout(ctx context.Context) error {
    ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
    defer cancel()
    
    select {
    case result := <-doWork(ctx):
        return result
    case <-ctx.Done():
        return ctx.Err()  // context.DeadlineExceeded
    }
}
```

### Worker Pool

```go
func workerPool(jobs <-chan Job, results chan<- Result, workers int) {
    var wg sync.WaitGroup
    
    for i := 0; i < workers; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            for job := range jobs {
                results <- process(job)
            }
        }()
    }
    
    wg.Wait()
    close(results)
}
```

---

## Structs and Methods

### Constructor Functions

```go
// ✅ Good: NewXxx constructor
func NewServer(addr string, opts ...Option) *Server {
    s := &Server{
        addr:    addr,
        timeout: 30 * time.Second,  // Default
    }
    for _, opt := range opts {
        opt(s)
    }
    return s
}

// Functional options
type Option func(*Server)

func WithTimeout(d time.Duration) Option {
    return func(s *Server) {
        s.timeout = d
    }
}
```

### Method Receivers

```go
// Value receiver: doesn't modify, small structs
func (u User) FullName() string {
    return u.FirstName + " " + u.LastName
}

// Pointer receiver: modifies state, large structs
func (u *User) SetEmail(email string) {
    u.Email = email
}
```

---

## Project Structure

```
myapp/
├── cmd/
│   └── myapp/
│       └── main.go         # Entry point
├── internal/               # Private packages
│   ├── handler/
│   ├── service/
│   └── repository/
├── pkg/                    # Public packages
├── go.mod
└── go.sum
```

---

## Testing

```go
func TestAdd(t *testing.T) {
    got := Add(2, 3)
    want := 5
    if got != want {
        t.Errorf("Add(2, 3) = %d; want %d", got, want)
    }
}

// Table-driven tests
func TestCalculate(t *testing.T) {
    tests := []struct {
        name string
        a, b int
        want int
    }{
        {"positive", 2, 3, 5},
        {"negative", -1, 1, 0},
        {"zero", 0, 0, 0},
    }
    
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            got := Calculate(tt.a, tt.b)
            if got != tt.want {
                t.Errorf("got %d, want %d", got, tt.want)
            }
        })
    }
}
```

---

## Anti-patterns

| Anti-pattern | Problem | Better Approach |
|--------------|---------|-----------------|
| Ignoring errors | Hidden bugs | Handle or return |
| Naked returns | Unclear code | Named returns only |
| Large interfaces | Hard to implement | Small interfaces |
| init() abuse | Hidden side effects | Explicit init |
| Global state | Testing difficulty | Dependency injection |

---

## References

- [Effective Go](https://go.dev/doc/effective_go)
- [Go Code Review Comments](https://github.com/golang/go/wiki/CodeReviewComments)
- [Standard Go Project Layout](https://github.com/golang-standards/project-layout)
