Create a new full-stack web application based on the following complete Product Requirements Document (PRD).

The application must be a real estate listing platform with a Progressive Web App (PWA) UI. The primary design philosophy is modern, minimalistic, and futuristic, with a white background. The most critical feature is that property listings are displayed using an embedded HTML iframe code from a virtual tour service called Teleportme. The application must support three distinct user roles: Admin, Lister, and Seeker.

---
## 1. 🚀 Product Overview

* **Product Name:** **Real Prop Realty**
* **Tagline:** Step Inside Virtually
* **Vision:** A modern, PWA-style real estate listing platform for "Real Prop Realty" that provides an immersive user experience by showcasing all properties exclusively through Teleportme virtual walkthroughs.
* **Core Concept:** A clean, fast, "Airbnb-like" interface where users can browse, save, and list properties, with the primary media for every property being a fully interactive virtual tour.
* **Target Audience:**
    * **Seekers (Property Browsers):** Want to find properties and save them to a wishlist.
    * **Listers (Agents/Owners):** Need a simple way to create and manage their property listings.
    * **Admins:** Need a CMS dashboard to manage all users, all listings, and site settings.

---
## 2. 🎨 UI/UX Design Specification

* **Design Philosophy:** Modern, Minimalistic, Futuristic, PWA-first. The UI should feel like a native app.
* **Branding:**
    * **Logo:** The **Real Prop Realty logo** (provided by the user) must be used in the main navigation bar (header) and as the PWA/favicon.
    * **Tagline:** The tagline "Step Inside Virtually" should be present on the homepage, possibly near the main search bar or in the footer.
* **Layout:**
    * **General:** Clean, uncluttered, with generous white space.
    * **Navigation (Public):** A simple bottom navigation bar (for PWA mobile view) with icons for Home, Search, Favorites, and Profile/Login. A standard top navigation bar (featuring the logo) for desktop.
    * **Navigation (Admin):** A separate, secure admin dashboard with a side-panel navigation for Users, Properties, and Settings.
    * **Listing Cards:** On browse/search pages, properties should be shown as large, clean cards. Each card must feature a "Step Inside Virtually" call-to-action and a "Save" (heart) icon.
* **Color Palette:**
    * **Primary Background:** `#FFFFFF` (White)
    * **Primary Text:** `#000000` (Black)
    * **Primary Accent & CTA:** `#FF6600` (Vibrant Orange - used for buttons, links, and highlights)
    * **Secondary Accent:** A shade of green (from the logo's map pin) for success messages or secondary highlights.
    * **Borders & Dividers:** `#EEEEEE` (Very light gray for subtle separation)
* **Typography:**
    * **Font:** Use a clean, sans-serif font family (e.g., **Inter** or **Roboto**).
    * **Hierarchy:** Clear, logical heading sizes (H1, H2, H3) and body text.
* **Key Screens:**
    * **Homepage:** * Feature the Real Prop Realty logo in the header.
        * **Directly below the header, display a prominent button group or tabs for 'BUY', 'RENT', and 'LEASE' to act as primary site filters.**
        * Below this, include a main search bar and grids of featured properties (controlled by the Admin).
    * **Search Results Page:** A filterable list or map view of properties.
    * **Property Details Page:** This is the most critical page.
        * **Above the Fold:** The **Teleportme virtual tour embed** should be the hero element, taking up the main content area. A "Save" (heart) button must be present.
        * **Below the Tour:** A clean layout showing Price, Address, Description, Amenities, and the Lister's contact form.
    * **Favorites Page:** A grid view of all properties the logged-in Seeker has saved.

---
## 3. ⚙️ Core Features & User Stories

### User Role: Public User (Guest)

* **Epic: Property Browsing**
    * As a Guest, I want to visit the Real Prop Realty homepage and immediately see a search bar and featured property listings.
    * **As a User,** I want to click the 'BUY', 'RENT', or 'LEASE' buttons on the homepage to be taken directly to the search results page, pre-filtered for that listing type (where 'BUY' shows properties listed for 'Buy' or 'Sell').
    * As a Guest, I want to search and filter properties (by type, location, price, etc.).
    * As a Guest, I want to click on a property and view its full details, including the Teleportme virtual tour.
    * As a Guest, I want to be prompted to sign up or log in when I try to save a property to a wishlist.

* **Epic: Lead Generation & Onboarding Forms**
    * **As a Guest,** I want dedicated public pages to submit my requirements or properties (e.g., `/onboarding/buyer` and `/onboarding/seller`).
    * **As a Buyer (Tenant equivalent),** I want a multi-step or comprehensive form that collects my specific requirements:
        * **Contact Details:** Full Name, Phone Number, WhatsApp Number, Email.
        * **Opt-in:** A checkbox to opt-in for WhatsApp updates.
        * **Buyer Profile:** Buyer Type (e.g., First-time buyer, Investor, Family).
        * **Property Requirements:** Property Type (Apartment, Villa, etc.), BHK/Bedrooms preference, Budget Range.
        * **Location & Timing:** Preferred Areas (multi-select or text), Expected Purchase/Move-in Date.
    * **As a Seller (Owner equivalent),** I want a comprehensive form to submit my property details for listing consideration:
        * **Contact Details:** Full Name, Phone Number, WhatsApp Number, Email.
        * **Opt-in:** A checkbox to opt-in for WhatsApp updates.
        * **Property Details:** Exact Property Address, Property Type, Expected Price (Sale/Rent).
        * **Specifications:** A section to add extensive custom details (Age of property, specific amenities, furnishing status) which the system will capture as a flexible JSON payload.
    * **As a Guest,** upon submitting either form, I want to see a clean success confirmation, and my submission must be stored securely in the `Onboarding_Submissions` database table with a 'pending' status for Admin review.

### User Role: Seeker (Property Browser)

* **Epic: Authentication & Wishlist**
    * **As a Seeker,** I want to be able to sign up for a free account using my email and a password.
    * **As a Seeker,** I want to be able to log in to my account.
    * **As a Seeker,** I want to browse property listings and click a "Save" or "Heart" icon to add a property to my personal wishlist.
    * **As a Seeker,** I want to be able to click the "Favorites" tab in the navigation bar to see a gallery of all the properties I have saved.
    * **As a Seeker,** I want to be able to remove a property from my wishlist.

### User Role: Lister (Agent / Owner)

* **Epic: Authentication & Profile**
    * **As a Lister,** I want to create an account and log in.
    * **As a Lister,** I want a simple profile page where I can manage my contact information.

* **Epic: Listing Management**
    * **As a Lister,** I want a "Create New Listing" form.
    * **As a Lister,** I want this form to have standard fields (Title, Description, Price, Address, etc.) and select from Admin-defined lists (Property Type, Amenities).
    * **As a Lister,** I want a dropdown for "Listing Type" with options: 'Sell', 'Rent', 'Lease'.
    * **As a Lister, I want a dedicated, mandatory text area labeled "Teleportme Embed Code."**
    * **As a Lister,** I want to be able to paste the *full HTML iframe embed code* provided by Teleportme directly into this text area.
    * **As a Lister,** I want a dashboard (e.g., "My Listings") where I can see, edit, and delete all my active properties.

### User Role: Admin (CMS Dashboard)

* **Epic: Admin Dashboard & User Management**
    * **As an Admin,** I want to log in to a separate, secure admin dashboard.
    * **As an Admin,** I want to view a list of all users and be able to edit their profile, change their role (Seeker, Lister, Admin), or delete/suspend their account.

* **Epic: Global Property Management**
    * **As an Admin,** I want to view *all* property listings on the site, regardless of who listed them.
    * **As an Admin,** I want to be able to edit or delete any property listing.
    * **As an Admin,** I want to have a "Featured Property" toggle on each listing, so I can control which properties appear on the homepage.

* **Epic: Site Configuration Management**
    * **As an Admin,** I want a settings page where I can manage the dropdown lists used during listing creation.
    * **As an Admin,** I want to be able to add or remove options for "Property Type" (e.g., add 'Villa').
    * **As an Admin,** I want to be able to add or remove options from the master "Amenities" list (e.g., add 'Rooftop Deck').

* **Epic: Lead & Onboarding Management (Buyer & Seller Forms)**
    * **As an Admin,** I want a standardized lead pipeline relying exclusively on official Buyer and Seller onboarding forms (mirroring Tenant/Owner forms). Manual lead entry pages should be decommissioned to ensure data consistency.
    * **As an Admin,** I want to review pending form submissions from Buyers and Sellers.
    * **As an Admin,** I want to click a "Verify" button on a submission to convert it into a permanent "Lead" record. This verification process must capture 100% of the submission details (BHK, Budget, Preferred Areas, Move-in Date, Buyer/Seller Type) and bundle them into a comprehensive JSON payload within the lead's message field to prevent data loss.
    * **As an Admin,** I want a Lead Management Dashboard featuring a unified, full-width rectangular card layout for each lead (avoiding split-screen designs) to maximize readability and information density.
    * **As an Admin,** I want a Lead Details Popup that parses the JSON payload to display full, untruncated requirements with proper text-wrapping. The popup must:
        * Strip technical JSON symbols and render arrays as clean, comma-separated lists.
        * Automatically detect and format ISO date strings into human-readable formats (e.g., "1 May 2026").
        * Prioritize and smartly map fields so core requirements (Area, BHK, Budget) are consistently visible.

### User Role: Manager (CMS Dashboard)

* **Epic: Restricted Access & Change Requests**
    * **As a Manager,** I want to log in to the CMS dashboard with restricted permissions (e.g., I can view leads and properties, but cannot permanently delete or alter critical data without approval).
    * **As a Manager,** when I attempt to edit a lead's details, update a status, or delete a note, I want the system to automatically generate a "Change Request" instead of executing the action immediately.
    * **As a Manager,** I want to track the status (pending, approved, rejected) of my submitted change requests.

* **Epic: Admin Approval Workflow (Change Requests)**
    * **As an Admin,** I want a dedicated dashboard section to review "Change Requests" submitted by Managers.
    * **As an Admin,** I want to view the specific details of the proposed change (e.g., what fields are changing, the reason for deletion).
    * **As an Admin,** I want to explicitly "Approve" or "Reject" the request, with the option to leave a review note.
    * **As an Admin,** if I approve the request, the system must automatically apply the requested changes to the database without requiring manual data entry.

---
## 4. 🗃️ Data Model / Database Schema

### `Users` Table
* `user_id` (Primary Key)
* `email` (String, Unique)
* `password_hash` (String)
* `full_name` (String)
* `phone_number` (String)
* `role` (Enum: 'Seeker', 'Lister', 'Admin')

### `Managers` Table
* `manager_id` (Primary Key)
* `name`, `email` (String, email is Unique)
* `password_hash` (String)
* `permissions` (JSON - defines specific access rights)
* `is_active` (Boolean, default: true)
* `created_at` (Timestamp)

### `Change_Requests` Table
* `request_id` (Primary Key)
* `type` (String, e.g., 'edit_lead', 'status_lead', 'delete_lead')
* `entity_type` (Enum: 'lead', 'property')
* `entity_id` (String)
* `entity_title` (String - human-readable label)
* `changes` (JSON - stores the exact proposed modifications)
* `reason` (Text)
* `requested_by` (String)
* `status` (Enum: 'pending', 'approved', 'rejected')
* `reviewed_by` (String)
* `review_note` (Text)
* `created_at`, `updated_at` (Timestamp)

### `Properties` Table
* `property_id` (Primary Key)
* `lister_id` (Foreign Key to `Users.user_id`)
* `title` (String)
* `description` (Text)
* `status` (Enum: 'Active', 'Inactive', 'Pending')
* **`listing_type` (Enum: 'Sell', 'Rent', 'Lease')** - *Simplified based on button request*
* `property_type_id` (Foreign Key to `Property_Types.type_id`)
* `price` (Decimal)
* `address` (String)
* `city` (String)
* `state` (String)
* `zip_code` (String)
* `bedrooms` (Integer)
* `bathrooms` (Integer)
* `square_footage` (Integer)
* `is_featured` (Boolean, default: false)
* `created_at` (Timestamp)
* `updated_at` (Timestamp)

### `Property_Media` Table
* `media_id` (Primary Key)
* `property_id` (Foreign Key to `Properties.property_id`)
* `media_type` (Enum: 'Teleportme')
* **`embed_code` (Text)** - This is the critical field for the Teleportme HTML.

### `Amenities` Table (Managed by Admin)
* `amenity_id` (Primary Key)
* `name` (String, Unique, e.g., 'Swimming Pool', 'Gym', 'Parking')

### `Property_Amenities_Junction` Table (Many-to-Many)
* `property_id` (Foreign Key to `Properties.property_id`)
* `amenity_id` (Foreign Key to `Amenities.amenity_id`)

### `Property_Types` Table (Managed by Admin)
* `type_id` (Primary Key)
* `name` (String, Unique, e.g., 'Apartment', 'House', 'Commercial')

### `User_Favorites` Table (Wishlist Feature)
* `user_id` (Foreign Key to `Users.user_id`)
* `property_id` (Foreign Key to `Properties.property_id`)
* `created_at` (Timestamp)
* *(Primary Key: Composite of `user_id` and `property_id`)*

### `Onboarding_Submissions` Table
* `submission_id` (Primary Key)
* `form_type` (Enum: 'Buyer', 'Seller')
* `status` (Enum: 'pending', 'verified', 'rejected')
* `name`, `phone`, `email` (String)
* `buyer_type` / `seller_type` (String)
* `property_type` (String)
* `budget_range` (String)
* `bedrooms` (String)
* `preferred_areas` (String)
* `move_in_date` (Timestamp)
* `property_details` (JSON - for Seller properties)
* `created_at`, `updated_at` (Timestamp)

### `Leads` Table
* `lead_id` (Primary Key)
* `lead_type` (Enum: 'Buyer', 'Seller')
* `source` (String, e.g., 'onboarding_form')
* `status` (String, e.g., 'new', 'contacted', 'closed')
* `name`, `phone`, `email` (String)
* `property_type`, `budget_range`, `preferred_area`, `bhk_preference` (String)
* `message` (Text - stores the full JSON payload of all submission details)
* `created_at`, `updated_at` (Timestamp)

---
## 5. 🛠️ Technical Requirements

* **Architecture:** Progressive Web App (PWA) to ensure it's installable on mobile devices and feels like a native app.
* **Frontend:** A modern JavaScript framework (e.g., React, Vue, Svelte) for a fast, component-based UI.
* **Backend:** A scalable backend (e.g., Node.js, Python) to manage APIs, authentication, and the database.
* **Key Functionality:** The system *must* be able to accept raw HTML embed code in the backend, sanitize it to prevent security issues (XSS), and then render it correctly on the frontend. The `embed_code` field should be stored as a `TEXT` type in the database.