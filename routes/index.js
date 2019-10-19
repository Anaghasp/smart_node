var express = require("express");
var router = express.Router();
var request = require("request-promise");
var Data = require("../models/data");
/* GET home page. */
router.get("/", function(req, res, next) {
  res.json({ message: "working" });
});

router.get("/getData", async (req, res, next) => {
  try {
    var options = {
      uri: "http://localhost:3000/api/Data",
      headers: {
        "User-Agent": "Request-Promise"
      },
      json: true // Automatically parses the JSON string in the response
    };
    let response = await request(options);
    console.log(response);
    res.json(response);
  } catch (error) {
    console.log(error);
    res.json({ message: "error" });
  }
});

router.post("/newData", async (req, res, next) => {
  try {
    let data = new Data();
    data.name = req.body.name;
    data.type = req.body.type;
    data.group = req.body.group;
    data.records = req.body.records;
    await data.save();
    var options = {
      method: "POST",
      uri: "http://localhost:3000/api/Data",
      body: {
        $class: "org.me.cto.Data",
        dataId: data.id,
        forTrade: true,
        owner: "resource:org.me.cto.User#1"
      },
      json: true
    };
    let response = await request(options);
    console.log(response);
    res.json(response);
    // var stuff = JSON.parse(data.records);
    // res.json(stuff);
  } catch (error) {
    console.log(error);
    res.json({ message: "error" });
  }
});

router.get("/factors", async (req, res, next) => {
  try {
    let data = await Data.find({}, "type name group");
    res.json(data);
  } catch (error) {
    console.log(error);
    res.json({ message: "error" });
  }
});

router.post("/transaction", async (req, res, next) => {
  try {
    let new_owner;
    let data_id = req.body.dataId;
    var options = {
      uri: "http://localhost:3000/api/Data",
      headers: {
        "User-Agent": "Request-Promise"
      },
      json: true
    };
    let response = await request(options);
    for (var i = 0; i < response.length; i++) {
      // console.log(response[i].dataId);
      if (response[i].dataId == data_id) {
        let ll = response[i].owner.length;
        if (response[i].owner[ll - 1] === "1") {
          new_owner = "2";
          console.log(new_owner);
          break;
        }
        if (response[i].owner[ll - 1] === "2") {
          new_owner = "1";
          console.log(new_owner);
          break;
        }
      }
    }
    // res.json("yo");
    data_id = "resource:org.me.cto.Data#" + data_id;
    new_owner = "resource:org.me.cto.User#" + new_owner;
    var options_2 = {
      method: "POST",
      uri: "http://localhost:3000/api/TradeData",
      body: {
        $class: "org.me.cto.TradeData",
        data: data_id,
        newOwner: new_owner
      },
      json: true
    };
    let response_2 = await request(options_2);
    // console.log(response_2);
    res.json({ message: true });
  } catch (error) {
    // console.log(error);
    res.json({ message: "error" });
  }
});
module.exports = router;
