# Next Level Recreation Center - Finalized UX Map & System Architecture

## 1. Public Ecosystem
### Homepage (The Hook)
- **Goal:** Establish mission and inclusive Houston/Dayton branding.
- **CTAs:** "Book Your Space" (Rentals), "Join the Family" (Memberships), "Admin Console" (Hidden/Footer).
- **SEO:** Optimized meta-tags for regional visibility.

### Memberships & Donations
- **Goal:** Conversion and community support.
- **Tiers:** Community, Bronze, Silver (Seniors), Gold, Platinum, Elite.
- **Highlight:** Clear distinction for Veteran discounts and tax-deductible donation pathways.

### Venue Rental & Events
- **Selection:** High-end visual filters for Courts, Event Halls, and Veteran Lounges.
- **Registration:** External Tally.so integration for robust data gathering.

---

## 2. Member Portal (Self-Service CRM)
### Member Authentication
- **Flow:** `member-login.html` (Email/Password & Google OAuth).
- **Self-Healing:** Automatic creation of Firestore `members` record upon first login.

### Member Dashboard (`member-portal.html`)
- **Overview:** Active status, tier display, and member-since validation.
- **QR ID:** Real-time generation of Member ID for physical check-ins.
- **Booking Tracker:** Live counter of upcoming reservations.

### Account Settings Hub
- **Profile:** Real-time name updates and Profile Photo management.
- **Storage:** Direct integration with Firebase Storage for photo uploads.
- **Billing:** Placeholders for payment method management.

---

## 3. Administrative Suite (Kinetic Admin)
### Admin Security Gateway
- **Gatekeeper:** `admin-login.html`.
- **Validation:** Server-side UID whitelist check against the `admins` collection.
- **Error Reporting:** Real-time diagnostic alerts for unauthorized access attempts.

### Dashboard HUD (`admin-dashboard.html`)
- **Metrics:** Aggregated member counts and global activity feed.
- **Navigation:** Unified sidebar for cross-suite operations.

### Operation Modules
- **Booking Schedule (`admin-bookings.html`):** Full CRUD for facility rentals with GCal Master Preview.
- **Events Manager (`admin-events.html`):** Control center for community programs.
- **Member Database (`admin-members.html`):** Searchable CRM for tracking account status and join dates.
- **Donation Tracker (`admin-donations.html`):** Financial audit log for community contributions.

---

## 4. Technical Infrastructure
- **Core:** HTML5 / Tailwind CSS / Vanilla JS.
- **Backend:** Firebase (Auth, Firestore, Storage, Hosting).
- **Security:** Granular Firestore Rules protecting user data from unauthorized edits.
