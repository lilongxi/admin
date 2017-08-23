import 'whatwg-fetch';

export const getData = (url) => {
	var result = fetch(url, {
	  method: 'GET',
	  mode: 'cors',
	  credentials:'include',
      headers: {
          'Accept': 'application/json, text/plain, */*'
      }
 });
 let data = result
	  	.then((res) => {
	  		return res.json()
	  	})
	  	.catch((err) => {
	  		return err
	  	})
  return data;
}


// 将对象拼接成 key1=val1&key2=val2&key3=val3 的字符串形式
function params(obj){
	let temp = '';
	for (let i in obj) {
		temp += `&${i}=${obj[i]}`;
	}
	return temp;
}

// 发送 post 请求
export const postData = (url, obj) => {
    var result = fetch(url, {
        method: 'POST',
        mode: 'cors',
        credentials:'include',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params(obj)
    });
	let data = result
	  	.then((res) => {
	  		return res.json()
	  	})
	  	.catch((err) => {
	  		return err
	  	})
    return data;
}