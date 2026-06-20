const express = require('express');
const { Client } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

const dbConfig = {
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'mcp_test',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
};

app.get('/', async (req, res) => {
  const client = new Client(dbConfig);
  let status = 'unknown';
  let error = null;

  try {
    await client.connect();
    await client.query('SELECT 1');
    status = 'connected';
    await client.end();
  } catch (err) {
    status = 'error';
    error = err.message;
  }

  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MCP Test</title>
  <style>
    body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f0f4f8; }
    h1 { color: #333; }
    .status { padding: 0.75rem 1.5rem; border-radius: 8px; font-size: 1.1rem; margin-top: 1rem; }
    .connected { background: #d4edda; color: #155724; }
    .error { background: #f8d7da; color: #721c24; }
    .unknown { background: #fff3cd; color: #856404; }
  </style>
</head>
<body>
  <h1>MCP Test</h1>
  <div class="status ${status}">
    DB status: <strong>${status}</strong>${error ? ` — ${error}` : ''}
  </div>
</body>
</html>`);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
