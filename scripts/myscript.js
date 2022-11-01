let vid;
function init() {
    vid = document.getElementById("myVideo");
    vid.addEventListener('canplaythrough', myAutoPlay, false);
}

function myAutoPlay() {
        vid.play();
}
