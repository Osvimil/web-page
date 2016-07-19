var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var multer = require('multer');
var cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name:"dxryacje2",
  api_key:"461619285282926",
  api_secret:"dun4TLvrg0etKJQBl97ac1BiKac"
});

var appy = express();
mongoose.connect("mongodb://localhost/lenguajes");

appy.use(bodyParser.json());
appy.use(bodyParser.urlencoded({extended:true}));
appy.use(multer({dest: "./uploads"}));

var lenguajesSchema = {
  titulo:String,
  descripcion:String,
  imagenUrl:String,
  precioGeneral:Number
};
var Lenguajes = mongoose.model('Lenguajes',lenguajesSchema);


appy.set("view engine","jade");
appy.use(express.static('public'));
appy.get("/",function(solicitud,respuesta){
    var datos={
      titulo:"JAVASCRIPT BASICO",
      descripcion:"Curso con lo esencial del lenguaje",
      imagenUrl:"js.png",
      precioGeneral:1199,
    }

    var lenguaje = new Lenguajes(datos);
    lenguaje.save(function(error){
      console.log(lenguaje);

    });

    appy.get("/menu",function(solicitud,respuesta){
      Lenguajes.find(function(error,documento){
        if(error){
          console.log(error);
        }
        respuesta.render("menu/pruebon",{language:documento });

      });
    });



  respuesta.render('prueba');
  //respuesta.send('ESA BANDA LOCA');
  //respuesta.end('HOLA AMIGOSSSHH');

});
appy.post("/admin",function(solicitud,respuesta){
  if(solicitud.body.password == "563311"){
    Lenguajes.find(function(error,documento){
      if(error){
        console.log(error);
      }
      respuesta.render("admin/index",{language:documento });
    });

  }else{
    respuesta.redirect("/");
  }
});

appy.get("/admin",function(solicitud,respuesta){
  respuesta.render("admin/form");
});





appy.post("/menu",function(solicitud,respuesta){
  console.log(solicitud.bodyParser);
  if(solicitud.body.contrasena == "563311"){
    var datos={
      titulo: solicitud.body.nombre,
      descripcion:solicitud.body.descripcion,
      imagenUrl:"js.png",
      precioGeneral:solicitud.body.costo,
    }

    var lenguaje = new Lenguajes(datos);


      cloudinary.uploader.upload(solicitud.files.upload_image.path,
        function(result) {
          lenguaje.imagenUrl= result.url;
          lenguaje.save(function(error){
              console.log(lenguaje);
              respuesta.render("prueba"); });
       });
    //console.log(solicitud.files);
  /*
    */

  }else{
    respuesta.render("menu/new");
  }


  //respuesta.render("menu/new");

});

appy.get("/menu/new",function(solicitud,respuesta){
  respuesta.render("menu/new");


});

appy.listen(8080);


// CONTROL + C PARA CERRAR SERVIDOR
// node nombre.js para ejecutar script en el servidor
