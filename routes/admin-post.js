const express = require('express');
const router = express.Router();
// const Category = require('../models/category-models');
// const Post = require('../models/post-models');
const db = require('../models/index');
const multer  = require('multer');
const im = require('imagemagick');





// var upload = multer({ dest: 'uploads/' });
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now()+'.jpg')
    }
});
var upload = multer({storage: storage});

router.get('/xoaCategory-:id', function (req,res,next) {
    idCategory = req.params.id;
    db.Categorys.destroy({where:{id:idCategory}}).then(function () {
        return res.redirect('/views-category');
    })
});
router.get('/xoaPost-:id', function (req,res,next) {
    idPost = req.params.id;
    db.Posts.destroy({where:{id:idPost}}).then(function () {
        return res.redirect('/views-Post');
    })
});

router.get('/create-categor:er', function (req,res,next) {
    db.Categorys.findAll()
        .then(function (category) {
            // console.log(category);
            res.render('create-category', {category:category});
        }).catch(function (err) {
        throw err
    });

   // res.render('create-category');
});
router.post('/create-categor:er', function (req,res,next) {
    let nameCategory = req.body.nameCategory;
    let valuesSelect = req.body.selectOption;
    // console.log(ValuesSelect);
    db.Categorys.findOrCreate({where: {title:nameCategory },defaults:{parentID:valuesSelect}})
        .spread(function (user,created) {
         if (user){
            return res.redirect('/views-category');
         } else{
             return res.redirect('/create-category')
         }
        })
        .catch(function (err) {
            throw err
        })
});

router.get('/edit-categor:id', function (req,res,next) {
    let id = req.params.id;
    db.Categorys.findAll()
        .then(function (category) {
            // console.log(category);
            db.Categorys.findById(id).then(function (idCate) {
                if (idCate){
                    let parentID =idCate.dataValues.parentID;
                    let title = idCate.dataValues.title;
                    res.render('Edit-category',{titleCategory:title,category:category,parentID:parentID});
                }else{
                    res.redirect('/auth/admin');
                }

            });
            // res.render('create-category', {category:category});
        }).catch(function (err) {
        throw err
    });

    // res.render('create-category');
});
router.post('/edit-categor:id', function (req,res,next) {
    let id = req.params.id;
    let nameCategory = req.body.nameCategory;
    let valuesSelect = req.body.selectOption;
    // console.log(ValuesSelect);
    db.Categorys.update({title:nameCategory,parentID:valuesSelect},{where:{id:id}})
        .then(function (created) {
         if (created){
            return res.redirect('/views-category');
         }else{
             return res.redirect('/edit-categor:id')
         }
        })
        .catch(function (err) {
            throw err
        })
});

router.get('/edit-post:id', function (req,res,next) {
    let id = req.params.id;
            // console.log(category);
            db.Posts.findById(id).then(function (idPost) {
                if (idPost){
                    res.render('Edit-post',{idPost:idPost});
                }else{
                    res.redirect('/auth/admin');
                }

            });
            // res.render('create-category', {category:category});


    // res.render('create-category');
});
router.post('/edit-post:id', function (req,res,next) {
    let id = req.params.id;
    let nameCategory = req.body.nameCategory;
    let valuesSelect = req.body.selectOption;
    // console.log(ValuesSelect);
    db.Categorys.update({title:nameCategory,parentID:valuesSelect},{where:{id:id}})
        .then(function (created) {
         if (created){
            return res.redirect('/views-category');
         }else{
             return res.redirect('/edit-categor:id')
         }
        })
        .catch(function (err) {
            throw err
        })
});

router.get('/views-category', function (req,res,next) {
    // console.log(req.body.test);
    // db.User.findAll({ include: [{
    //         model: db.Board
    //     }]}).then(function (users) {
    //     console.log(JSON.stringify(users));
    // });

    db.Categorys.findAll()
        .then(function (category) {
            // console.log(category);
            res.render('views-all-category', {category:category});
        }).catch(function (err) {
        throw err
    });

});

router.get('/views-user', function (req,res,next) {
    // console.log(db);
    res.render('views-all-user');
});

router.get('/views-post', function (req,res,next) {
    db.Posts.findAll({include:[{model:db.Categorys}]}).then(function (post) {
        res.render('views-all-post',{allPost:post})
    });
});

router.get('/create-post', function (req,res,next) {

    db.Categorys.findAll()
        .then(function (category) {
            // console.log(category);
            res.render('create-post', {category:category});
        })
        .catch(function (err) {
        throw err
    });

});

router.post('/create-post',upload.single('anhPost'), function (req,res,next) {
    let titlePost = req.body.title;
    let desc = req.body.desc;
    let dmID = req.body.category;
    let contentPost=req.body.contentPost;
    let imagesPost = req.file.path;
    // let fileName = req.file.filename;
    // let imagesPost2=imagesPost.slice(7);

var Imag =    im.resize({
        srcPath: imagesPost,
        dstPath: imagesPost+"-small.jpg",
        width:   130,
        height:130

    }, function(err, stdout, stderr){
        if (err) throw err;

    });
const imagesConvert =Imag.spawnargs[12];
const imagesConvert2=imagesConvert.replace("public/","");
// console.log(Imag);
console.log(imagesConvert2);


    if (!req.file){
        return res.redirect('/create-post');
    }else {

        db.Posts.findOrCreate({where:{title:titlePost},defaults:{desc:desc,dmID:dmID,imagesPost:imagesConvert2,contentPost:contentPost}})
            .then(function (post,created) {
                // console.log(post);
                return res.redirect('/views-post');
            }).catch(function (err) {
            throw err
        })
    }




});

module.exports = router;


