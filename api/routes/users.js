const express = require("express");
const router = express.Router();

const UsersController = require("../controllers/users");

router.get("/", UsersController.users_get_all_users);
router.get("/:_id", UsersController.users_get_user_byId);
router.post("/signup", UsersController.users_post_signup);
router.post("/login", UsersController.users_post_login);
router.delete("/:userId", UsersController.users_delete_user);

module.exports = router;
