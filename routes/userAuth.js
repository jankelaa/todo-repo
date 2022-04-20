const express = require('express');
const router = express.Router();
/**MODEL */
const { User } = require('../models');
/**JOI */
const { userAuthSchema } = require('../helpers/joi_userAuth');
/**BCRYPT */
const bcrypt = require('bcrypt');
const saltRounds = 10;
/**JWT */
const { signAccessToken } = require('../helpers/jwt');
/** JSON obj u POST zahtevima */
router.use(express.json());

/* REGISTER AND AUTHENTICATE NEW USER. */
router.post('/register', async (req, res) => {
  // const { email, password } = req.body;

  try {
    let user = await userAuthSchema.validateAsync(req.body);

    if (await User.findOne({ where: { email: user.email } }))
      return res.status(409).send(`${user.email} already exists!`); /*`` umesto '': template literals for interpolated expressions (bilo koji izraz unutar ${...}*/

    user.password = await bcrypt.hash(user.password, saltRounds); /** Technique 2 (auto-gen a salt and hash):  */

    await User.create(user); /** .create() = .build() + .save() */

    return res.json(user);

  } catch (err) {
    if (err.isJoi === true) return res.status(422).json(err); /* 422 Unprocessable Entity: the server understands the content type of the request entity, 
    and the syntax of the request entity is correct, but it was unable to process the contained instructions.*/
    else return res.status(500).json(err);
  }
})

/* LOGIN. */
router.post('/login', async (req, res) => {
  try {
    const user = await userAuthSchema.validateAsync(req.body);

    const found = await User.findOne({ where: { email: user.email } })
    if (!found)
      return res.status(404).send(`${user.email} doesn't exist!`);

    if (await bcrypt.compare(user.password, found.password)) {

      const token = await signAccessToken(found.id);
      return res.json(token);
      // return res.json({ token });

    } else {
      return res.status(400).send('Password is incorect!');
    }

  } catch (err) {
    if (err.isJoi === true) return res.status(422).json(err);
    else return res.status(500).json(err);
  }
})

/* DELETE. */
router.post('/delete', async (req, res) => {
  try {
    const user = (req.body);
    
    const count = await User.destroy({ where: { id: user.id } });
    if(count>0)
      return res.json(`Deleted user ${user.id}.`);
    else
      return res.status(404).send(`User ${user.id} not found.`);

  } catch (err) {
    return res.status(500).json(err);
  }
})

module.exports = router;
