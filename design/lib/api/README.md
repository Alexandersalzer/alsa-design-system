# 🔧 API Layer - Centraliserat Type System

## 📦 Vad Som Skapats

| Fil | Syfte | Rader | Status |
|-----|-------|-------|--------|
| **types.ts** | Centrala API types & guards | 167 | ✅ Klart |
| **index.ts** | Single export point | 39 | ✅ Klart |
| **USAGE_EXAMPLES.md** | Detaljerad guide | 500+ | ✅ Klart |
| **example-migration.ts** | Före/Efter exempel | 250+ | ✅ Klart |
| **__tests__/types.test.ts** | Test suite | 200+ | ✅ Klart |

---

## ⚡ QUICK START

### **1. Import (Nya Sättet):**

```typescript
// ✅ SINGLE IMPORT - Allt du behöver
import { 
  apiClient,           // Axios instance
  ApiResponse,         // Type för responses
  isSuccessResponse,   // Type guard
  showSuccess,         // Event helper
  showError,          // Event helper
  getCSRFToken        // CSRF helper
} from '@/lib/api';
```

### **2. Använd Type Guard:**

```typescript
const response = await apiClient.get('/endpoint');

if (isSuccessResponse(response.data)) {
  // ✅ TypeScript vet: response.data.success === true
  console.log('Data:', response.data.data);
}
```

### **3. Definiera Response Type:**

```typescript
interface MyData {
  items: string[];
}

type MyResponse = ApiResponse<MyData>;

const response = await apiClient.get<MyResponse>('/items');
```

---

## 🎯 CORE TYPES

```typescript
// Base response type
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

// Success type (discriminated union)
interface SuccessResponse<T> extends ApiResponse<T> {
  success: true;
  data?: T;
}

// Error type (discriminated union)
interface ErrorResponse extends ApiResponse {
  success: false;
  message: string;
}

// API Error (från Axios)
interface ApiError {
  response?: {
    data?: { message?: string; code?: string };
    status?: number;
  };
  message?: string;
}
```

---

## 🛡️ TYPE GUARDS

```typescript
// Check success
if (isSuccessResponse(response.data)) {
  // Type: SuccessResponse<T>
}

// Check error
if (isErrorResponse(response.data)) {
  // Type: ErrorResponse
}

// Check API error
if (isApiError(error)) {
  // Type: ApiError
}
```

---

## 📝 COMMON PATTERNS

### **Pattern 1: Simple API Call**

```typescript
const response = await apiClient.get('/data');

if (isSuccessResponse(response.data)) {
  setData(response.data.data);
} else {
  console.error(response.data.message);
}
```

### **Pattern 2: With Error Handling**

```typescript
try {
  const response = await apiClient.post('/save', data);
  
  if (isSuccessResponse(response.data)) {
    showSuccess('Sparat!');
  }
} catch (error) {
  // ErrorProvider visar redan toast
  if (isApiError(error)) {
    console.error('Status:', error.response?.status);
  }
}
```

### **Pattern 3: Service Function**

```typescript
type DomainsResponse = ApiResponse<{ domains: Domain[] }>;

export async function getDomains(): Promise<DomainsResponse> {
  const response = await apiClient.get<DomainsResponse>('/domains');
  return response.data;
}
```

### **Pattern 4: Component Usage**

```typescript
const handleLoad = async () => {
  const data = await getDomains();
  
  if (isSuccessResponse(data)) {
    setDomains(data.data?.domains || []);
  } else {
    showError(data.message);
  }
};
```

---

## ✅ BENEFITS

| Benefit | Before | After |
|---------|--------|-------|
| **Type Safety** | ⚠️ Mixed | ✅ Unified |
| **Import Count** | 3-5 imports | 1 import |
| **Type Guards** | ❌ None | ✅ 3 guards |
| **Documentation** | ⚠️ Scattered | ✅ Centralized |
| **Error Type** | ❌ Duplicated 3x | ✅ One definition |
| **Backend Alignment** | ⚠️ Implicit | ✅ Explicit |

---

## 🔄 BACKWARD COMPATIBILITY

### **✅ Existing Code Works As-Is:**

```typescript
// Services - INGEN ÄNDRING KRÄVS
export async function getDomains(): Promise<DomainsResponse> {
  const response = await apiClient.get('/domains');
  return response.data; // Samma som innan
}

// Components - INGEN ÄNDRING KRÄVS
const data = await getDomains();
if (data.success) {
  setDomains(data.domains); // Samma som innan
}

// useCache - INGEN ÄNDRING KRÄVS
const { data } = useCache('/domains');
if (data?.success) { ... } // Samma som innan
```

### **⚠️ Recommended Improvements:**

```typescript
// FÖRE (fungerar, men kan förbättras)
if (response.data?.success) { ... }

// EFTER (type-safe)
if (isSuccessResponse(response.data)) { ... }
```

---

## 📊 FILE STRUCTURE

```
/src/lib/api/
├── client.ts                    # Axios instance (unchanged)
├── csrf.ts                      # CSRF helpers (unchanged)
├── cache.ts                     # Cache implementation (unchanged)
├── types.ts                     # ✅ NYA: Central types
├── index.ts                     # ✅ NYA: Export barrel
├── README.md                    # ✅ NYA: Quick reference
├── USAGE_EXAMPLES.md            # ✅ NYA: Detailed guide
├── example-migration.ts         # ✅ NYA: Migration examples
└── __tests__/
    └── types.test.ts            # ✅ NYA: Test suite
```

---

## 🚀 ADOPTION STRATEGY

### **Phase 1: Immediate (Redo nu)**
- [x] Types skapade
- [x] Export barrel skapad
- [x] Dokumentation skriven
- [ ] Import från `@/lib/api` i alla **nya filer**

### **Phase 2: Gradual (När du refaktorerar)**
- [ ] Använd `isSuccessResponse()` istället för `?.success`
- [ ] Använd `ApiResponse<T>` för nya response types
- [ ] Använd `isApiError()` i catch blocks

### **Phase 3: Future (Valfritt)**
- [ ] Skapa API wrapper (`api.get`, `api.post`)
- [ ] Migrera alla services till wrapper
- [ ] Refactor alla custom response types

---

## 🧪 TESTING

**Kör tester:**
```bash
npm test src/lib/api/__tests__/types.test.ts
```

**Manual test:**
```typescript
// I vilken komponent som helst:
import { isSuccessResponse } from '@/lib/api';

const response = await apiClient.get('/test');
console.log('Success?', isSuccessResponse(response.data));
```

---

## 📖 DOCUMENTATION

- **README.md** (du läser den nu) - Quick reference
- **USAGE_EXAMPLES.md** - Detaljerade exempel och best practices
- **example-migration.ts** - Före/Efter migration patterns
- **types.ts** - Inline documentation i koden

---

## 🎓 EXAMPLES

**Se mer i:**
- [USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md) - 20+ exempel
- [example-migration.ts](./example-migration.ts) - Före/Efter

**Quick preview:**

```typescript
// Import everything
import { 
  apiClient, 
  ApiResponse, 
  isSuccessResponse,
  showSuccess 
} from '@/lib/api';

// Define type
type SaveResponse = ApiResponse<{ id: number }>;

// API call
const response = await apiClient.post<SaveResponse>('/save', data);

// Type-safe check
if (isSuccessResponse(response.data)) {
  showSuccess('Sparat!');
  console.log('ID:', response.data.data?.id);
}
```

---

## ❓ FAQ

### **Q: Måste jag ändra befintlig kod?**
**A:** Nej! 100% bakåtkompatibelt. Använd för nya kod först.

### **Q: Hur ändrar jag från gammalt till nytt sätt?**
**A:** Se [example-migration.ts](./example-migration.ts) för före/efter.

### **Q: Fungerar det med useCache?**
**A:** Ja! useCache påverkas inte alls.

### **Q: Fungerar det med ErrorProvider?**
**A:** Perfekt! ErrorProvider använder redan events som exporteras här.

### **Q: Ska jag refaktorera alla 19 type filer?**
**A:** Nej, inte nödvändigt. Gör gradvis när du ändå arbetar i filerna.

---

## ✅ CHECKLIST

**Setup:**
- [x] types.ts skapad
- [x] index.ts skapad
- [x] Tester skapade
- [x] Dokumentation skriven

**Usage:**
- [ ] Importera från `@/lib/api` i nästa ny fil
- [ ] Använd `isSuccessResponse()` någonstans
- [ ] Verifiera att TypeScript autocomplete fungerar
- [ ] Kör tester

**Adoption:**
- [ ] Använd i alla nya filer framåt
- [ ] Migrera befintliga filer gradvis (valfritt)
- [ ] Överväg API wrapper layer (framtid)

---

## 🎉 STATUS

**✅ KLART OCH REDO ATT ANVÄNDA!**

**Nästa steg:**
```typescript
// I din nästa nya fil:
import { apiClient, ApiResponse, isSuccessResponse } from '@/lib/api';
```

**Det är allt!** 🚀

