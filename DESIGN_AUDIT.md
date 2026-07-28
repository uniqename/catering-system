# GTT CATERING SYSTEM - 12 PAGE DESIGN AUDIT

**Design Foundation:** Dark Luxury SaaS
- Primary Background: #0a1911 (forest green)
- Secondary Background: #0f2416 (slightly lighter green)
- Accent Color: #d7a859 (gold)
- Text Primary: #ffffff (white)
- Text Secondary: #a8d5ca (pale green)
- Cards: Subtle border (rgba(215, 168, 89, 0.08))

---

## PAGE 1: DASHBOARD ✅ REFERENCE
**Status:** 95% Complete - Matches Mockup

**Key Elements:**
- Header: "Good morning, Alexandra!" + subtitle
- 4 Metric Cards (NEW INQUIRIES, CONFIRMED ORDERS, REVENUE, TOTAL CLIENTS)
- Revenue Chart: Line graph with gold dots and gradient fill
- Top Menu Items: Donut chart with legend
- Today's Tasks: Checklist with strikethrough completed items
- Recent Inquiries: Table with 3-dot action menu
- Upcoming Events: Date-focused cards on right sidebar
- Quick Actions: 6 icon buttons (New Inquiry, Create Order, Add Client, Create Invoice, View Calendar, Share QR)
- Get More Inquiries: QR code + Share Now button

---

## PAGE 2: INQUIRIES (New Inquiry Form + List)

### Current State:
✅ Form exists - dark theme with proper inputs
⚠️ List view missing - should show all inquiries with filters

### Should Have:
```
HEADER: "Inquiries"
FILTERS:
  - Status (All, Inquiry, Quoted, Proposal Sent, Confirmed)
  - Date Range (This Month, Last Month, Last 3 Months, Custom)
  - Sort (Newest, Oldest, High Value, Low Value)

INQUIRY CARDS/TABLE:
  - Client Name
  - Event Type
  - Event Date
  - Guest Count
  - Budget
  - Status Badge
  - Last Updated
  - 3-Dot Menu (View, Edit, Send Proposal, Delete)

CLICK ANYWHERE ON ROW:
  → Opens Inquiry Detail Page

SIDEBAR (Right):
  - Total Inquiries (count)
  - This Week (count)
  - Conversion Rate (% → Confirmed)
  - Average Budget ($)

NEW INQUIRY BUTTON (Top Right):
  → Opens form modal or dedicated form page
```

### Visual Spec:
- Cards: #0f2416 background, subtle border
- Status badges: Green (inquiry/confirmed), Amber (quoted), etc.
- Spacing: gap-6 between cards, p-6 inside cards
- Hover state: bg-[#102418] with gold border

### Missing Features:
- [ ] Inquiry list view (currently just shows form)
- [ ] Filter system
- [ ] Search functionality
- [ ] Bulk actions (select multiple)
- [ ] Lead scoring (High/Med/Low)
- [ ] Export to CSV

---

## PAGE 3: ORDERS (Event Management)

### Current State:
❌ Basic order management exists but not event-focused
⚠️ Needs complete redesign to match Dashboard design system

### Should Have:
```
HEADER: "Orders"

FILTER TABS (Horizontal):
  - All Events
  - Inquiry (pending)
  - Proposal Sent
  - Deposit Paid
  - Confirmed
  - Completed

MAIN VIEW: Event Cards or Timeline
  - Event Type (Wedding, Corporate, Birthday, etc.)
  - Client Name
  - Date & Time
  - Guest Count
  - Status
  - Menu Selected (Yes/No)
  - Deposit Paid (Yes/No with amount)
  - Invoice Created (Yes/No)

CLICK EVENT:
  → Opens Event Detail Page showing:
    - Full client info
    - Menu selections
    - Staff assigned
    - Venue details
    - Payment status
    - Timeline
    - Notes
    - Action buttons (Create Invoice, Send Reminder, Mark Complete)

SIDEBAR (Right):
  - Upcoming This Week (count)
  - Awaiting Deposit (count)
  - Confirmed This Month (count)
  - Revenue Impact ($)

CALENDAR BUTTON (Top Right):
  → Links to Calendar view
```

### Visual Spec:
- Status color coding: Green (confirmed), Amber (pending), Red (overdue)
- Cards: #0f2416 with subtle hover effects
- Timeline view option for upcoming events
- Color-coded by status across the interface

### Missing Features:
- [ ] Event Detail page (built but not linked)
- [ ] Status timeline visualization
- [ ] Staff assignment interface
- [ ] Menu selection tracking
- [ ] Deposit tracking
- [ ] Event checklists

---

## PAGE 4: CALENDAR

### Current State:
✅ Calendar exists with event dots
⚠️ Needs deeper interaction and event context

### Should Have:
```
MONTH/WEEK/DAY VIEWS:
  - Month: Grid with colored dots for events
  - Week: Hourly timeline view
  - Day: Detailed timeline

EVENTS SHOWN:
  - Catering events (colored by type or status)
  - Proposal deadlines (different color)
  - Tastings
  - Deliveries
  - Staff days off

CLICK EVENT:
  → Opens Event Detail Sidebar showing:
    - Full event info
    - Client
    - Menu
    - Status
    - Staff assigned
    - Venue
    - Next steps button

LEFT SIDEBAR:
  - Upcoming Events list
  - Today's events highlighted
  - Overdue items in red

FILTERS (Top):
  - Event Type
  - Status
  - Staff Member
```

### Visual Spec:
- Color coding by event type/status
- Current day highlighted (#d7a859 border)
- Responsive: Mobile (day view) → Tablet (week) → Desktop (month)
- Event detail sidebar sticky on right

### Missing Features:
- [ ] Week/Day view
- [ ] Multi-user calendar (team visibility)
- [ ] Reminders/notifications
- [ ] Sync with Google Calendar
- [ ] Time slots visualization
- [ ] Conflict detection

---

## PAGE 5: CLIENTS (CRM)

### Current State:
✅ Client manager exists
⚠️ Needs CRM features and proper layout

### Should Have:
```
HEADER: "Clients"

SEARCH BAR (Top):
  - Search by name, email, phone
  - Filter by status (Active, Prospect, Inactive)
  - Sort by (Recent, Most Events, Highest Value)

CLIENT CARDS OR TABLE:
  - Client Photo (initial circle)
  - Client Name
  - Lifetime Value ($)
  - # of Events
  - Last Event Date
  - Status
  - 3-Dot Menu (View, Edit, Delete, Send Email)

CLICK CLIENT NAME:
  → Opens Client Profile Page

SIDEBAR (Right):
  - New Clients This Month (count)
  - Repeat Clients (count)
  - Total Revenue from Clients ($)
  - Avg. Client Lifetime Value ($)

ADD CLIENT BUTTON (Top Right):
  → Opens form or modal
```

### Visual Spec:
- Client cards: #0f2416 background
- Initial circles: Gold (#d7a859) with white text
- Lifetime Value: Large gold text
- Status indicators: Green/Amber/Red
- Hover: bg-[#102418] with border

### Missing Features:
- [ ] Client segments (VIP, Regular, One-Time)
- [ ] Communication history
- [ ] Email/SMS templates
- [ ] Client preferences (dietary, style)
- [ ] Document storage
- [ ] Birthday/Anniversary reminders

---

## PAGE 6: MENU & PACKAGES

### Current State:
✅ Menu system exists
⚠️ Needs package tier structure

### Should Have:
```
HEADER: "Menu & Packages"

TAB NAVIGATION:
  - Packages (Bronze, Silver, Gold, Custom)
  - A La Carte Items
  - Beverages
  - Add-ons (Linens, Tables, Staff)

PACKAGE CARDS:
  - Package Name
  - Price
  - Items Included (list)
  - Popularity (# of orders)
  - Margins (%)
  - Actions (Edit, Duplicate, Delete)
  - "Use This Package" button

CLICK PACKAGE:
  → Expands to show full details
  → Option to customize

A LA CARTE ITEMS TABLE:
  - Item Name
  - Category
  - Price
  - Cost
  - Margin
  - Popularity
  - Status (Available/Seasonal)

SIDEBAR (Right):
  - Most Popular Items (top 3)
  - Highest Margin Items
  - Seasonal Menu Management
  - Pricing by Event Type
```

### Visual Spec:
- Package cards: Gold border (#d7a859) on #0f2416 background
- Price in large gold text
- Margin percentage in #10B981 (green)
- Edit mode: Inline editable fields

### Missing Features:
- [ ] Package customization UI
- [ ] Ingredient-level costing
- [ ] Allergen/dietary tags
- [ ] Photos for each item
- [ ] Seasonal pricing
- [ ] Pricing by guest count

---

## PAGE 7: INVOICES

### Current State:
⚠️ Invoice system exists
❌ Invoice list view missing
❌ Invoice detail/preview missing

### Should Have:
```
HEADER: "Invoices"

FILTER TABS:
  - All
  - Draft
  - Sent
  - Partially Paid
  - Paid
  - Overdue

INVOICES TABLE/LIST:
  - Invoice #
  - Client Name
  - Event Date
  - Amount
  - Due Date
  - Paid Amount
  - Status Badge
  - Last Updated
  - 3-Dot Menu (View, Edit, Send, Duplicate, Delete)

CLICK INVOICE:
  → Opens Invoice Preview (PDF-like view)
    - Header with logo/company info
    - Client info block
    - Line items table
    - Subtotal, Tax, Total
    - Payment terms
    - Payment button (Stripe link if unpaid)
    - Download PDF button
    - Send Email button
    - Mark as Paid button

TOP RIGHT ACTIONS:
  - Create Invoice Button → Opens Invoice Builder
  - Export CSV Button

SIDEBAR (Right):
  - Total Outstanding ($)
  - Overdue Amount ($)
  - This Month Revenue ($)
  - Paid This Month ($)
  - Collection Rate (%)
```

### Visual Spec:
- Status colors: Green (paid), Gold (sent), Red (overdue)
- Invoice number in gold
- Amount in large white text
- Hover: subtle border animation

### Missing Features:
- [ ] Invoice list view (priority!)
- [ ] Invoice preview/detail page
- [ ] PDF generation
- [ ] Payment tracking
- [ ] Stripe integration
- [ ] Email template customization
- [ ] Auto-payment reminders
- [ ] Subscription/recurring invoices

---

## PAGE 8: PAYMENTS

### Current State:
✅ Payments tracker exists
⚠️ Needs deeper detail and reconciliation

### Should Have:
```
HEADER: "Payments"

TOP SUMMARY:
  - Revenue Today ($)
  - Deposits Received ($)
  - Outstanding Balance ($)
  - Refunds This Month ($)

PAYMENT METHOD TABS:
  - All
  - Stripe
  - Bank Transfer
  - Cash
  - Check

PAYMENTS TABLE:
  - Invoice #
  - Client Name
  - Amount
  - Date Paid
  - Payment Method
  - Status (Received, Pending, Failed)
  - 3-Dot Menu (View Invoice, Issue Refund, Contact)

CLICK ROW:
  → Expands to show:
    - Full transaction details
    - Invoice preview
    - Event details
    - Refund options (if applicable)

SIDEBAR (Right):
  - Payment Methods breakdown (chart)
  - Revenue Trend (last 30 days)
  - Aging Report (0-30, 31-60, 60+)
  - Next 7 Days Revenue ($)

FILTERS (Top):
  - Date Range
  - Payment Method
  - Status
  - Amount Range
```

### Visual Spec:
- Status colors: Green (received), Amber (pending), Red (failed)
- Amount in gold text
- Chart colors: #d7a859, #10B981, #f59e0b
- Mini chart showing trend

### Missing Features:
- [ ] Refund management
- [ ] Bank reconciliation
- [ ] Payment plans/installments
- [ ] Stripe webhook integration
- [ ] Aging report
- [ ] Revenue forecasting
- [ ] Tax summary report

---

## PAGE 9: REPORTS (Business Intelligence)

### Current State:
⚠️ Profit dashboard exists but basic
❌ Missing executive summary

### Should Have:
```
HEADER: "Reports"

TAB NAVIGATION:
  - Executive Summary
  - Revenue
  - Bookings
  - Customers
  - Menu Performance
  - Financial

EXECUTIVE SUMMARY:
  - YTD Revenue ($) - large gold number
  - Total Events (count)
  - Avg Revenue Per Event ($)
  - Customer Retention (%)
  - Lead Conversion (%)

REVENUE SECTION:
  - Revenue This Month vs Last Month (comparison)
  - Revenue Trend (line chart, last 12 months)
  - Revenue by Event Type (pie chart)
  - Top Clients by Revenue (table)

BOOKINGS SECTION:
  - Bookings Trend (line chart)
  - Bookings by Type (bar chart)
  - Conversion Rate (inquiry → confirmed %)
  - Sales Pipeline (funnel chart)

CUSTOMERS SECTION:
  - New Customers This Month (count)
  - Repeat Customer Rate (%)
  - Customer Lifetime Value (avg)
  - Churn Rate (%)

MENU PERFORMANCE:
  - Top Selling Items (table)
  - Menu Item Margins (chart)
  - Popular Pairings (what sells together)

FINANCIAL:
  - Gross Profit (%)
  - Operating Expenses
  - Net Profit
  - Cash Flow

FILTERS (All Sections):
  - Date Range (This Month, YTD, Last 12M, Custom)
  - Event Type
  - Price Range

EXPORT BUTTON (Top Right):
  - Export to PDF
  - Export to CSV
  - Schedule Report (email)
```

### Visual Spec:
- Charts: Mix of line (trends), pie (breakdown), bar (comparison)
- Colors: #d7a859 (primary), #10B981 (positive), #f59e0b (warning)
- Large metric cards: #0f2416 with gold accent text
- Table rows: alternating subtle background

### Missing Features:
- [ ] Executive summary view
- [ ] Advanced charting (funnel, waterfall)
- [ ] Custom report builder
- [ ] Scheduled reports via email
- [ ] Comparison (YoY, MoM)
- [ ] Forecasting
- [ ] Export to PDF/Excel
- [ ] Data drill-down

---

## PAGE 10: SETTINGS

### Current State:
✅ Business settings exist
⚠️ Missing team management
⚠️ Missing integrations

### Should Have:
```
HEADER: "Settings"

SIDEBAR TABS (Left):
  - Business Info
  - Operations
  - Financial
  - Team (NEW)
  - Integrations (NEW)
  - Notifications (NEW)
  - Billing (NEW)

BUSINESS INFO:
  ✅ Company Name
  ✅ Owner Name
  ✅ Logo Upload
  ✅ Email
  ✅ Phone
  ✅ Website
  ✅ Address
  ✅ Timezone
  ⚠️ Tax ID/EIN
  ⚠️ Business License

OPERATIONS:
  ✅ Business Hours
  ✅ Min Event Size
  ✅ Max Event Size
  ✅ Default Event Buffer
  ⚠️ Lead Time (min days before event)
  ⚠️ Cancellation Policy
  ⚠️ Standard Delivery Radius

FINANCIAL:
  ✅ Tax Rate
  ✅ Currency
  ⚠️ Deposit % required
  ⚠️ Late payment fee
  ⚠️ Acceptable payment methods

TEAM (NEW):
  - Add Team Member button
  - Team member list:
    - Name
    - Role (Owner, Manager, Staff)
    - Email
    - Phone
    - Active/Inactive
    - 3-Dot Menu (Edit, Remove)

INTEGRATIONS (NEW):
  - Stripe (connect/reconnect button)
  - Google Calendar (sync)
  - Twilio (SMS)
  - Mailchimp (email)
  - QuickBooks (accounting)
  - Each with ON/OFF toggle

NOTIFICATIONS (NEW):
  - Email Notifications (toggle)
    - New Inquiry
    - Deposit Received
    - Invoice Overdue
    - Event Reminder (days before)
  - SMS Notifications (toggle)
    - Event Reminders
    - Payment Confirmations

BILLING (NEW):
  - Current Plan
  - Next Billing Date
  - Payment Method
  - Update Payment Method button
  - Invoice History link

SAVE CHANGES BUTTON (Top Right)
```

### Visual Spec:
- Tab navigation: Gold underline for active
- Input fields: Dark background (#0a1911) with subtle border
- Toggles: Green when ON, gray when OFF
- Connected integrations: Green checkmark indicator
- Section dividers: Subtle border (rgba(215, 168, 89, 0.1))

### Missing Features:
- [ ] Team management (CRITICAL)
- [ ] Role-based permissions
- [ ] Integrations page (CRITICAL for Stripe, Calendar, SMS)
- [ ] Notification preferences
- [ ] Billing/subscription management
- [ ] API key management
- [ ] Audit log
- [ ] Data export/backup

---

## PAGE 11: CLIENT BOOKING (QR Landing)

### Current State:
✅ Client booking form exists
⚠️ Needs styling refinement

### Should Have:
```
HEADER SECTION:
  - Company Logo (Garage to Table)
  - Company Name
  - Tagline: "Curated meals, flavored with love"

FORM FIELDS:
  ✅ Name *
  ✅ Email *
  ✅ Phone *
  ✅ Event Type (dropdown)
  ✅ Event Date *
  ✅ Guest Count *
  ✅ Budget
  ✅ Special Requests (textarea)

FORM LAYOUT:
  - Clean, minimal
  - Gold accent button
  - Mobile responsive
  - Dark theme matching dashboard

SUCCESS STATE:
  ✅ Thank you message
  ✅ Confirmation email notice

FOOTER:
  - Contact info (phone, email)
  - Social media links (optional)
  - "Powered by Garage to Table" (subtle)

RESPONSIVE:
  - Mobile: Single column, large tap targets
  - Tablet: Two column layout
  - Desktop: Centered form, max-width 600px
```

### Visual Spec:
- Background: #0a1911
- Form containers: #0f2416 with subtle border
- Input fields: Dark (#0a1911), subtle gold border on focus
- Button: Large gold (#d7a859) with hover effect
- Success message: Green background, checkmark icon

### Features Status:
✅ All required features present
⚠️ Mobile responsiveness needs testing

---

## PAGE 12: CLIENT ORDER (Full Menu)

### Current State:
✅ Client order page exists with menu/drinks/rentals
⚠️ Needs refining

### Should Have:
```
HEADER:
  - Logo
  - Company Name
  - Tagline

MENU SECTIONS:
  ✅ Main Dishes
    - Jollof Rice
    - Grilled Chicken
    - Beef Stew
    - Fried Rice
    - Price, description, qty selector
  
  ✅ Sides & Vegetables
    - Plantains, Salad, Coleslaw
    - Price, qty selector
  
  ✅ Beverages
    - Water, Juice, Soda, Wine
    - Price, qty selector
  
  ✅ Event Rentals
    - Tables (Round, Rectangular)
    - Chairs (per 4)
    - Linens
    - Price, qty selector

LAYOUT:
  - Left: Menu items in grid
  - Right: Sticky shopping cart sidebar
    - Item list with quantities
    - Subtotal
    - Tax (15%)
    - Total
    - Submit button

RESPONSIVE:
  - Mobile: Menu full width, cart below
  - Tablet/Desktop: Two column layout with sticky cart

ADD/REMOVE BUTTONS:
  ✅ Plus/Minus buttons for quantity
  ✅ Real-time total calculation
  ✅ Visual feedback on click

SUCCESS STATE:
  ✅ Thank you message
  ✅ Order confirmation

STYLING:
  - Same dark theme as client booking
  - Gold accents on prices
  - Green for confirmed items
```

### Visual Spec:
- Menu item cards: #0f2416 background, subtle border
- Price: Large gold text
- Plus/Minus buttons: Gold hover state
- Cart sidebar: Sticky on desktop, scrollable on mobile
- Total: Large gold text with gold background bar

### Features Status:
✅ All required features present
⚠️ Accessibility (keyboard navigation) needs testing
⚠️ Mobile testing needed

---

# SUMMARY BY COMPLETION STATUS

## ✅ COMPLETE (95%+)
1. Dashboard
2. Client Booking Page
3. Client Order Page

## ⚠️ PARTIAL (50-95%)
4. Inquiries - Form exists, list view missing
5. Calendar - Basic calendar, event detail sidebar exists
6. Clients - Manager exists, profile page exists
7. Menu & Packages - Basic menu, needs package tiers
8. Payments - Tracker exists, needs deeper features
9. Settings - Business settings exist, missing Team/Integrations/Billing

## ❌ INCOMPLETE (0-50%)
10. Orders - Needs complete event-focused redesign
11. Invoices - List and detail views MISSING (PRIORITY)
12. Reports - Basic dashboard exists, needs full reporting features

---

# CRITICAL GAPS (MUST BUILD)

### Priority 1 - Revenue Impact
- [ ] Invoice List & Detail Page (blocks payment tracking)
- [ ] Orders/Events List (blocks operations)
- [ ] Revenue Analytics Page (detail drill-down from dashboard)

### Priority 2 - Operations
- [ ] Order/Event Detail Page (full event context)
- [ ] Team Management (Settings > Team tab)
- [ ] Calendar advanced views (week/day)

### Priority 3 - Growth
- [ ] Integrations (Settings > Integrations tab)
- [ ] Notifications/Reminders (Settings > Notifications tab)
- [ ] Reports advanced features (forecasting, exports)

---

# STYLING CONSISTENCY CHECKLIST

- [ ] All pages use #0a1911 background
- [ ] All cards use #0f2416 with CardBorder
- [ ] All headings use #d7a859 (gold)
- [ ] All status badges properly colored (Green/Amber/Red)
- [ ] All buttons have hover state (bg-[#102418])
- [ ] All inputs have subtle border and focus state
- [ ] Spacing consistent (gap-6, p-6 for cards)
- [ ] Icons from Lucide React (consistent style)
- [ ] No hardcoded colors (use established palette)
- [ ] Mobile responsive (test at 375px, 768px, 1024px)

