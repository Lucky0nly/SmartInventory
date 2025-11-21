#include <iostream>
#include <vector>
#include <string>
#include <iomanip>
#include <algorithm>

using namespace std;

// ==========================================
// 1. DATA MODELS
// ==========================================

// Structure for items inside a bill
struct BillItem {
    string productName;
    double price;
    int qty;
};

// Class representing a Bill/Invoice
class Bill {
private:
    int id;
    double total;
    string date;
    vector<BillItem> items;

public:
    Bill(int b_id, double b_total, string b_date, vector<BillItem> b_items) {
        id = b_id;
        total = b_total;
        date = b_date;
        items = b_items;
    }

    void displayAsJSON() {
        cout << "  { \"id\": " << id << ", \"total\": " << total << ", \"date\": \"" << date << "\", \"items\": [";
        for (size_t i = 0; i < items.size(); i++) {
            cout << "{\"name\": \"" << items[i].productName << "\", \"qty\": " << items[i].qty << "}";
            if (i < items.size() - 1) cout << ", ";
        }
        cout << "] }" << endl;
    }
};

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

    int getId() const { return id; }
    string getName() const { return name; }
    double getPrice() const { return price; }
    int getStock() const { return stock; }
    
    void setStock(int qty) { stock = qty; }

    void displayAsJSON() {
        cout << "  { \"id\": " << id << ", \"name\": \"" << name << "\", \"price\": " << price 
             << ", \"stock\": " << stock << " }" << endl;
    }
};

// ==========================================
// 2. SERVICE LAYER (Business Logic)
// ==========================================
class InventoryService {
private:
    vector<Product> products;
    vector<Bill> salesHistory; // Stores all past bills

public:
    void seedData() {
        products.push_back(Product(1, "Pastel Notebook", 12.50, 45, "Stationery"));
        products.push_back(Product(2, "Gel Pen Set", 8.00, 12, "Stationery"));
        products.push_back(Product(3, "Desk Lamp", 35.00, 8, "Electronics"));
        products.push_back(Product(4, "Ceramic Mug", 15.00, 24, "Home"));
        products.push_back(Product(5, "Planner 2025", 22.00, 5, "Stationery"));
    }

    vector<Product>& getAllProducts() {
        return products;
    }

    vector<Bill>& getSalesHistory() {
        return salesHistory;
    }

    Product* getProductById(int id) {
        for (auto &p : products) {
            if (p.getId() == id) return &p;
        }
        return nullptr;
    }

    void addBill(Bill b) {
        salesHistory.push_back(b);
    }
};

// ==========================================
// 3. CONTROLLER (API Simulation)
// ==========================================
class InventoryController {
private:
    InventoryService* service;

public:
    InventoryController(InventoryService* s) : service(s) {}

    // GET /api/inventory
    void getInventory() {
        cout << "\n[API RESPONSE] JSON Data:" << endl;
        cout << "[" << endl;
        vector<Product>& list = service->getAllProducts();
        for (size_t i = 0; i < list.size(); i++) {
            list[i].displayAsJSON();
            if (i < list.size() - 1) cout << "," << endl;
        }
        cout << "]" << endl;
    }

    // GET /api/bills (New Endpoint)
    void getBills() {
        cout << "\n[API RESPONSE] Sales History JSON:" << endl;
        cout << "[" << endl;
        vector<Bill>& list = service->getSalesHistory();
        for (size_t i = 0; i < list.size(); i++) {
            list[i].displayAsJSON();
            if (i < list.size() - 1) cout << "," << endl;
        }
        cout << "]" << endl;
    }

    // POST /api/pay (Simulated Payment Process)
    // Takes bill ID, total amount, and a vector of pairs {Product ID, Quantity}
    void processPayment(int billId, double total, vector<pair<int, int>> cartItems) {
        cout << "\n[API REQUEST] Processing Payment for Bill #" << billId << "..." << endl;
        
        vector<BillItem> billItems;
        bool stockError = false;

        // 1. Check and Update Stock
        for (auto item : cartItems) {
            int pId = item.first;
            int qty = item.second;
            
            Product* p = service->getProductById(pId);
            if (p && p->getStock() >= qty) {
                p->setStock(p->getStock() - qty);
                // Add to bill record
                billItems.push_back({p->getName(), p->getPrice(), qty});
            } else {
                stockError = true;
                cout << "[API ERROR] Stock mismatch for Product ID: " << pId << endl;
            }
        }

        // 2. Save Bill if no errors
        if (!stockError) {
            // In a real app, date would be auto-generated
            Bill newBill(billId, total, "2023-11-21", billItems);
            service->addBill(newBill);
            cout << "[API SUCCESS] Payment Processed. Bill Saved." << endl;
        } else {
            cout << "[API FAILED] Transaction cancelled due to stock issues." << endl;
        }
    }
};

// ==========================================
// MAIN
// ==========================================
int main() {
    InventoryService service;
    service.seedData();
    InventoryController api(&service);

    cout << "=== C++ BACKEND SERVER (UPDATED) ===" << endl;
    
    // Simulate User Journey
    
    // 1. Load Inventory
    api.getInventory();

    // 2. User creates a bill (ID 1001) with 2 items
    // Buying: ID 1 (2 qty), ID 3 (1 qty)
    vector<pair<int, int>> cart = {{1, 2}, {3, 1}};
    api.processPayment(1001, 60.00, cart);

    // 3. User creates another bill (ID 1002)
    // Buying: ID 2 (5 qty)
    vector<pair<int, int>> cart2 = {{2, 5}};
    api.processPayment(1002, 40.00, cart2);

    // 4. Admin views bill history (The "View Bills" page)
    cout << "\n>>> ADMIN REQUEST: View Bill History" << endl;
    api.getBills();

    return 0;
}