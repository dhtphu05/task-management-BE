const express = require('express');
const app = express();
const port = 3000;

// Middleware xử lý JSON
app.use(express.json());

// Route đơn giản
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Lắng nghe cổng
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
