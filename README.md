# SmartInventory

[![License: MIT](https://img.shields.io/badge/License-MIT-0ea5e9?style=flat-square)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-10b981?style=flat-square)](https://github.com/Lucky0nly/SmartInventory)
![JavaScript](https://img.shields.io/badge/JavaScript-84.9%25-f1e05a?style=flat-square)
![C++](https://img.shields.io/badge/C%2B%2B-14.4%25-00599c?style=flat-square)

**A full-stack inventory management system with role-based access control, real-time stock tracking, and secure transaction processing.**

---

## Overview

SmartInventory is an enterprise-grade inventory management solution featuring a high-performance C++ backend with OOP design patterns and a modern JavaScript frontend. It supports multi-user workflows with granular permission controls, automated billing, and comprehensive sales analytics.

---

## Features

- **Role-Based Access Control** — Admin, Cashier, and User hierarchies with permission validation
- **Real-Time Stock Management** — Track inventory across multiple product categories
- **Transaction Processing** — Secure payment handling with automatic bill generation
- **JSON API Responses** — RESTful backend with structured data serialization
- **Multi-Category Products** — Organize items by Stationery, Electronics, Home, Clothing, and Food
- **Sales History Tracking** — Complete audit trail with timestamps and itemization
- **Stock Validation** — Prevent overselling with real-time inventory verification
- **User Polymorphism** — Extensible user hierarchy for future role additions

---

## Tech Stack

| Component | Technology |
|-----------|-------------|
| **Backend** | C++ (OOP, Inheritance, Polymorphism, Encapsulation) |
| **Frontend** | JavaScript, HTML5, CSS3 |
| **API Format** | JSON |
| **Build** | webpack, npm |

---

## Installation

### Prerequisites
```bash
# C++ Compiler (g++, clang, or MSVC)
g++ --version

# Node.js & npm
node --version
npm --version
```

### Backend Setup
```bash
# Compile backend
g++ -std=c++17 -o InventoryBackend InventoryBackend.cpp

# Run server
./InventoryBackend
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

---

## Usage

### Initialize System
```cpp
InventoryService service;
service.seedData();
InventoryController api(&service);
```

### Retrieve Inventory
```cpp
api.getInventory();
```

### Process Payment
```cpp
vector<pair<int, int>> cart = {{1, 2}, {3, 1}};
api.processPayment(1001, 60.00, cart);
```

### Check User Permissions
```cpp
User* currentUser = new Admin("supervisor");
if (currentUser->canViewReports()) {
    api.getBills();
}
```

### API Response Example
```json
[
  {
    "id": 1,
    "name": "Pastel Notebook",
    "price": 12.50,
    "stock": 45
  },
  {
    "id": 3,
    "name": "Desk Lamp",
    "price": 35.00,
    "stock": 8
  }
]
```

---

## Directory Structure

```
SmartInventory/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.js
│   ├── package.json
│   └── README.md
├── InventoryBackend.cpp
├── InventoryBackend.exe
├── .gitattributes
├── README.md
└── LICENSE
```

---

## Roadmap

- [x] Core backend with OOP architecture
- [x] User role system with polymorphism
- [x] Transaction processing engine
- [x] Real-time stock validation
- [ ] Complete frontend dashboard
- [ ] Database integration (MySQL/PostgreSQL)
- [ ] Advanced analytics & reports
- [ ] Multi-store support
- [ ] Mobile application (React Native)
- [ ] Barcode scanning integration
- [ ] Low-stock alert system
- [ ] PDF/CSV export functionality

---

## Contributing

We welcome contributions! Please follow this workflow:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/enhancement`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature/enhancement`
5. Submit a Pull Request

**Guidelines:**
- Follow OOP principles in C++ code
- Maintain clean, readable code structure
- Include comments for complex logic
- Test transactions thoroughly

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Author

**Lucky0nly**

- GitHub: [@Lucky0nly](https://github.com/Lucky0nly)
- Project: [SmartInventory](https://github.com/Lucky0nly/SmartInventory)

---

<div align="center">
  
**Built with dedication for modern inventory management**

</div>
