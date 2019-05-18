DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  item_id INT AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(45) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT(10) NOT NULL,
  primary key(item_id)
);

SELECT * FROM products;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("Tennis Racquet", "Sports", 179.99, 29),
      ("Cans of Tennis Balls", "Sports", 13.49, 400),
      ("Super Smash Brother Ultimate", "Video Games", 59.99, 150),
      ("Nintendo Switch", "Video Games", 299.00, 40),
      ("Maro Kart", "Video Games", 59.99, 100),
      ("Kleenex", "Personal Care", 7.50, 1200),
      ("iPad", "Electronics", 599.00, 68),
      ("Google Pixel", "Mobile Phones", 499.99, 30),
      ("Bose Speakers", "Electronics", 30.50, 35),
      ("Backpacks", "Outdoors", 19.95, 23);
