-- Pengguna (email+password atau Google)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  password_hash TEXT,
  google_sub TEXT UNIQUE,
  avatar TEXT,
  created_at INTEGER NOT NULL
);

-- Sesi login (cookie httpOnly)
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

-- Tagihan / pesanan
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  service TEXT NOT NULL,
  service_name TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  method TEXT NOT NULL,
  base_amount INTEGER NOT NULL,
  unique_code INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  confirmed_at INTEGER,
  verify_deadline INTEGER,
  paid_at INTEGER,
  rejected_at INTEGER,
  reject_reason TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_match ON orders(status, method, amount);

-- Log mutasi rekening yang masuk dari webhook (audit)
CREATE TABLE IF NOT EXISTS mutations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  method TEXT,
  amount INTEGER NOT NULL,
  description TEXT,
  order_id TEXT,
  raw TEXT,
  received_at INTEGER NOT NULL
);