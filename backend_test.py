import requests
import sys
import json
from datetime import datetime
from base64 import b64encode

class MonoAurelAPITester:
    def __init__(self, base_url="https://aurel-preview.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.admin_auth = None
        self.test_results = []
        self.setup_admin_auth()

    def setup_admin_auth(self):
        """Setup basic auth for admin endpoints"""
        credentials = b64encode(b"admin:monoaurel2025").decode("ascii")
        self.admin_auth = {"Authorization": f"Basic {credentials}"}

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None, auth=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        test_headers = {'Content-Type': 'application/json'}
        
        if headers:
            test_headers.update(headers)
        if auth:
            test_headers.update(auth)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                result = {"status": "PASS", "expected": expected_status, "actual": response.status_code}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                result = {"status": "FAIL", "expected": expected_status, "actual": response.status_code}

            try:
                response_data = response.json() if response.content else {}
            except:
                response_data = {"raw": response.text}

            self.test_results.append({
                "test_name": name,
                "endpoint": endpoint,
                "method": method,
                "result": result,
                "response_preview": str(response_data)[:200] + "..." if len(str(response_data)) > 200 else str(response_data)
            })

            return success, response_data

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.test_results.append({
                "test_name": name,
                "endpoint": endpoint,
                "method": method,
                "result": {"status": "ERROR", "error": str(e)},
                "response_preview": ""
            })
            return False, {}

    def test_health_endpoints(self):
        """Test basic health and root endpoints"""
        print("\n=== TESTING HEALTH ENDPOINTS ===")
        self.run_test("API Root", "GET", "/", 200)
        self.run_test("Health Check", "GET", "/health", 200)

    def test_products_endpoints(self):
        """Test product-related endpoints"""
        print("\n=== TESTING PRODUCT ENDPOINTS ===")
        
        # Get all products
        success, products = self.run_test("Get All Products", "GET", "/products", 200)
        
        if success and products:
            product_id = products[0]['id'] if products else None
            product_handle = products[0]['handle'] if products else None
            
            if product_id:
                # Get specific product by ID
                self.run_test("Get Product by ID", "GET", f"/products/{product_id}", 200)
            
            if product_handle:
                # Get product by handle
                self.run_test("Get Product by Handle", "GET", f"/products/handle/{product_handle}", 200)
        
        # Test with collection filter
        self.run_test("Get Products with Collection Filter", "GET", "/products?collection=test", 200)

    def test_collections_endpoints(self):
        """Test collection-related endpoints"""
        print("\n=== TESTING COLLECTION ENDPOINTS ===")
        
        # Get all collections
        success, collections = self.run_test("Get All Collections", "GET", "/collections", 200)
        
        if success and collections:
            collection_id = collections[0]['id'] if collections else None
            
            if collection_id:
                # Get specific collection by ID
                self.run_test("Get Collection by ID", "GET", f"/collections/{collection_id}", 200)

    def test_quote_endpoints(self):
        """Test quote request endpoints"""
        print("\n=== TESTING QUOTE ENDPOINTS ===")
        
        # Create a quote request
        quote_data = {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "1234567890",
            "category": "sculpture",
            "message": "Test quote request message",
            "budget_range": "5000-15000",
            "preferred_contact": "email"
        }
        success, quote = self.run_test("Create Quote Request", "POST", "/quotes", 200, quote_data)
        
        # Get quotes (admin only)
        self.run_test("Get All Quotes (Admin)", "GET", "/admin/quotes", 200, auth=self.admin_auth)
        
        # Test updating quote status
        if success and quote.get('id'):
            quote_id = quote['id']
            self.run_test("Update Quote Status", "PUT", f"/admin/quotes/{quote_id}/status?status=contacted", 200, auth=self.admin_auth)

    def test_marquee_endpoints(self):
        """Test marquee order endpoints"""
        print("\n=== TESTING MARQUEE ORDER ENDPOINTS ===")
        
        # Create a marquee order
        marquee_data = {
            "text": "TEST",
            "size": "large",
            "material": "metal",
            "light_type": "LED",
            "color": "white",
            "purpose": "event",
            "delivery_date": "2025-02-01",
            "name": "Test User",
            "email": "test@example.com",
            "phone": "1234567890"
        }
        success, order = self.run_test("Create Marquee Order", "POST", "/marquee-orders", 200, marquee_data)
        
        # Get marquee orders (admin only)
        self.run_test("Get All Marquee Orders (Admin)", "GET", "/admin/marquee-orders", 200, auth=self.admin_auth)

    def test_newsletter_endpoints(self):
        """Test newsletter subscription endpoints"""
        print("\n=== TESTING NEWSLETTER ENDPOINTS ===")
        
        # Subscribe to newsletter
        test_email = f"test_{int(datetime.now().timestamp())}@example.com"
        self.run_test("Newsletter Subscription", "POST", f"/newsletter?email={test_email}", 200)
        
        # Try duplicate subscription
        self.run_test("Duplicate Newsletter Subscription", "POST", f"/newsletter?email={test_email}", 400)

    def test_blog_endpoints(self):
        """Test blog-related endpoints"""
        print("\n=== TESTING BLOG ENDPOINTS ===")
        
        # Get all blog posts
        self.run_test("Get All Blog Posts", "GET", "/blog", 200)
        
        # Get blog posts by category
        self.run_test("Get Blog Posts by Category", "GET", "/blog?category=art", 200)

    def test_admin_product_management(self):
        """Test admin product management endpoints"""
        print("\n=== TESTING ADMIN PRODUCT MANAGEMENT ===")
        
        # Seed data first
        self.run_test("Seed Database", "POST", "/admin/seed", 200, auth=self.admin_auth)
        
        # Create new product
        product_data = {
            "title": "Test Product",
            "title_tr": "Test Ürünü",
            "description": "A test product for API testing",
            "description_tr": "API testi için test ürünü",
            "product_type": "sculpture",
            "price": 1000.00,
            "stock_status": "in_stock",
            "materials": ["Test Material"],
            "dimensions": "10cm x 10cm",
            "weight": "1kg",
            "custom_available": True
        }
        success, product = self.run_test("Create Product (Admin)", "POST", "/admin/products", 200, product_data, auth=self.admin_auth)
        
        if success and product.get('id'):
            product_id = product['id']
            
            # Update product
            updated_data = {**product_data, "title": "Updated Test Product", "price": 1500.00}
            self.run_test("Update Product (Admin)", "PUT", f"/admin/products/{product_id}", 200, updated_data, auth=self.admin_auth)
            
            # Delete product
            self.run_test("Delete Product (Admin)", "DELETE", f"/admin/products/{product_id}", 200, auth=self.admin_auth)

    def test_admin_collection_management(self):
        """Test admin collection management endpoints"""
        print("\n=== TESTING ADMIN COLLECTION MANAGEMENT ===")
        
        # Create new collection
        collection_data = {
            "title": "Test Collection",
            "title_tr": "Test Koleksiyonu",
            "description": "A test collection for API testing",
            "description_tr": "API testi için test koleksiyonu",
            "sort_order": 10
        }
        success, collection = self.run_test("Create Collection (Admin)", "POST", "/admin/collections", 200, collection_data, auth=self.admin_auth)
        
        if success and collection.get('id'):
            collection_id = collection['id']
            
            # Update collection
            updated_data = {**collection_data, "title": "Updated Test Collection"}
            self.run_test("Update Collection (Admin)", "PUT", f"/admin/collections/{collection_id}", 200, updated_data, auth=self.admin_auth)
            
            # Delete collection
            self.run_test("Delete Collection (Admin)", "DELETE", f"/admin/collections/{collection_id}", 200, auth=self.admin_auth)

    def test_stripe_checkout_endpoints(self):
        """Test Stripe checkout endpoints (demo mode)"""
        print("\n=== TESTING STRIPE CHECKOUT ENDPOINTS ===")
        
        # Create checkout session
        checkout_data = {
            "items": [
                {
                    "product_id": "test-product",
                    "variant_id": None,
                    "quantity": 1,
                    "price": 100.00
                }
            ],
            "origin_url": "https://aurel-preview.preview.emergentagent.com"
        }
        success, session = self.run_test("Create Checkout Session", "POST", "/checkout/session", 200, checkout_data)
        
        if success and session.get('session_id'):
            session_id = session['session_id']
            # Get checkout status
            self.run_test("Get Checkout Status", "GET", f"/checkout/status/{session_id}", 200)

    def test_authentication_protection(self):
        """Test that admin endpoints are properly protected"""
        print("\n=== TESTING AUTHENTICATION PROTECTION ===")
        
        # Test admin endpoints without auth
        self.run_test("Admin Quotes Without Auth", "GET", "/admin/quotes", 401)
        self.run_test("Admin Products Without Auth", "POST", "/admin/products", 401, {"title": "test"})
        self.run_test("Admin Collections Without Auth", "POST", "/admin/collections", 401, {"title": "test"})

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting MONO AUREL API Testing Suite\n")
        print(f"Testing against: {self.base_url}")
        
        try:
            self.test_health_endpoints()
            self.test_products_endpoints()
            self.test_collections_endpoints()
            self.test_quote_endpoints()
            self.test_marquee_endpoints()
            self.test_newsletter_endpoints()
            self.test_blog_endpoints()
            self.test_admin_product_management()
            self.test_admin_collection_management()
            self.test_stripe_checkout_endpoints()
            self.test_authentication_protection()
        except Exception as e:
            print(f"\n❌ Critical error during testing: {e}")
        
        # Print results
        print(f"\n📊 Testing Results:")
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Tests Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        # Print failed tests
        failed_tests = [t for t in self.test_results if t['result']['status'] != 'PASS']
        if failed_tests:
            print(f"\n❌ Failed Tests ({len(failed_tests)}):")
            for test in failed_tests:
                status = test['result']
                if status['status'] == 'FAIL':
                    print(f"  • {test['test_name']}: Expected {status['expected']}, got {status['actual']}")
                elif status['status'] == 'ERROR':
                    print(f"  • {test['test_name']}: {status['error']}")
        
        return 0 if self.tests_passed == self.tests_run else 1

def main():
    tester = MonoAurelAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())