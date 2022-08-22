"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./models/user");
const Apartment = require("./models/apartment");
const Review = require("./models/review");

const mongoDB = "mongodb+srv://abdulbarrilawal:Moyosore74@cluster0.zmn7hpe.mongodb.net/test";

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', (error) => {
  console.log(error)
})

db.once('connected', () => {
  console.log('Database Connected');
})


const app = express();
const port = 5001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/user", (req, res) => {
  var user = new User();
  user.username = req.body.username;
  user.save((err, savedUser) => {
    if (err) {
      res.status(500).send({ error: "Could not save user" });
    } else {
      req.send(savedUser);
    }
  });
});

app.get("/user", (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      res.status(500).send({ error: "Could not fetch users" });
    } else {
      res.send(users);
    }
  });
});

app.post("/apartment", (req, res) => {
  var apartment = new Apartment();
  apartment.apartmentName = req.body.apartmentName;
  apartment.save((err, savedApartment) => {
    if (err) {
      res.status(500).send({ error: "Could not save apartment" });
    } else {
      res.send(savedApartment);
    }
  });
});

app.get("/apartment", (req, res) => {
  Apartment.find({})
    .populate({ path: "user", model: "User" })
    .exec((err, apartments) => {
      if (err) {
        res.status(500).send({ error: "Could not fetch apartments" });
      } else {
        res.send(apartments);
      }
    });
});

app.get("/", (req, res) => {
  Review.find({})
    .populate({ path: "user", model: "User" })
    .populate({ path: "apartment", model: "Apartment" })
    .lean()
    .exec((err, allUsers) => {
      if (err) {
        res.status(500).send({ error: "Could not fetch apartments" });
      } else {
        res.send(allUsers);
      }
    });
});

app.get("/review", (req, res) => {
  Review.find({})
    .populate({ path: "user", model: "User" })
    .populate({ path: "apartment", model: "Apartment" })
    .exec((err, reviews) => {
      if (err) {
        res.status(500).send({ error: "Could not fetch reviews" });
      } else {
        res.send(reviews);
      }
    });
});

app.post("/review", (req, res) => {
  var review = new Review();
  review.landlordReview = req.body.landlordReview;
  review.environmentReview = req.body.environmentReview;
  review.amenitiesQuality = req.body.amenitiesQuality;
  review.image = req.body.image;
  review.video = req.body.video;
  review.rating = req.body.rating;

  review.save((err, newReview) => {
    if (err) {
      res.status(500).send({ error: "Could not create review" });
    } else {
      res.send(newReview);
    }
  });
});

app.put("/apartment/user/add", (req, res) => {
  User.findOne({ _id: req.body.userId }, (err, user) => {
    if (err) {
      res.status(500).send({ error: "Could not add apartment name" });
    } else {
      Apartment.update(
        { _id: req.body.apartmentId },
        { $addToSet: { user: user._id } },
        (err, apartment) => {
          if (err) {
            res.status(500).send({ error: "Could not add apartment name" });
          } else {
            res.send(apartment);
          }
        }
      );
    }
  });
});

app.put("/review/apartment/add", (req, res) => {
  Apartment.findOne({ _id: req.body.apartmentId }, (err, apartment) => {
    if (err) {
      res.status(500).send({ error: "Could not add review" });
    } else {
      Review.update(
        { _id: req.body.reviewId },
        { $addToSet: { apartment: apartment._id } },
        (err, review) => {
          if (err) {
            res.status(500).send({ error: "Could not add review" });
          } else {
            res.send(review);
          }
        }
      );
    }
  });
});

app.listen(port, () => {
  console.log(`API Started & Listening on port ${port}`);
});
