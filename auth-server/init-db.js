/**
 * Database Initialization Script
 * Initializes the OAuth demo application database with required tables and seed data
 * Created: 2026-01-05 14:25:33 UTC
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, '../data/oauth-demo.db');

/**
 * Initialize database with required schema
 */
function initializeDatabase() {
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening database:', err);
      process.exit(1);
    }
    console.log('Connected to SQLite database at:', dbPath);
  });

  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON');

  // Create users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      first_name TEXT,
      last_name TEXT,
      profile_picture_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating users table:', err);
    } else {
      console.log('✓ Users table initialized');
    }
  });

  // Create OAuth clients table
  db.run(`
    CREATE TABLE IF NOT EXISTS oauth_clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id TEXT UNIQUE NOT NULL,
      client_secret TEXT NOT NULL,
      client_name TEXT NOT NULL,
      redirect_uris TEXT NOT NULL,
      description TEXT,
      owner_id INTEGER NOT NULL,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (owner_id) REFERENCES users(id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating oauth_clients table:', err);
    } else {
      console.log('✓ OAuth clients table initialized');
    }
  });

  // Create authorization codes table
  db.run(`
    CREATE TABLE IF NOT EXISTS authorization_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      client_id TEXT NOT NULL,
      user_id INTEGER NOT NULL,
      redirect_uri TEXT NOT NULL,
      scope TEXT,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (client_id) REFERENCES oauth_clients(client_id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating authorization_codes table:', err);
    } else {
      console.log('✓ Authorization codes table initialized');
    }
  });

  // Create access tokens table
  db.run(`
    CREATE TABLE IF NOT EXISTS access_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      token TEXT UNIQUE NOT NULL,
      client_id TEXT NOT NULL,
      user_id INTEGER NOT NULL,
      scope TEXT,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (client_id) REFERENCES oauth_clients(client_id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating access_tokens table:', err);
    } else {
      console.log('✓ Access tokens table initialized');
    }
  });

  // Create refresh tokens table
  db.run(`
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      token TEXT UNIQUE NOT NULL,
      client_id TEXT NOT NULL,
      user_id INTEGER NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (client_id) REFERENCES oauth_clients(client_id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating refresh_tokens table:', err);
    } else {
      console.log('✓ Refresh tokens table initialized');
    }
  });

  // Create session table
  db.run(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT UNIQUE NOT NULL,
      user_id INTEGER NOT NULL,
      user_agent TEXT,
      ip_address TEXT,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating sessions table:', err);
    } else {
      console.log('✓ Sessions table initialized');
    }
  });

  // Create audit log table
  db.run(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      user_id INTEGER,
      resource_type TEXT,
      resource_id TEXT,
      changes TEXT,
      ip_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating audit_logs table:', err);
    } else {
      console.log('✓ Audit logs table initialized');
    }
  });

  // Create indexes for better query performance
  db.run(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_oauth_clients_owner ON oauth_clients(owner_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_auth_codes_client ON authorization_codes(client_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_auth_codes_user ON authorization_codes(user_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_access_tokens_user ON access_tokens(user_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_access_tokens_client ON access_tokens(client_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id)`, (err) => {
    if (err) {
      console.error('Error creating indexes:', err);
    } else {
      console.log('✓ Database indexes created');
    }
  });

  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
      process.exit(1);
    }
    console.log('\n✓ Database initialization completed successfully');
    process.exit(0);
  });
}

// Run initialization
initializeDatabase();

module.exports = { initializeDatabase };
