# TypeScript E-Wallet API

This project is created as an E-wallet API

# Library Dependencies

- express
- express-jwt
- mongoose
- jsonwebtoken
- bcryptjs
- body-parser
- cors
- dotenv
- morgan
- nodemon
- jwt-decode
- TypeScript

# Routes

```
POST /api/v1/register
Payload: username, name, password

POST /api/v1/login
Payload: username, password

GET /api/users/balance
AUTH: Bearer token

POST /api/transactions/deposit
Payload: amount
AUTH: Bearer token

GET /api/transactions/
AUTH: Bearer token

POST /api/transactions/transfer
Payload: amount, accountDestination
AUTH: Bearer token

POST /api/transactions/withdrawal
Payload: amount
AUTH: Bearer token

```
