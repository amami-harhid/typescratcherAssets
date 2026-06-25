import { Timer } from "./timer";

export const loadingSpinner = ()=>{
 
    window.addEventListener("load", async function() {
        const _overlay = document.querySelector('#loading-overlay') as HTMLDivElement;
        if(_overlay){
            await Timer.wait(2000); // スピナーを最低2秒間は見せておく
            _overlay.style.display = "none";
        }
    });
}