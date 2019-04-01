var express = require("express");
var router = express.Router();
var Restaurent = require("../models/restaurent")
router.get("/restaurents",function(req,res){
    //Get all restaurents from db
    
    Restaurent.find({},function(err,allRestaurents){
        if(err){
            console.log(err);
        }else{
            res.render("restaurents/index",{restaurents: allRestaurents, currentUser: req.user});
        }
    });
    
});

//CREATE - create new restaurents
router.post("/restaurents",function(req,res){
    var name =req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newRestaurent = {name: name,image: image,description: description};
    Restaurent.create(newRestaurent,function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            //redirect back to restaurents page
            res.redirect("/restaurents");
        }
    });
});

//NEW - show form to create new restaurent
router.get("/restaurents/new",isLoggedIn,function(req,res){
    res.render("restaurents/new");
});

//SHOW - shows more info about the restaurent

router.get("/restaurents/:id",function(req,res){
    Restaurent.findById(req.params.id).populate("comments").exec(function(err,foundRestaurent){
        if(err){
            console.log(err);
        }else{
            console.log(foundRestaurent);
            res.render("restaurents/show",{restaurent: foundRestaurent});
        }
    });
});

//EDIT RESTAURENT
router.get("/restaurents/:id/edit", function(req, res){
    Restaurent.findById(req.params.id, function(err, foundRestaurent){
        if(err){
            res.redirect("/restaurents")
        }else {
            res.render("restaurents/edit",{restaurent: foundRestaurent});
        }
    });
});

router.put("/restaurents/:id", function(req, res){
    Restaurent.findByIdAndUpdate(req.params.id, req.body.restaurent, function(err, updatedRestaurent){
        if(err){
            res.redirect("/restaurents");
        }else{
            res.redirect("/restaurents/" + req.params.id);
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
module.exports = router;