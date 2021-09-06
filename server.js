const express = require('express')
const app = express()
const multer = require('multer')
const mimeTypes = require('mime-types')


const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function(req,file,cb){
        var p =Date.now()+file.originalname+"."+mimeTypes.extension(file.mimetype)
        cb("",p)
        processImage({ imagepath: "uploads/"+p,          
        saveimagepath: "sends/send"+p,
        watermarkpath: "watermark.png"})
    }
    
})

const upload = multer({
    storage: storage,
    // fileFilter: function(req,file,cb){
    //     const filetypes = /jpeg|jpg|png|gif/
    //     const mimetype = filetypes.test(file.mimetype)
    //     const extname = filetypes.test(path.extname(file.originalname))
    //     if(mimetype && extname){ 
    //         return cb(null,true)
    //     }
    //     cb("Error: la imagen debe ser una imagen valida")
    // }
    
})

app.get("/", (req,res)=>{
    res.sendFile(__dirname+"/views/index.html")
})

app.post("/files", upload.single('imagen'),(req,res)=>{
   // console.log(__dirname+Date.now()+file.originalname+"."+mimeTypes.extension(file.mimetype))
   // var htmlsend = '<div><img class="photo" src="'+__dirname+Date.now()+file.originalname+"."+mimeTypes.extension(file.mimetype)+'"></div>'
    //__dirname+Date.now()+file.originalname+"."+mimeTypes.extension(file.mimetype)
    res.send("htmlsend")

})

 // watermark image

function processImage(options)
{
const Jimp = require("jimp");

Jimp.read(options.imagepath)
.then(async image =>
{
console.log("image opened");

// main image
//image.scaleToFit(options.imagemax, options.imagemax);
await addWatermark(image, options.watermarkpath);
image.quality(95);
image.writeAsync(options.saveimagepath)
  .then(() => console.log("image saved"))
  .catch(err => { console.error(err); });
})

.catch(err =>
{
console.error(err);
});
}


function addWatermark(image, watermarkpath)
{
const Jimp = require("jimp");

return Jimp.read(watermarkpath)
.then(watermark =>
{
     console.log("watermark opened");
     const x = image.bitmap.width - 32 - watermark.bitmap.width;
     const y = image.bitmap.height - 32 - watermark.bitmap.height;
     image.composite(watermark, x, y, { opacitySource: 0.5 });
 })
 .catch(err =>
 {
     console.error(err);
 });
}


app.listen(5000,()=> console.log("server started in port 5000"))