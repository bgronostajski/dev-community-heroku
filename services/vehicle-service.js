const { Client } = require('pg')

exports.getListUsingAPI = function(req, res) {
    req.conn.query("SELECT Id, Name FROM Vehicle__c")
        .then(vehicles => {
            res.json(vehicles.records);
        })
        .catch(err=>{
            res.json(err)
        })
}

exports.getListUsingPG = function(req, res) {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    })

    client.connect();

    client.query(`SELECT * FROM salesforce.Vehicle__c`).then(result=>{
        res.json(result.rows);

    }).catch(err=>{
        res.json(err).status(200);

    }).finally(()=>{
        client.end()
    })
}

exports.createNewVehiclePG = function() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    })



    client.query('BEGIN')
}

exports.createNewVehicleAPI = function(req, res) {
    const vehicle = req.body;
    req.conn.sobject("Vehicle__c").create(vehicle)
        .then(rec=>res.json(rec).status(201))
        .catch(err=>{res.json(err).status(401)})
}
