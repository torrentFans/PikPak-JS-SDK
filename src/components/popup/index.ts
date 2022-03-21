import htm from 'htm';
import style from './index.less';
import QRCode from '../../lib/qrcode.js';
import { h, render } from 'preact';
import { resourceType, getTitleFromUrl, isPC } from '../../utils';

const html = htm.bind(h);

// 展示的类型
export enum clientType {
	PC = 'pc',
	MOBILE = 'mobile',
}

// 监听非弹框区域点击事件处理
const handleRemoveListener = (e: any) => {
	if (e.target.getAttribute('data-pikpak')) {
		return;
	}
	const popup: HTMLElement = document.querySelector('#pikpak-sdk-wrapper .popup-wrapper')!;
	const { top, left, width, height } = popup?.getBoundingClientRect();
	const x = e.clientX;
	const y = e.clientY;
	if (x < left || x > left + width) {
		document.body.removeChild(document.querySelector('#pikpak-sdk-wrapper')!);
	}
	if (y < top || y > top + height) {
		document.body.removeChild(document.querySelector('#pikpak-sdk-wrapper')!);
	}
}

/**
 * PikPak SDK弹窗类
 */
class Popup {
	private type: clientType = clientType.PC
	private icon: string = 'icon-file' 
	private resourceTitle: string = ''
	private apkURL: string = 'https://download.mypikpak.com/app/default_PikPak.apk';
	private deepLink: string = 'pikpakapp://xpan/main_tab?tab=1&add_url=';
	private url: string = '';
	private source: string = 'PikPak-SDK';
	private el: HTMLElement;
	constructor(el: HTMLElement, url: string, apkURL: string, source: string) {
		this.clearMountedPopup();
		this.clickBlankClosePopup();
		this.el = el;
		this.url = url;
		this.apkURL = apkURL;
		this.source = source;
		this.icon = resourceType(url);
		this.resourceTitle = getTitleFromUrl(url);
		this.type = isPC() ? clientType.PC : clientType.MOBILE;
		this.deepLink = `pikpakapp://xpan/main_tab?tab=1&add_url=${url}`;
		let timer = setTimeout(() => {
			this.renderQRCode();
			clearTimeout(timer);
		}, 0);
	}
	getInstance() {
		return () => {
			this.closePopup = this.closePopup.bind(this);
			this.saveToPikPak = this.saveToPikPak.bind(this);
			this.installPikPak = this.installPikPak.bind(this);
			return html`
			<div id="pikpak-resource-popup">
				<style>${ style }</style>
				<div class="popup-wrapper popup-wrapper-${this.type}">
					<div class="header">
						<div class="handle-bar" onclick=${this.type === clientType.PC ? this.closePopup : null}></div>
						<div class="github-icon icon-github" onclick=${this.toGithub}></div>	
					</div>
					<div class="logo icon-logo"></div>
					<div class="title">使用PikPak秒存资源 在线播放</div>
					<div class="resource-info">
						<div class="resource-info-title">
							<div class="${this.icon} resource-info-title__icon"></div>
							<div class="resource-info-title__text" title="${this.resourceTitle}">${this.resourceTitle}</div>
						</div>
					</div>
					<div class="pikpak-qrcode-wrapper">
						<canvas id="pikpak-landing-code"></canvas>
					</div>
					<div class="install-apk" onclick=${this.installPikPak}>下载 PikPak APK</div>
					${
						this.type === clientType.PC ? html`
							<div class="had-install" onclick=${() => this.openPikPakWeb()}>使用 PikPak 网页版(需科学上网)</div>
						` : html`
							<div class="had-install" onclick=${this.saveToPikPak}>已经安装 PikPak 点此添加资源</div>
						`
					}
				</div>
			</div>`;
		}
	}
	// 跳转到github仓库
	toGithub() {
		const a = document.createElement('a');
		a.href = 'https://github.com/torrentFans/PikPak-JS-SDK';
		a.target = '_blank';
		a.click();
	}
	// 关闭popup
	closePopup() {
		document.body.removeChild(this.el);
		document.removeEventListener('click', handleRemoveListener);
	}
	// 安装PikPak
	installPikPak() {
		const a = document.createElement('a');
		a.href = this.apkURL;
		a.download = 'PikPak.apk';
		a.click();
	}
	// openPikPak
	saveToPikPak() {
		const a = document.createElement('a');
		a.href = this.deepLink;
		a.click();	
		this.closePopup();
	}
	// open PikPak web
	openPikPakWeb() {
		const a = document.createElement('a');
		const hash = this.url.match(/magnet:\?xt\=urn:btih:([a-zA-Z0-9]{32,40})/)?.[1];
		a.href = `https://drive.mypikpak.com/landing?__add_url=${window.encodeURIComponent(this.url)}&__source=${this.source}`;
		if (hash) {
			a.href = `${a.href}&__campaign=${hash}`;
		}
		a.click();
		this.closePopup();
	}
	// 渲染二维码
	renderQRCode() {
		const canvas = document.getElementById('pikpak-landing-code');
		(QRCode as any).toCanvas( canvas, this.apkURL, function(error: any) {
				if (error) {
					canvas?.parentNode?.removeChild(canvas);
				}
			}
		)
	}
	// 非popup区域点击, 关闭popup
	clickBlankClosePopup() {
		document.addEventListener('click', handleRemoveListener);
	}
	// 清除之前已经打开的popup
	clearMountedPopup() {
		const popups: HTMLElement[] = Array.from(document.querySelectorAll('#pikpak-sdk-wrapper') || []);
		if (Array.from(popups).length <= 1) { return; }
		document.body.removeChild(popups.shift()!);
		document.removeEventListener('click', handleRemoveListener);
	}
	// 移动端可以滑动关闭popup
	slideToClosePopup() {
		if (this.type === clientType.PC) {
			return;
		}
		// const wrapper: HTMLElement | null = document.querySelector('#pikpak-sdk-wrapper');
		const wrapper: HTMLElement | null = document.querySelector('.popup-wrapper');
		const header: HTMLElement | null = document.querySelector('#pikpak-sdk-wrapper .header')!;
		if (!wrapper || !header) { return }
		const rectInfo = wrapper?.getBoundingClientRect();
		let startY = rectInfo.top;
		let endY = 0;
		document.addEventListener('touchmove', e => {
			const { clientY: y } = e.targetTouches[0];
			wrapper.style.transition = '';
			wrapper.style.top = Math.max(y, wrapper?.getBoundingClientRect().y) + 'px';
			endY = y;
		});
		document.addEventListener('touchend', () => {
			if (endY >= (rectInfo.top + rectInfo.y) * 2 / 3) {
				wrapper.style.transition = 'top 0.2s ease-in';
				wrapper.style.top = rectInfo.top + rectInfo.height + 'px';
			} else {
				wrapper.style.transition = 'top 0.2s cubic-bezier(0.680, -0.030, 0.000, 1.650)';
				wrapper.style.top = startY + 'px';
			}
		});
	}
	// 挂载到body
	$mount() {
		const popup = this.getInstance();
		render(html`<${popup} />`, this.el);
		this.slideToClosePopup();
	}
}

export default Popup;