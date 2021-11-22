/**
 * 判断当前为pc还是mobile 
 * @returns Boolean 
 */
export function isPC() {
	var userAgentInfo = navigator.userAgent;
	var Agents = ["Android", "iPhone","SymbianOS", "Windows Phone","iPad", "iPod"];
	var flag = true;
	for (var v = 0; v < Agents.length; v++) {
			if (userAgentInfo.indexOf(Agents[v]) > 0) {
					flag = false;
					break;
			}
	}
	return flag;
}

// 支持限制video icon的类型
const videoTypes = ['mp4', 'mkv', 'avi', 'webm', 'rmvb', 'mv', 'flv', 'mov', 'mpg', 'mpeg'];
/**
 * 根据资源链接去返回对应的图标类型
 * @param url string
 * @returns 资源对应的图标类型
 */
export function resourceType(url: string) {
	url = url.trim();
	if (/^magnet:\?xt=urn:btih:/i.test(url)) {
		return 'icon-bt';
	}
	const type = url.split('.')?.pop() || '';
	if (videoTypes.includes(type)) {
		return 'icon-video';
	}
	return 'icon-file';
}

/**
 * 从资源链接中提取出标题, 
 * 按规则提取不到则返回资源链接
 * @param url string
 */
export function getTitleFromUrl(url: string) {
	let title = url;
	if (resourceType(url) === 'icon-bt') {
		if (/dn=/i.test(url)) {
			let temp = url.match(/\&?dn=([^\&]+)/);
			if (temp && temp[1]) {
				title = temp[1];
			}
		}
	}
	if (resourceType(url) === 'icon-video') {
		const temp: string = url?.split('/')?.pop() || '';
		if (/\.(mp4|mkv|avi|webm|rmvb|mv|flv|mov|mpg|mpeg)/i.test(temp)) {
			title = temp;
		}
	}
	if (resourceType(url) === 'icon-file') {
		const temp = url?.split('/')?.pop();
		if (temp) {
			title = temp;
		}
	}
	if (/^ed2k:\/\/\|file\|(.+?)\|/) {
		let temp = url.match(/^ed2k:\/\/\|file\|(.+?)\|/);
		if (temp && temp[1]) {
			title = temp[1];
		}
	}
	return title;
}
