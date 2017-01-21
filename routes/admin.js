const router = require('express').Router();
router.post('/test', (request, response, next) => {
    response.end("Hello World");
});