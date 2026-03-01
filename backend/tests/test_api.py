"""
Backend API Tests for MONO AUREL - Luxury Art E-commerce
Tests: Products, Collections, Quotes, Newsletter, Blog, Health endpoints
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
ADMIN_USER = "admin"
ADMIN_PASS = "monoaurel2025"


class TestHealthEndpoints:
    """Health check and root endpoints"""
    
    def test_health_endpoint(self):
        """Test /api/health returns healthy status"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        print("✓ Health endpoint working")
    
    def test_root_api_endpoint(self):
        """Test /api/ root endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "Mono Aurel API" in data["message"]
        print("✓ Root API endpoint working")


class TestProductsAPI:
    """Product CRUD operations - public endpoints"""
    
    def test_get_all_products(self):
        """Test GET /api/products returns product list"""
        response = requests.get(f"{BASE_URL}/api/products")
        assert response.status_code == 200
        products = response.json()
        assert isinstance(products, list)
        print(f"✓ Products endpoint returned {len(products)} products")
    
    def test_get_product_by_handle(self):
        """Test GET /api/products/handle/{handle} returns specific product"""
        # First get a product handle from the list
        response = requests.get(f"{BASE_URL}/api/products")
        products = response.json()
        
        if len(products) > 0:
            handle = products[0]["handle"]
            response = requests.get(f"{BASE_URL}/api/products/handle/{handle}")
            assert response.status_code == 200
            product = response.json()
            assert product["handle"] == handle
            print(f"✓ Get product by handle working - {handle}")
        else:
            pytest.skip("No products available to test")
    
    def test_get_product_by_invalid_handle(self):
        """Test GET /api/products/handle/{invalid} returns 404"""
        response = requests.get(f"{BASE_URL}/api/products/handle/invalid-product-xxx")
        assert response.status_code == 404
        print("✓ Invalid product handle returns 404")


class TestCollectionsAPI:
    """Collection endpoints"""
    
    def test_get_all_collections(self):
        """Test GET /api/collections returns collection list"""
        response = requests.get(f"{BASE_URL}/api/collections")
        assert response.status_code == 200
        collections = response.json()
        assert isinstance(collections, list)
        print(f"✓ Collections endpoint returned {len(collections)} collections")
    
    def test_get_collection_by_id(self):
        """Test GET /api/collections/{id} returns specific collection"""
        response = requests.get(f"{BASE_URL}/api/collections")
        collections = response.json()
        
        if len(collections) > 0:
            collection_id = collections[0]["id"]
            response = requests.get(f"{BASE_URL}/api/collections/{collection_id}")
            assert response.status_code == 200
            collection = response.json()
            assert collection["id"] == collection_id
            print(f"✓ Get collection by ID working")
        else:
            pytest.skip("No collections available to test")


class TestQuotesAPI:
    """Quote request endpoint - public POST, admin GET"""
    
    def test_create_quote_request(self):
        """Test POST /api/quotes creates new quote request"""
        quote_data = {
            "name": "TEST_User",
            "email": f"test_{uuid.uuid4().hex[:8]}@example.com",
            "category": "sculpture",
            "message": "Test quote request from automated testing",
            "phone": "+90 555 123 4567",
            "budget_range": "15000-30000",
            "preferred_contact": "email"
        }
        
        response = requests.post(f"{BASE_URL}/api/quotes", json=quote_data)
        assert response.status_code == 200
        quote = response.json()
        assert quote["name"] == quote_data["name"]
        assert quote["email"] == quote_data["email"]
        assert "id" in quote
        print(f"✓ Quote request created successfully - ID: {quote['id']}")
    
    def test_get_quotes_without_auth(self):
        """Test GET /api/admin/quotes without auth returns 401"""
        response = requests.get(f"{BASE_URL}/api/admin/quotes")
        assert response.status_code == 401
        print("✓ Admin quotes endpoint properly protected")
    
    def test_get_quotes_with_auth(self):
        """Test GET /api/admin/quotes with auth returns quotes"""
        response = requests.get(
            f"{BASE_URL}/api/admin/quotes",
            auth=(ADMIN_USER, ADMIN_PASS)
        )
        assert response.status_code == 200
        quotes = response.json()
        assert isinstance(quotes, list)
        print(f"✓ Admin quotes endpoint working - {len(quotes)} quotes found")


class TestMarqueeOrdersAPI:
    """Marquee order endpoints"""
    
    def test_create_marquee_order(self):
        """Test POST /api/marquee-orders creates new order"""
        order_data = {
            "text": "TEST",
            "size": "medium",
            "material": "wood",
            "light_type": "led",
            "color": "white",
            "purpose": "wedding",
            "name": "TEST_Customer",
            "email": f"test_{uuid.uuid4().hex[:8]}@example.com",
            "phone": "+90 555 987 6543"
        }
        
        response = requests.post(f"{BASE_URL}/api/marquee-orders", json=order_data)
        assert response.status_code == 200
        order = response.json()
        assert order["text"] == order_data["text"]
        assert "id" in order
        print(f"✓ Marquee order created - ID: {order['id']}")
    
    def test_get_marquee_orders_with_auth(self):
        """Test GET /api/admin/marquee-orders with auth"""
        response = requests.get(
            f"{BASE_URL}/api/admin/marquee-orders",
            auth=(ADMIN_USER, ADMIN_PASS)
        )
        assert response.status_code == 200
        orders = response.json()
        assert isinstance(orders, list)
        print(f"✓ Admin marquee orders endpoint working - {len(orders)} orders")


class TestNewsletterAPI:
    """Newsletter subscription endpoint"""
    
    def test_newsletter_subscription(self):
        """Test POST /api/newsletter subscribes email"""
        unique_email = f"test_{uuid.uuid4().hex[:8]}@newsletter.com"
        
        response = requests.post(
            f"{BASE_URL}/api/newsletter",
            params={"email": unique_email}
        )
        assert response.status_code == 200
        subscriber = response.json()
        assert subscriber["email"] == unique_email
        print(f"✓ Newsletter subscription working - {unique_email}")
    
    def test_newsletter_duplicate_email(self):
        """Test duplicate email subscription returns 400"""
        unique_email = f"duplicate_{uuid.uuid4().hex[:8]}@newsletter.com"
        
        # First subscription
        response = requests.post(
            f"{BASE_URL}/api/newsletter",
            params={"email": unique_email}
        )
        assert response.status_code == 200
        
        # Duplicate subscription
        response = requests.post(
            f"{BASE_URL}/api/newsletter",
            params={"email": unique_email}
        )
        assert response.status_code == 400
        print("✓ Duplicate email properly rejected")


class TestBlogAPI:
    """Blog post endpoints"""
    
    def test_get_blog_posts(self):
        """Test GET /api/blog returns blog posts"""
        response = requests.get(f"{BASE_URL}/api/blog")
        assert response.status_code == 200
        posts = response.json()
        assert isinstance(posts, list)
        print(f"✓ Blog endpoint working - {len(posts)} posts")


class TestAdminProductCRUD:
    """Admin product CRUD operations"""
    
    def test_create_product_with_auth(self):
        """Test POST /api/admin/products with auth"""
        product_data = {
            "title": "TEST_Product",
            "title_tr": "TEST_Ürün",
            "description": "Test product description",
            "product_type": "sculpture",
            "price": 1000.00,
            "stock_status": "in_stock",
            "custom_available": False,
            "materials": ["Test Material"],
            "tags": ["test"]
        }
        
        response = requests.post(
            f"{BASE_URL}/api/admin/products",
            json=product_data,
            auth=(ADMIN_USER, ADMIN_PASS)
        )
        assert response.status_code == 200
        product = response.json()
        assert product["title"] == product_data["title"]
        assert "id" in product
        print(f"✓ Product created - ID: {product['id']}")
        
        # Verify with GET
        get_response = requests.get(f"{BASE_URL}/api/products/{product['id']}")
        assert get_response.status_code == 200
        print("✓ Created product verified with GET")
        
        # Cleanup - delete the test product
        delete_response = requests.delete(
            f"{BASE_URL}/api/admin/products/{product['id']}",
            auth=(ADMIN_USER, ADMIN_PASS)
        )
        assert delete_response.status_code == 200
        print("✓ Test product cleaned up")
    
    def test_create_product_without_auth(self):
        """Test POST /api/admin/products without auth returns 401"""
        product_data = {
            "title": "Unauthorized Product",
            "product_type": "sculpture",
            "price": 1000.00
        }
        
        response = requests.post(
            f"{BASE_URL}/api/admin/products",
            json=product_data
        )
        assert response.status_code == 401
        print("✓ Admin product creation properly protected")


class TestAdminCollectionCRUD:
    """Admin collection CRUD operations"""
    
    def test_create_collection_with_auth(self):
        """Test POST /api/admin/collections with auth"""
        collection_data = {
            "title": "TEST_Collection",
            "title_tr": "TEST_Koleksiyon",
            "description": "Test collection description",
            "sort_order": 99
        }
        
        response = requests.post(
            f"{BASE_URL}/api/admin/collections",
            json=collection_data,
            auth=(ADMIN_USER, ADMIN_PASS)
        )
        assert response.status_code == 200
        collection = response.json()
        assert collection["title"] == collection_data["title"]
        assert "id" in collection
        print(f"✓ Collection created - ID: {collection['id']}")
        
        # Cleanup
        delete_response = requests.delete(
            f"{BASE_URL}/api/admin/collections/{collection['id']}",
            auth=(ADMIN_USER, ADMIN_PASS)
        )
        assert delete_response.status_code == 200
        print("✓ Test collection cleaned up")


class TestSeedData:
    """Database seeding endpoint"""
    
    def test_seed_database_with_auth(self):
        """Test POST /api/admin/seed with auth"""
        response = requests.post(
            f"{BASE_URL}/api/admin/seed",
            auth=(ADMIN_USER, ADMIN_PASS)
        )
        assert response.status_code == 200
        result = response.json()
        assert "message" in result
        print("✓ Database seeding endpoint working")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
