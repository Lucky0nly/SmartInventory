#include <iostream>
#include <vector>
#include <string>
#include <iomanip>
#include <algorithm>

using namespace std;

// ==========================================
// 1. DATA MODEL (The "M" in MVC)
// ==========================================
class Product {
private:
    int id;
    string name;
    double price;
    int stock;
    string category;

public:
    Product(int p_id, string p_name, double p_price, int p_stock, string p_cat) {
        id = p_id;
        name = p_name;
        price = p_price;
        stock = p_stock;
        category = p_cat;
    }

    // --- GETTERS (for API responses) ---
    int getId() const { return id; }
    string getName() const { return name; }
    double getPrice() const { return price; }
    int getStock() const { return stock; }
    string getCategory() const { return category; }

    // --- SETTERS (for API updates) ---
    void setStock(int qty) { stock = qty; }
    void setPrice(double p) { price = p; }

    // --- DISPLAY (JSON Simulation) ---
    void displayAsJSON() {
        cout << "{ \"id\": " << id << ", \"name\": \"" << name << "\", \"price\": " << price 
             << ", \"stock\": " << stock << " }" << endl;
    }
};

// ==========================================
// 2. SERVICE LAYER (Business Logic)
// ==========================================
class InventoryService {
private:
    vector<Product> products;

public:
    void seedData() {
        products.push_back(Product(1, "Pastel Notebook", 12.50, 45, "Stationery"));
        products.push_back(Product(2, "Gel Pen Set", 8.00, 12, "Stationery"));
        products.push_back(Product(3, "Desk Lamp", 35.00, 8, "Electronics"));
    }

    vector<Product>& getAllProducts() {
        return products;
    }

    Product* getProductById(int id) {
        for (auto &p : products) {
            if (p.getId() == id) return &p;
        }
        return nullptr;
    }

    void addProduct(Product p) {
        products.push_back(p);
    }
};

// ==========================================
// 3. MAIN CLASS: INVENTORY CONTROLLER 
// (The "API" that connects to Frontend)
// ==========================================
class InventoryController {
private:
    InventoryService* service; // Pointer to logic layer

public:
    InventoryController(InventoryService* s) : service(s) {}

    // --- GET METHOD (Connected to GET /api/inventory) ---
    void getInventory() {
        cout << "\n[API RESPONSE] Sending Inventory Data to Frontend..." << endl;
        cout << "[" << endl;
        vector<Product>& list = service->getAllProducts();
        for (size_t i = 0; i < list.size(); i++) {
            list[i].displayAsJSON();
            if (i < list.size() - 1) cout << "," << endl;
        }
        cout << "]" << endl;
    }

    // --- SET METHOD (Connected to POST /api/buy) ---
    void setStockUpdate(int id, int qtyBought) {
        cout << "\n[API REQUEST] Received Update Request for ID: " << id << endl;
        Product* p = service->getProductById(id);
        
        if (p != nullptr) {
            if (p->getStock() >= qtyBought) {
                int newStock = p->getStock() - qtyBought;
                p->setStock(newStock);
                cout << "[API SUCCESS] Stock updated. New Stock: " << newStock << endl;
            } else {
                cout << "[API ERROR] Insufficient Stock." << endl;
            }
        } else {
            cout << "[API ERROR] Product not found." << endl;
        }
    }

    // --- DISPLAY METHOD (Connected to Dashboard View) ---
    void displayDashboardStats() {
        vector<Product>& list = service->getAllProducts();
        double totalValue = 0;
        int lowStockCount = 0;

        for (auto &p : list) {
            totalValue += (p.getPrice() * p.getStock());
            if (p.getStock() < 10) lowStockCount++;
        }

        cout << "\n[API RESPONSE] Dashboard Stats:" << endl;
        cout << "{ \"total_value\": " << totalValue << ", \"low_stock_alerts\": " << lowStockCount << " }" << endl;
    }
};

// ==========================================
// MAIN EXECUTION
// ==========================================
int main() {
    // 1. Initialize System
    InventoryService service;
    service.seedData();

    // 2. Initialize Controller (The interface)
    InventoryController api(&service);

    cout << "=== C++ BACKEND SERVER RUNNING ===" << endl;
    cout << "Waiting for Frontend Requests...\n" << endl;

    // 3. Simulate Frontend Interactions
    
    // SCENARIO 1: Frontend loads Dashboard
    // Frontend calls: GET /api/dashboard
    cout << ">>> REQUEST: Frontend asks for Dashboard Stats" << endl;
    api.displayDashboardStats();

    // SCENARIO 2: Frontend loads Inventory Table
    // Frontend calls: GET /api/inventory
    cout << "\n>>> REQUEST: Frontend asks for Product List" << endl;
    api.getInventory();

    // SCENARIO 3: User buys 2 Notebooks (ID 1)
    // Frontend calls: POST /api/buy { id: 1, qty: 2 }
    cout << "\n>>> REQUEST: Frontend sends Buy Order (ID: 1, Qty: 2)" << endl;
    api.setStockUpdate(1, 2);

    return 0;
}