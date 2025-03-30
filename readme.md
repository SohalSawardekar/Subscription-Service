# Backend of a Subscription Service

Sure! Here's the Markdown content in a code block so you can copy and save it as an `.md` file:

````md
# Express Backend Setup with dotenv

This guide covers the basics of setting up an Express backend and configuring environment variables using `dotenv`.

---

## 1. Setup Your Project

Initialize a new Node.js project:

```sh
mkdir my-express-app && cd my-express-app
npm init -y
```
````

Install dependencies:

```sh
npm install express dotenv
```

---

## 2. Create `.env` File

In your project root, create a `.env` file to store environment variables:

```env
PORT=3000
SERVER_URL=http://localhost:3000
NODE_ENV=development
DB_URI=mongodb://localhost:27017/mydatabase
JWT_SECRET=mysecretkey
JWT_EXPIRE=3600
ARCJET_ENV=production
ARCJET_KEY=myarcjetkey
QSTASH_URL=https://qstash.upstash.io
QSTASH_TOKEN=myqstashtoken
QSTASH_CURRENT_SIGNING_KEY=mycurrentsigningkey
QSTASH_NEXT_SIGNING_KEY=mynextsigningkey
```

**Note:** Never commit the `.env` file to version control. Add it to `.gitignore`.

---

## 3. Create `server.js`

Create a `server.js` file for your Express server:

```js
require("dotenv").config();
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(
    `Server running on ${process.env.SERVER_URL || `http://localhost:${PORT}`}`
  );
});
```

---

## 4. Create `config.js`

Centralize environment variable management in a `config.js` file:

```js
require("dotenv").config();

export const {
  PORT,
  SERVER_URL,
  NODE_ENV,
  DB_URI,
  JWT_SECRET,
  JWT_EXPIRE,
  ARCJET_ENV,
  ARCJET_KEY,
  QSTASH_URL,
  QSTASH_TOKEN,
  QSTASH_CURRENT_SIGNING_KEY,
  QSTASH_NEXT_SIGNING_KEY,
} = process.env;
```

---

## 5. Run the Server

Start the server:

```sh
node server.js
```

---

## 6. Using Nodemon (Optional)

For automatic restarts during development, install `nodemon`:

```sh
npm install -g nodemon
```

Run the server with:

```sh
nodemon server.js
```

---

## 7. Secure Your Environment Variables

Use `dotenv` securely:

- **Never expose sensitive keys** in your frontend code.
- **Use `.gitignore`** to prevent committing `.env` files.
- **For production**, configure environment variables in your hosting platform (e.g., Heroku, Vercel).

---

This guide sets up a basic Express backend with environment variables. You can expand it by adding middleware, database connections, and authentication.

Happy coding! 🚀

```

```
