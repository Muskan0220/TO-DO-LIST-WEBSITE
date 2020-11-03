const express = require("express");
const bodyparser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');
const _ = require("lodash");
const app = express();
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.connect('mongodb+srv://admin-muskan:Test123@cluster0.kpb2d.mongodb.net/todolistDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const itemschema = {
  name: {
    type: String,
    required: true
  }
};
const Item = mongoose.model("Item", itemschema)
const item1 = new Item({
  name: "Add items to your todolist"
});
const item2 = new Item({
  name: "Click the + sign to do so"
});
const item3 = new Item({
  name: "<-- Hit this to delete the item"
});
const defaultitems = [item1, item2, item3];
const listschema = {
  name: String,
  items: [itemschema]
}
const List = mongoose.model("List", listschema);
app.get("/", function(req, res) {

  let day = date.getDate();
  Item.find({}, function(err, items) {
    if (items.length === 0) {
      Item.insertMany(defaultitems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("SUCCESSFULLY LOGGED DEFAULT ITEMS");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {
        whatday: day,
        newitem: items
      });

    }
  })

});
app.get("/:listname", function(req, res) {
  const customlistname = _.capitalize(req.params.listname);
  List.findOne({
    name: customlistname
  }, function(err, foundlist) {
    if (!err) {
      if (!foundlist) {
        const list = new List({
          name: customlistname,
          items: defaultitems
        })
        list.save();
        res.redirect("/" + customlistname);
      } else {
        res.render("list", {
          whatday: foundlist.name,
          newitem: foundlist.items
        });
      }
    }
  })

})
app.post("/", function(req, res) {
  const itemname = req.body.new;
  const listname = req.body.add;
  const item = new Item({
    name: itemname
  });
  if (listname === (date.getDate())) {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({
      name: listname
    }, function(err, founditem) {
      founditem.items.push(item);
      founditem.save();
      res.redirect("/" + listname);
    })
  }
});
app.post("/delete", function(req, res) {
  const checkid = req.body.checkbox;
  const listname = req.body.listname;
  if (listname === (date.getDate())) {
    Item.findByIdAndRemove(checkid, function(err) {
      if (err) {
        console.log(err)
      }
      res.redirect("/");
    });
  } else {
    List.findOneAndUpdate({
      name: listname
    }, {
      $pull: {
        items: {
          _id: checkid
        }
      }
    }, function(err, foundlist) {
      if (!err) {
        res.redirect("/" + listname);
      }
    })
  }
});

app.listen(3000, () => {
  console.log("SERVER HAS STARTED RUNNING SUCCESSFULLY")
});
