const fs = require('fs-extra');
const moment = require('moment');

const file_lib = process.cwd()+"/src/version.js";
const file_data = process.cwd()+"/src/version.json";

// let content = process.argv.splice(2);

module.exports = function(content){
	fs.readFile(file_data,"utf8",(err,data)=>{
		if(err){   
			console.log("版本信息读取错误");
			return;
		}
		try{
			let list = JSON.parse(data);
			let last_version = list[list.length-1].version;
			let vs = last_version.split(".");
			let sum = 0;
			sum = parseInt(vs[0])*100+parseInt(vs[1])*10+parseInt(vs[2]);
			sum ++;
			list.push({
				"version":Math.floor(sum/100)+"."+Math.floor(sum%100/10)+"."+sum%10,
				"date":moment().format("YYYY-MM-DD hh:mm:ss"),
				"content":content
			})
			fs.outputFile(file_data,JSON.stringify(list),err=>{
				fs.readFile(file_data, 'utf8', function(err, data) {
					try{
						let res = JSON.parse(data);
						let modal = "const versions = " + JSON.stringify(res) + "\nexport default versions;"
						fs.outputFile(file_lib,modal,err=>{
							console.log("版本号生成成功.....")
						});
					}catch(e){
						console.log("数据格式转化错误",data);
						console.log(e);
					}
				})
			});
		}catch(e){
			console.log("数据格式转化错误");
			console.log(data,e);
		}

	})

}



