const express = require('express');
const ctrl = require("../../controllers/authController");
const { validateBody } = require("../../utils");
const {authenticate, upload} = require("../../middlewares");
const {schemas} = require("../../utils/usersValdationSchemas");
const router = express.Router();


router.post("/register", validateBody(schemas.registerSchema), ctrl.register);
router.post("/login", validateBody(schemas.loginSchema), ctrl.login);
router.get("/current", authenticate, ctrl.getCurrent);
router.post("/logout", authenticate, ctrl.logout);
router.patch("/avatar", authenticate, upload.single("avatar"), ctrl.updateAvatar);

module.exports = router;