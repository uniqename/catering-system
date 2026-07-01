import { Database } from './supabase';

type User = {
  id: string;
  email: string;
};

const mockUsers: { [key: string]: { email: string; password: string } } = {};
let currentUser: User | null = null;

const generateId = () => Math.random().toString(36).substring(7);
const getStorageKey = (table: string, userId: string) => `db_${userId}_${table}`;

export const mockDb = {
  auth: {
    signUp: async (email: string, password: string) => {
      if (mockUsers[email]) {
        return { error: new Error('User already exists') };
      }
      const id = generateId();
      mockUsers[email] = { email, password };
      currentUser = { id, email };
      return { error: null, data: { user: currentUser } };
    },

    signInWithPassword: async (email: string, password: string) => {
      const user = mockUsers[email];
      if (!user || user.password !== password) {
        return { error: new Error('Invalid email or password') };
      }
      currentUser = { id: generateId(), email };
      return { error: null, data: { session: { user: currentUser } } };
    },

    signOut: async () => {
      currentUser = null;
      return { error: null };
    },

    getSession: async () => {
      return { data: { session: currentUser ? { user: currentUser } : null } };
    },

    onAuthStateChange: (
      callback: (event: string, session: any) => void
    ) => {
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
  },

  from: (table: string) => {
    const userId = currentUser?.id || 'guest';
    const storageKey = getStorageKey(table, userId);

    const getData = () => {
      const data = localStorage.getItem(storageKey);
      return data ? JSON.parse(data) : [];
    };

    const saveData = (data: any[]) => {
      localStorage.setItem(storageKey, JSON.stringify(data));
    };

    return {
      select: (columns?: string) => ({
        eq: (column: string, value: any) => ({
          order: (col: string, options?: any) => ({
            then: (callback: (result: any) => void) => {
              const data = getData().filter((item: any) => item[column] === value);
              callback({
                data: data.sort((a: any, b: any) => {
                  const aVal = a[col];
                  const bVal = b[col];
                  const isAscending = !options || options.ascending !== false;
                  return isAscending ? (aVal > bVal ? 1 : -1) : aVal > bVal ? -1 : 1;
                }),
                error: null,
              });
              return Promise.resolve();
            },
          }),
          async then(callback: (result: any) => void) {
            const data = getData().filter((item: any) => item[column] === value);
            callback({ data, error: null });
            return Promise.resolve();
          },
        }),
        order: (col: string, options?: any) => ({
          then: (callback: (result: any) => void) => {
            const data = getData().sort((a: any, b: any) => {
              const aVal = a[col];
              const bVal = b[col];
              const isAscending = !options || options.ascending !== false;
              return isAscending ? (aVal > bVal ? 1 : -1) : aVal > bVal ? -1 : 1;
            });
            callback({ data, error: null });
            return Promise.resolve();
          },
        }),
        async then(callback: (result: any) => void) {
          const data = getData();
          callback({ data, error: null });
          return Promise.resolve();
        },
      }),
      insert: (records: any) => ({
        select: () => ({
          single: () => ({
            async then(callback: (result: any) => void) {
              const data = getData();
              const newRecord = {
                id: generateId(),
                ...records,
                user_id: userId,
              };
              data.push(newRecord);
              saveData(data);
              callback({ data: newRecord, error: null });
              return Promise.resolve();
            },
          }),
        }),
        async then(callback: (result: any) => void) {
          const data = getData();
          const newRecords = Array.isArray(records)
            ? records.map((r) => ({ id: generateId(), ...r, user_id: userId }))
            : [{ id: generateId(), ...records, user_id: userId }];
          data.push(...newRecords);
          saveData(data);
          callback({ data: newRecords, error: null });
          return Promise.resolve();
        },
      }),
      update: (values: any) => ({
        eq: (column: string, value: any) => ({
          async then(callback: (result: any) => void) {
            const data = getData();
            const updated = data.map((item: any) =>
              item[column] === value ? { ...item, ...values } : item
            );
            saveData(updated);
            callback({ data: updated, error: null });
            return Promise.resolve();
          },
        }),
      }),
      delete: () => ({
        eq: (column: string, value: any) => ({
          async then(callback: (result: any) => void) {
            const data = getData();
            const filtered = data.filter((item: any) => item[column] !== value);
            saveData(filtered);
            callback({ data: null, error: null });
            return Promise.resolve();
          },
        }),
      }),
    };
  },
};
