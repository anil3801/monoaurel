from fastapi import FastAPI, APIRouter, HTTPException, Request, UploadFile, File, Depends
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
import secrets
import base64
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Stripe setup
stripe_api_key = os.environ.get('STRIPE_API_KEY', 'sk_test_emergent')

app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBasic()

# Admin credentials (in production, use proper auth)
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "monoaurel2025"

def verify_admin(credentials: HTTPBasicCredentials = Depends(security)):
    correct_username = secrets.compare_digest(credentials.username, ADMIN_USERNAME)
    correct_password = secrets.compare_digest(credentials.password, ADMIN_PASSWORD)
    if not (correct_username and correct_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return credentials.username

# ============ MODELS ============

class ProductVariant(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    price: float
    compare_at_price: Optional[float] = None
    sku: Optional[str] = None
    inventory_quantity: int = 0
    weight: Optional[float] = None
    weight_unit: str = "kg"

class ProductImage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    src: str
    alt: Optional[str] = None
    position: int = 0

class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    title_tr: Optional[str] = None
    description: Optional[str] = None
    description_tr: Optional[str] = None
    handle: str
    vendor: str = "Mono Aurel"
    product_type: str
    tags: List[str] = []
    status: str = "active"  # active, draft, archived
    stock_status: str = "in_stock"  # in_stock, made_to_order, sold_out
    price: float
    compare_at_price: Optional[float] = None
    price_min: Optional[float] = None
    price_max: Optional[float] = None
    images: List[ProductImage] = []
    variants: List[ProductVariant] = []
    materials: List[str] = []
    dimensions: Optional[str] = None
    weight: Optional[str] = None
    custom_available: bool = False
    collection_ids: List[str] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProductCreate(BaseModel):
    title: str
    title_tr: Optional[str] = None
    description: Optional[str] = None
    description_tr: Optional[str] = None
    handle: Optional[str] = None
    product_type: str
    tags: List[str] = []
    status: str = "active"
    stock_status: str = "in_stock"
    price: float
    compare_at_price: Optional[float] = None
    price_min: Optional[float] = None
    price_max: Optional[float] = None
    images: List[ProductImage] = []
    variants: List[ProductVariant] = []
    materials: List[str] = []
    dimensions: Optional[str] = None
    weight: Optional[str] = None
    custom_available: bool = False
    collection_ids: List[str] = []

class Collection(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    title_tr: Optional[str] = None
    description: Optional[str] = None
    description_tr: Optional[str] = None
    handle: str
    image: Optional[str] = None
    sort_order: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CollectionCreate(BaseModel):
    title: str
    title_tr: Optional[str] = None
    description: Optional[str] = None
    description_tr: Optional[str] = None
    handle: Optional[str] = None
    image: Optional[str] = None
    sort_order: int = 0

class QuoteRequest(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: Optional[str] = None
    category: str
    message: str
    budget_range: Optional[str] = None
    preferred_contact: str = "email"
    reference_images: List[str] = []
    status: str = "new"  # new, contacted, quoted, completed
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class QuoteRequestCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    category: str
    message: str
    budget_range: Optional[str] = None
    preferred_contact: str = "email"
    reference_images: List[str] = []

class MarqueeOrderRequest(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    text: str
    size: str
    material: str
    light_type: str
    color: Optional[str] = None
    purpose: str
    delivery_date: Optional[str] = None
    name: str
    email: str
    phone: Optional[str] = None
    reference_images: List[str] = []
    status: str = "new"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class MarqueeOrderCreate(BaseModel):
    text: str
    size: str
    material: str
    light_type: str
    color: Optional[str] = None
    purpose: str
    delivery_date: Optional[str] = None
    name: str
    email: str
    phone: Optional[str] = None
    reference_images: List[str] = []

class NewsletterSubscriber(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PaymentTransaction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    amount: float
    currency: str
    status: str = "pending"
    payment_status: str = "pending"
    metadata: Dict[str, Any] = {}
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CartItem(BaseModel):
    product_id: str
    variant_id: Optional[str] = None
    quantity: int
    price: float

class CheckoutRequest(BaseModel):
    items: List[CartItem]
    origin_url: str

class BlogPost(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    title_tr: Optional[str] = None
    slug: str
    excerpt: Optional[str] = None
    excerpt_tr: Optional[str] = None
    content: str
    content_tr: Optional[str] = None
    featured_image: Optional[str] = None
    category: str
    tags: List[str] = []
    reading_time: int = 5
    status: str = "published"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BlogPostCreate(BaseModel):
    title: str
    title_tr: Optional[str] = None
    slug: Optional[str] = None
    excerpt: Optional[str] = None
    excerpt_tr: Optional[str] = None
    content: str
    content_tr: Optional[str] = None
    featured_image: Optional[str] = None
    category: str
    tags: List[str] = []
    reading_time: int = 5
    status: str = "published"

# ============ HELPER FUNCTIONS ============

def generate_handle(title: str) -> str:
    return title.lower().replace(" ", "-").replace("ş", "s").replace("ğ", "g").replace("ü", "u").replace("ö", "o").replace("ç", "c").replace("ı", "i")

# ============ PRODUCT ROUTES ============

@api_router.get("/products", response_model=List[Product])
async def get_products(
    collection: Optional[str] = None,
    product_type: Optional[str] = None,
    status: Optional[str] = "active",
    limit: int = 50
):
    query = {}
    if collection:
        query["collection_ids"] = collection
    if product_type:
        query["product_type"] = product_type
    if status:
        query["status"] = status
    
    products = await db.products.find(query, {"_id": 0}).limit(limit).to_list(limit)
    for p in products:
        if isinstance(p.get('created_at'), str):
            p['created_at'] = datetime.fromisoformat(p['created_at'])
        if isinstance(p.get('updated_at'), str):
            p['updated_at'] = datetime.fromisoformat(p['updated_at'])
    return products

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if isinstance(product.get('created_at'), str):
        product['created_at'] = datetime.fromisoformat(product['created_at'])
    if isinstance(product.get('updated_at'), str):
        product['updated_at'] = datetime.fromisoformat(product['updated_at'])
    return product

@api_router.get("/products/handle/{handle}", response_model=Product)
async def get_product_by_handle(handle: str):
    product = await db.products.find_one({"handle": handle}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if isinstance(product.get('created_at'), str):
        product['created_at'] = datetime.fromisoformat(product['created_at'])
    if isinstance(product.get('updated_at'), str):
        product['updated_at'] = datetime.fromisoformat(product['updated_at'])
    return product

@api_router.post("/admin/products", response_model=Product)
async def create_product(product_data: ProductCreate, admin: str = Depends(verify_admin)):
    data = product_data.model_dump()
    if not data.get('handle'):
        data['handle'] = generate_handle(product_data.title)
    product = Product(**data)
    doc = product.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    await db.products.insert_one(doc)
    return product

@api_router.put("/admin/products/{product_id}", response_model=Product)
async def update_product(product_id: str, product_data: ProductCreate, admin: str = Depends(verify_admin)):
    existing = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = product_data.model_dump()
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    update_data['handle'] = product_data.handle or generate_handle(product_data.title)
    
    await db.products.update_one({"id": product_id}, {"$set": update_data})
    updated = await db.products.find_one({"id": product_id}, {"_id": 0})
    if isinstance(updated.get('created_at'), str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'])
    if isinstance(updated.get('updated_at'), str):
        updated['updated_at'] = datetime.fromisoformat(updated['updated_at'])
    return updated

@api_router.delete("/admin/products/{product_id}")
async def delete_product(product_id: str, admin: str = Depends(verify_admin)):
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}

# ============ COLLECTION ROUTES ============

@api_router.get("/collections", response_model=List[Collection])
async def get_collections():
    collections = await db.collections.find({}, {"_id": 0}).sort("sort_order", 1).to_list(100)
    for c in collections:
        if isinstance(c.get('created_at'), str):
            c['created_at'] = datetime.fromisoformat(c['created_at'])
        if isinstance(c.get('updated_at'), str):
            c['updated_at'] = datetime.fromisoformat(c['updated_at'])
    return collections

@api_router.get("/collections/{collection_id}", response_model=Collection)
async def get_collection(collection_id: str):
    collection = await db.collections.find_one({"id": collection_id}, {"_id": 0})
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    if isinstance(collection.get('created_at'), str):
        collection['created_at'] = datetime.fromisoformat(collection['created_at'])
    if isinstance(collection.get('updated_at'), str):
        collection['updated_at'] = datetime.fromisoformat(collection['updated_at'])
    return collection

@api_router.post("/admin/collections", response_model=Collection)
async def create_collection(collection_data: CollectionCreate, admin: str = Depends(verify_admin)):
    data = collection_data.model_dump()
    if not data.get('handle'):
        data['handle'] = generate_handle(collection_data.title)
    collection = Collection(**data)
    doc = collection.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    await db.collections.insert_one(doc)
    return collection

@api_router.put("/admin/collections/{collection_id}", response_model=Collection)
async def update_collection(collection_id: str, collection_data: CollectionCreate, admin: str = Depends(verify_admin)):
    existing = await db.collections.find_one({"id": collection_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    update_data = collection_data.model_dump()
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    update_data['handle'] = collection_data.handle or generate_handle(collection_data.title)
    
    await db.collections.update_one({"id": collection_id}, {"$set": update_data})
    updated = await db.collections.find_one({"id": collection_id}, {"_id": 0})
    if isinstance(updated.get('created_at'), str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'])
    if isinstance(updated.get('updated_at'), str):
        updated['updated_at'] = datetime.fromisoformat(updated['updated_at'])
    return updated

@api_router.delete("/admin/collections/{collection_id}")
async def delete_collection(collection_id: str, admin: str = Depends(verify_admin)):
    result = await db.collections.delete_one({"id": collection_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Collection not found")
    return {"message": "Collection deleted successfully"}

# ============ QUOTE REQUEST ROUTES ============

@api_router.post("/quotes", response_model=QuoteRequest)
async def create_quote_request(quote_data: QuoteRequestCreate):
    quote = QuoteRequest(**quote_data.model_dump())
    doc = quote.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.quote_requests.insert_one(doc)
    return quote

@api_router.get("/admin/quotes", response_model=List[QuoteRequest])
async def get_quote_requests(status: Optional[str] = None, admin: str = Depends(verify_admin)):
    query = {}
    if status:
        query["status"] = status
    quotes = await db.quote_requests.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    for q in quotes:
        if isinstance(q.get('created_at'), str):
            q['created_at'] = datetime.fromisoformat(q['created_at'])
    return quotes

@api_router.put("/admin/quotes/{quote_id}/status")
async def update_quote_status(quote_id: str, status: str, admin: str = Depends(verify_admin)):
    result = await db.quote_requests.update_one(
        {"id": quote_id},
        {"$set": {"status": status}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Quote request not found")
    return {"message": "Status updated successfully"}

# ============ MARQUEE ORDER ROUTES ============

@api_router.post("/marquee-orders", response_model=MarqueeOrderRequest)
async def create_marquee_order(order_data: MarqueeOrderCreate):
    order = MarqueeOrderRequest(**order_data.model_dump())
    doc = order.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.marquee_orders.insert_one(doc)
    return order

@api_router.get("/admin/marquee-orders", response_model=List[MarqueeOrderRequest])
async def get_marquee_orders(status: Optional[str] = None, admin: str = Depends(verify_admin)):
    query = {}
    if status:
        query["status"] = status
    orders = await db.marquee_orders.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    for o in orders:
        if isinstance(o.get('created_at'), str):
            o['created_at'] = datetime.fromisoformat(o['created_at'])
    return orders

# ============ NEWSLETTER ROUTES ============

@api_router.post("/newsletter", response_model=NewsletterSubscriber)
async def subscribe_newsletter(email: str):
    existing = await db.newsletter_subscribers.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already subscribed")
    
    subscriber = NewsletterSubscriber(email=email)
    doc = subscriber.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.newsletter_subscribers.insert_one(doc)
    return subscriber

# ============ BLOG ROUTES ============

@api_router.get("/blog", response_model=List[BlogPost])
async def get_blog_posts(category: Optional[str] = None, limit: int = 20):
    query = {"status": "published"}
    if category:
        query["category"] = category
    posts = await db.blog_posts.find(query, {"_id": 0}).sort("created_at", -1).limit(limit).to_list(limit)
    for p in posts:
        if isinstance(p.get('created_at'), str):
            p['created_at'] = datetime.fromisoformat(p['created_at'])
        if isinstance(p.get('updated_at'), str):
            p['updated_at'] = datetime.fromisoformat(p['updated_at'])
    return posts

@api_router.get("/blog/{slug}", response_model=BlogPost)
async def get_blog_post(slug: str):
    post = await db.blog_posts.find_one({"slug": slug}, {"_id": 0})
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    if isinstance(post.get('created_at'), str):
        post['created_at'] = datetime.fromisoformat(post['created_at'])
    if isinstance(post.get('updated_at'), str):
        post['updated_at'] = datetime.fromisoformat(post['updated_at'])
    return post

@api_router.post("/admin/blog", response_model=BlogPost)
async def create_blog_post(post_data: BlogPostCreate, admin: str = Depends(verify_admin)):
    post = BlogPost(
        **post_data.model_dump(),
        slug=post_data.slug or generate_handle(post_data.title)
    )
    doc = post.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    await db.blog_posts.insert_one(doc)
    return post

@api_router.put("/admin/blog/{post_id}", response_model=BlogPost)
async def update_blog_post(post_id: str, post_data: BlogPostCreate, admin: str = Depends(verify_admin)):
    existing = await db.blog_posts.find_one({"id": post_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    update_data = post_data.model_dump()
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    update_data['slug'] = post_data.slug or generate_handle(post_data.title)
    
    await db.blog_posts.update_one({"id": post_id}, {"$set": update_data})
    updated = await db.blog_posts.find_one({"id": post_id}, {"_id": 0})
    if isinstance(updated.get('created_at'), str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'])
    if isinstance(updated.get('updated_at'), str):
        updated['updated_at'] = datetime.fromisoformat(updated['updated_at'])
    return updated

@api_router.delete("/admin/blog/{post_id}")
async def delete_blog_post(post_id: str, admin: str = Depends(verify_admin)):
    result = await db.blog_posts.delete_one({"id": post_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return {"message": "Blog post deleted successfully"}

# ============ STRIPE PAYMENT ROUTES ============

@api_router.post("/checkout/session")
async def create_checkout_session(request: Request, checkout_data: CheckoutRequest):
    host_url = str(request.base_url).rstrip('/')
    webhook_url = f"{host_url}/api/webhook/stripe"
    
    stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
    
    total_amount = sum(item.price * item.quantity for item in checkout_data.items)
    
    success_url = f"{checkout_data.origin_url}/checkout/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{checkout_data.origin_url}/shop"
    
    metadata = {
        "source": "mono_aurel_shop",
        "items_count": str(len(checkout_data.items))
    }
    
    checkout_request = CheckoutSessionRequest(
        amount=float(total_amount),
        currency="try",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata=metadata
    )
    
    session: CheckoutSessionResponse = await stripe_checkout.create_checkout_session(checkout_request)
    
    transaction = PaymentTransaction(
        session_id=session.session_id,
        amount=total_amount,
        currency="try",
        status="initiated",
        payment_status="pending",
        metadata=metadata
    )
    doc = transaction.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    await db.payment_transactions.insert_one(doc)
    
    return {"url": session.url, "session_id": session.session_id}

@api_router.get("/checkout/status/{session_id}")
async def get_checkout_status(request: Request, session_id: str):
    host_url = str(request.base_url).rstrip('/')
    webhook_url = f"{host_url}/api/webhook/stripe"
    
    stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
    
    status: CheckoutStatusResponse = await stripe_checkout.get_checkout_status(session_id)
    
    await db.payment_transactions.update_one(
        {"session_id": session_id},
        {"$set": {
            "status": status.status,
            "payment_status": status.payment_status,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    
    return status

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    host_url = str(request.base_url).rstrip('/')
    webhook_url = f"{host_url}/api/webhook/stripe"
    
    stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
    
    body = await request.body()
    signature = request.headers.get("Stripe-Signature")
    
    try:
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        
        if webhook_response.session_id:
            await db.payment_transactions.update_one(
                {"session_id": webhook_response.session_id},
                {"$set": {
                    "status": webhook_response.event_type,
                    "payment_status": webhook_response.payment_status,
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }}
            )
        
        return {"received": True}
    except Exception as e:
        logging.error(f"Webhook error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

# ============ SEED DATA ============

@api_router.post("/admin/seed")
async def seed_database(admin: str = Depends(verify_admin)):
    # Seed collections
    collections_data = [
        {"title": "Totem Sculptures", "title_tr": "Totem Heykeller", "handle": "totem-sculptures", "sort_order": 1,
         "description": "Geometric forms stacked into tall column objects", "description_tr": "Geometrik formların istiflendiği uzun sütun objeler"},
        {"title": "Sphere Sculptures", "title_tr": "Küre Heykeller", "handle": "sphere-sculptures", "sort_order": 2,
         "description": "Stacked sphere objects in various sizes and textures", "description_tr": "İstiflenmiş küre objeler, farklı boyut ve dokular"},
        {"title": "Geometric Objects", "title_tr": "Geometrik Objeler", "handle": "geometric-objects", "sort_order": 3,
         "description": "Sharp-edged art objects", "description_tr": "Keskin kenarlı sanat objeleri"},
        {"title": "Stone Objects", "title_tr": "Taş Objeler", "handle": "stone-objects", "sort_order": 4,
         "description": "Natural stone-look decorative pieces", "description_tr": "Doğal taş görünümlü dekoratif parçalar"},
        {"title": "Marquee Letters", "title_tr": "Işıklı Harfler", "handle": "marquee-letters", "sort_order": 5,
         "description": "Illuminated letters and custom signage", "description_tr": "Işıklı harfler ve özel tabelalar"},
    ]
    
    for col_data in collections_data:
        existing = await db.collections.find_one({"handle": col_data["handle"]})
        if not existing:
            collection = Collection(**col_data)
            doc = collection.model_dump()
            doc['created_at'] = doc['created_at'].isoformat()
            doc['updated_at'] = doc['updated_at'].isoformat()
            await db.collections.insert_one(doc)
    
    # Get collection IDs
    totem_col = await db.collections.find_one({"handle": "totem-sculptures"}, {"_id": 0})
    sphere_col = await db.collections.find_one({"handle": "sphere-sculptures"}, {"_id": 0})
    stone_col = await db.collections.find_one({"handle": "stone-objects"}, {"_id": 0})
    
    # Seed products
    products_data = [
        {
            "title": "Equilibrium Totem",
            "title_tr": "Denge Totemi",
            "handle": "equilibrium-totem",
            "description": "A striking tall sculpture featuring geometric carved patterns. This totem represents balance and ancient wisdom.",
            "description_tr": "Geometrik oyma desenlere sahip çarpıcı uzun heykel. Bu totem denge ve kadim bilgeliği temsil eder.",
            "product_type": "sculpture",
            "price": 28500.00,
            "stock_status": "made_to_order",
            "custom_available": True,
            "materials": ["Ceramic", "Clay"],
            "dimensions": "180cm x 30cm x 30cm",
            "weight": "45kg",
            "images": [{"src": "https://customer-assets.emergentagent.com/job_f854762d-e9d8-45ed-a96a-aa51980e7c30/artifacts/35as5za0_totemmy13.png", "alt": "Equilibrium Totem", "position": 0}],
            "collection_ids": [totem_col["id"]] if totem_col else [],
            "tags": ["totem", "geometric", "tall", "carved"]
        },
        {
            "title": "Serenity Spheres",
            "title_tr": "Huzur Küreleri",
            "handle": "serenity-spheres",
            "description": "Stacked ceramic spheres in varying sizes, creating a sense of peaceful balance and organic harmony.",
            "description_tr": "Farklı boyutlarda istiflenmiş seramik küreler, huzurlu bir denge ve organik uyum hissi yaratır.",
            "product_type": "sculpture",
            "price": 32000.00,
            "stock_status": "made_to_order",
            "custom_available": True,
            "materials": ["Ceramic", "Glazed finish"],
            "dimensions": "150cm x 40cm x 40cm",
            "weight": "38kg",
            "images": [{"src": "https://customer-assets.emergentagent.com/job_f854762d-e9d8-45ed-a96a-aa51980e7c30/artifacts/y2uawiad_artobject23.png", "alt": "Serenity Spheres", "position": 0}],
            "collection_ids": [sphere_col["id"]] if sphere_col else [],
            "tags": ["spheres", "stacked", "organic", "peaceful"]
        },
        {
            "title": "Zen Stone Stack",
            "title_tr": "Zen Taş Yığını",
            "handle": "zen-stone-stack",
            "description": "A meditation-inspired arrangement of smooth stone-like objects, perfect for creating a calming atmosphere.",
            "description_tr": "Pürüzsüz taş benzeri objelerin meditasyondan ilham alan düzenlemesi, sakinleştirici bir atmosfer yaratmak için mükemmel.",
            "product_type": "sculpture",
            "price": 18500.00,
            "stock_status": "in_stock",
            "custom_available": False,
            "materials": ["Ceramic", "Stone-effect finish"],
            "dimensions": "120cm x 35cm x 35cm",
            "weight": "28kg",
            "images": [{"src": "https://customer-assets.emergentagent.com/job_f854762d-e9d8-45ed-a96a-aa51980e7c30/artifacts/yymn2n6w_stone9.png", "alt": "Zen Stone Stack", "position": 0}],
            "collection_ids": [stone_col["id"]] if stone_col else [],
            "tags": ["zen", "meditation", "calm", "stone"]
        }
    ]
    
    for prod_data in products_data:
        existing = await db.products.find_one({"handle": prod_data["handle"]})
        if not existing:
            product = Product(**prod_data)
            doc = product.model_dump()
            doc['created_at'] = doc['created_at'].isoformat()
            doc['updated_at'] = doc['updated_at'].isoformat()
            await db.products.insert_one(doc)
    
    return {"message": "Database seeded successfully"}

# ============ MAIN ROUTES ============

@api_router.get("/")
async def root():
    return {"message": "Mono Aurel API", "version": "1.0.0"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy"}

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
