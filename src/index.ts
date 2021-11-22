import Popup from './components/popup';

export default {
	init(apkURL: string = 'https://download.mypikpak.com/app/default_PikPak.apk') {
		document.addEventListener('click', function({ target }: any) {
			try {
				const link = target.getAttribute('data-pikpak');
				if (!link) {
					return;
				}
				const mount = document.createElement('div');
				mount.id = 'pikpak-sdk-wrapper'
				document.body.appendChild(mount);
				const popup = new Popup(mount, link, apkURL);
				popup.$mount();
			} catch(err) {
				console.error("this element haven't 'data-pikpak' attribute.");
			}
		});
	}
}; 