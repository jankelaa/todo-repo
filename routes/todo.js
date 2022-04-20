const express = require('express');
const { verifyAccessToken, decodeAccessToken } = require('../helpers/jwt');
const router = express.Router();

const { Todo } = require('../models');

/* GET all my todo items. */
router.get('/', verifyAccessToken, async (req, res) => {
    try {
        console.log(req.payload);
        const myTodos = await Todo.findAll({
            where: {
                userId: req.payload.aud
            }
        });
        return res.json(myTodos);
    } catch (err) {
        return res.status(500).json(err);
    }
});

/* Create todo item. */
router.post('/create', verifyAccessToken, async (req, res) => {
    try {

        let todoObj = { title: req.body.title, content: req.body.content, flag: false, userId: req.payload.aud };
        await Todo.create(todoObj);
        return res.json(todoObj);

    } catch (err) {
        return res.status(500).json(err);
    }
});

/* Delete todo item with ID. */
router.post('/delete', verifyAccessToken, async (req, res) => {
    try {
        const oneTodo = await Todo.findOne({ where: { id: req.body.id } })
        if(!oneTodo) return res.status(404).send(`Todo ${req.body.id} not found.`);
        if(oneTodo.userId!=req.payload.aud) return res.status(403).send('Unauthorized access.');

        const count = await Todo.destroy({ where: { id: oneTodo.id } });
        if (count > 0)
            return res.json(`Deleted todo ${oneTodo.id}.`);

    } catch (err) {
        return res.status(500).json(err);
    }
});

router.get('/set', verifyAccessToken, async (req, res) => {
    try {
        const found = await Todo.findOne({ where: { id: req.query.id } })
        if(!found) return res.status(404).send(`Todo ${req.query.id} not found.`);
        if(found.userId!=req.payload.aud) return res.status(403).send('Unauthorized access.');

        await Todo.update({ flag: true }, {
            where: {
                id: req.query.id
            }
        })

        res.json(`Set flag for todo ${req.query.id}.`);
    } catch (err) {
        return res.status(500).json(err);
    }

});


module.exports = router;
