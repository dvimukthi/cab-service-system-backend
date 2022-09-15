const express = require("express");
const bodyParser = require("body-parser");

const {
  createCustomers,
  deleteCustomer,
  getCustomers,
  getCustomersById,
  getDrivers,
  getDriverById,
  getTrips,
  getTripById,
  getUsers,
  getUserById,
  getVehicles,
  updateCustomer,
} = require("./src/services/data_service");
const Customer = require("./src/models/Customer");

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const hostname = "127.0.0.1";
const port = 3001;

app.get("/", function (req, res) {
  res.send(JSON.stringify({ status: "OK" }));
});

app.get("/customers", async function (req, res) {
  try {
    const customers = await getCustomers();
    res.send(JSON.stringify(customers));
  } catch (err) {
    res.sendStatus(500).send(JSON.stringify(err.message));
  }
});

app.get("/customer/:id", async function (req, res) {
  try {
    const id = req.params.id;
    const customer = await getCustomersById(id);
    if (!customer) res.sendStatus(404);
    else res.send(JSON.stringify(customer));
  } catch (err) {
    res.sendStatus(500).send(JSON.stringify(err.message));
  }
});

app.post("/customer", async function (req, res) {
  try {
    var body = req.body;
    if (!body) {
      res.sendStatus(400);
      return;
    }

    var customer = new Customer(
      null,
      null,
      "CUSTOMER",
      body.first_name,
      body.last_name,
      body.address,
      body.email,
      body.phone_number,
      0
    );
    const cust = await createCustomers(customer);
    res.send(JSON.stringify(customer));
  } catch (err) {
    console.log(err);
    res.sendStatus(500).send(JSON.stringify(err.message));
  }
});

app.put("/customer/:id", async function (req, res) {
  try {
    var id = req.params.id;
    var body = req.body;
    if (!body) {
      res.sendStatus(400);
      return;
    }

    var customer = new Customer(
      null,
      null,
      "CUSTOMER",
      body.first_name,
      body.last_name,
      body.address,
      body.email,
      body.phone_number,
      body.trip_count
    );
    const cust = await updateCustomer(customer, id);
    res.send(JSON.stringify(cust));
  } catch (err) {
    console.log(err);
    res.sendStatus(500).send(JSON.stringify(err.message));
  }
});

app.delete("/customer/:id", async function (req, res) {
  try {
    var id = req.params.id;
    const _id = await deleteCustomer(id);
    res.send(JSON.stringify({ status: "Delete", id: _id }));
  } catch (err) {
    console.log(err);
    res.sendStatus(500).send(JSON.stringify(err.message));
  }
});

app.get("/drivers", async function (req, res) {
  try {
    const drivers = await getDrivers();
    res.send(JSON.stringify(drivers));
  } catch (err) {
    res.sendStatus(500).send(JSON.stringify(err.message));
  }
});

app.get("/driver/:id", async function (req, res) {
  try {
    const id = req.params.id;
    const driver = await getDriverById(id);
    if (!driver) res.sendStatus(404);
    else res.send(JSON.stringify(driver));
  } catch (err) {
    res.sendStatus(500).send(JSON.stringify(err.message));
  }
});

app.get("/trips", async function (req, res) {
  try {
    const trips = await getTrips();
    res.send(JSON.stringify(trips));
  } catch (err) {
    res.sendStatus(500).send(JSON.stringify(err.message));
  }
});

app.get("/trip/:id", async function (req, res) {
  try {
    const id = req.params.id;
    const trip = await getTripById(id);
    if (!trip) res.sendStatus(404);
    else res.send(JSON.stringify(trip));
  } catch (err) {
    res.sendStatus(500).send(JSON.stringify(err.message));
  }
});

app.get("/users", async function (req, res) {
  try {
    const users = await getUsers();
    res.send(JSON.stringify(users));
  } catch (err) {
    res.sendStatus(500).send(JSON.stringify(err.message));
  }
});

app.get("/user/:id", async function (req, res) {
  try {
    const id = req.params.id;
    const user = await getUserById(id);
    if (!user) res.sendStatus(404);
    else res.send(JSON.stringify(user));
  } catch (err) {
    res.sendStatus(500).send(JSON.stringify(err.message));
  }
});

app.get("/vehicles", async function (req, res) {
  try {
    const vehicles = await getVehicles();
    res.send(JSON.stringify(vehicles));
  } catch (err) {
    res.sendStatus(500).send(JSON.stringify(err.message));
  }
});

app.get("/vehicle/:id", async function (req, res) {
  try {
    const id = req.params.id;
    const vehicle = await getVehiclesById(id);
    if (!vehicle) res.sendStatus(404);
    else res.send(JSON.stringify(vehicle));
  } catch (err) {
    res.sendStatus(500).send(JSON.stringify(err.message));
  }
});

var server = app.listen(port, hostname, () => {
  console.log(`Server Started on : http://${hostname}:${port}/`);
});
