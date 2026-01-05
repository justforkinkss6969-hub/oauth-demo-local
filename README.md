# OAuth2 Local Demo

A comprehensive local demonstration of OAuth2 authentication flows, designed to help developers understand and implement OAuth2 security patterns in their applications.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Demo](#running-the-demo)
- [OAuth2 Flows Supported](#oauth2-flows-supported)
- [Testing the Flows](#testing-the-flows)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Security Considerations](#security-considerations)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Overview

This repository provides a local OAuth2 demonstration environment that simulates a complete OAuth2 implementation with:

- **Authorization Server**: Issues access tokens and manages OAuth2 flows
- **Resource Server**: Protects resources and validates access tokens
- **Client Application**: Demonstrates how to authenticate users using OAuth2

This is an educational tool perfect for:
- Learning OAuth2 concepts and flows
- Testing OAuth2 implementation locally
- Demonstrating OAuth2 security patterns
- Developing OAuth2-enabled applications

## Architecture

The OAuth2 Local Demo consists of three main components working together:

```
┌─────────────────────────────────────────────────────────────┐
│                     User (Browser)                          │
└────────────────────┬────────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
┌──────────────────┐    ┌──────────────────┐
│  Client App      │    │ Authorization    │
│  (Port 3000)     │◄──►│ Server           │
│                  │    │ (Port 8080)      │
│  - Login UI      │    │                  │
│  - Callback      │    │ - Issue Tokens   │
│  - Token Mgmt    │    │ - User Auth      │
└────────┬─────────┘    │ - Consent Screen │
         │              └────────┬─────────┘
         │                       │
         └───────────┬───────────┘
                     │
                     ▼
         ┌──────────────────────┐
         │  Resource Server     │
         │  (Port 8081)         │
         │                      │
         │ - Protected API      │
         │ - Token Validation   │
         │ - User Data/Scopes   │
         └──────────────────────┘
```

### Components

#### 1. **Client Application** (Port 3000)
- Web application that users interact with
- Initiates OAuth2 login flow
- Manages user sessions and tokens
- Built with modern web frameworks

#### 2. **Authorization Server** (Port 8080)
- Issues and manages OAuth2 tokens
- Authenticates users
- Implements consent screens
- Manages client credentials
- Stores and validates refresh tokens

#### 3. **Resource Server** (Port 8081)
- Protects API endpoints with token validation
- Returns user data based on granted scopes
- Enforces token expiration and scope restrictions

## Prerequisites

Before running the OAuth2 demo, ensure you have the following installed:

- **Node.js** v14.0.0 or higher ([Download](https://nodejs.org/))
- **npm** v6.0.0 or higher (comes with Node.js)
- **Git** for version control ([Download](https://git-scm.com/))
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Basic understanding of OAuth2 concepts

### System Requirements

- **OS**: Windows, macOS, or Linux
- **RAM**: Minimum 2GB
- **Disk Space**: ~500MB for dependencies
- **Network**: Localhost access (127.0.0.1)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/justforkinkss6969-hub/oauth-demo-local.git
cd oauth-demo-local
```

### 2. Install Dependencies

Install dependencies for all three components:

```bash
# Install root dependencies
npm install

# Install client app dependencies
cd client && npm install && cd ..

# Install authorization server dependencies
cd auth-server && npm install && cd ..

# Install resource server dependencies
cd resource-server && npm install && cd ..
```

### 3. Verify Installation

Test that all dependencies are installed correctly:

```bash
npm run verify-setup
```

## Configuration

### Environment Variables

Create `.env` files in each component directory with the required configuration.

#### Client App (`.env`)

```env
# Client Application Configuration
REACT_APP_CLIENT_ID=local-client-app
REACT_APP_CLIENT_SECRET=your-secret-key-here
REACT_APP_REDIRECT_URI=http://localhost:3000/callback
REACT_APP_AUTH_SERVER_URL=http://localhost:8080
REACT_APP_RESOURCE_SERVER_URL=http://localhost:8081
REACT_APP_SCOPE=profile email openid
PORT=3000
```

#### Authorization Server (`.env`)

```env
# Authorization Server Configuration
PORT=8080
NODE_ENV=development
SECRET_KEY=your-secret-key-change-this-in-production
TOKEN_EXPIRY=3600
REFRESH_TOKEN_EXPIRY=604800
DATABASE_URL=sqlite://./oauth.db
CORS_ORIGIN=http://localhost:3000
```

#### Resource Server (`.env`)

```env
# Resource Server Configuration
PORT=8081
NODE_ENV=development
AUTH_SERVER_URL=http://localhost:8080
SECRET_KEY=your-secret-key-change-this-in-production
CORS_ORIGIN=http://localhost:3000
```

## Running the Demo

### Option 1: Run All Services (Recommended)

```bash
# From the root directory
npm start

# This will start:
# - Client App on http://localhost:3000
# - Authorization Server on http://localhost:8080
# - Resource Server on http://localhost:8081
```

### Option 2: Run Services Individually

```bash
# Terminal 1: Start Authorization Server
cd auth-server
npm start

# Terminal 2: Start Resource Server
cd resource-server
npm start

# Terminal 3: Start Client App
cd client
npm start
```

### Option 3: Run with Docker (if available)

```bash
docker-compose up --build
```

### Verify All Services Are Running

```bash
curl http://localhost:3000/health
curl http://localhost:8080/health
curl http://localhost:8081/health
```

All endpoints should return: `{"status":"healthy"}`

## OAuth2 Flows Supported

### 1. Authorization Code Flow (Most Common)

This is the standard OAuth2 flow for server-side applications:

```
User → Client App → Authorization Server → User Auth → Client App → Resource Server
```

**Use Case**: Web applications with a backend server

**Flow Steps**:
1. User clicks "Login with OAuth"
2. Client redirects to Authorization Server
3. User authenticates and grants consent
4. Authorization Server redirects back with authorization code
5. Client exchanges code for access token (backend-to-backend)
6. Client uses access token to access protected resources

### 2. Implicit Flow (Deprecated for Security)

For single-page applications (legacy):

```
User → Client App → Authorization Server → User Auth → Direct Token
```

**Note**: This flow is deprecated due to security concerns. Use Authorization Code with PKCE instead.

### 3. Resource Owner Password Credentials Flow

For trusted applications where user directly provides credentials:

```
User → Client App (with credentials) → Authorization Server → Access Token
```

**Use Case**: Mobile apps or CLI tools

## Testing the Flows

### Manual Testing via Browser

1. **Start all services** (see Running the Demo section)

2. **Open the Client Application**
   - Navigate to: `http://localhost:3000`
   - You should see a "Login with OAuth" button

3. **Initiate OAuth Login**
   - Click "Login with OAuth"
   - You'll be redirected to the Authorization Server

4. **Authenticate**
   - Enter test credentials:
     - **Username**: `testuser`
     - **Password**: `testpass123`
   - Click "Sign In"

5. **Grant Consent**
   - Review requested scopes (profile, email, openid)
   - Click "Allow" to grant permission

6. **Success**
   - You'll be redirected back to the Client App
   - Token will be stored in browser storage
   - You can now access protected resources

### Automated Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run integration tests
npm run test:integration
```

### Testing with cURL

```bash
# 1. Get authorization code
curl -X GET "http://localhost:8080/authorize?client_id=local-client-app&response_type=code&redirect_uri=http://localhost:3000/callback&scope=profile%20email&state=random-state"

# 2. Exchange code for token
curl -X POST "http://localhost:8080/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code&code=AUTH_CODE&client_id=local-client-app&client_secret=YOUR_SECRET"

# 3. Access protected resource
curl -X GET "http://localhost:8081/user/profile" \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

### Testing with Postman

1. Import the included Postman collection: `oauth-demo.postman_collection.json`
2. Set up environment variables in Postman:
   - `client_id`: local-client-app
   - `client_secret`: your-secret-key
   - `auth_server_url`: http://localhost:8080
   - `resource_server_url`: http://localhost:8081
3. Run through the pre-configured requests

## Project Structure

```
oauth-demo-local/
├── README.md                          # This file
├── package.json                       # Root package configuration
├── .env.example                       # Example environment variables
├── .gitignore                         # Git ignore rules
│
├── client/                            # Client Application (React)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx             # OAuth login button
│   │   │   ├── Callback.jsx          # Callback handler
│   │   │   └── Dashboard.jsx         # Protected dashboard
│   │   ├── services/
│   │   │   ├── AuthService.js        # OAuth logic
│   │   │   └── ApiService.js         # API calls
│   │   ├── App.jsx
│   │   └── index.js
│   ├── package.json
│   ├── .env
│   └── public/
│
├── auth-server/                       # Authorization Server (Express)
│   ├── src/
│   │   ├── routes/
│   │   │   ├── authorize.js          # /authorize endpoint
│   │   │   ├── token.js              # /token endpoint
│   │   │   └── consent.js            # Consent screen
│   │   ├── middleware/
│   │   │   ├── auth.js               # Authentication
│   │   │   └── errorHandler.js       # Error handling
│   │   ├── models/
│   │   │   ├── User.js               # User model
│   │   │   ├── Client.js             # OAuth client
│   │   │   └── Token.js              # Token model
│   │   ├── utils/
│   │   │   ├── tokenGenerator.js     # Token generation
│   │   │   └── codeGenerator.js      # Authorization code
│   │   ├── database.js               # Database setup
│   │   └── app.js
│   ├── package.json
│   ├── .env
│   └── oauth.db                       # SQLite database
│
├── resource-server/                   # Resource Server (Express)
│   ├── src/
│   │   ├── routes/
│   │   │   ├── user.js               # User endpoints
│   │   │   └── health.js             # Health check
│   │   ├── middleware/
│   │   │   ├── validateToken.js      # Token validation
│   │   │   └── errorHandler.js       # Error handling
│   │   ├── models/
│   │   │   └── User.js               # User data
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── .env
│
└── docs/                              # Documentation
    ├── ARCHITECTURE.md                # Detailed architecture
    ├── API_REFERENCE.md               # API endpoints
    ├── OAUTH2_FLOWS.md                # OAuth2 flow diagrams
    ├── TROUBLESHOOTING.md             # Common issues
    └── SECURITY.md                    # Security guidelines
```

## API Endpoints

### Authorization Server (Port 8080)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/authorize` | Start OAuth flow, redirect to login |
| `POST` | `/token` | Exchange code for access token |
| `GET` | `/login` | User login form |
| `POST` | `/login` | Process login credentials |
| `GET` | `/consent` | Consent screen |
| `POST` | `/consent` | Process consent decision |
| `POST` | `/revoke` | Revoke access token |
| `GET` | `/userinfo` | Get authenticated user info |
| `GET` | `/health` | Health check endpoint |

**Example: Authorization Request**

```bash
curl -X GET "http://localhost:8080/authorize" \
  -G --data-urlencode "client_id=local-client-app" \
  -G --data-urlencode "response_type=code" \
  -G --data-urlencode "redirect_uri=http://localhost:3000/callback" \
  -G --data-urlencode "scope=profile email" \
  -G --data-urlencode "state=abc123"
```

### Resource Server (Port 8081)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/user/profile` | Get user profile (requires token) |
| `GET` | `/user/email` | Get user email (requires token) |
| `GET` | `/user/info` | Get all user info (requires token) |
| `GET` | `/health` | Health check endpoint |

**Example: Protected Resource Request**

```bash
curl -X GET "http://localhost:8081/user/profile" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Client App (Port 3000)

| Route | Description |
|-------|-------------|
| `/` | Home page with login button |
| `/callback` | OAuth callback handler |
| `/dashboard` | Protected user dashboard |
| `/logout` | Logout handler |

## Security Considerations

### Development vs Production

⚠️ **WARNING**: This demo uses simplified security for educational purposes. Never use in production without implementing proper security measures.

### Recommendations for Production

1. **HTTPS Only**
   - Always use HTTPS in production
   - Never transmit tokens over plain HTTP

2. **Secure Token Storage**
   - Use HttpOnly, Secure cookies for tokens
   - Never store tokens in localStorage
   - Implement token rotation

3. **PKCE (Proof Key for Code Exchange)**
   - Implement PKCE for mobile and SPA apps
   - Prevents authorization code interception

4. **Secret Management**
   - Use environment variables or secret managers
   - Never commit secrets to version control
   - Rotate secrets regularly

5. **Token Security**
   - Use short-lived access tokens (15-30 minutes)
   - Implement refresh token rotation
   - Validate token signatures
   - Check token expiration

6. **CORS Configuration**
   - Restrict CORS to trusted origins only
   - Never use `*` in production

7. **Input Validation**
   - Validate all user inputs
   - Sanitize redirect URIs
   - Check redirect URI matches registered URI

8. **Rate Limiting**
   - Implement rate limiting on auth endpoints
   - Prevent brute force attacks

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

**Error**: `EADDRINUSE: address already in use :::3000`

**Solution**:
```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9
# Or use a different port
export PORT=3001 && npm start
```

#### 2. CORS Errors

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
- Verify CORS_ORIGIN matches your client URL
- Check `.env` files have correct configuration
- Ensure all services are running

#### 3. Token Validation Fails

**Error**: `Invalid token` or `Token expired`

**Solution**:
- Verify token endpoint returns valid JWT
- Check token expiry settings in `.env`
- Ensure secret keys match across services
- Clear browser cache and try again

#### 4. Database Lock Error

**Error**: `SQLITE_CANTOPEN` or database locked

**Solution**:
```bash
# Remove existing database
rm auth-server/oauth.db

# Restart auth server
cd auth-server && npm start
```

#### 5. Cannot Find Module

**Error**: `Cannot find module 'express'`

**Solution**:
```bash
# Reinstall dependencies
npm install
cd client && npm install && cd ..
cd auth-server && npm install && cd ..
cd resource-server && npm install && cd ..
```

### Debug Mode

Enable debug logging:

```bash
# Authorization Server
DEBUG=oauth:* npm start

# Resource Server
DEBUG=oauth:* npm start

# Client App
REACT_APP_DEBUG=true npm start
```

### Logs

Check logs directory for detailed error information:

```bash
tail -f logs/auth-server.log
tail -f logs/resource-server.log
tail -f logs/client.log
```

## Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/oauth-demo-local.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add tests for new features
   - Update documentation

4. **Commit your changes**
   ```bash
   git commit -m "Add feature: description of your changes"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Provide a clear description of changes
   - Reference any related issues
   - Ensure tests pass

### Code Style

- Use ESLint configuration provided
- Format code with Prettier: `npm run format`
- Run linter: `npm run lint`

### Testing Requirements

- Write unit tests for new functions
- Add integration tests for API endpoints
- Maintain >80% code coverage

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Additional Resources

- **OAuth2 Specification**: [RFC 6749](https://tools.ietf.org/html/rfc6749)
- **OpenID Connect**: [OpenID Connect Specification](https://openid.net/specs/openid-connect-core-1_0.html)
- **PKCE**: [RFC 7636](https://tools.ietf.org/html/rfc7636)
- **Node.js Security**: [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

## Support

For issues, questions, or suggestions:

1. **Check Existing Issues**: https://github.com/justforkinkss6969-hub/oauth-demo-local/issues
2. **Create a New Issue**: Include error messages, steps to reproduce, and environment info
3. **Email**: Contact the maintainers

---

**Last Updated**: January 5, 2026  
**Version**: 1.0.0  
**Maintained by**: justforkinkss6969-hub
