const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Orders were fetched successfully',
    });
});

router.post('/', (req, res, next) => {
    res.status(201).json({
        message: 'Order was created successfully',
    });
});

router.get('/:orderId', (req, res, next) => {
    const orderId = req.params.orderId;
    res.status(200).json({
        message: 'Order: ' + orderId + ', was created successfully',
        orderId: orderId
    });
});

router.delete('/:orderId', (req, res, next) => {
    const orderId = req.params.orderId;
    res.status(200).json({
        message: 'Order: ' + orderId + ', was deleted',
        orderId: orderId
    });
});

module.exports = router;