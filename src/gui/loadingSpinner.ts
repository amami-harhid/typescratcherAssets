export const loadingSpinner = ()=>{
 
    window.addEventListener("load", function() {
        const _overlay = document.querySelector('#loading-overlay') as HTMLDivElement;
        if(_overlay){
            _overlay.style.display = "none";
        }
    });
}