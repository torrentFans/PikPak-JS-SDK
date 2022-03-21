import Popup from './components/popup';

export default {
	init(apkURL: string = 'https://download.mypikpak.com/app/default_PikPak.apk', source: string = 'PikPak-SDK') {
		document.addEventListener('click', function({ target, currentTarget }: any) {
			try {
				const link = target.getAttribute('data-pikpak');
				if (!link) {
					return;
				}
				const mount = document.createElement('div');
				mount.id = 'pikpak-sdk-wrapper'
				document.body.appendChild(mount);
				const popup = new Popup(mount, link, apkURL, source);
				popup.$mount();
			} catch(err) {
				console.error("this element haven't 'data-pikpak' attribute.");
			}
		}, true);
	}
}; 