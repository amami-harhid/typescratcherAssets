import costumesJson from '../assetJsons/costumes.json';
import backdropsJson from '../assetJsons/backdrops.json';
import soundsJson from '../assetJsons/sounrds.json';
import { SoundSvgData } from './soundSvg';
import { SoundPlayData, SoundStopData } from './soundSvg';

import { loadingGif } from './loadingGif';
import { Timer } from './timer';
import { Sound } from './sound';
import { license } from './license';
import { JsonElement, soundModal } from './elementSoundModal';
import { imageModal } from './elementImageModal';
import { version } from './version';

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
const TITLE = 'Scratch3 アセット一覧';
const APP = '説明';
const PagingNumber = 50;
const HeaderCostumeId = 'headerCostume';
const HeaderBackdropId = 'headerBackdrop';
const HeaderSoundId = 'headerSound';
const TypePullId = 'typePull';
const PagingPullId = 'pagingPull';
const css = `
    html, body {
        height: 100%;
        overflow: hidden;
        scrollbar-gutter: stable; /* .containerスクロールバー表示幅によるレイアウト崩れを防止する */
    }
    img {
        pointer-events: none;
    }
    .border {
        border: 1px solid black;
        border-radius: 10px;
    }
    div.header {
        position: relative;
        display: flex;
        margin: 0 auto;
        height:50px;
        width:100%;
        background-color:#fea0a0;
        align-items: center;
    }
    div.typeDiv {
        display: flex;
        padding-left:clamp(1vw, 2vw, 2vw);
        align-items: center;
        margin-left: 1rem;
    }
    .pullDown {
        border: none; /*1px solid black;*/    
        cursor: pointer;
    }
    .radius10 {
        border-radius: 5px;    
    }
    div.license {
        margin-left: auto !important;
        margin-right: 10px;
    }
    button.license {
        border: none; /*1px solid black;*/
        width: 6rem;
        cursor: pointer;
    }
    span.version {
        margin-left: 1rem;
        margin-right: 5px;
    }
    div.hedderHidden {
        display: none;
    }
    div.header > div {
        margin-left: 10px;
    }
    div.hidden {
        visibility: hidden;
    }
    .container {
        position: relative;
        margin: 0 auto;
        top: 50;
        width:100%;
        height:100%;
        overflow-y: auto;
        scrollbar-gutter: stable; /* スクロールバー表示幅によるレイアウト崩れを防止する */
    }
    div.container_inner {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        opacity: 0.9;
        background-color:#fefefe;
        margin:2px;
    }
    div.element {
        background-color: #fafafa;
        border: 1px solid #505050;
        display: flex;
        justify-content: center;
        align-items: center;
        width:150px;
        height:150px;
        cursor: pointer;
    }
    .fit {
        width: fit-content;
    }
    img.thumbnail {
        opacity: 1.0;
        padding-bottom: 20px;
    }
    .play-element {
        position:relative;
        display: flex;
        justify-content: center;
        align-items: center;

    }
    .play-button {
        right:0.5rem;
    }
    .play-button {
        display:flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        width:2.5rem;
        height: 2.5rem;
        background-color: hsla(300,53%,60%,1);
        color: hsla(0, 100%, 100%, 1);
        border-radius:50%;
        cursor: pointer;
    }
    .play-button {
        position: absolute;
        top: 0.5rem;
        z-index: auto;
    }
    .elem-name {
        position: absolute;
        top: 115px;
        font-size: 0.8rem;  
    }
    #modalOverlay, #modalOverlayElem {
        display: none;               /* JS で display:block にして表示 */
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5); /* 半透明の黒背景 */
        justify-content: center;
        align-items: center;
    }

    /* モーダル本体 */
    #modalContent, #modalContentElem {
        background: #fff;
        padding: 20px;
        border-radius: 8px;
        width: fit-content;
        height:50%;
        overflow:auto;
        text-align: center;
        box-shadow: 0 0 10px rgba(0,0,0,0.3);
    }
    #modalContentInner, #modalContentInnerElem {
        position: relative;
        width: 100%;
        text-align: center;
        font-size: 0.8rem; 
    }
    div.modalImageDiv {
        display: flex;
        width: 100%;
        height: 180px;
        justify-content: center;
        align-items: center;
        font-size: 0.8rem;  
    }
    div.modalImageDivInner {
        display: flex;
        width: 180px;
        justify-content: center;
        align-items: center;
        border-radius: 8px;
        border: 1px solid #505050;
    }
    img.soundImage:hover {

        color:red;
    }
    .modalImageInfoDiv {
        text-align: center;
        
    }
    .modalImageInfoDiv > div {
        overflow-wrap: anywhere;
        margin-right: 20px;
        cursor: pointer;
    }
    .responsive-text {
        font-size: clamp(10px, 2.0vw, 20px);
    }
    .responsive-text2 {
        font-size: clamp(10px, 1.5vw, 15px);
    }
    img {
        /* ドラッグでの保存や選択を禁止 */
        -webkit-user-drag: none;
        user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
    }
    .copyButtonInfo {
        padding: 10px;
    }
    .copyButton {
        width:120px;
        border: none;
        border-radius: 8px;
        background-color: #4545fa;
        color: white;
        cursor: pointer;
    }
    .copyButton > img {
        height: 12px;
    }
    .copyButtonInfo span {
        font-size: 10px;
        padding: 10px;
    }
    span.copy-name {
        font-size:18px;
        cursor: pointer;
    }
`;

export class Gui {
    private static _observer: IntersectionObserver;
    static getObseerver(): IntersectionObserver {
        if(Gui._observer == undefined){
            const options = {
                root: null, // ビューポートを基準にする
                rootMargin: '0px',
                threshold: 0.1 // 画像が10%見えたら発火
            };
            Gui._observer = new IntersectionObserver((entries, observer)=>{
                entries.forEach(entry => {
                    // 画像が画面内に入った場合
                    if (entry.isIntersecting) {
                        const div = entry.target as HTMLDivElement;
                        div.classList.add('hidden');
                        const img = div.querySelector('img') as HTMLImageElement;
                        // data-srcの値を本来のsrcに代入
                        if(img && img.dataset && img.dataset.src){
                            img.src = img.dataset.src;
                            img.onload = async () => {
                                if(img.width < img.height) {
                                    img.setAttribute('height', '100px');
                                    img.removeAttribute('width');              
                                }else{
                                    img.setAttribute('width', '100px');                
                                    img.removeAttribute('height');                
                                }
                                img.classList.add('loaded');
                                await Timer.wait(500);
                                div.classList.remove('hidden');
                            }
                        }else{
                            div.classList.remove('hidden');
                        }
                        // 一度処理したら監視を解除
                        div.classList.remove('lazy-load')
                        observer.unobserve(div);
                    }
                });
            },options)
        }
        return Gui._observer;
    }
    static createLayout() :void {

        const style = document.createElement('style');
        style.innerHTML = css;
        const head = document.getElementsByTagName('head');
        head[0].appendChild(style);
        
        const body = document.querySelector('body');
        {
            const header = document.createElement('div');
            header.id = HeaderCostumeId;
            header.classList.add('header');
            header.classList.add('border');
            body?.appendChild(header);
            Gui.addCostumeHeaderControl();
        }
        {
            const header = document.createElement('div');
            header.id = HeaderBackdropId;
            header.classList.add('header');
            header.classList.add('border');
            body?.appendChild(header);
            Gui.addBackdropHeaderControl();
            Gui.showBackdropHeaderControl(false);
        }
        {
            const header = document.createElement('div');
            header.id = HeaderSoundId;
            header.classList.add('header');
            header.classList.add('border');
            body?.appendChild(header);
            Gui.addSoundHeaderControl();
            Gui.showSoundHeaderControl(false);
        }
        
        const container = document.createElement('div');
        container.classList.add('container');
        container.id = 'container';
        body?.appendChild(container);

        const containerInner = document.createElement('div');
        containerInner.classList.add('container_inner');
        containerInner.classList.add('fit');
        containerInner.id = 'containerInner';
        container.appendChild(containerInner);

        // モーダル
        if(body){
            const modalOverlay = document.createElement('div') as HTMLDivElement;
            body.appendChild(modalOverlay);
            modalOverlay.id = 'modalOverlay';
            const modalContent = document.createElement('div') as HTMLDivElement;
            modalOverlay.appendChild(modalContent);
            modalContent.id = 'modalContent';
            const modalTitle = document.createElement('div') as HTMLParagraphElement;
            modalContent.appendChild(modalTitle);
            modalTitle.innerHTML = '<h1>このWEBアプリに関するお知らせ</h1>';
            modalOverlay.addEventListener('click', (event:Event)=>{
                if(event.target === modalOverlay){
                    modalOverlay.style.display = 'none';
                }
            });
            const modalContentInner = document.createElement('div') as HTMLDivElement;
            modalContentInner.id = 'modalContentInner';
            modalContent.appendChild(modalContentInner);
            license(modalContentInner);
        }
        // モーダル２
        if(body){
            const modalOverlay = document.createElement('div') as HTMLDivElement;
            body.appendChild(modalOverlay);
            modalOverlay.id = 'modalOverlayElem';
            const modalContent = document.createElement('div') as HTMLDivElement;
            modalOverlay.appendChild(modalContent);
            modalContent.id = 'modalContentElem';
            const modalTitle = document.createElement('div') as HTMLParagraphElement;
            modalContent.appendChild(modalTitle);
            modalTitle.innerHTML = '<h1>アセット情報</h1>';
            modalOverlay.addEventListener('click', (event:Event)=>{
                if(event.target === modalOverlay){
                    modalOverlay.style.display = 'none';
                    const _modalContentInner = document.querySelector('#modalContentInnerElem') as HTMLDivElement;
                    _modalContentInner?.querySelectorAll('div').forEach(div=>{
                        const parent = div.parentElement;
                        if(parent && parent.id == 'modalContentInnerElem')
                            _modalContentInner.removeChild(div);
                    });
                }
            });
            const modalContentInner = document.createElement('div') as HTMLDivElement;
            modalContentInner.id = 'modalContentInnerElem';
            modalContent.appendChild(modalContentInner);
        }

    }
    static showCostumeHeaderControl(show: boolean): void {
        const header = document.querySelector(`#${HeaderCostumeId}`);
        const typePull = header?.querySelector(`.${TypePullId}`) as HTMLSelectElement;
        typePull.selectedIndex = 0;
        if(show === true){
            header?.classList.remove('hedderHidden');
        }else{
            header?.classList.add('hedderHidden');
        }
    }
    static addCostumeHeaderControl(): void {
        const header = document.querySelector(`#${HeaderCostumeId}`);
        const pageTitle = document.createElement('p') as HTMLParagraphElement;
        pageTitle.innerHTML = `<p style="margin-left:10px;" class="responsive-text">${TITLE}</p>`;
        header?.appendChild(pageTitle);
        const typePullDiv = document.createElement('div');
        header?.appendChild(typePullDiv);
        typePullDiv.classList.add('typeDiv');
        const typePull = document.createElement('select') as HTMLSelectElement;
        typePull.classList.add('responsive-text2');
        typePull.classList.add('pullDown');
        typePull.classList.add('radius10');
        typePull.classList.add(TypePullId);
        typePull.name = TypePullId;
        typePull.id = `Costume_${TypePullId}`
        typePull.addEventListener('change', (event: Event)=>{
            if(event.currentTarget){
                const containerInner = document.querySelector('#containerInner');
                containerInner?.querySelectorAll('div').forEach(div=>{
                    const parent = div.parentElement;
                    if(parent && parent.id == 'containerInner')
                        containerInner.removeChild(div);
                });
                Gui.unLazyLoad();
                const changeVal = (event.currentTarget as HTMLOptionElement).value;
                Gui.showCostumeHeaderControl(false);
                if(changeVal == '2'){
                    Gui.showBackdropHeaderControl(true);

                    //Gui.viewBackdropsPullOption();
                    Gui.viewBackdrops();
                }else if(changeVal == '3'){
                    Gui.showSoundHeaderControl(true);
                    //Gui.viewAudiosPullOption();
                    Gui.viewAudios();
                }
                Gui.lazyLoad();
            }
        });
        typePullDiv.appendChild(typePull);
        {
            const option = document.createElement('option') as HTMLOptionElement;
            option.value = '1';
            option.text = 'コスチューム';
            typePull.appendChild(option);            
        }
        {
            const option = document.createElement('option') as HTMLOptionElement;
            option.value = '2';
            option.text = '背景';
            typePull.appendChild(option);            
        }
        {
            const option = document.createElement('option') as HTMLOptionElement;
            option.value = '3';
            option.text = '音';
            typePull.appendChild(option);            
        }
        const pagingPullDiv = document.createElement('div');
        header?.appendChild(pagingPullDiv);
        pagingPullDiv.classList.add('typeDiv');
        const pagingPull = document.createElement('select') as HTMLSelectElement;
        pagingPullDiv.appendChild(pagingPull);
        pagingPull.classList.add('responsive-text2');
        pagingPull.classList.add('pullDown');
        pagingPull.classList.add('radius10');
        pagingPull.classList.add(PagingPullId);
        pagingPull.name = PagingPullId;
        pagingPull.id = `Costume_${PagingPullId}`;
        {
            const option = document.createElement('option') as HTMLOptionElement;
            option.value= '1';
            option.text = '0001-';
            pagingPull.appendChild(option);
        }
        pagingPull.selectedIndex = 0;
        pagingPullDiv.appendChild(pagingPull);
        pagingPull.addEventListener('change', (event: Event)=>{
            const changeVal = (event.currentTarget as HTMLOptionElement).value;
            const _no = changeVal;
            const _idx = parseInt(_no);
            const _type = Gui.getTypeCounter(header);
            Gui.unLazyLoad();
            if(_type == 0){
                Gui.viewCostumes(_idx);
            }else if(_type == 1) {
                Gui.viewBackdrops(_idx);
            }else if(_type == 2) {
                Gui.viewAudios(_idx);
            }
            Gui.lazyLoad();
        });


        const licenseDiv = document.createElement('div') as HTMLDivElement;
        licenseDiv.classList.add('license');
        header?.appendChild(licenseDiv);

        const licenseButton = document.createElement('button') as HTMLButtonElement;
        licenseButton.classList.add('responsive-text');
        licenseButton.classList.add('license');
        licenseButton.classList.add('radius10');
        licenseButton.innerText = `${APP}`;
        licenseDiv.appendChild(licenseButton);
        licenseButton.addEventListener('click', ()=>{
            const modalOverlay = document.querySelector('#modalOverlay') as HTMLDivElement;
            if(modalOverlay)
                modalOverlay.style.display = 'flex';
        });
        
        const versionSpan = document.createElement('span') as HTMLSpanElement;
        versionSpan.innerText = version;
        versionSpan.classList.add('responsive-text2');
        versionSpan.classList.add('version');
        licenseDiv.appendChild(versionSpan);


    }
    static showBackdropHeaderControl(show: boolean): void {
        const header = document.querySelector(`#${HeaderBackdropId}`);
        const typePull = header?.querySelector(`.${TypePullId}`) as HTMLSelectElement;
        typePull.selectedIndex = 1;
        if(show === true){
            header?.classList.remove('hedderHidden');
        }else{
            header?.classList.add('hedderHidden');
        }
    }
    static addBackdropHeaderControl(): void {
        const header = document.querySelector(`#${HeaderBackdropId}`);
        const pageTitle = document.createElement('p') as HTMLParagraphElement;
        pageTitle.innerHTML = `<p style="margin-left:10px;" class="responsive-text">${TITLE}</p>`;
        header?.appendChild(pageTitle);
        const typePullDiv = document.createElement('div');
        header?.appendChild(typePullDiv);
        typePullDiv.classList.add('typeDiv');
        //typePullDiv.classList.add('fit');
        const typePull = document.createElement('select') as HTMLSelectElement;
        typePull.classList.add('responsive-text2');
        typePull.classList.add('pullDown');
        typePull.classList.add('radius10');
        typePull.classList.add(TypePullId);
        typePull.name = TypePullId;
        typePull.id = `Backdrop_${TypePullId}`
        typePull.addEventListener('change', (event: Event)=>{
            if(event.currentTarget){
                const containerInner = document.querySelector('#containerInner');
                containerInner?.querySelectorAll('div').forEach(div=>{
                    const parent = div.parentElement;
                    if(parent && parent.id == 'containerInner')
                        containerInner.removeChild(div);
                });
                Gui.unLazyLoad();
                const changeVal = (event.currentTarget as HTMLOptionElement).value;
                Gui.showBackdropHeaderControl(false);
                if(changeVal == '1'){
                    Gui.showCostumeHeaderControl(true);
                    //Gui.viewCostumesPullOption();
                    Gui.viewCostumes();
                }else if(changeVal == '3'){
                    Gui.showSoundHeaderControl(true);
                    //Gui.viewAudiosPullOption();
                    Gui.viewAudios();
                }
                Gui.lazyLoad();
            }
        });
        typePullDiv.appendChild(typePull);
        {
            const option = document.createElement('option') as HTMLOptionElement;
            option.value = '1';
            option.text = 'コスチューム';
            typePull.appendChild(option);            
        }
        {
            const option = document.createElement('option') as HTMLOptionElement;
            option.value = '2';
            option.text = '背景';
            typePull.appendChild(option);            
        }
        {
            const option = document.createElement('option') as HTMLOptionElement;
            option.value = '3';
            option.text = '音';
            typePull.appendChild(option);            
        }
        const pagingPullDiv = document.createElement('div');
        header?.appendChild(pagingPullDiv);
        pagingPullDiv.classList.add('typeDiv');
        const pagingPull = document.createElement('select') as HTMLSelectElement;
        pagingPullDiv.appendChild(pagingPull);
        pagingPull.classList.add('responsive-text2');
        pagingPull.classList.add('pullDown');
        pagingPull.classList.add('radius10');
        pagingPull.classList.add(PagingPullId);
        pagingPull.name = PagingPullId;
        pagingPull.id = `Backdrop_${PagingPullId}`;
        {
            const option = document.createElement('option') as HTMLOptionElement;
            option.value= '1';
            option.text = '0001-';
            pagingPull.appendChild(option);
        }
        pagingPull.selectedIndex = 0;
        pagingPullDiv.appendChild(pagingPull);
        pagingPull.addEventListener('change', (event: Event)=>{
            const changeVal = (event.currentTarget as HTMLOptionElement).value;
            const _no = changeVal;
            const _idx = parseInt(_no);
            const _type = Gui.getTypeCounter(header);
            Gui.unLazyLoad();
            if(_type == 0){
                Gui.viewCostumes(_idx);
            }else if(_type == 1) {
                Gui.viewBackdrops(_idx);
            }else if(_type == 2) {
                Gui.viewAudios(_idx);
            }
            Gui.lazyLoad();
        });


        const licenseDiv = document.createElement('div') as HTMLDivElement;
        licenseDiv.classList.add('license');
        header?.appendChild(licenseDiv);

        const licenseButton = document.createElement('button') as HTMLButtonElement;
        licenseButton.classList.add('responsive-text');
        licenseButton.classList.add('license');
        licenseButton.classList.add('radius10');
        licenseButton.innerText = `${APP}`;
        licenseDiv.appendChild(licenseButton);
        licenseButton.addEventListener('click', ()=>{
            const modalOverlay = document.querySelector('#modalOverlay') as HTMLDivElement;
            if(modalOverlay)
                modalOverlay.style.display = 'flex';
        });
        
        const versionSpan = document.createElement('span') as HTMLSpanElement;
        versionSpan.innerText = version;
        versionSpan.classList.add('responsive-text2');
        versionSpan.classList.add('version');
        licenseDiv.appendChild(versionSpan);


    }
    static showSoundHeaderControl(show: boolean): void {
        const header = document.querySelector(`#${HeaderSoundId}`);
        const typePull = header?.querySelector(`.${TypePullId}`) as HTMLSelectElement;
        typePull.selectedIndex = 2;
        if(show === true){
            header?.classList.remove('hedderHidden');
        }else{
            header?.classList.add('hedderHidden');
        }
    }
    static addSoundHeaderControl(): void {
        const header = document.querySelector(`#${HeaderSoundId}`);
        const pageTitle = document.createElement('p') as HTMLParagraphElement;
        pageTitle.innerHTML = `<p style="margin-left:10px;" class="responsive-text">${TITLE}</p>`;
        header?.appendChild(pageTitle);
        const typePullDiv = document.createElement('div');
        header?.appendChild(typePullDiv);
        typePullDiv.classList.add('typeDiv');
        //typePullDiv.classList.add('fit');
        const typePull = document.createElement('select') as HTMLSelectElement;
        typePull.classList.add('responsive-text2');
        typePull.classList.add('pullDown');
        typePull.classList.add('radius10');
        typePull.classList.add(TypePullId);
        typePull.name = TypePullId;
        typePull.id = `Sound_${TypePullId}`;
        typePull.addEventListener('change', (event: Event)=>{
            if(event.currentTarget){
                const containerInner = document.querySelector('#containerInner');
                containerInner?.querySelectorAll('div').forEach(div=>{
                    const parent = div.parentElement;
                    if(parent && parent.id == 'containerInner')
                        containerInner.removeChild(div);
                });
                Gui.unLazyLoad();
                const changeVal = (event.currentTarget as HTMLOptionElement).value;
                Gui.showSoundHeaderControl(false);
                if(changeVal == '1'){
                    Gui.showCostumeHeaderControl(true);
                    //Gui.viewCostumesPullOption();
                    Gui.viewCostumes();        
                }else if(changeVal == '2'){
                    Gui.showBackdropHeaderControl(true);
                    //Gui.viewBackdropsPullOption();
                    Gui.viewBackdrops();
                }
                Gui.lazyLoad();
            }
        });
        typePullDiv.appendChild(typePull);
        {
            const option = document.createElement('option') as HTMLOptionElement;
            option.value = '1';
            option.text = 'コスチューム';
            typePull.appendChild(option);            
        }
        {
            const option = document.createElement('option') as HTMLOptionElement;
            option.value = '2';
            option.text = '背景';
            typePull.appendChild(option);            
        }
        {
            const option = document.createElement('option') as HTMLOptionElement;
            option.value = '3';
            option.text = '音';
            typePull.appendChild(option);            
        }
        const pagingPullDiv = document.createElement('div');
        header?.appendChild(pagingPullDiv);
        pagingPullDiv.classList.add('typeDiv');
        const pagingPull = document.createElement('select') as HTMLSelectElement;
        pagingPullDiv.appendChild(pagingPull);
        pagingPull.classList.add('responsive-text2');
        pagingPull.classList.add('pullDown');
        pagingPull.classList.add('radius10');
        pagingPull.classList.add(PagingPullId);
        pagingPull.name = PagingPullId;
        pagingPull.id = `Sound_${PagingPullId}`;
        {
            const option = document.createElement('option') as HTMLOptionElement;
            option.value= '1';
            option.text = '0001-';
            pagingPull.appendChild(option);
        }
        pagingPull.selectedIndex = 0;
        pagingPullDiv.appendChild(pagingPull);
        pagingPull.addEventListener('change', (event: Event)=>{
            const changeVal = (event.currentTarget as HTMLOptionElement).value;
            const _no = changeVal;
            const _idx = parseInt(_no);
            const _type = Gui.getTypeCounter(header);
            Gui.unLazyLoad();
            if(_type == 0){
                Gui.viewCostumes(_idx);
            }else if(_type == 1) {
                Gui.viewBackdrops(_idx);
            }else if(_type == 2) {
                Gui.viewAudios(_idx);
            }
            Gui.lazyLoad();
        });


        const licenseDiv = document.createElement('div') as HTMLDivElement;
        licenseDiv.classList.add('license');
        header?.appendChild(licenseDiv);

        const licenseButton = document.createElement('button') as HTMLButtonElement;
        licenseButton.classList.add('responsive-text');
        licenseButton.classList.add('license');
        licenseButton.classList.add('radius10');
        licenseButton.innerText = `${APP}`;
        licenseDiv.appendChild(licenseButton);
        licenseButton.addEventListener('click', ()=>{
            const modalOverlay = document.querySelector('#modalOverlay') as HTMLDivElement;
            if(modalOverlay)
                modalOverlay.style.display = 'flex';
        });
        
        const versionSpan = document.createElement('span') as HTMLSpanElement;
        versionSpan.innerText = version;
        versionSpan.classList.add('responsive-text2');
        versionSpan.classList.add('version');
        licenseDiv.appendChild(versionSpan);
    }

    static getTypeCounter(header: Element|null): number {
        if(header){
            const pagingPull = header.querySelector(`.${TypePullId}`) as HTMLSelectElement;
            return pagingPull.selectedIndex;
        }
        throw 'ERROR';
    }
    static getPagingStartCounter(): number {
        const pagingPull = document.querySelector('#pagingPull') as HTMLSelectElement;
        return pagingPull.selectedIndex;
    }
    static lazyLoad(): void {
        Gui.unLazyLoad();
        const lazyImages = document.querySelectorAll('.lazy-load');
        const observer = Gui.getObseerver();
        // 取得した画像をすべて監視対象にする
        lazyImages.forEach(div => {            
            observer.observe(div);
        });
    }
    static unLazyLoad(): void {
        const observer = Gui.getObseerver();
        const lazyImages = document.querySelectorAll('.lazy-load');
        lazyImages.forEach(div => {
            observer.unobserve(div);
        });

    }
    static viewFirst(): void {
        //const typePull = document.querySelector('#typePull') as HTMLSelectElement;
        //typePull.selectedIndex = 0; // Coustume;
        Gui.viewCostumesPullOption();
        Gui.viewBackdropsPullOption();
        Gui.viewAudiosPullOption();
        Gui.viewCostumes();

    }
    static viewAll(): void {
        Gui.viewCostumes();
        Gui.viewBackdrops();   
    }
    static viewCostumesPullOption(): void {
        const header = document.querySelector(`#${HeaderCostumeId}`) as HTMLDivElement;
        Gui.setPullOption(header, costumesJson);
    }
    static viewBackdropsPullOption(): void {
        const header = document.querySelector(`#${HeaderBackdropId}`) as HTMLDivElement;
        Gui.setPullOption(header, backdropsJson);
    }
    static viewAudiosPullOption(): void {
        const header = document.querySelector(`#${HeaderSoundId}`) as HTMLDivElement;
        Gui.setPullOption(header, soundsJson);
    }
    static setPullOption(header: HTMLDivElement, jsons: JsonElement[]): void {
        const pagingPull = header.querySelector(`.${PagingPullId}`) as HTMLSelectElement;
        pagingPull.innerHTML = pagingPull.options[0].outerHTML;
        const length = jsons.length;
        const counter = Math.floor(length / PagingNumber) + 1;
        for(let idx=0; idx < counter; idx++){
            if(idx ==0) continue;
            const option = document.createElement('option') as HTMLOptionElement;
            option.value = `${idx*PagingNumber}`
            option.text = `${idx*PagingNumber}`.padStart(4, '0')+'-';
            pagingPull.appendChild(option);
        }
    }

    static viewCostumes(counter: number = 1): void {
        const containerInner = document.querySelector('#containerInner');
        containerInner?.querySelectorAll('div').forEach(div=>{
            const parent = div.parentElement;
            if(parent && parent.id == 'containerInner')
                containerInner.removeChild(div);
        });
        const start = (counter < PagingNumber)? -1: counter-1;
        const end = (counter < PagingNumber)? PagingNumber : counter + PagingNumber; 
        let _counter = 0;
        for(const element of costumesJson) {
            if( start < _counter && _counter < end){
                Gui.addImageElement(element);
            }
            _counter += 1;
        }
    }
    static addImageElement(imageElement:JsonElement): void {
        const containerInner = document.querySelector('#containerInner');
        const elemDivOuter = document.createElement('div');
        elemDivOuter.classList.add('play-element');
        containerInner?.appendChild(elemDivOuter);
        const elemDiv = document.createElement('div');
        elemDivOuter?.appendChild(elemDiv);
        elemDiv.classList.add('element');
        elemDiv.classList.add('border');
        elemDiv.classList.add('lazy-load');
        const image = document.createElement('img') as HTMLImageElement;
        image.setAttribute('oncontextmenu', 'return false;');
        image.classList.add('thumbnail');
        image.src = loadingGif;
        image.setAttribute('data-src', imageElement.url);
        image.setAttribute('height', '100px');
        elemDiv.appendChild(image);
        const p = document.createElement('p') as HTMLParagraphElement;
        elemDivOuter.appendChild(p);
        p.classList.add('elem-name');
        p.innerText = imageElement.name;

        elemDiv.addEventListener('click', ()=>{
            imageModal(imageElement);
        })
    }
    static viewBackdrops(counter: number = 1): void {
        const containerInner = document.querySelector('#containerInner');
        containerInner?.querySelectorAll('div').forEach(div=>{
            const parent = div.parentElement;
            if(parent && parent.id == 'containerInner')
                containerInner.removeChild(div);
        });
        const start = (counter < PagingNumber)? -1: counter-1;
        const end = (counter < PagingNumber)? PagingNumber : counter + PagingNumber; 
        let _counter = 0;
        for(const element of backdropsJson) {
            if( start < _counter && _counter < end){
                Gui.addImageElement(element);
            }
            _counter += 1;
        }
    }
    static async viewAudios(counter: number = 1): Promise<void> {
        const containerInner = document.querySelector('#containerInner');
        containerInner?.querySelectorAll('div').forEach(div=>{
            const parent = div.parentElement;
            if(parent && parent.id == 'containerInner')
                containerInner.removeChild(div);
        });
        const start = (counter < PagingNumber)? -1: counter-1;
        const end = (counter < PagingNumber)? PagingNumber : counter + PagingNumber; 
        let _counter = 0;
        for(const element of soundsJson) {
            if( start < _counter && _counter < end){
                Gui.addSound(element);
            }
            _counter += 1;
        }
        
    }
    static async addSound(sound: JsonElement): Promise<void> {
        const containerInner = document.querySelector('#containerInner');
        const elemDivOuter = document.createElement('div');
        elemDivOuter.classList.add('play-element');
        containerInner?.appendChild(elemDivOuter);
        const elemDiv = document.createElement('div');
        elemDivOuter.appendChild(elemDiv);
        elemDiv.classList.add('element');
        elemDiv.classList.add('border');
        elemDiv.classList.add('lazy-load');
        const image = document.createElement('img') as HTMLImageElement;
        image.setAttribute('oncontextmenu', 'return false;');
        image.src = SoundSvgData;
        image.setAttribute('height', '100px');
        elemDiv.appendChild(image);

        const control = document.createElement('div');
        elemDivOuter.appendChild(control);
        control.classList.add('play-button');
        const playMark = document.createElement('img') as HTMLImageElement;
        playMark.setAttribute('oncontextmenu', 'return false;');
        playMark.src = SoundPlayData;
        control.appendChild(playMark);
        playMark.setAttribute('width', '50%');
        control.addEventListener('mouseenter', ()=>{
            playMark.src = SoundStopData;
            sounder.play();
        });
        control.addEventListener('mouseleave', ()=>{
            playMark.src = SoundPlayData;
            sounder.stop();
        });
        const p = document.createElement('p') as HTMLParagraphElement;
        elemDivOuter.appendChild(p);
        p.classList.add('elem-name');
        p.innerText = sound.name;
        const sounder = new Sound(sound.url);
        await sounder.makeSoundPlayer();

        elemDiv.addEventListener('click', ()=>{

            soundModal(sound, sounder);   

        });
        
    }
}