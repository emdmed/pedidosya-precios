const express = require('express');
const app = express();
const fs = require("fs");
const fetch = require("node-fetch");
const url = "https://www.pedidosya.com.ar/restaurantes/buenos-aires?a=libertad%201684&lat=-34.5886152&lng=-58.383174999999994";
const port = process.env.PORT || 3000;
const cheerio = require("cheerio");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


const prices_AR = []; 

let ult_promedio;

function finish(){
    console.log("FINISHED");
}

function search(){
    return fetch(`${url}`)
    .then(response => response.text());
}


setInterval(run, 14000);

search()
    .then(body =>{
       const $ = cheerio.load(body);
       $(".arrivalName").each(function(i, element){
        const $element = $(element);
        //console.log($element.text());
        let resto_link = $element.attr("href");
        //console.log(resto_link);
        search()
            .then (body =>{
              const $1 = cheerio.load(body);
              $1(".price").each(function(i, element){
                  let noformat_price = $1(".price").text();              
                  let separated_price = noformat_price.replace(/\r?\n|\r/g, " ");
                  let  p_data = separated_price.split(" ");
                  prices_AR.push(p_data);
              });       
            })
            .then(function(){
                //console.log(prices_AR);
            }).then(function(){
              let string_pricesAR = prices_AR.toString();
              let reformat = string_pricesAR.replace(/,/g, " ");
              let numbers = reformat.replace(/\$/g, "");
              let splitted_in_num_1 = numbers.replace(/  /g, " ");
              let splitted_in_num_2 = splitted_in_num_1.replace(/  /g, " ");
              let splitted_in_num = splitted_in_num_2.split(" ");
     
              let len = splitted_in_num.length;
              console.log("length = " + splitted_in_num.length);
              
              let ttotal = 0;
              for (i = 0; i < len; i++){
                if (parseInt(splitted_in_num[i]) > 0){
                    let sum =  ttotal + parseInt(splitted_in_num[i]);
                    ttotal = sum;
                }
            
              }
             
              let _promedio = ttotal / len;
              let promedio = _promedio.toFixed(0);
              console.log("promedio: " + promedio)

              let date = new Date();
              let day = date.getDate();
              let month = date.getMonth() +1;
              let year = date.getFullYear();
              let hour = date.getHours();
              let min = date.getMinutes();

              fs.appendFileSync(`data/promedio-${hour}-${min}-${day}-${month}-${year}.txt`, "Promedio de precios " + promedio + " pesos");
              fs.appendFileSync(`data/raw-precios-${hour}-${min}-${day}-${month}-${year}.txt`, splitted_in_num + resto_link);

            });               
    });
});


function run (){
search()
    .then(body =>{
       const $ = cheerio.load(body);
       $(".arrivalName").each(function(i, element){
        const $element = $(element);
        //console.log($element.text());
        let resto_link = $element.attr("href");
        //console.log(resto_link);
        search()
            .then (body =>{
              const $1 = cheerio.load(body);
              $1(".price").each(function(i, element){
                  let noformat_price = $1(".price").text();              
                  let separated_price = noformat_price.replace(/\r?\n|\r/g, " ");
                  let  p_data = separated_price.split(" ");
                  prices_AR.push(p_data);
              });       
            })
            .then(function(){
                //console.log(prices_AR);
            }).then(function(){
              let string_pricesAR = prices_AR.toString();
              let reformat = string_pricesAR.replace(/,/g, " ");
              let numbers = reformat.replace(/\$/g, "");
              let splitted_in_num_1 = numbers.replace(/  /g, " ");
              let splitted_in_num_2 = splitted_in_num_1.replace(/  /g, " ");
              let splitted_in_num = splitted_in_num_2.split(" ");
     
              let len = splitted_in_num.length;
              console.log("length = " + splitted_in_num.length);
              
              let ttotal = 0;
              for (i = 0; i < len; i++){
                if (parseInt(splitted_in_num[i]) > 0){
                    let sum =  ttotal + parseInt(splitted_in_num[i]);
                    ttotal = sum;
                }
            
              }
             
              let _promedio = ttotal / len;
              let promedio = _promedio.toFixed(0);
              console.log("promedio: " + promedio)

              let date = new Date();
              let day = date.getDate();
              let month = date.getMonth() +1;
              let year = date.getFullYear();
              let hour = date.getHours();
              let min = date.getMinutes();

              fs.appendFileSync(`data/promedio-${hour}-${min}-${day}-${month}-${year}.txt`, "Promedio de precios " + promedio + " pesos");

            });               
    });
});}

//RUN
app.listen(port, function(){
    console.log("Running...");  
});