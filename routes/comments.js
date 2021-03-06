var express = require("express");
var router = express.Router();
var Restaurent = require("../models/restaurent");
var Comment = require("../models/comment");

router.get("/restaurents/:id/comments/new",isLoggedIn,function(req,res){
    //find restaurent by id
    Restaurent.findById(req.params.id,function(err,restaurent){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{restaurent: restaurent});
        }
    })
});
router.post("/restaurents/:id/comments",isLoggedIn, function(req, res){
    Restaurent.findById(req.params.id, function(err, restaurent){
        if(err){
            console.log(err);
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }else{
                //add username and id to comment
                comment.author._id = req.user._id;
                comment.author.username = req.user.username;
                //save comment
                comment.save();
                restaurent.comments.push(comment);
                restaurent.save();
                res.redirect('/restaurents/' + restaurent._id);
            }
            })
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