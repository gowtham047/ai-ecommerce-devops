const express = require("express");
const { Pool } = require("pg");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;

const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || "ecommerce_user",
    password: process.env.DB_PASSWORD || "ecommerce_password",
    database: process.env.DB_NAME || "ecommerce_db"
});

app.get("/health", (req, res) => {
    res.json({
        status: "UP",
        application: "Demo E-Commerce Backend"
    });
});

app.get("/api/products", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id, name, price FROM products ORDER BY id"
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Unable to retrieve products" });
    }
});

app.listen(PORT, () => {
    console.log(`E-commerce backend running on port ${PORT}`);
});
