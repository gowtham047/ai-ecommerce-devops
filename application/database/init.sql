CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price NUMERIC(10,2) NOT NULL
);

INSERT INTO products (name, price)
VALUES
    ('Laptop', 50000.00),
    ('Smartphone', 25000.00),
    ('Headphones', 2000.00)
ON CONFLICT DO NOTHING;
