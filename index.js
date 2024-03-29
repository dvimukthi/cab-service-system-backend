const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const multiparty = require("multiparty");

const {
  createBranch,
  deleteBranch,
  getBranchList,
  getBranchById,
  getBranchByName,
  updateBranch,
  createCredentials,
  createCustomers,
  deleteCustomer,
  getCustomers,
  getCustomersById,
  getCustomerByUserId,
  updateCustomer,
  createDriver,
  deleteDriver,
  getDrivers,
  getDriverById,

  getDriverByUserId,
  getDriverByVehicleId,
  updateDriver,
  acceptRejectTrip,
  createTrip,
  signIn,
  getTrips,
  getTripById,
  getTripsByDriverId,
  getTripsByCustomerId,
  getUsers,
  getUserById,
  createVehicle,
  deleteVehicle,
  getVehicles,
  getVehiclesByNumberPlate,
  getVehicleByTypeAndBranch,
  updateVehicle,
} = require("./src/services/data_service");

const Customer = require("./src/models/Customer");
const Vehicle = require("./src/models/Vehicle");
const Trip = require("./src/models/Trip");
const Driver = require("./src/models/Driver");
const Branch = require("./src/models/Branch");
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cors());
const hostname = "127.0.0.1";
const port = 3001;

app.get("/", function (req, res) {
  res.send(JSON.stringify({ status: "OK" }));
});

app.post("/signin", async function (req, res) {
  var form = new multiparty.Form();
  if (!form) {
    res.sendStatus(400);
    return;
  }

  form.parse(req, async function (err, fields, files) {
    var userName = fields["email"];
    var passWord = fields["password"];
    try {
      var user = await signIn(userName, passWord);
      console.log(user);
      if (user) {
        res.status(200).send(
          JSON.stringify({
            userId: user.getId(),
            name: user.getFirstName() + " " + user.getLastName(),
            type: user.getUserType(),
          })
        );
      } else {
        res.status(404).send();
      }
    } catch (err) {
      res.status(500).send();
    }
  });
});

app.post("/branch", async function (req, res) {
  try {
    var body = req.body;
    if (!body) {
      res.sendStatus(400);
      return;
    }
    var branch = new Branch(
      null,
      body.location,
      body.address,
      body.email,
      body.phone
    );
    const _branch = await createBranch(branch);
    res.status(201).send(JSON.stringify(_branch));
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.put("/branch/:id", async function (req, res) {
  try {
    var id = req.params.id;
    var body = req.body;
    if (!body) {
      res.sendStatus(400);
      return;
    }

    var branch = new Branch(
      null,
      body.location,
      body.address,
      body.email,
      body.phone
    );

    console.log(branch);
    const _branch = await updateBranch(branch, id);
    res.send(JSON.stringify(_branch));
  } catch (err) {
    console.log(err);
    res.status(500).send(JSON.stringify(err.message));
  }
});

app.delete("/branch/:id", async function (req, res) {
  try {
    var id = req.params.id;
    const _id = await deleteBranch(id);
    res.send(JSON.stringify({ status: "Delete", id: _id }));
  } catch (err) {
    console.log(err);
    res.status(500).send(JSON.stringify(err.message));
  }
});

app.get("/branch", async function (req, res) {
  try {
    const branchs = await getBranchList();
    res.send(JSON.stringify(branchs));
  } catch (err) {
    res.status(500).send(JSON.stringify(err.message));
  }
});

app.get("/branch/:id", async function (req, res) {
  try {
    const id = req.params.id;
    const branchs = await getBranchById(id);
    res.send(JSON.stringify(branchs));
  } catch (err) {
    res.status(500).send(JSON.stringify(err.message));
  }
});

app.get("/customers", async function (req, res) {
  try {
    const customers = await getCustomers();
    res.send(JSON.stringify(customers));
  } catch (err) {
    res.status(500).send(JSON.stringify(err.message));
  }
});

app.get("/customer/:id", async function (req, res) {
  try {
    const id = req.params.id;
    const customer = await getCustomersById(id);
    if (!customer) res.sendStatus(404);
    else res.send(JSON.stringify(customer));
  } catch (err) {
    res.status(500).send(JSON.stringify(err.message));
  }
});

app.get("/customer/:id/trips", async function (req, res) {
  try {
    const id = req.params.id;
    const customerTrips = await getTripsByCustomerId(id);
    if (!customerTrips) res.sendStatus(404);
    else res.send(JSON.stringify(customerTrips));
  } catch (err) {
    res.status(500).send(JSON.stringify(err.message));
  }
});

app.post("/customer", async function (req, res) {
  try {
    var form = new multiparty.Form();
    if (!form) {
      res.sendStatus(400);
      return;
    }

    form.parse(req, async function (err, fields, files) {
      var customer = new Customer(
        null,
        null,
        "CUSTOMER",
        fields["first_name"],
        fields["last_name"],
        fields["address"],
        fields["email"],
        fields["phone_number"],
        fields["trip_count"]
      );
      const cust = await createCustomers(customer);
      console.log("getUserId()", cust.getUserId());
      const creds = await createCredentials(
        fields["email"],
        fields["password"],
        cust.getUserId()
      );
      if (creds && cust) res.status(201).send(JSON.stringify(customer));
      else res.status(500).send();
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(JSON.stringify(err.message));
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
    res.status(500).send(JSON.stringify(err.message));
  }
});

app.delete("/customer/:id", async function (req, res) {
  try {
    var id = req.params.id;
    const _id = await deleteCustomer(id);
    res.send(JSON.stringify({ status: "Delete", id: _id }));
  } catch (err) {
    console.log(err);
    res.status(500).send(JSON.stringify(err.message));
  }
});

app.get("/drivers", async function (req, res) {
  try {
    const drivers = await getDrivers();
    res.send(JSON.stringify(drivers));
  } catch (err) {
    res.status(500).send(JSON.stringify(err.message));
  }
});

app.get("/driver/user/:id", async function (req, res) {
  try {
    const id = req.params.id;
    console.log(id);
    const driver = await getDriverByUserId(id);
    console.log(driver);
    if (!driver) res.sendStatus(404);
    else res.send(JSON.stringify(driver));
  } catch (err) {
    res.status(500).send(JSON.stringify(err.message));
  }
});

app.get("/driver/:id", async function (req, res) {
  try {
    const id = req.params.id;
    console.log(id);
    const driver = await getDriverById(id);
    console.log(driver);
    if (!driver) res.sendStatus(404);
    else res.send(JSON.stringify(driver));
  } catch (err) {
    res.status(500).send(JSON.stringify(err.message));
  }
});

// Driver CRUD
app.post("/driver", async function (req, res) {
  try {
    var body = req.body;
    if (!body) {
      res.sendStatus(400);
      return;
    }
    const numberPlate = body.numberPlate;
    const branchName = body.branch;
    const vehicle = await getVehiclesByNumberPlate(numberPlate);
    const branch = await getBranchByName(branchName);

    var driver = new Driver(
      null,
      null,
      "DRIVER",
      body.firstName,
      body.lastName,
      body.address ? body.address : "",
      body.email,
      body.phoneNumber,
      body.status,
      branch.getId(),
      vehicle.getId()
    );
    const _driver = await createDriver(driver);
    res.status(201).send(JSON.stringify(_driver));
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.put("/driver/:id", async function (req, res) {
  try {
    var id = req.params.id;
    var body = req.body;
    if (!body) {
      res.sendStatus(400);
      return;
    }

    const numberPlate = body.numberPlate;
    const branchName = body.branch;
    const vehicle = await getVehiclesByNumberPlate(numberPlate);
    const branch = await getBranchByName(branchName);
    var driver = new Driver(
      id,
      null,
      "DRIVER",
      body.firstName,
      body.lastName,
      body.address ? body.address : "",
      body.email,
      body.phoneNumber,
      body.status,
      branch.getId(),
      vehicle.getId()
    );

    console.log(driver);
    const _driver = await updateDriver(driver, id);
    res.send(JSON.stringify(_driver));
  } catch (err) {
    console.log(err);
    res.status(500).send(JSON.stringify(err.message));
  }
});

app.delete("/driver/:id", async function (req, res) {
  try {
    var id = req.params.id;
    const _id = await deleteDriver(id);
    res.send(JSON.stringify({ status: "Delete", id: _id }));
  } catch (err) {
    console.log(err);
    res.status(500).send(JSON.stringify(err.message));
  }
});
//   End Driver CRUD
app.get("/trips", async function (req, res) {
  try {
    const trips = await getTrips();
    res.send(JSON.stringify(trips));
  } catch (err) {
    res.status(500).send(JSON.stringify(err.message));
  }
});

app.put("/trip/accept", async function (req, res) {
  try {
    var body = req.body;
    if (!body) {
      res.status(400).send();
      return;
    }
    const id = body.id;
    const checked = body.checked ? 1 : 0;
    const resp = await acceptRejectTrip(id, checked);
    if (resp == null) res.sendStatus(404);
    else res.send(await getTripById(id));
  } catch (err) {
    res.status(500).send(JSON.stringify(err.message));
  }
});

app.get("/trip/:id/driver", async function (req, res) {
  try {
    const id = req.params.id;
    const trips = await getTripsByDriverId(id);
    if (!trips) res.sendStatus(404);
    else res.send(JSON.stringify(trips));
  } catch (err) {
    res.status(500).send(JSON.stringify(err.message));
  }
});

app.get("/trip/:id", async function (req, res) {
  try {
    const id = req.params.id;
    const trip = await getTripById(id);
    if (!trip) res.sendStatus(404);
    else res.send(JSON.stringify(trip));
  } catch (err) {
    res.status(500).send(JSON.stringify(err.message));
  }
});

app.post("/trip", async function (req, res) {
  try {
    var body = req.body;
    if (!body) {
      res.status(400).send();
      return;
    }
    console.log(body);
    var vehicle_type = body.mini ? "Mini" : body.car ? "Car" : "Van";
    var branch = await getBranchByName(body.branch);
    console.log(branch);
    var vehicle = await getVehicleByTypeAndBranch(vehicle_type, branch.id);

    var customer = await getCustomerByUserId(body.customer_id);

    var drivers = await getDriverByVehicleId(vehicle.getId());

    console.log(drivers);
    var cost =
      Number(body.distance ? body.distance : 0) *
      Number(vehicle.getPrice() ? vehicle.getPrice() : 0);

    var trip = new Trip(
      null,
      body.pickup_street,
      body.pickup_city,
      body.drop_street,
      body.drop_city,
      drivers[0].getId(),
      vehicle.id,
      customer.getId(),
      false,
      "",
      body.distance,
      branch.id,
      cost
    );
    console.log(trip);
    const trip_id = await createTrip(trip);
    res
      .status(201)
      .send(JSON.stringify({ status: "SUCCESS", trip_id: trip_id }));
  } catch (err) {
    console.log(err);
    res.status(500).send(JSON.stringify(err.message));
  }
});

app.get("/users", async function (req, res) {
  try {
    const users = await getUsers();
    res.send(JSON.stringify(users));
  } catch (err) {
    res.status(500).send(JSON.stringify(err.message));
  }
});

app.get("/user/:id", async function (req, res) {
  try {
    const id = req.params.id;
    const user = await getUserById(id);
    if (!user) res.sendStatus(404);
    else res.send(JSON.stringify(user));
  } catch (err) {
    res.status(500).send(JSON.stringify(err.message));
  }
});

app.get("/vehicles", async function (req, res) {
  try {
    const vehicles = await getVehicles();
    res.send(JSON.stringify(vehicles));
  } catch (err) {
    res.status(500).send(JSON.stringify(err.message));
  }
});

app.get("/vehicle/:id", async function (req, res) {
  try {
    const id = req.params.id;
    const vehicle = await getVehiclesById(id);
    if (!vehicle) res.sendStatus(404);
    else res.send(JSON.stringify(vehicle));
  } catch (err) {
    res.status(500).send(JSON.stringify(err.message));
  }
});

app.post("/vehicle", async function (req, res) {
  try {
    var body = req.body;
    if (!body) {
      res.sendStatus(400);
      return;
    }

    console.log(body);

    const branchName = body.branch;
    const branch = await getBranchByName(branchName);

    var vehicle = new Vehicle(
      null,
      body.name,
      body.type,
      body.numberPlate,
      body.seats,
      body.price,
      branch.getId()
    );
    console.log(vehicle);

    const _vehicle = await createVehicle(vehicle);
    res.status(201).send(JSON.stringify(_vehicle));
  } catch (err) {
    console.log(err);
    res.status(500).send(JSON.stringify(err.message));
  }
});

app.put("/vehicle/:id", async function (req, res) {
  try {
    var id = req.params.id;
    var body = req.body;
    if (!body) {
      res.sendStatus(400);
      return;
    }

    const branchName = body.branch;
    const branch = await getBranchByName(branchName);
    var vehicle = new Vehicle(
      null,
      body.name,
      body.type,
      body.numberPlate,
      body.seats,
      body.price,
      branch.getId()
    );
    console.log(vehicle);

    const _vehicle = await updateVehicle(vehicle, id);
    res.send(JSON.stringify(_vehicle));
  } catch (err) {
    console.log(err);
    res.status(500).send(JSON.stringify(err.message));
  }
});

app.delete("/vehicle/:id", async function (req, res) {
  try {
    var id = req.params.id;
    const _id = await deleteVehicle(id);
    res.send(JSON.stringify({ status: "Delete", id: _id }));
  } catch (err) {
    console.log(err);
    res.status(500).send(JSON.stringify(err.message));
  }
});

var server = app.listen(port, hostname, () => {
  console.log(`Server Started on : http://${hostname}:${port}/`);
});
