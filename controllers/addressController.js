const AddressModel = require('../models/AddressModel');

async function getUserAddresses(req, res) {
    const userId = parseInt(req.query.userId);
    try{
        const addresses = await AddressModel.findByUserId(userId);
        res.json(addresses);
    } catch(err){
        console.error(err);
        res.status(500).json({success:false, error:err});
    }
}

async function addAddress(req, res) {
    const { userId, fullAddress, notes } = req.body; 
    try{
        await AddressModel.create(userId, fullAddress, notes);
        res.json({success:true, message:"Address added successfully"});
    } catch(err){
        console.error(err);
        res.status(500).json({success:false, error:err});
    }
}

module.exports = {
    getUserAddresses,
    addAddress
};

