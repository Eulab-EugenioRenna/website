# PocketBase Backend

This directory contains the PocketBase backend configuration and migrations for the Eulab website.

## Schema Architecture

The database is structured into 8 main collections:

### 1. Main Content
- **projects**: Portfolio projects.
  - Relation: `client` (links to `clients` collection).
  - Fields: `name`, `description`, `image`, `tags` (JSON), `link`, `work_date`.
    - **tags Example**: `["Web Design", "Development", "SEO"]`
- **services**: Services offered.
  - Fields: `name`, `slug`, `description`, `icon`, `features` (JSON), `pricing_tiers` (JSON).
    - **features Example**: `["Custom Domain", "24/7 Support", "Analytics"]`
    - **pricing_tiers Example**:
      ```json
      {
        "basic": { "price": "€500", "features": ["One Page", "Basic SEO"] },
        "professional": { "price": "€1200", "features": ["Multipage", "CMS", "Advanced SEO"] },
        "enterprise": { "price": "Custom", "features": ["Custom App", "SLA", "Priority Support"] }
      }
      ```
- **tech_stack**: Technologies used.
  - Fields: `name`, `logo`, `website`.

### 2. Trust & Social Proof
- **clients**: Companies/Clients worked with.
  - Fields: `name`, `logo`, `website`, `year`.
- **partners**: Strategic partners.
  - Fields: `name`, `logo`, `website`.
- **testimonials**: Client reviews.
  - Fields: `client_name`, `client_company`, `rating`, `quote`, `featured` (bool).

### 3. Content & Support
- **blog_posts**: Blog articles.
  - Fields: `title`, `slug`, `content` (Rich Text), `status` ('draft' | 'published'), `tags` (JSON).
    - **tags Example**: `["Tutorial", "News", "Tech"]`
- **faq**: Frequently asked questions.
  - Fields: `question`, `answer`, `category`.

## Blog & Webhook Logic (N8N)

The blog system is designed to be headless and automatable via N8N for a "Set it and forget it" workflow.

**Logic Flow:**
1.  **Drafting**: Posts can be created via the Admin UI or N8N with `status="draft"`.
2.  **Publishing**: The frontend `PocketbaseService.getBlogPosts()` only fetches records where `status="published"`.
3.  **N8N Integration**:
    - **Webhook**: You can set up an N8N workflow to listen for external events (e.g., RSS feed updates, new YouTube videos, or AI agents generation).
    - **Authentication**: N8N connects to PocketBase using an Admin Email/Password.
    - **Action**: N8N formats the content and inserts a new record into `blog_posts`.
    - **Auto-Publish**: Set `status="published"` in the N8N payload to make it live immediately, or `draft` to review first.

## Inserting Data

### Option A: Admin UI (Manual)
1.  Go to `http://localhost:8090/_/` (local) or your production URL.
2.  Login with your Admin credentials.
3.  Select a collection on the left and click **"New Record"**.

### Option B: Migrations (Seeding)
The file `pb_migrations/1710000000_init_collections.js` contains seed data for:
- `tech_stack`: Pre-filled with Angular, PocketBase, Docker, etc.
- `clients`: Pre-filled with standard clients.

To reset and re-seed:
1.  Stop the backend container.
2.  Delete `pb_data`.
3.  Restart the container (`docker compose up -d`). The migration will run automatically.
