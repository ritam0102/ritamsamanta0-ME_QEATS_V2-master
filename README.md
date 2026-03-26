## 🚀 Features

- 🍽️ Browse restaurants based on location
- 🔍 Search restaurants by name and attributes
- 📦 Order food from nearby restaurants
- ⏱️ Calculate delivery time dynamically
- ⭐ Filter restaurants by rating, price, and cuisine
- 🌐 REST APIs with proper request/response handling

---

## 🛠️ Tech Stack

- **Backend:** Java, Spring Boot
- **Database:** MongoDB
- **Build Tool:** Gradle
- **Testing:** JUnit, Mockito
- **API:** RESTful Web Services
- **Other:** Jackson, Lombok

---

## 🏗️ Project Architecture

Controller → Service → Repository → Database

- **Controller Layer:** Handles HTTP requests
- **Service Layer:** Business logic and processing
- **Repository Layer:** Database interaction
- **DTOs:** Data transfer between layers

---

## ⚙️ Getting Started

### Prerequisites

- Java 8+
- Gradle
- MongoDB

---

### 🔧 Installation

```bash
# Clone the repository
git clone https://github.com/ritam0102/ritamsamanta0-ME_QEATS_V2-master.git

# Navigate to project
cd ritamsamanta0-ME_QEATS_V2-master

# Build the project
./gradlew build

# Run the application
./gradlew bootRun
```

---

## 📌 API Endpoints

### 🔍 Get Restaurants by Location
GET /qeats/v1/restaurants?latitude={lat}&longitude={lon}

### 🍔 Place Order
POST /qeats/v1/orders

### 🔎 Search Restaurants
GET /qeats/v1/restaurants/search?query={name}

---

## 🧪 Running Tests

```bash
./gradlew test
```

---

## 📊 Key Learnings

- Built scalable REST APIs using Spring Boot
- Implemented layered architecture for clean code
- Integrated MongoDB for efficient data handling
- Optimized backend performance for real-time queries
- Wrote unit and integration tests

---

## 👨‍💻 Author

**Ritam Samanta**

- GitHub: https://github.com/ritam0102
