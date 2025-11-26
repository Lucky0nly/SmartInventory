#include <iostream>
#include <vector>
#include <string>
#include <iomanip>
#include <algorithm>

using namespace std;


// [NEW] 0. USER HIERARCHY (OOP: Inheritance & Polymorphism)


// Base Class
class User {
protected:
    string username;
public:
    User(string u) : username(u) {}// When creating a User object, store the given string into the username variable.

    // Virtual Function (Polymorphism)
    virtual void showRole() {
        cout << "User: " << username << " (Generic Role)" << endl;
    }

    // Virtual Function to check permissions
    virtual bool canViewReports() {
        return false; // Default: No access
    }
};

// Derived Class 1 (Inheritance)
class Admin : public User {
public:
    Admin(string u) : User(u) {}

    // Overriding Base Method
    void showRole() override {
        cout << "User: " << username << " [ADMIN] - Full Access granted." << endl;
    }

    bool canViewReports() override {
        return true; // Admins can view reports
    }
};

// Derived Class 2 (Inheritance)
class Cashier : public User {
public:
    Cashier(string u) : User(u) {}

    // Overriding Base Method
    void showRole() override {
        cout << "User: " << username << " [CASHIER] - Limited Access (Billing Only)." << endl;
    }
};

// ==========================================
// 1. DATA MODELS (OOP: Encapsulation & Composition)
// ==========================================

struct BillItem {
    string productName;
    double price;
    int qty;
};

class Bill {
private:
    int id;
    double total;
    string date;
    vector<BillItem> items; // Composition

public:
    Bill(int b_id, double b_total, string b_date, vector<BillItem> b_items) {
        id = b_id;
        total = b_total;
        date = b_date;
        items = b_items;
    }

    void displayAsJSON() {
        cout << "  { \"id\": " << id << ", \"total\": " << total << ", \"date\": \"" << date << "\", \"items\": [";
        for (size_t i = 0; i < items.size(); i++) {   // size_t = an unsigned integer type used for sizes and indexing.It is the standard type returned by vector.size()
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
// 2. SERVICE LAYER (OOP: Abstraction)
// ==========================================
class InventoryService {
private:
    vector<Product> products;  //stores all product objects
    vector<Bill> salesHistory; //stores all bills (sales invoices)

public:
    void seedData() {   //Pre-load fake data
        products.push_back(Product(1, "Pastel Notebook", 12.50, 45, "Stationery"));
        products.push_back(Product(2, "Gel Pen Set", 8.00, 12, "Stationery"));
        products.push_back(Product(3, "Desk Lamp", 35.00, 8, "Electronics"));
        products.push_back(Product(4, "Ceramic Mug", 15.00, 24, "Home"));
        products.push_back(Product(5, "Planner 2025", 22.00, 5, "Stationery"));
        products.push_back(Product(6, "Cotton T-Shirt", 18.00, 30, "Cloths"));
        products.push_back(Product(7, "Energy Bar", 3.50, 60, "Food"));
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

    void addBill(Bill b) {  //Adds a bill object to sales history.
        salesHistory.push_back(b);
    }
};

// ==========================================
// 3. CONTROLLER
// ==========================================
class InventoryController {
private:
    InventoryService* service;

public:
    InventoryController(InventoryService* s) : service(s) {}

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

    void processPayment(int billId, double total, vector<pair<int, int>> cartItems) {
        cout << "\n[API REQUEST] Processing Payment for Bill #" << billId << "..." << endl;
        
        vector<BillItem> billItems;
        bool stockError = false;

        for (auto item : cartItems) {
            int pId = item.first;
            int qty = item.second;
            
            Product* p = service->getProductById(pId);
            if (p && p->getStock() >= qty) {
                p->setStock(p->getStock() - qty);
                billItems.push_back({p->getName(), p->getPrice(), qty});
            } else {
                stockError = true;
                cout << "[API ERROR] Stock mismatch for Product ID: " << pId << endl;
            }
        }

        if (!stockError) {
            Bill newBill(billId, total, "2023-11-21", billItems);
            service->addBill(newBill);
            cout << "[API SUCCESS] Payment Processed. Bill Saved." << endl;
        } else {
            cout << "[API FAILED] Transaction cancelled due to stock issues." << endl;
        }
    }
};


// MAIN EXECUTION

int main() {
    InventoryService service;
    service.seedData();
    InventoryController api(&service);

    cout << "=== C++ BACKEND SERVER (OOP: POLYMORPHISM ENABLED) ===" << endl;
    
    // 1. Demonstration of Polymorphism
    // Using Base Class Pointer to hold Derived Class Objects
    User* currentUser;
    
    // Scenario A: Admin Login
    currentUser = new Admin("Lucky");
    currentUser->showRole(); // Calls Admin's showRole() -> POLYMORPHISM
    
    api.getInventory(); // Anyone can view inventory

    // Scenario B: Cashier Login (Simulated)
    delete currentUser;
    currentUser = new Cashier("Bob");
    currentUser->showRole(); // Calls Cashier's showRole() -> POLYMORPHISM

    // 2. Process Transactions
    vector<pair<int, int>> cart = {{1, 2}, {3, 1}};
    api.processPayment(1001, 60.00, cart);

    // 3. Check Permissions using Inheritance/Polymorphism logic
    cout << "\n>>> CHECKING PERMISSIONS FOR CURRENT USER (" << "Bob" << ")..." << endl;
    if (currentUser->canViewReports()) {
        api.getBills();
    } else {
        cout << "[ACCESS DENIED] Current user cannot view global bill history." << endl;
    }

    // 4. Switch back to Admin to view reports
    delete currentUser;
    currentUser = new Admin("SuperAdmin");
    cout << "\n>>> SWITCHED USER: SuperAdmin" << endl;
    if (currentUser->canViewReports()) {
        cout << ">>> ADMIN REQUEST: View Bill History" << endl;
        api.getBills();
    }

    return 0;
}