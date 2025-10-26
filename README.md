# Gateway Service

Gateway HTTP service for Maingoo. Provides REST endpoints for Auth and Documents Analyzer microservices over NATS.

## Setup

```bash
pnpm install
cp .env.example .env
pnpm run start:dev
```

## Environment variables

See `.env.example` for defaults. Variables are validated with Joi at startup.

- `PORT`: HTTP port (default 3000)
- `NATS_SERVERS`: comma separated list (e.g. `nats://localhost:4222`)
- `JWT_SECRET` or `JWKS_PATH`: credentials to validate incoming JWTs

## HTTP Endpoints

### Authentication

| Method | Path                 | Description                    | Auth Required |
| ------ | -------------------- | ------------------------------ | ------------- |
| POST   | `/api/auth/register` | Register a new user            | ❌            |
| POST   | `/api/auth/login`    | Authenticate and get tokens    | ❌            |
| POST   | `/api/auth/refresh`  | Refresh access/refresh tokens  | ❌            |
| GET    | `/api/auth/roles`    | Get available roles            | ❌            |
| GET    | `/api/auth/profile`  | Get authenticated user profile | ✅            |

### Document Analysis

| Method | Path                   | Description                              | Auth Required |
| ------ | ---------------------- | ---------------------------------------- | ------------- |
| POST   | `/api/analyze/invoice` | Upload invoice image for AI analysis     | ✅            |
| GET    | `/api/analyze/:id`     | Get document analysis status/result      | ✅            |
| GET    | `/api/analyze`         | List all documents for user's enterprise | ✅            |

### Suppliers

| Method | Path                 | Description           | Auth Required |
| ------ | -------------------- | --------------------- | ------------- |
| POST   | `/api/suppliers`     | Create a new supplier | ✅            |
| GET    | `/api/suppliers`     | List all suppliers    | ✅            |
| GET    | `/api/suppliers/:id` | Get supplier by ID    | ✅            |

### Invoices (Auto-created from Document Analysis)

| Method | Path                          | Description                        | Auth Required |
| ------ | ----------------------------- | ---------------------------------- | ------------- |
| POST   | `/api/suppliers/invoices`     | Create invoice manually (optional) | ✅            |
| GET    | `/api/suppliers/invoices`     | List all invoices for enterprise   | ✅            |
| GET    | `/api/suppliers/invoices/:id` | Get invoice by ID                  | ✅            |

### Enterprises

| Method | Path                   | Description             | Auth Required |
| ------ | ---------------------- | ----------------------- | ------------- |
| POST   | `/api/enterprises`     | Create a new enterprise | ❌            |
| GET    | `/api/enterprises`     | List all enterprises    | ✅            |
| GET    | `/api/enterprises/:id` | Get enterprise by ID    | ✅            |
| PATCH  | `/api/enterprises/:id` | Update enterprise       | ✅            |
| DELETE | `/api/enterprises/:id` | Delete enterprise       | ✅            |

### Health Check

| Method | Path      | Description          | Auth Required |
| ------ | --------- | -------------------- | ------------- |
| GET    | `/health` | Check service health | ❌            |

**JWT Protected routes** (✅) require `Authorization: Bearer <token>` header.

## Invoice Processing Flow

```
1. Upload Invoice Image
   POST /api/analyze/invoice
   → Returns documentId

2. Analyzer processes with OpenAI
   → Extracts: supplier, invoice number, items, totals
   → Status: PENDING → PROCESSING → DONE

3. Auto-creation via NATS event
   → Analyzer emits 'documents.analyzed'
   → Suppliers service creates invoice automatically

4. Query Created Invoice
   GET /api/suppliers/invoices
   → Returns all invoices for your enterprise
```

See [INVOICE-FLOW.md](../../INVOICE-FLOW.md) for detailed documentation.

## Postman Collection

Import the Postman collection from `postman/Maingoo-Gateway-API.postman_collection.json` to test all endpoints.

**Available environments:**

- `Local.postman_environment.json` (http://localhost:3000)
- `Development.postman_environment.json` (your dev server)

**Quick Start:**

1. Import collection and environment
2. Run "Login User" → Token saved automatically
3. Run "Submit Invoice for Analysis" → documentId saved
4. Run "Get Document by ID" → Check status
5. Run "List All Invoices" → See auto-created invoice

## Development Tips

- Rate limiting configured via `@nestjs/throttler` (TTL & limit env controlled).
- Responses automatically wrapped with success metadata; RPC errors are mapped to HTTP responses.
- File uploads handled in memory via `multer`.
