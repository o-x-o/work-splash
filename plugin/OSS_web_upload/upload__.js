;(function(){

var host = 'http://mycyberstar.oss-cn-hangzhou.aliyuncs.com';
var accessid= 'LTAIbhWYKObAMCBA';
var accesskey= 'l2LuFKi2vshKZimOP5nkmCo3Dc6EoM';

var policy=null;
var signature=null;

var policyText = {
	"expiration": new Date(new Date().getTime()+1000*60).toISOString(), //（一分钟之后失效）设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
	"conditions": [
		["content-length-range", 0, 1024*1024*1000] //（1000M） 设置上传文件的大小限制
	]
};

var g_dirname = '';
var g_object_name = '';
var g_object_name_type = 'random_name'; /* local_name || random_name */

function ajaxJsonp(url,param,callback,cbstr){
	var callBackName="JsonpCallBack"+Math.round((new Date().getTime()+Math.random())*10000);
	url=url+"?"+(cbstr||"callback")+"="+callBackName;
	window[callBackName]=callback||function(){};
	if(param){
		Object.keys(param).forEach(function(k){
			url+="&"+k+"="+JSON.stringify(param[k]);
		});
	}
	var script=document.createElement("script");
	script.src=url;
	document.getElementsByTagName("head")[0].appendChild(script);
	script.remove && script.remove();
}

function random_string(len) {
	len = len || 32;
	var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
	var maxPos = chars.length;
	var pwd = '';
	for (i = 0; i < len; i++) {
		pwd += chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return pwd;
}

function get_suffix(filename) {
	var pos = filename.lastIndexOf('.');
	var suffix = '';
	if (pos != -1) {
		suffix = filename.substring(pos);
	}
	return suffix;
}

function calculate_object_name(filename)
{
	if (g_object_name_type == 'local_name')
	{
		g_object_name += "${filename}";
	}
	else if (g_object_name_type == 'random_name')
	{
		var suffix = get_suffix(filename);
		g_object_name = g_dirname + random_string(10) + suffix;
	}
	return '';
}

function get_uploaded_object_name(filename)
{
	if (g_object_name_type == 'local_name')
	{
		tmp_name = g_object_name;
		tmp_name = tmp_name.replace("${filename}", filename);
		return tmp_name;
	}
	else if(g_object_name_type == 'random_name')
	{
		return g_object_name;
	}
}

function set_upload_param(up, filename)
{
	g_object_name = g_dirname;
	if (filename != '') {
		var suffix = get_suffix(filename);
		calculate_object_name(filename);
	}
	
	//var policyBase64 = Base64.encode(JSON.stringify(policyText));
	ajaxJsonp("http://192.168.1.113:7090/",{},function(res){
		accessid = res.accessid;
		host = res.host;
		signature = res.signature;
		policy = res.policy;
		
		
		new_multipart_params = {
				
			'key' : g_object_name,
			'policy': policy,
			'OSSAccessKeyId': accessid, 
			'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
			'callback' : callbackbody,
			'signature': signature
			/*
			'key' : g_object_name,
			'policy': policy || policyBase64,
			'OSSAccessKeyId': accessid, 
			'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
			'signature': signature || Crypto.util.bytesToBase64(Crypto.HMAC(Crypto.SHA1, policyBase64, accesskey, { asBytes: true }))
			*/
		};
		
		up.setOption({
			'url': host,
			'multipart_params': new_multipart_params
		});
		
		up.start();
	});
	
	
	return new_multipart_params;
}

var uploader = new plupload.Uploader({
	runtimes : 'html5,flash,silverlight,html4',
	browse_button : 'selectfiles', 
	//multi_selection: false,
	url : 'http://oss.aliyuncs.com',

	init: {
		PostInit: function() {
			document.getElementById('postfiles').onclick = function() {
			set_upload_param(uploader, '', false);
			return false;
			};
		},

		FilesAdded: function(up, files) {
			plupload.each(files, function(file) {
				// plupload.formatSize(file.size)
			});
		},

		BeforeUpload: function(up, file) {
			var dir = document.getElementById("dirname").value;
			if (dir != '' && dir.indexOf('/') != dir.length - 1){
				dir = dir + '/';
			}
			g_dirname = dir;
			var param=set_upload_param(up, file.name, true);
			console.log(param.key);
			//host+'/'+param.key 为访问链接
		},

		UploadProgress: function(up, file) {
			//file.percent
		},
			
		FileUploaded: function(up, file, info) {
			//get_uploaded_object_name(file.name)
		},

		Error: function(up, err) {
			//document.getElementById('console').appendChild(document.createTextNode("\nError xml:" + err.response));
		}
	}
});



window.refresh=function(){
	
	set_upload_param(uploader,"");
}

uploader.init();

})();