# Next Level Recreation Center - README

## Project Overview
Next Level Recreation Center, LLC is a 100% Veteran-owned and operated facility focused on empowering Veterans, youth, and the community through sports, mentorship, and wellness. This repository contains the high-fidelity codebase for the center's unified digital platform.

## Key Features
- **Member Hub (Self-Service CRM):** A secure portal for members to manage profiles, upload photos via Firebase Storage, and track their bookings.
- **Admin Console (Kinetic HUD):** A dedicated administrative suite for real-time management of facility schedules, membership databases, and donation records.
- **Booking Engine:** Real-time facility reservation system with Master Google Calendar synchronization.
- **Membership Management:** Integrated tiered pricing with "Self-Healing" record generation for new users.
- **Event Ecosystem:** Comprehensive calendar with Tally.so integration for the June 11th Veteran Health Fair.
- **Donation Platform:** Impact-driven donation page integrated with GoFundMe.

## Technology Stack
- **Frontend:** HTML5, Tailwind CSS
- **Interactions:** Vanilla JavaScript (ES6 Modules)
- **Backend-as-a-Service:** Firebase (Authentication, Firestore Database, Cloud Storage)
- **Forms:** Tally.so Integration
- **Deployment:** Vercel (Edge optimized)

## System Architecture
The platform is split into two secure environments:
1. **The Member Portal:** Public-facing self-service hub with auto-registration.
2. **The Admin Console:** Restricted operational gateway requiring specific UID authorization in the `admins` collection.

## Deployment Instructions
1. Ensure `js/firebase-config.js` is updated with your production API keys.
2. Set Firestore Security Rules to enable Role-Based Access Control (RBAC).
3. Connect the GitHub repository to **Vercel** for automated deployment.

## Design System
- **Theme:** "The Disciplined Hub" (Kinetic Community)
- **Primary Colors:** Navy (#002046), Signal Red (#B51A1E), Silver
- **Typography:** Manrope (Brand/Headers), Public Sans (Body)
