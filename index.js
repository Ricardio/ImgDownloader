"use strict"
var cloudscraper = require("cloudscraper");
var fs = require("fs");
var websites = require("./websites.json");
var request = require("request")

var i = 0,  max = 100;
var link = "";

var website = checkIn(link, websites); /*debug*/ console.log(website.name);
var web = replaceAt(link, website.urlPatt, "*");

cloudscraper.get(link, function(error, body, response){
	htmlParser(body);
});

function htmlParser(html) {
	var regex = new RegExp("\"(?:[^\"\\\\]|\\.)*" + website.srcPatt + "(.*?)\"", "g");
	var newLink = web.link;
	var src = html;
	src.replace(regex, cb);

	if(website.urlPatt.length > 0){
		for(var j = 0; j < web.numStarts.length; j++)
			newLink = numLink(web.numStarts[j], newLink, i);
		i++
		console.log(newLink);
		cloudscraper.get(newLink, function(error, body, response){
			htmlParser(body);
		});
	}

	function cb(match) {
		var url = website.urlFix + match.replace("\"", "").replace("\"","");
		var fileName = isolate(["/", url.length], url);
		if (website.filters.length > 0)
			if(checkIn(website.filters, "extFix") === "extFix"){
				var extenFix = isolate(["jpg", fileName.length], fileName);
				fileName = fileName.replace(extenFix, "");
			} else if(checkIn(fileName, website.filters))
				return;

		if (!fs.existsSync(path)) {
			var path = "C:/Users/Ricardio/Downloads/" + fileName;
			var file = fs.createWriteStream(path);
			request(url).pipe(file);
		}
		/*debug*/ console.log(url); console.log(fileName);
	}
}


function checkIn(arr, item){
	var check;
	for(var i = 0; i < arr.length; i++){
		if(typeof arr !== "string"){
			check = arr[i].indexOf(item);
			if(check > -1) return str[i];
		}

		if(typeof item[i] === "object")
			check = arr.indexOf(item[i].name);
		else
			check = arr.indexOf(item[i]);
		if(check > -1) return item[i];
	}
}

function isolate(arr, item){
	var bef = arr[0], aft = arr[1];
	if(typeof arr[0] !== "number")
		bef = item.lastIndexOf(arr[0]) + arr[0].length;
	if(typeof arr[1] !== "number")
		aft = item.lastIndexOf(arr[1]);
	return item.substring(bef, aft);
}

function replaceAt(str, arr, char){
	var obj = {
		numStarts : [],
		link : str
	}
	var befIndex, aftIndex;
	for(var t = 0; t < arr.length; t++){
		if(typeof arr[t][0] !== "number"){
			befIndex = obj.link.lastIndexOf(arr[t][0]) + arr[t][0].length;
			aftIndex = obj.link.lastIndexOf(arr[t][1]);
		} else {
			befIndex = xIndexOf(obj.link, arr[t][1], arr[t][0]) + arr[t][1].length;
			aftIndex = xIndexOf(obj.link, arr[t][3], arr[t][2]);
		}
		obj.numStarts.push(obj.link.substring(befIndex, aftIndex));
		var befString = obj.link.substring(0, befIndex);
		var aftString = obj.link.substring(aftIndex);
		obj.link = befString + char + aftString;
	}
	return obj
}

function xIndexOf(str, val, amt){
	var temp = str.indexOf(val);
	if(amt > 1)
		for (var i = 1; i < amt; i++)
			temp = str.indexOf(val, temp + 1)
	return temp;
}

function numLink(strNum, item, iter){
	var num = +strNum + iter;
	if(strNum.indexOf("0") === 0){
		var size = "1"
		for(var i = 0; i < strNum.length - 1; i++)
			size += "0"
		if(num < +size){
			var pad = strNum.replace("0", "1");
			pad = +pad + iter + "";
			num = pad.replace("1", "0");
		}
	}
	return item.replace("*", num) + "";
}
