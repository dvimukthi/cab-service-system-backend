var mysql = require("mysql");
var Customer = require("../models/Customer");
var Driver = require("../models/Driver");
var Trip = require("../models/Trip");
var User = require("../models/User");
var Vehicle = require("../models/Vehicle");
var Branch = require("../models/Branch");

var conn = mysql.createConnection({
  host: "localhost",
  user: "app_user",
  password: "12345",
  database: "go_cheeta",
});

conn.connect(function (err) {
  if (err) throw err;
});

async function createBranch(branch) {
  return new Promise(async (resolve) => {
    conn.beginTransaction((err) => {
      if (err) resolve(null);

      SQL = `INSERT INTO go_cheeta.branch 
                (location, address, email, phone) 
                VALUES (?)`;

      values = [
        branch.getLocation(),
        branch.getAddress(),
        branch.getEmail(),
        branch.getPhone(),
      ];
      conn.query(SQL, [values], function (err, result) {
        if (err) {
          console.log(err);
          resolve(null);
        }
        branch.setId(result.insertId);
        conn.commit();
        resolve(branch);
      });
    });
  });
}

async function deleteBranch(id) {
  return new Promise((resolve) => {
    conn.beginTransaction((err) => {
      if (err) resolve(null);
      getBranchById(id).then((branch) => {
        var SQL = `DELETE FROM   go_cheeta.branch WHERE id = ${id}`;
        conn.query(SQL, function (err, result) {
          if (err) {
            console.log(err);
            resolve(null);
          }
          resolve(id);
        });
      });
    });
  });
}

function getBranchById(id) {
  return new Promise((resolve) => {
    var SQL = ` SELECT id,location, address, email, phone, 
            (SELECT count(*) FROM go_cheeta.driver WHERE  branch = branch.id) as 'drivers',
            (SELECT count(*) FROM go_cheeta.vehicle  WHERE  branch_id = branch.id) as 'vehicles'
            FROM go_cheeta.branch where id = '${id}';`;

    conn.query(SQL, function (err, rows) {
      if (rows.length == 0) {
        resolve(null);
      } else {
        var branch = new Branch(
          rows[0].id,
          rows[0].location,
          rows[0].address,
          rows[0].email,
          rows[0].phone,
          rows[0].drivers,
          rows[0].vehicles
        );
      }
      resolve(branch);
    });
  });
}

function getBranchList() {
  return new Promise((resolve) => {
    var SQL = ` SELECT id,location, address, email, phone, 
            (SELECT count(*) FROM go_cheeta.driver WHERE  branch = branch.id) as 'drivers',
            (SELECT count(*) FROM go_cheeta.vehicle  WHERE  branch_id = branch.id) as 'vehicles'
            FROM go_cheeta.branch;`;

    conn.query(SQL, function (err, rows) {
      var branchList = [];
      if (rows.length == 0) {
        resolve(null);
      } else {
        for (const r of rows) {
          var branch = new Branch(
            r.id,
            r.location,
            r.address,
            r.email,
            r.phone,
            r.drivers,
            r.vehicles
          );
          branchList.push(branch);
        }
      }
      resolve(branchList);
    });
  });
}

function getBranchByName(location) {
  return new Promise((resolve) => {
    var SQL = ` SELECT id,location 
            FROM go_cheeta.branch where location = '${location}';`;

    conn.query(SQL, function (err, rows) {
      if (rows.length == 0) {
        resolve(null);
      } else {
        var branch = new Branch(rows[0].id, rows[0].location);
      }
      resolve(branch);
    });
  });
}

async function updateBranch(branch, id) {
  return new Promise(async (resolve) => {
    conn.beginTransaction(async (err) => {
      if (err) resolve(null);

      var dbBranch = await getBranchById(id);

      var SQL = `UPDATE  go_cheeta.branch 
                        SET 
                        location = '${
                          branch.getLocation()
                            ? branch.getLocation()
                            : dbBranch.getLocation()
                        }', 
                        address = '${
                          branch.getAddress()
                            ? branch.getAddress()
                            : dbBranch.getAddress()
                        }', 
                        email = '${
                          branch.getEmail()
                            ? branch.getEmail()
                            : dbBranch.getEmail()
                        }', 
                        phone = '${
                          branch.getPhone()
                            ? branch.getPhone()
                            : dbBranch.getPhone()
                        }'
                        WHERE id = ${id}`;
      conn.query(SQL, function (err, result) {
        if (err) {
          console.log(err);
          resolve(null);
        }
        conn.commit();
        resolve(branch);
      });
    });
  });
}

async function createCredentials(email, password, userId) {
  return new Promise(async (resolve) => {
    var SQL = `
                INSERT INTO go_cheeta.credentials
                (username, password, user_id )
                VALUES
                ('${email}', '${password}', '${userId}') 
            `;
    console.log(SQL);
    conn.query(SQL, function (err, result) {
      if (err) resolve(null);
      var id = result.insertId;
      resolve(id);
    });
  });
}

async function createCustomers(customer) {
  return new Promise(async (resolve) => {
    var user = new User(
      null,
      customer.getUserType(),
      customer.getFirstName(),
      customer.getLastName(),
      customer.getAddress(),
      customer.getEmail(),
      customer.getPhoneNumber()
    );

    var mUser = await createUser(user);
    conn.beginTransaction((err) => {
      if (err) resolve(null);

      customer.setUserId(mUser.getId());

      SQL = `INSERT INTO go_cheeta.customer (trip_count, user_id) VALUES (?)`;

      values = [0, mUser.getId()];
      conn.query(SQL, [values], function (err, result) {
        if (err) {
          console.log(err);
          resolve(null);
        }
        customer.setId(result.insertId);
        conn.commit();
        resolve(customer);
      });
    });
  });
}

function updateCustomer(customer, id) {
  return new Promise((resolve) => {
    getCustomersById(id).then((dbCustomer) => {
      var user = new User(
        dbCustomer.getUserId,
        "CUSTOMER",
        customer.getFirstName() != null
          ? customer.getFirstName()
          : dbUser.getFirstName(),
        customer.getLastName() != null
          ? customer.getLastName()
          : dbCustomer.getLastName(),
        customer.getAddress() != null
          ? customer.getAddress()
          : dbCustomer.getAddress(),
        customer.getEmail() != null
          ? customer.getEmail()
          : dbCustomer.getEmail(),
        customer.getPhoneNumber() != null
          ? customer.getPhoneNumber()
          : dbCustomer.getPhoneNumber()
      );
      updateUser(user, dbCustomer.getUserId()).then(
        conn.beginTransaction((err) => {
          if (err) resolve(null);
          var SQL = `UPDATE  go_cheeta.customer SET 
                                trip_count = ${customer.getTripCount()}
                                WHERE id = ${id}`;
          conn.query(SQL, function (err, result) {
            if (err) {
              console.log(err);
              resolve(null);
            }
            conn.commit();
            resolve(customer);
          });
        })
      );
    });
  });
}

function deleteCustomer(id) {
  return new Promise((resolve) => {
    conn.beginTransaction((err) => {
      if (err) resolve(null);
      var SQL = `DELETE FROM   go_cheeta.customer WHERE id = ${id}`;
      conn.query(SQL, function (err, result) {
        if (err) {
          console.log(err);
          resolve(null);
        }
        conn.commit();
        resolve(id);
      });
    });
  });
}

function getCustomers() {
  return new Promise((resolve) => {
    var SQL = ` SELECT first_name, last_name, address, email, phone_number, customer.id as "ID", trip_count FROM go_cheeta.user 
        INNER JOIN
        customer WHERE customer.user_id = user.id;`;
    var customers = [];
    conn.query(SQL, function (err, rows) {
      rows.forEach((r) => {
        var customer = new Customer(
          r.ID,
          null,
          null,
          r.first_name,
          r.last_name,
          r.address,
          r.email,
          r.phone_number,
          r.trip_count
        );

        customers.push(customer);
      });
      resolve(customers);
    });
  });
}

function getCustomersById(id) {
  return new Promise((resolve) => {
    var SQL = ` SELECT first_name, last_name, address, email, phone_number, customer.id as "ID", trip_count FROM go_cheeta.user 
        INNER JOIN
        customer WHERE customer.user_id = user.id and customer.id = ${id};`;
    conn.query(SQL, function (err, rows) {
      if (rows.length == 0) {
        resolve(null);
      } else {
        var customer = new Customer(
          rows[0].ID,
          null,
          null,
          rows[0].first_name,
          rows[0].last_name,
          rows[0].address,
          rows[0].email,
          rows[0].phone_number,
          rows[0].trip_count
        );
        resolve(customer);
      }
    });
  });
}
// for driver CRUD
async function createDriver(driver) {
  return new Promise(async (resolve) => {
    var user = new User(
      null,
      driver.getUserType(),
      driver.getFirstName(),
      driver.getLastName(),
      driver.getAddress(),
      driver.getEmail(),
      driver.getPhoneNumber()
    );

    var mUser = await createUser(user);
    conn.beginTransaction((err) => {
      if (err) resolve(null);

      driver.setUserId(mUser.getId());

      SQL = `INSERT INTO go_cheeta.driver (status, user_id, branch, vehicle_id) VALUES (?)`;

      values = [0, mUser.getId(), driver.getBranch(), driver.getVehicleId()];

      conn.query(SQL, [values], function (err, result) {
        if (err) {
          console.log(err);
          resolve(null);
        }
        driver.setId(result.insertId);
        conn.commit();
        resolve(driver);
      });
    });
  });
}

function updateDriver(driver, id) {
  return new Promise((resolve) => {
    getDriverById(id).then((db) => {
      var dbdriver = db[0];
      var user = new User(
        dbdriver.getUserId(),
        "DRIVER",
        driver.getFirstName() != null
          ? driver.getFirstName()
          : dbdriver.getFirstName(),
        driver.getLastName() != null
          ? driver.getLastName()
          : dbdriver.getLastName(),
        driver.getEmail() != null ? driver.getEmail() : dbdriver.getEmail(),
        driver.getPhoneNumber() != null
          ? driver.getPhoneNumber()
          : dbdriver.getPhoneNumber()
      );
      updateUser(user, dbdriver.getUserId()).then(
        conn.beginTransaction((err) => {
          if (err) resolve(null);
          var SQL = `UPDATE  go_cheeta.driver SET 
                                    status = ${driver.status},
                                    branch = ${driver.getBranch()},
                                    vehicle_id = ${driver.getVehicleId()}
                                    WHERE id = ${id}`;
          conn.query(SQL, function (err, result) {
            if (err) {
              console.log(err);
              resolve(null);
            }
            conn.commit();
            resolve();
          });
        })
      );
    });
  });
}

async function deleteDriver(id) {
  return new Promise((resolve) => {
    conn.beginTransaction((err) => {
      if (err) resolve(null);
      getDriverById(id).then((driver) => {
        var SQL = `DELETE FROM   go_cheeta.driver WHERE id = ${id}`;
        conn.query(SQL, function (err, result) {
          if (err) {
            console.log(err);
            resolve(null);
          }
          SQL = `DELETE FROM   go_cheeta.user WHERE id = ${driver[0].getUserId()}`;
          conn.query(SQL, function (err, result) {
            if (err) {
              console.log(err);
              resolve(null);
            }
          });
          resolve(id);
        });
      });
    });
  });
}
function getDrivers() {
  return new Promise((resolve) => {
    var SQL = ` SELECT first_name, last_name, address, email, phone_number, driver.id as "ID", 
        status, driver.branch, driver.vehicle_id FROM go_cheeta.user 
        INNER JOIN
        driver WHERE driver.user_id = user.id;`;
    var drivers = [];
    conn.query(SQL, async function (err, rows) {
      for (const r of rows) {
        var driver = new Driver(
          r.ID,
          null,
          null,
          r.first_name,
          r.last_name,
          r.address,
          r.email,
          r.phone_number,
          r.status,
          r.branch,
          r.vehicle_id
        );

        if (r.vehicle_id) {
          const vehicle = await getVehicleById(r.vehicle_id);
          driver.setVehicle(vehicle);
        }

        if (r.branch) {
          const branch = await getBranchById(r.branch);
          driver.setBranch(branch.getLocation());
        }
        drivers.push(driver);
      }
      resolve(drivers);
    });
  });
}

function getDriverById(id) {
  return new Promise((resolve) => {
    var SQL = ` SELECT user.id as "userId" , first_name, last_name, address, email, phone_number, driver.id as "ID", 
        status, driver.branch, driver.vehicle_id FROM go_cheeta.user 
        INNER JOIN
        driver WHERE driver.user_id = user.id
        AND driver.id = ${id};`;
    var drivers = [];
    conn.query(SQL, async function (err, rows) {
      for (const r of rows) {
        var driver = new Driver(
          r.ID,
          r.userId,
          null,
          r.first_name,
          r.last_name,
          r.address,
          r.email,
          r.phone_number,
          r.status,
          r.branch,
          r.vehicle_id
        );

        if (r.vehicle_id) {
          const vehicle = await getVehicleById(r.vehicle_id);
          driver.setVehicle(vehicle);
        }

        if (r.branch) {
          const branch = await getBranchById(r.branch);
          driver.setBranch(branch.getLocation());
        }
        drivers.push(driver);
      }
      resolve(drivers);
    });
  });
}

function getDriverByUserId(id) {
  return new Promise((resolve) => {
    var SQL = ` SELECT first_name, last_name, address, email, phone_number, driver.id as "ID", driver.status, (select location from branch where id = driver.branch) as "branch" FROM go_cheeta.user 
        INNER JOIN
        driver WHERE driver.user_id = user.id and user.id = ${id};`;
    conn.query(SQL, function (err, rows) {
      if (rows.length == 0) {
        resolve(null);
      } else {
        var driver = new Driver(
          rows[0].ID,
          null,
          null,
          rows[0].first_name,
          rows[0].last_name,
          rows[0].address,
          rows[0].email,
          rows[0].phone_number,
          rows[0].status,
          rows[0].branch
        );
        resolve(driver);
      }
    });
  });
}

function signIn(username, password) {
  return new Promise((resolve) => {
    var SQL = ` SELECT id, first_name, last_name, address, email, phone_number, user_type
        FROM go_cheeta.user 
        WHERE id in (SELECT user_id FROM go_cheeta.credentials 
                            WHERE trim(username) = '${username}'
                            AND   trim(password) = '${password}')`;

    // console.log()
    conn.query(SQL, function (err, r) {
      if (err) console.log(err);
      var user = new User(
        r[0].id,
        r[0].user_type,
        r[0].first_name,
        r[0].last_name,
        r[0].address,
        r[0].email,
        r[0].phone_number
      );
      resolve(user);
    });
  });
}

async function acceptRejectTrip(id, confirmed) {
  return new Promise((resolve) => {
    var SQL = `UPDATE go_cheeta.trip
                  SET
                  confirmed = ${confirmed}
                  WHERE id=${id}`;
    console.log(SQL);
    conn.query(SQL, function (err, result) {
      if (err) resolve(null);
      resolve(id);
    });
  });
}

async function createTrip(trip) {
  return new Promise((resolve) => {
    var SQL = `INSERT INTO go_cheeta.trip 
                  ( 
                    pickup_street,
                    pickup_city,
                    drop_street,
                    drop_city,
                    confirmed,
                    driver_id,
                    vehicle_id,
                    customer_id,
                    branch_id,
                    distance

                )
                  VALUES (?)`;
    conn.beginTransaction((err) => {
      if (err) resolve(null);
      let values = [
        trip.getPickupstreet(),
        trip.getPickupCity(),
        trip.getDropStreet(),
        trip.getDropCity(),
        trip.getConfirmedStatus(),
        null,
        trip.getVehicleId(),
        trip.getCustomerId(),
        trip.getBranch(),
        trip.getDistance(),
      ];
      conn.query(SQL, [values], function (err, result) {
        if (err) {
          console.log(err);
          resolve(null);
        }
        conn.commit();
        getTripById(result.insertId)
          .then((dbTrip) => {
            resolve(dbTrip);
          })
          .catch((err) => {
            console.log(err);
            resolve(null);
          });
      });
    });
  });
}

function getTrips() {
  return new Promise((resolve) => {
    var SQL = `SELECT id,pickup_street,pickup_city,drop_street,drop_city,confirmed,driver_id,vehicle_id,customer_id
        FROM go_cheeta.trip;`;
    var trips = [];
    conn.query(SQL, function (err, rows) {
      rows.forEach((r) => {
        var trip = new Trip(
          r.id,
          r.pickup_street,
          r.pickup_city,
          r.drop_street,
          r.drop_city,
          r.driver_id,
          r.vehicle_id,
          r.customer_id,
          r.confirmed
        );

        trips.push(trip);
      });
      resolve(trips);
    });
  });
}

function getTripById(id) {
  return new Promise((resolve) => {
    var SQL = `SELECT id,pickup_street,pickup_city,drop_street,drop_city,confirmed,driver_id,vehicle_id,customer_id
        FROM go_cheeta.trip WHERE id=${id};`;

    conn.query(SQL, function (err, rows) {
      if (err) console.log(err);
      if (rows.length == 0) {
        resolve(null);
      } else {
        var trip = new Trip(
          rows[0].id,
          rows[0].pickup_street,
          rows[0].pickup_city,
          rows[0].drop_street,
          rows[0].drop_city,
          rows[0].driver_id,
          rows[0].vehicle_id,
          rows[0].customer_id,
          rows[0].confirmed
        );
        resolve(trip);
      }
    });
  });
}
async function getTripsByCustomerId(id) {
  return new Promise((resolve) => {
    var SQL = `SELECT id,pickup_street,pickup_city,drop_street,drop_city,confirmed,driver_id,vehicle_id,
        (SELECT CONCAT(first_name,' ',last_name) FROM go_cheeta.user WHERE id IN (
            SELECT user_id from go_cheeta.customer WHERE id = customer_id
        )) as "customer_name",customer_id, branch_id, distance, cost
        FROM go_cheeta.trip WHERE driver_id in (SELECT id from go_cheeta.customer WHERE id = '${id}')`;
    var trips = [];
    console.log(SQL);
    conn.query(SQL, async function (err, rows) {
      if (err) resolve(null);
      for (const r of rows) {
        var branch = await getBranchById(r.branch_id);
        console.log(branch);
        var trip = new Trip(
          r.id,
          r.pickup_street,
          r.pickup_city,
          r.drop_street,
          r.drop_city,
          r.driver_id,
          r.vehicle_id,
          r.customer_id,
          r.confirmed,
          r.customer_name,
          r.distance,
          branch ? branch.getLocation() : "",
          r.cost
        );

        var vehicle = await getVehicleById(r.vehicle_id);
        trip.setVehicle(vehicle);
        var driver = await getDriverById(r.driver_id);
        trip.setDriver(driver[0]);
        console.log(trip);
        trips.push(trip);
      }
      console.log(trips);
      resolve(trips);
    });
  });
}

async function getTripsByDriverId(id) {
  return new Promise((resolve) => {
    var SQL = `SELECT id,pickup_street,pickup_city,drop_street,drop_city,confirmed,driver_id,vehicle_id,
        (SELECT CONCAT(first_name,' ',last_name) FROM go_cheeta.user WHERE id IN (
            SELECT user_id from go_cheeta.customer WHERE id = customer_id
        )) as "customer_name",customer_id, branch_id, distance, cost
        FROM go_cheeta.trip WHERE driver_id in (SELECT id from go_cheeta.driver WHERE user_id = '${id}')`;
    var trips = [];
    console.log(SQL);
    conn.query(SQL, function (err, rows) {
      if (err) resolve(null);
      rows.forEach((r) => {
        var trip = new Trip(
          r.id,
          r.pickup_street,
          r.pickup_city,
          r.drop_street,
          r.drop_city,
          r.driver_id,
          r.vehicle_id,
          r.customer_id,
          r.confirmed,
          r.customer_name,
          r.distance,
          r.branch_id,
          r.cost
        );
        console.log(trip);
        trips.push(trip);
      });
      console.log(trips);
      resolve(trips);
    });
  });
}

async function createUser(user) {
  return new Promise((resolve) => {
    var SQL = `INSERT INTO go_cheeta.user 
                  (user_type,
                  first_name,
                  last_name,
                  address,
                  email,
                  phone_number )
                  VALUES (?)`;
    conn.beginTransaction((err) => {
      if (err) resolve(null);
      let values = [
        user.getUserType(),
        user.getFirstName(),
        user.getLastName(),
        user.getAddress(),
        user.getEmail(),
        user.getPhoneNumber(),
      ];
      conn.query(SQL, [values], function (err, result) {
        if (err) {
          console.log(err);
          resolve(null);
        }
        conn.commit();
        getUserById(result.insertId)
          .then((dbUser) => {
            resolve(dbUser);
          })
          .catch((err) => {
            console.log(err);
            resolve(null);
          });
      });
    });
  });
}
function getUsers() {
  return new Promise((resolve) => {
    var SQL = ` SELECT id,first_name, last_name, address, email, phone_number FROM go_cheeta.user ;`;
    var users = [];
    conn.query(SQL, function (err, rows) {
      rows.forEach((r) => {
        var user = new User(
          r.id,
          null,
          null,
          r.first_name,
          r.last_name,
          r.address,
          r.email,
          r.phone_number
        );

        users.push(user);
      });
      resolve(users);
    });
  });
}

function getUserById(id) {
  return new Promise((resolve) => {
    var SQL = ` SELECT first_name, last_name, address, email, phone_number, id  FROM go_cheeta.user WHERE id = ${id};`;
    conn.query(SQL, function (err, rows) {
      if (rows.length == 0) {
        resolve(null);
      } else {
        var user = new User(
          rows[0].id,
          null,
          null,
          rows[0].first_name,
          rows[0].last_name,
          rows[0].address,
          rows[0].email,
          rows[0].phone_number
        );
        resolve(user);
      }
    });
  });
}

function updateUser(user, id) {
  return new Promise((resolve) => {
    console.log("ID - ", id);
    getUserById(id).then((dbUser) => {
      var SQL = `UPDATE go_cheeta.user 
            SET user_type = '${
              user.getUserType() != null
                ? user.getUserType()
                : dbUser.getUserType()
            }',
                first_name = '${
                  user.getFirstName() != null
                    ? user.getFirstName()
                    : dbUser.getFirstName()
                }',
                last_name = '${
                  user.getLastName() != null
                    ? user.getLastName()
                    : dbUser.getLastName()
                }',
                address = '${
                  user.getAddress() != null
                    ? user.getAddress()
                    : dbUser.getAddress()
                }',
                email = '${
                  user.getEmail() != null ? user.getEmail() : dbUser.getEmail()
                }',
                phone_number = '${
                  user.getPhoneNumber() != null
                    ? user.getPhoneNumber()
                    : dbUser.getPhoneNumber()
                }' 
            WHERE id = ${id}`;

      conn.beginTransaction((err) => {
        if (err) resolve(null);
        conn.query(SQL, function (err, result) {
          if (err) {
            console.log(err);
            resolve(null);
          }
          conn.commit();
          resolve(user);
        });
      });
    });
  });
}

async function createVehicle(vehicle) {
  return new Promise(async (resolve) => {
    conn.beginTransaction((err) => {
      if (err) resolve(null);
      SQL = `INSERT INTO go_cheeta.vehicle (vehicle_name, 
                vehicle_type, number_plate, number_of_seats, price, branch_id) 
              VALUES (?)`;

      values = [
        vehicle.getName(),
        vehicle.getType(),
        vehicle.getNumberPlate(),
        vehicle.getSeats(),
        vehicle.getPrice(),
        vehicle.getBranchId(),
      ];
      conn.query(SQL, [values], function (err, result) {
        if (err) {
          console.log(err);
          resolve(null);
        }
        vehicle.setId(result.insertId);
        conn.commit();
        resolve(vehicle);
      });
    });
  });
}

async function deleteVehicle(id) {
  return new Promise((resolve) => {
    conn.beginTransaction((err) => {
      if (err) resolve(null);
      getVehicleById(id).then((vehicle) => {
        var SQL = `DELETE FROM   go_cheeta.vehicle WHERE id = ${id}`;
        conn.query(SQL, function (err, result) {
          if (err) {
            console.log(err);
            resolve(null);
          }
          resolve(id);
        });
      });
    });
  });
}

async function getVehicles() {
  return new Promise((resolve) => {
    var SQL = `SELECT id,vehicle_name, vehicle_type, number_plate, 
        number_of_seats, price, branch_id 
        FROM go_cheeta.vehicle order by vehicle_type;`;
    var vehicles = [];
    conn.query(SQL, async function (err, rows) {
      for (const r of rows) {
        var vehicle = new Vehicle(
          r.id,
          r.vehicle_name,
          r.vehicle_type,
          r.number_plate,
          r.number_of_seats,
          r.price,
          r.branch_id
        );

        if (r.branch_id) {
          const branch = await getBranchById(r.branch_id);
          vehicle.setBranch(branch.getLocation());
        }

        vehicles.push(vehicle);
      }
      resolve(vehicles);
    });
  });
}

function getVehicleById(id) {
  return new Promise((resolve) => {
    var SQL = ` SELECT id,vehicle_name, vehicle_type, number_plate, number_of_seats, price, branch_id FROM go_cheeta.vehicle where id = ${id};`;
    conn.query(SQL, function (err, rows) {
      if (rows.length == 0) {
        resolve(null);
      } else {
        var vehicle = new Vehicle(
          rows[0].id,
          rows[0].vehicle_name,
          rows[0].vehicle_type,
          rows[0].number_plate,
          rows[0].number_of_seats,
          rows[0].price,
          rows[0].branch_id
        );
      }
      resolve(vehicle);
    });
  });
}

function getVehiclesByNumberPlate(numberPlate) {
  return new Promise((resolve) => {
    var SQL = ` SELECT id,vehicle_name, vehicle_type, number_plate, number_of_seats, price, branch_id FROM go_cheeta.vehicle 
        where number_plate = '${numberPlate}';`;
    conn.query(SQL, function (err, rows) {
      if (rows.length == 0) {
        resolve(null);
      } else {
        var vehicle = new Vehicle(
          rows[0].id,
          rows[0].vehicle_name,
          rows[0].vehicle_type,
          rows[0].number_plate,
          rows[0].number_of_seats,
          rows[0].price,
          rows[0].branch_id
        );
      }
      resolve(vehicle);
    });
  });
}

function getVehicleByTypeAndBranch(type, branchId) {
  return new Promise((resolve) => {
    var SQL = ` SELECT id,vehicle_name, number_plate, number_of_seats, price, branch_id 
        FROM go_cheeta.vehicle where vehicle_type = '${type}' AND branch_id=${branchId};`;
    conn.query(SQL, function (err, rows) {
      if (rows.length == 0) {
        resolve(null);
      } else {
        var vehicle = new Vehicle(
          rows[0].id,
          rows[0].vehicle_name,
          rows[0].vehicle_type,
          rows[0].number_plate,
          rows[0].number_of_seats,
          rows[0].price,
          rows[0].branch_id
        );
      }
      resolve(vehicle);
    });
  });
}

function updateVehicle(vehicle, id) {
  return new Promise((resolve) => {
    getVehicleById(id).then((db) => {
      var dbVehicle = db[0];
      conn.beginTransaction((err) => {
        if (err) resolve(null);
        var SQL = `UPDATE  go_cheeta.vehicle SET 
                                    vehicle_name = '${
                                      vehicle.getName()
                                        ? vehicle.getName()
                                        : dbVehicle.getName()
                                    }',
                                    vehicle_type = '${
                                      vehicle.getType()
                                        ? vehicle.getType()
                                        : dbVehicle.getType()
                                    }',
                                    number_plate = '${
                                      vehicle.getNumberPlate()
                                        ? vehicle.getNumberPlate()
                                        : dbVehicle.getNumberPlate()
                                    }',
                                    number_of_seats = ${
                                      vehicle.getSeats()
                                        ? vehicle.getSeats()
                                        : dbVehicle.getSeats()
                                    },
                                    price = ${
                                      vehicle.getPrice()
                                        ? vehicle.getPrice()
                                        : dbVehicle.getPrice()
                                    },
                                    branch_id = ${
                                      vehicle.getBranchId()
                                        ? vehicle.getBranchId()
                                        : dbVehicle.getBranchId()
                                    }
                                    WHERE id = ${id}`;
        conn.query(SQL, function (err, result) {
          if (err) {
            console.log(err);
            resolve(null);
          }
          conn.commit();
          resolve();
        });
      });
    });
  });
}

module.exports = {
  createBranch,
  deleteBranch,
  getBranchList,
  getBranchByName,
  getBranchById,
  updateBranch,
  createCredentials,
  createCustomers,
  deleteCustomer,
  getCustomers,
  getCustomersById,
  updateCustomer,
  createDriver,
  deleteDriver,
  getDrivers,
  getDriverById,
  getDriverByUserId,
  updateDriver,
  signIn,
  acceptRejectTrip,
  createTrip,
  getTrips,
  getTripById,
  getTripsByCustomerId,
  getTripsByDriverId,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  createVehicle,
  deleteVehicle,
  getVehicles,
  getVehicleById,
  getVehiclesByNumberPlate,
  getVehicleByTypeAndBranch,
  updateVehicle,
};
