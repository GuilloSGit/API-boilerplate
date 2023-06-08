const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET request to /products',
    });
});

router.post('/', (req, res, next) => {
    res.status(201).json({
        message: 'Handling POST request to /products',
    });
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    if(id === 'special') {
        res.status(200).json({
            message: 'Product with ID ' + id + ' is a secret and should not be discovered. You should die.',
            id: id
        });
    } else {
        res.status(200).json({
            message: 'Product with ID ' + id + ' is now in the list.',
        });
    }
});

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    res.status(200).json({
        message: 'Update product with ID ' + id + '.'
    });
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    res.status(200).json({
        message: 'The product with ID ' + id + ' was deleted.'
    });
});

module.exports = router;
