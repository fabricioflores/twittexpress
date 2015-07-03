'use strict';

var _ = require('lodash');

// Get the json for the slides - static for now
exports.index = function(req, res) {
  var pbshow = {
    "slides" : [
      {
        "subtitle" : "Este es el slide 0!",
        "src" : "./images/image00.jpg",
        "title" : "Slide 0",
        "id" : "image00"
      },
      {
        "subtitle" : "Este es el slide 1",
        "src" : "./images/image01.jpg",
        "title" : "Slide 2",
        "id" : "image01"
      },
      {
        "subtitle" : "Este es el slide 2",
        "src" : "./images/image02.jpg",
        "title" : "Slide 2",
        "id" : "image02"
      },
      {
        "subtitle" : "Este es el slide 3",
        "src" : "./images/image03.jpg",
        "title" : "Slide 3",
        "id" : "image03"
      },
      {
        "subtitle" : "Este es el slide 4",
        "src" : "./images/image04.jpg",
        "title" : "Slide 4",
        "id" : "image04"
      }
    ],
    "max_text_chars": 180,
    "random_slides": true
  };

  res.json(pbshow);
};
