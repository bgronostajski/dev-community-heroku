const {Pool} = require('pg')
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
})

exports.getDetailsUsingAPI = function(req, res) {
    console.log(req.params.id)
    req.conn.sobject("Vehicle__c").retrieve(req.params.id)
        .then(vehicle => res.json(vehicle))
        .catch(err => res.json(err).status(400))
}

exports.getListUsingAPI = function(req, res) {
    req.conn.query("SELECT Id, Name FROM Vehicle__c")
        .then(vehicles => res.json(vehicles.records))
        .catch(err => res.json(err).status(400))
}

exports.createNewVehicleAPI = function(req, res) {
    const vehicle = req.body;
    req.conn.sobject("Vehicle__c").create(vehicle)
        .then(rec=>res.json(rec).status(201))
        .catch(err=>{res.json(err).status(400)})
}





exports.getListUsingPG = async function(req, res) {
    await pool.connect();

    try{
        const queryString = `SELECT sfid, name FROM salesforce.Vehicle__c`;
        const result = await pool.query(queryString).rows;
        res.json(result).status(200);
    } catch (err) {
        res.status(400).json(err);
    }
}

exports.getDetailsUsingPG = async function(req, res) {
    await pool.connect();

    try{
        const queryString = 'SELECT * FROM salesforce.Vehicle__c where id = $1';
        const result = (await pool.query(queryString, [req.params.id])).rows[0];
        res.json(result).status(200);
    } catch (err) {
        res.status(400).json(err);
    }
}

exports.createNewVehiclePG = async function(req, res) {
    await pool.connect();

    try{
        const vehicle = req.body;
        await pool.query('BEGIN');
        const queryString = 'INSERT INTO salesforce.vehicle__c(name) VALUES ($1) RETURNING *';
        const newVehicle = (await pool.query(queryString, [vehicle.name])).rows[0];
        await pool.query('COMMIT');
        res.json(newVehicle).status(201);
    }catch (err) {
        await pool.query('ROLLBACK');
        res.status(400).json(err);
    }

}
