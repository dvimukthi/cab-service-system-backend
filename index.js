const express = require('express');
var cors = require('cors')
const bodyParser = require('body-parser');
const multiparty = require('multiparty');

const {
    getBranchByName,
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
    acceptRejectTrip,
    createTrip,
    signIn,
    getTrips,
    getTripById,
    getTripsByDriverId,
    getUsers,
    getUserById,
    createVehicle,
    getVehicles,
    getVehiclesByNumberPlate,
    getVehicleByTypeAndBranch,
   } = require('./src/services/data_service');

const Customer = require('./src/models/Customer');
const Vehicle = require('./src/models/Vehicle');
const Trip = require('./src/models/Trip');
const Driver = require('./src/models/Driver');
var app = express();

app.use(bodyParser.urlencoded({extended: false}));
// app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cors())
const hostname = '127.0.0.1';
const port = 3001;

app.get('/', function (req, res) {
    res.send(JSON.stringify({"status":"OK"}));
});

app.post('/signin', async function (req, res) {
    var form = new multiparty.Form()
        if(!form){
            res.sendStatus(400);
            return;
        }

        form.parse(req, async function(err, fields, files) {
            var userName = fields['email'];
            var passWord = fields['password'];
            try{
                var user =  await signIn(userName, passWord);
                console.log(user);
                if(user) {
                    res.status(200).send(JSON.stringify({
                            "userId":user.getId(),
                            "name":user.getFirstName()+' '+user.getLastName(),
                            "type":user.getUserType()
                    }));
                } else {
                    res.status(404).send();
                }
            }catch(err) {
                res.status(500).send();
            }
        });
    
    
});

app.get('/customers', async function (req, res) {
    try{
        const customers = await getCustomers();
        res.send(JSON.stringify(customers));
    } catch (err){
        res.status(500).send(JSON.stringify(err.message));
    }
});

app.get('/customer/:id', async function (req, res) {
    try{
        const id = req.params.id;
        const customer = await getCustomersById(id);
        if(!customer)
            res.sendStatus(404);
        else 
            res.send(JSON.stringify(customer));
    } catch (err){
        res.status(500).send(JSON.stringify(err.message));
    }
});

app.post('/customer', async function (req, res) {
    try{
        var form = new multiparty.Form()
        if(!form){
            res.sendStatus(400);
            return;
        }

        form.parse(req, async function(err, fields, files) {
            var customer = new Customer(null, null, "CUSTOMER",fields['first_name']
            , fields['last_name'],
            fields['address'], fields['email'], fields['phone_number'], 
            fields['trip_count'])
            const cust = await createCustomers(customer);
            const creds = await createCredentials(fields['email'], fields['password'],cust.getUserId())
            if(creds && cust)
                res.status(201).send(JSON.stringify(customer));
            else
                res.status(500).send();    
        })
    } catch (err){
        console.log(err);
        res.status(500).send(JSON.stringify(err.message));
    }
});

app.put('/customer/:id', async function (req, res) {
    try{
        var id = req.params.id;
        var body = req.body;
        if(!body){
            res.sendStatus(400);
            return;
        }

        var customer = new Customer(null, null, "CUSTOMER",body.first_name, body.last_name,
        body.address, body.email, body.phone_number, body.trip_count);
        const cust = await updateCustomer(customer,id);
        res.send(JSON.stringify(cust));
    } catch (err){
        console.log(err);
        res.status(500).send(JSON.stringify(err.message));
    }
});

app.delete('/customer/:id', async function (req, res) {
    try{
        var id = req.params.id;
        const _id = await deleteCustomer(id);
        res.send(JSON.stringify({"status": "Delete", "id":_id}));
    } catch (err){
        console.log(err);
        res.status(500).send(JSON.stringify(err.message));
    }
});

app.get('/drivers', async function (req, res) {
    try{
        const drivers = await getDrivers();
        res.send(JSON.stringify(drivers));
    } catch (err){
        res.status(500).send(JSON.stringify(err.message));
    }
});

app.get('/driver/user/:id', async function (req, res) {
    try{
        const id = req.params.id;
        console.log(id);
        const driver = await getDriverByUserId(id);
        console.log(driver);
        if(!driver)
            res.sendStatus(404);
        else 
            res.send(JSON.stringify(driver));
    } catch (err){
        res.status(500).send(JSON.stringify(err.message));
    }
});

app.get('/driver/:id', async function (req, res) {
    try{
        const id = req.params.id;
        console.log(id);
        const driver = await getDriverById(id);
        console.log(driver);
        if(!driver)
            res.sendStatus(404);
        else 
            res.send(JSON.stringify(driver));
    } catch (err){
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
        body.address?body.address:'',
        body.email,
        body.phoneNumber,
        body.status,
        branch.getId(),
        vehicle.getId(),      
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
        body.address?body.address:'',
        body.email,
        body.phoneNumber,
        body.status,
        branch.getId(),
        vehicle.getId(),     
      );

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
app.get('/trips', async function (req, res) {
    try{
        const trips = await getTrips();
        res.send(JSON.stringify(trips));
    } catch (err){
        res.status(500).send(JSON.stringify(err.message));
    }
});

app.put('/trip/accept', async function (req, res) {
    try{
        var body = req.body;
        if(!body){
            res.status(400).send();
            return;
        }
        const id = body.id;
        const checked = body.checked?1:0;
        const resp = await acceptRejectTrip(id, checked);
        if(resp == null)
            res.sendStatus(404);
        else 
            res.send(await getTripById(id));
    } catch (err){
        res.status(500).send(JSON.stringify(err.message));
    }
});

app.get('/trip/:id/driver', async function (req, res) {
    try{
        const id = req.params.id;
        const trips = await getTripsByDriverId(id);
        if(!trips)
            res.sendStatus(404);
        else 
            res.send(JSON.stringify(trips));
    } catch (err){
        res.status(500).send(JSON.stringify(err.message));
    }
});

app.get('/trip/:id', async function (req, res) {
    try{
        const id = req.params.id;
        const trip = await getTripById(id);
        if(!trip)
            res.sendStatus(404);
        else 
            res.send(JSON.stringify(trip));
    } catch (err){
        res.status(500).send(JSON.stringify(err.message));
    }
});



app.post('/trip', async function (req, res) {
    try{
        var body = req.body;
        if(!body){
            res.status(400).send();
            return;
        }
        console.log(body);
        var vehicle_type = body.mini ? 'Mini': body.car ? 'Car' : 'Van';
        var branch = await getBranchByName(body.branch);
        var vehicle = await getVehicleByTypeAndBranch(vehicle_type, branch.id);
        console.log(vehicle);
        var trip = new Trip(
            null,
            body.pickup_street,
            body.pickup_city,
            body.drop_street,
            body.drop_city,
            null,
            vehicle.id,
            body.customer_id,
            false,
            body.distance,
            branch.id,
        );
        const trip_id = await createTrip(trip);
        res.status(201).send(JSON.stringify({"status":"SUCCESS", "trip_id":trip_id}));
    }catch (err) {
        console.log(err);
        res.status(500).send(JSON.stringify(err.message));
    }
});

app.get('/users', async function (req, res) {
    try{
        const users = await getUsers();
        res.send(JSON.stringify(users));
    } catch (err){
        res.status(500).send(JSON.stringify(err.message));
    }
});

app.get('/user/:id', async function (req, res) {
    try{
        const id = req.params.id;
        const user = await getUserById(id);
        if(!user)
            res.sendStatus(404);
        else 
            res.send(JSON.stringify(user));
    } catch (err){
        res.status(500).send(JSON.stringify(err.message));
    }
});

app.get('/vehicles', async function (req, res) {
    try{
        const vehicles = await getVehicles();
        res.send(JSON.stringify(vehicles));
    } catch (err){
        res.status(500).send(JSON.stringify(err.message));
    }
});

app.get('/vehicle/:id', async function (req, res) {
    try{
        const id = req.params.id;
        const vehicle = await getVehiclesById(id);
        if(!vehicle)
            res.sendStatus(404);
        else 
            res.send(JSON.stringify(vehicle));
    } catch (err){
        res.status(500).send(JSON.stringify(err.message));
    }
});

app.post('/vehicles', async function (req, res) {
    try{
        var body = req.body;
        if(!body){
            res.sendStatus(400);
            return;
        }
        
        var vehicle = new Vehicle(null,body.name, body.type, 
            body.number_plate, body.seats, body.price, body.branch_id);

        const _vehicle = await createVehicle(vehicle);
        res.status(201).send(JSON.stringify(_vehicle));
    } catch (err){
        console.log(err);
        res.status(500).send(JSON.stringify(err.message));
    }
});
var server = app.listen(port, hostname, () => {
  console.log(`Server Started on : http://${hostname}:${port}/`);
});