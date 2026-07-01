# Catering Business System

A mobile-first app for home-based caterers to manage inventory, menu pricing, and orders with voice dictation support.

## Project Structure

### Phase 1 - Working Core (Complete)
- **Authentication**: Email/password signup and login via Supabase
- **Menu Management**: Add menu items with cost and pricing
- **Ingredients**: Track ingredients with quantities and costs
- **Orders**: Create orders with multiple items, track delivery status

## Tech Stack

- **Frontend**: Next.js 16+ (App Router), TypeScript, React, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Hosting**: Vercel (ready to deploy)

## Getting Started

### 1. Set Up Supabase

Create a new Supabase project and run the following SQL to set up tables:

```sql
-- Menu items table
CREATE TABLE menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  unit_cost decimal(10,2) NOT NULL,
  price decimal(10,2) NOT NULL,
  active boolean DEFAULT true,
  created_at timestamp DEFAULT now()
);

-- Ingredients table
CREATE TABLE ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  unit_cost decimal(10,2) NOT NULL,
  qty decimal(10,2) NOT NULL,
  active boolean DEFAULT true
);

-- Orders table
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_name text NOT NULL,
  order_date date NOT NULL,
  delivery_date date NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'delivered')),
  notes text,
  created_at timestamp DEFAULT now()
);

-- Order items table
CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id uuid NOT NULL REFERENCES menu_items(id),
  qty integer NOT NULL,
  price decimal(10,2) NOT NULL
);
```

### 2. Configure Environment

Copy your Supabase credentials to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Install & Run

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to get started.

## Features (Phase 1)

### Authentication
- Sign up with email and password
- Sign in to existing account
- Secure session management

### Menu Management
- Add menu items with cost and selling price
- View margin per item (price - cost)
- Activate/deactivate items
- Track all active items for order creation

### Ingredients
- Add ingredients with unit cost and quantity
- Update quantities as you use them
- Low stock alerts (< 5 units)
- Track total inventory value

### Orders
- Create orders with client name and delivery date
- Select multiple menu items per order
- Track order status (pending, confirmed, delivered)
- View order count and status breakdown
- Add notes to orders

## Next Steps (Future Phases)

- Voice dictation for order entry (Web Speech API)
- Order invoice generation and PDF export
- Integration with payment (WhatsApp/SMS billing)
- Calendar view for delivery dates
- Cost analysis and profitability tracking
- Mobile app wrapper (PWA)
