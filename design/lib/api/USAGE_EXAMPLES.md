# 📖 API TYPES - ANVÄNDNINGSEXEMPEL

## ✅ Vad Som Skapats

### **Nya Filer:**
1. `/src/lib/api/types.ts` (167 rader) - Centraliserade types
2. `/src/lib/api/index.ts` (39 rader) - Export barrel

### **Fördelar:**
- ✅ Bakåtkompatibelt (inga breaking changes)
- ✅ Type guards för säkerhet
- ✅ Dokumenterar backend pattern
- ✅ Single import point
- ✅ Redo för framtida wrapper layer

---

## 🚀 ANVÄNDNING

### **Import (Nya Sättet):**

```typescript
// FÖRE: Flera imports
import apiClient from '@/lib/api/client';
import { getCSRFToken } from '@/lib/api/csrf';
import { showError } from '@/lib/events';

// EFTER: En import
import { 
  apiClient, 
  getCSRFToken, 
  showError,
  ApiResponse,
  isSuccessResponse 
} from '@/lib/api';
```

---

## 📝 EXEMPEL 1: Existing Code (Ingen ändring)

**Din befintliga kod fungerar exakt som innan:**

```typescript
// Services - INGEN ÄNDRING
export async function getDomains(): Promise<DomainsResponse> {
  const response = await apiClient.get('/domains');
  return response.data; // Samma som innan
}

// Components - INGEN ÄNDRING
const data = await getDomains();
if (data.success) {
  setDomains(data.domains); // Samma som innan
}

// useCache - INGEN ÄNDRING
const { data } = useCache('/domains');
if (data?.success) { ... } // Samma som innan
```

---

## 📝 EXEMPEL 2: Type-Safe med Type Guards (Nytt sätt)

```typescript
import { apiClient, ApiResponse, isSuccessResponse } from '@/lib/api';

// Define response type
interface Domain {
  id: number;
  domain_name: string;
}

type DomainsData = { domains: Domain[] };
type DomainsResponse = ApiResponse<DomainsData>;

// API call
const response = await apiClient.get<DomainsResponse>('/domains');

// Type guard
if (isSuccessResponse(response.data)) {
  // ✅ TypeScript vet: response.data.success = true
  const domains = response.data.data?.domains;
  // domains är nu Domain[] | undefined
}
```

---

## 📝 EXEMPEL 3: Med Error Handling

```typescript
import { apiClient, isSuccessResponse, showSuccess } from '@/lib/api';

const handleSave = async () => {
  try {
    const response = await apiClient.post('/save', formData);
    
    if (isSuccessResponse(response.data)) {
      showSuccess('Sparat!');
      router.push('/success');
    } else {
      // Type-safe: response.data är ErrorResponse
      showError(response.data.message);
    }
  } catch (error) {
    // ErrorProvider visar redan toast automatiskt
    console.error('Save failed:', error);
  }
};
```

---

## 📝 EXEMPEL 4: Service Layer (Befintligt sätt)

**Ingen ändring behövs i services, men kan förbättras:**

```typescript
// FÖRE (fungerar fortfarande)
export interface DomainsResponse {
  success: boolean;
  domains: Domain[];
}

export async function getDomains(): Promise<DomainsResponse> {
  const response = await apiClient.get('/domains');
  return response.data;
}

// EFTER (valfri förbättring)
import { ApiResponse } from '@/lib/api';

export type DomainsResponse = ApiResponse<{ domains: Domain[] }>;
// ELLER behåll custom interface - båda fungerar!

export async function getDomains(): Promise<DomainsResponse> {
  const response = await apiClient.get<DomainsResponse>('/domains');
  return response.data;
}
```

---

## 📝 EXEMPEL 5: Type Guard i useEffect

```typescript
import { isSuccessResponse } from '@/lib/api';

useEffect(() => {
  const fetchData = async () => {
    const response = await apiClient.get('/data');
    
    if (isSuccessResponse(response.data)) {
      // Safe to access data fields
      setItems(response.data.items);
    }
  };
  
  fetchData();
}, []);
```

---

## 📝 EXEMPEL 6: Error Type Checking

```typescript
import { isApiError, ApiError } from '@/lib/api';

try {
  await apiClient.post('/endpoint', data);
} catch (error) {
  if (isApiError(error)) {
    // Type-safe: error är ApiError
    const status = error.response?.status;
    const message = error.response?.data?.message;
    
    console.error('API Error:', { status, message });
  } else {
    // Unknown error type
    console.error('Unknown error:', error);
  }
}
```

---

## 📝 EXEMPEL 7: Generic Response Handler

```typescript
import { ApiResponse, isSuccessResponse } from '@/lib/api';

async function handleApiCall<T>(
  call: () => Promise<{ data: ApiResponse<T> }>,
  onSuccess: (data: T | undefined) => void,
  onError?: (message: string) => void
) {
  try {
    const response = await call();
    
    if (isSuccessResponse(response.data)) {
      onSuccess(response.data.data);
    } else {
      onError?.(response.data.message || 'Unknown error');
    }
  } catch (error) {
    // ErrorProvider handles toast
    onError?.('Request failed');
  }
}

// Usage:
handleApiCall(
  () => apiClient.get('/domains'),
  (data) => setDomains(data?.domains || []),
  (error) => console.error(error)
);
```

---

## 🔄 MIGRATION EXAMPLES

### **Scenario 1: Fixa response.success Bug**

**FÖRE (BUGG):**
```typescript
const response = await apiClient.post('/complete', { step_key });
if (response.success) { // ❌ undefined
  refetch();
}
```

**EFTER (FIX):**
```typescript
const response = await apiClient.post('/complete', { step_key });
if (response.data?.success) { // ✅ Fungerar
  refetch();
}

// ELLER med type guard:
if (isSuccessResponse(response.data)) { // ✅ Type-safe
  refetch();
}
```

### **Scenario 2: Ny Service Function**

```typescript
import { ApiResponse } from '@/lib/api';

interface Profile {
  id: number;
  name: string;
  email: string;
}

// Define response type
type ProfileResponse = ApiResponse<{ profile: Profile }>;

// Service function
export async function getProfile(): Promise<ProfileResponse> {
  const response = await apiClient.get<ProfileResponse>('/profile');
  return response.data;
}

// Usage in component
const data = await getProfile();
if (data.success) {
  setProfile(data.data?.profile);
}
```

### **Scenario 3: Refactor Existing Service (Valfritt)**

```typescript
// FÖRE (fungerar, men kan förbättras)
export interface DomainsResponse {
  success: boolean;
  domains: Domain[];
}

// EFTER (mer DRY, men VALFRITT)
import { ApiResponse } from '@/lib/api';

export type DomainsResponse = ApiResponse<{ domains: Domain[] }>;

// Service function - INGEN ÄNDRING
export async function getDomains(): Promise<DomainsResponse> {
  const response = await apiClient.get('/domains');
  return response.data;
}
```

---

## 🎯 BEST PRACTICES

### **1. Använd Type Guards för Nya Kod**

```typescript
// ✅ REKOMMENDERAT
import { isSuccessResponse } from '@/lib/api';

if (isSuccessResponse(response.data)) {
  // Type-safe access
}

// ⚠️ FUNGERAR men mindre safe
if (response.data?.success) {
  // Standard check
}
```

### **2. Definiera Response Types**

```typescript
// För nya endpoints, använd ApiResponse:
type MyResponse = ApiResponse<{ items: Item[] }>;

// För befintliga, behåll eller refactor gradvis:
export interface MyResponse {
  success: boolean;
  items: Item[];
}
// Båda fungerar!
```

### **3. Använd Single Import**

```typescript
// ✅ BÄST
import { apiClient, showSuccess, ApiResponse } from '@/lib/api';

// ⚠️ FUNGERAR men fler imports
import apiClient from '@/lib/api/client';
import { showSuccess } from '@/lib/events';
```

---

## 📊 COMPATIBILITY MATRIX

| Kod | Före Types | Efter Types | Status |
|-----|-----------|-------------|--------|
| **Services** | `return response.data` | Samma | ✅ Fungerar |
| **useCache** | `const { data }` | Samma | ✅ Fungerar |
| **Direct apiClient** | Varies | Samma | ✅ Fungerar |
| **Custom Response Types** | 50+ interfaces | Kan fortsätta | ✅ Fungerar |
| **Type Guards** | Saknas | `isSuccessResponse()` | ✅ **NYA** |
| **Centraliserad ApiError** | Duplicerad | En definition | ✅ **NYA** |

**Conclusion:** 100% bakåtkompatibelt ✅

---

## 🚀 NÄSTA STEG

### **Omedelbart (Redo att använda):**

```typescript
// I alla nya filer:
import { ApiResponse, isSuccessResponse } from '@/lib/api';
```

### **Gradvis (När du refaktorerar):**

1. Använd `isSuccessResponse()` istället för `response.data?.success`
2. Använd `ApiResponse<T>` för nya response types
3. Använd central `ApiError` type i catch blocks

### **Framtid (Om du vill):**

1. Skapa `api` wrapper (se TODO i types.ts)
2. Migrera services till wrapper
3. Refactor alla custom Response types till `ApiResponse<T>`

---

## ✅ CHECKLIST

**Implementation:**
- [x] types.ts skapad
- [x] index.ts skapad
- [x] Dokumentation skriven
- [x] Exempel skapade

**Testing:**
- [ ] Import från @/lib/api i en fil
- [ ] Verifiera att TypeScript är nöjd
- [ ] Använd isSuccessResponse() någonstans
- [ ] Verifiera att autocomplete fungerar

**Adoption:**
- [ ] Använd i alla nya filer framåt
- [ ] (Valfritt) Migrera befintlig kod gradvis
- [ ] (Valfritt) Skapa api wrapper layer senare

---

**Status: ✅ Type system klart och redo att använda!**

**Du kan nu:**
```typescript
import { 
  apiClient,           // Axios instance
  ApiResponse,         // Type för responses
  isSuccessResponse,   // Type guard
  showSuccess,         // Event helper
  showError           // Event helper
} from '@/lib/api';
```

**Allt på en rad!** 🎉

