# Lenkie Frontend Assessment

A small slice of the Lenkie Broker Portal. Brokers use the portal to submit loan applications on behalf of their SME clients.

You'll be given the task at the start of your interview. **No preparation is needed.** Please just make sure the app runs before the call.

## Setup

Requires Node 20+ (see `.nvmrc`).

```bash
npm install
npm run dev
```

Open http://localhost:3000. You should see a list of loan applications.

## Stack

- **Nuxt 3** (client-side rendered, `ssr: false`), **Vue 3**, **TypeScript**
- **Tailwind CSS**: brand colours are in `tailwind.config.ts`, global styles in `assets/css/tailwind.css`
- Available if you want them, but none are required: **TanStack Vue Query**, **Vuelidate**, **VueUse**, **Day.js**

Work however you normally would. Use any editor, docs, AI tools or none.

## Project tour

```
components/ui/         Shared design system components (AppButton, AppInput, AppSelect,
                       AppCard, AppAlert, StatusBadge, AppSkeleton)
components/dev/        Mock API controls panel (dev tooling, not part of the product)
layouts/default.vue    App shell
pages/applications/    index.vue: list (done) · new.vue and [id].vue: stubs
plugins/vue-query.ts   Vue Query client setup
services/              Typed API client (loanApplicationsApi) and query keys
types/                 API types
server/                Mock backend (Nitro server routes, in-memory data)
```

## API

The mock backend mirrors the real Lenkie API contract. Data is in memory and resets when the dev server restarts.

| Method | Path | Success | Errors |
|---|---|---|---|
| `GET` | `/api/loan-applications` | `200` `LoanApplication[]`, newest first | |
| `GET` | `/api/loan-applications/:id` | `200` `LoanApplication` | `404` |
| `POST` | `/api/loan-applications` | `201` `LoanApplication` | `400`, `409`, `500` |

**Request body for `POST`:**

```json
{
  "companyName": "Northwind Traders Ltd",
  "companyNumber": "09876543",
  "fullName": "Jane Doe",
  "email": "jane.doe@example.com",
  "amount": 50000,
  "purpose": "Business expansion"
}
```

- `amount` is in GBP. It must be between 1,000 and 10,000,000, with at most 2 decimal places.
- `purpose` is one of the values in `LOAN_PURPOSES` (`types/loan-application.ts`).

**Errors** use [RFC 7807](https://www.rfc-editor.org/rfc/rfc7807) problem details. Validation errors are keyed by field:

```json
{
  "title": "One or more validation errors occurred",
  "status": 400,
  "errors": { "companyNumber": ["Enter a valid Companies House number, e.g. 01234567 or SC123456."] }
}
```

The API client throws an `ApiError` with `status` and `problem` for any non-2xx response.

**Timestamps** (`createdAt`, `expiresAt`) are ISO 8601 in UTC.

## Mock API controls

The **Mock API** button in the bottom-right corner lets you change how the mock backend behaves:
- **Latency**: Fast, Normal or Slow
- **Submit**: force a `500` or `409` response
- **Data**: switch between a clean dataset and a realistic one
