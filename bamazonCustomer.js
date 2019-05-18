var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "1234",
  database: "bamazon"
});

// Creates connection and calls to load product data if no errors
connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
  }
  loadProducts();
});

// Loads the products table from the bamazon database and logs result to console
function loadProducts() {
  // Selects all data from the bamazon db products table
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

    // Logs table in the terminal using the response
    console.table(res);

    // Call to prompt customer for their choice of product, pass response customerItem
    customerItem(res);
  });
}

// Prompts customer for a product ID
function customerItem(inventory) {
  // Prompts (ask) customer what they would like to purchase in console
  inquirer
    .prompt([
      {
        type: "input",
        name: "choice",
        message: "Provide the ID of the item you want to purchase. [Type Q to Quit]",
        validate: function(val) {
          return !isNaN(val) || val.toLowerCase() === "q";
        }
      }
    ])
    .then(function(val) {
      // Check if the user wants to quit the program
      checkExit(val.choice);
      var choiceId = parseInt(val.choice);
      var product = checkInventory(choiceId, inventory);

      // If the product exists, prompt the customer for the quantity
      if (product) {
        // Pass the chosen product to productQuantity
        productQuantity(product);
      }
      else {
        // Otherwise let customer know the item is not in the inventory and re-run loadProducts
        console.log("\nWe do not have that item in our inventory. Try again!\n\n");
        loadProducts();
      }
    });
}

// Prompt the customer for a product quantity
function productQuantity(product) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "quantity",
        message: "Please provide how many " + product.product_name + " you would like. [Type Q to Quit]",
        validate: function(val) {
          return val > 0 || val.toLowerCase() === "q";
        }
      }
    ])
    .then(function(val) {
      // Check if the user wants to quit the program
      checkExit(val.quantity);
      var quantity = parseInt(val.quantity);

      // If there isn't enough inventory for the chosen product, console log to let the customer know and re-run loadProducts
      if (quantity > product.stock_quantity) {
        console.log("\nWe don't have enough " + product.product_name + " in that quantity. Try a different product or different quantity!\n\n");
        loadProducts();
      }
      else {
        // Else run buyProduct and pass it the product information and quantity
        buyProduct(product, quantity);
      }
    });
}

// Buys the product
function buyProduct(product, quantity) {
  connection.query(
    "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
    [quantity, product.item_id],
    function(err, res) {
      // Prompt user that they have purchased, then re-run loadProducts
      console.log("\nYou have purchased " + quantity + " " + product.product_name + "'s!\n\n");
      loadProducts();
    }
  );
}

// Check inventory to see if quantity is above 0
function checkInventory(choiceId, inventory) {
  for (var i = 0; i < inventory.length; i++) {
    if (inventory[i].item_id === choiceId) {
      // return product if it matches
      return inventory[i];
    }
  }
  // Otherwise return null
  return null;
}

// Check to see if the user wants to exit the program
function checkExit(choice) {
  if (choice.toLowerCase() === "q") {
    // Log a message and exit node
    console.log("Goodbye!");
    process.exit(0);
  }
}
