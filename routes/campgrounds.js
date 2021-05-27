const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds");
const catchError = require("../utilities/error_handler");
const verifyLogin = require("../utilities/verify_login");
const verifyAuthor = require("../utilities/verify_author");
const { validateCampground } = require("../utilities/joi_schema");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.route("/")
    .get(catchError(campgrounds.index))
    .post(upload.array("images"), validateCampground, catchError(campgrounds.createCampground));

router.get("/new", verifyLogin, campgrounds.newCampground);

router.get("/:id", catchError(campgrounds.getCampground));

router.route("/edit/:id")
    .get(verifyLogin, catchError(campgrounds.editCampground))
    .patch(verifyAuthor, validateCampground, catchError(campgrounds.updateCampground));

router.route("/delete/:id")
    .get(verifyLogin, catchError(campgrounds.deleteCampground))
    .delete(verifyAuthor, catchError(campgrounds.confirmDeleteCampground));

module.exports = router;