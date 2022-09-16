var mysql = require("mysql");
var Customer = require("../models/Customer");
var Driver = require("../models/Driver");
var Trip = require("../models/Trip");
var User = require("../models/User");
var Vehicle = require("../models/Vehicle");

var conn = mysql.createConnection({
  host: "localhost",
  user: "app_user",
  password: "12345",
  database: "go_cheeta",
});

conn.connect(function (err) {
  if (err) throw err;
});

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

function getDrivers() {
  return new Promise((resolve) => {
    var SQL = ` SELECT first_name, last_name, address, email, phone_number, driver.id as "ID", status FROM go_cheeta.user 
        INNER JOIN
        driver WHERE driver.user_id = user.id;`;
    var drivers = [];
    conn.query(SQL, function (err, rows) {
      rows.forEach((r) => {
        var driver = new Driver(
          r.ID,
          null,
          null,
          r.first_name,
          r.last_name,
          r.address,
          r.email,
          r.phone_number,
          r.status
        );

        drivers.push(driver);
      });
      resolve(drivers);
    });
  });
}

function getDriverById(id) {
  return new Promise((resolve) => {
    var SQL = ` SELECT first_name, last_name, address, email, phone_number, driver.id as "ID", status FROM go_cheeta.user 
        INNER JOIN
        driver WHERE driver.user_id = user.id and driver.id = ${id};`;
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
          rows[0].trip_count
        );
        resolve(driver);
      }
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

function getVehicles() {
  return new Promise((resolve) => {
    var SQL = ` SELECT id,vehicle_name, vehicle_type, number_plate, number_of_seats, price, branch_id FROM go_cheeta.vehicle ;`;
    var vehicles = [];
    conn.query(SQL, function (err, rows) {
      rows.forEach((r) => {
        var vehicle = new Vehicle(
          r.id,
          vehicle_name,
          vehicle_type,
          r.number_plate,
          r.number_of_seats,
          r.price,
          r.branch_id
        );

        vehicles.push(vehicle);
      });
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

module.exports = {
  createCustomers,
  deleteCustomer,
  getCustomers,
  getCustomersById,
  updateCustomer,
  getDrivers,
  getDriverById,
  getTrips,
  getTripById,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  getVehicles,
  getVehicleById,
};
