
const iFrameSetupEvent = new Event("iFrameSetupComplete");

function inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

let wwfParentHeight = window.innerHeight;
let iFrameChecked = false;

if (!inIframe()) {document.dispatchEvent(iFrameSetupEvent);}

window.iFrameResizer = {
    onReady: function () {
        if ('parentIFrame' in window) {
            if (debug) {console.log("iFrame found");}
            parentIFrame.getPageInfo(function (pageInfo) {
                wwfParentHeight = pageInfo.clientHeight;
                let modalTop = (pageInfo.scrollTop - pageInfo.offsetTop) + 100;
                let modalHeight = pageInfo.clientHeight * 0.8;
                let modals = document.querySelectorAll('.modal');
                for (let modal of modals ) {
                    modalTop <= 0 ? modal.style.top = 0 : modal.style.top = `${modalTop}px`;
                }
                let modalContents = document.querySelectorAll('.modal-content');
                for (let modalContent of modalContents ) {
                    modalContent.style.height = `${modalHeight}px`;
                }
                if (!iFrameChecked) {
                    iFrameChecked = true;
                    document.dispatchEvent(iFrameSetupEvent);
                }
            });
        }
    }
};
