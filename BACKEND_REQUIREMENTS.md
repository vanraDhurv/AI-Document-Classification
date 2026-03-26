# AI Document Classification - Backend Requirements & Implementation

## Current Status ✅
- **Backend**: Mock implementation running (in-memory, no SQLite)
- **Frontend**: React with Material-UI (stable with all fixes)
- **Live**: `http://localhost:3001` (frontend), `http://localhost:8000` (backend)

---

## Production Backend Upgrade Path

### 1. **Document Upload & Storage**
✅ **Status**: Partially Implemented
- Accept: PDF, DOCX, TXT  
- Store files locally in `/backend/uploads/`
- Save metadata in SQLite DB

**TODO**:
```bash
# Add to requirements.txt:
sqlmodel
sqlalchemy
PyPDF2
python-docx
```

**Schema**:
```python
class Document(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    filename: str
    original_filename: str
    category: str | None
    size: int
    path: str
    author: str | None
    title: str | None
    summary: str | None
    text_content: str | None
    entities: str | None  # JSON
    mime_type: str
    uploader_id: int = Field(foreign_key="user.id")
    upload_date: datetime
    last_accessed: datetime | None
```

---

### 2. **Document Classification**
✅ **Status**: Ready for implementation
- Categories: Finance, HR, Legal, Contracts, Technical Reports

**Implementation**:
```python
def classify_category(text: str, filename: str) -> str:
    text_lower = (text + filename).lower()
    categories = {
        "Finance": ["invoice", "payment", "financial", "budget"],
        "HR": ["employee", "recruitment", "salary", "benefits"],
        "Legal": ["contract", "agreement", "legal", "terms"],
        "Contracts": ["contract", "agreement", "terms"],
        "Technical Reports": ["technical", "report", "system"],
    }
    for category, keywords in categories.items():
        if any(kw in text_lower for kw in keywords):
            return category
    return "General"
```

---

### 3. **Metadata Extraction**

#### Title Extraction
```python
def extract_metadata(text: str, filename: str) -> dict:
    lines = text[:500].split('\n')
    title = lines[0][:100] if lines else filename
    return {"title": title}
```

#### Author Detection
```python
# Regex patterns for author extraction
patterns = [
    r'(?:Author|By|From):\s*([^\n]+)',
    r'(?:Author|By):\s*([^\n]+)',
    r'\b[A-Z][a-z]+\s+[A-Z][a-z]+\b'
]
```

#### Date Detection
```python
date_pattern = r'\b(?:20\d{2}|19\d{2})[-/](?:0?[1-9]|1[0-2])[-/](?:0?[1-9]|[12]\d|3[01])\b'
```

#### Entity Extraction (spaCy or Regex)
```python
def extract_entities(text: str) -> dict:
    return {
        "emails": re.findall(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text),
        "amounts": re.findall(r'\$[\d,]+(?:\.\d{2})?', text),
        "phone_numbers": re.findall(r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text),
    }
```

---

### 4. **Summarization (Extractive)**

**TF-IDF Approach**:
```python
from sklearn.feature_extraction.text import TfidfVectorizer

def summarize_text(text: str, num_sentences: int = 3) -> str:
    sentences = re.split(r'(?<=[.!?])\s+', text[:2000])
    
    vectorizer = TfidfVectorizer(max_features=100, stop_words='english')
    tfidf = vectorizer.fit_transform(sentences)
    scores = tfidf.sum(axis=1).A1
    
    top_indices = np.argsort(scores)[-num_sentences:]
    top_indices = sorted(top_indices)
    
    return " ".join([sentences[i] for i in top_indices])
```

**Requirements**:
```bash
scikit-learn
numpy
```

---

### 5. **Semantic Search**

**Using SentenceTransformers + FAISS**:
```python
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

def embe dd_text(text: str) -> np.ndarray:
    model = SentenceTransformer('all-MiniLM-L6-v2')
    return model.encode(text)

def semantic_search(query: str, documents: List[Document]) -> List[Dict]:
    model = SentenceTransformer('all-MiniLM-L6-v2')
    query_embedding = model.encode(query)
    
    results = []
    for doc in documents:
        if doc.text_content:
            doc_embedding = model.encode(doc.text_content[:500])
            similarity = cosine_similarity(query_embedding, doc_embedding)
            if similarity > 0.3:
                results.append({"doc": doc, "score": similarity})
    
    return sorted(results, key=lambda x: x["score"], reverse=True)
```

**Requirements**:
```bash
sentence-transformers
faiss-cpu
```

---

### 6. **Security & Access Control**

#### Role-Based Access
```python
class User(SQLModel, table=True):
    id: int | None = None
    username: str
    password: str
    role: str  # "admin", "hr", "finance", "user"

# Middleware to enforce access
@app.get("/documents/{doc_id}")
def get_document(doc_id: int, current_user: User = Depends(get_current_user)):
    doc = session.get(Document, doc_id)
    
    # HR users only see HR docs
    if current_user.role == "hr" and doc.category != "HR":
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Finance users only see Finance docs
    if current_user.role == "finance" and doc.category != "Finance":
        raise HTTPException(status_code=403, detail="Access denied")
    
    return doc
```

#### Access Logging
```python
class AccessLog(SQLModel, table=True):
    id: int | None = None
    user_id: int = Field(foreign_key="user.id")
    document_id: int = Field(foreign_key="document.id")
    action: str  # "upload", "view", "download", "delete"
    timestamp: datetime

# Log every access
log = AccessLog(
    user_id=current_user.id,
    document_id=doc.id,
    action="view"
)
session.add(log)
session.commit()
```

---

## Installation & Setup

### Step 1: Update Requirements
```bash
cd backend
cat > requirements.txt << 'EOF'
fastapi
uvicorn[standard]
python-multipart
sqlmodel
sqlalchemy
PyPDF2
python-docx
sentence-transformers
faiss-cpu
scikit-learn
numpy
python-dateutil
EOF
```

### Step 2: Install Dependencies
```bash
pip install -r requirements.txt
```

**Note**: First-time `sentence-transformers` download is ~500MB.

### Step 3: Run Backend
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Step 4: Verify
```bash
# Test login
curl -X POST http://localhost:8000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"admin123"}'

# Should return token + user
```

---

## API Endpoints Summary

### Auth
- `POST /auth/login` → Get token
- `POST /auth/logout` → Invalidate token
- `GET /auth/me` → Current user info

### Documents
- `GET /documents/` → List user's docs (filtered by role)
- `GET /documents/categories/` → Get category list
- `POST /documents/upload` → Upload with auto-classification + summarization
- `GET /documents/{id}` → Get doc details (role check)
- `GET /documents/{id}/download` → Download file
- `DELETE /documents/{id}` → Delete doc

### Search
- `GET /search/?q=text` → Keyword search
- `POST /search/semantic` → Semantic search (embeddings)

### Admin Only
- `GET /logs/` → Access logs
- `GET /users/` → All users
- `POST /users/` → Create user
- `PUT /users/{id}` → Update user
- `DELETE /users/{id}` → Delete user

---

## Test Users (Hardcoded)
| Username | Password | Role    |
|----------|----------|---------|
| admin    | admin123 | admin   |
| hr       | hr123    | hr      |
| finance  | finance123 | finance |

---

## Database
- **Type**: SQLite
- **Location**: `backend/documents.db`
- **Auto-created** on first run

---

## Performance Notes
- Text extraction: First 10 PDF pages, full DOCX/TXT
- Summarization: TF-IDF on first 2000 chars
- Semantic search: Cosine similarity (threshold > 0.3)
- Entity extraction: Regex-based (no external NER)

---

## Next Steps
1. Backup current `main.py`
2. Implement SQLModel database layer
3. Add text extraction (PyPDF2, python-docx)
4. Add classification logic
5. Add summarization (TF-IDF)
6. Add semantic search (SentenceTransformers)
7. Add role-based access control
8. Add access logging

**Estimated effort**: 2-3 hours for full implementation

