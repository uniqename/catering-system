import { createClient } from '@supabase/supabase-js';
import { mockDb } from './mock-db';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: any = null;

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

if (supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl)) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch {
    console.warn('Failed to initialize Supabase client, using mock database');
    supabase = mockDb;
  }
} else {
  console.log('Using mock database (localStorage). Configure Supabase in .env.local to use production database.');
  supabase = mockDb;
}

export { supabase };

export type Database = {
  public: {
    Tables: {
      menu_items: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          unit_cost: number;
          price: number;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          unit_cost: number;
          price: number;
          active?: boolean;
          created_at?: string;
        };
      };
      menu_ingredients: {
        Row: {
          id: string;
          menu_item_id: string;
          ingredient_id: string;
          qty_used: number;
        };
        Insert: {
          id?: string;
          menu_item_id: string;
          ingredient_id: string;
          qty_used: number;
        };
      };
      ingredients: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          unit_cost: number;
          qty: number;
          active: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          unit_cost: number;
          qty: number;
          active?: boolean;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          client_name: string;
          order_date: string;
          delivery_date: string;
          status: 'pending' | 'confirmed' | 'delivered';
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          client_name: string;
          order_date: string;
          delivery_date: string;
          status?: 'pending' | 'confirmed' | 'delivered';
          notes?: string | null;
          created_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          menu_item_id: string;
          qty: number;
          price: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          menu_item_id: string;
          qty: number;
          price: number;
        };
      };
    };
  };
};
