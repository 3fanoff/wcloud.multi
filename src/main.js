import './scss/main.scss';
import Tab from "bootstrap/js/src/tab";

const isDebug = Boolean(localStorage.getItem('debug') || location.search.indexOf('debug') >= 0);
let debugNode = null;

function setDimensions () {
    document.documentElement.style.overflowY = 'scroll';
    const baseWidth = 1920;
    const ratio = document.documentElement.clientWidth < 980 ? 1.2 : window.devicePixelRatio;
    const dimension = ((document.documentElement.clientWidth / baseWidth) * ratio).toFixed(3);
    fillDebug({
        'doc.clientWidth' : document.documentElement.clientWidth,
        'doc.scrollWidth' : document.documentElement.scrollWidth,
        'window.innerWidth': window.innerWidth,
        'devicePixelRatio' : window.devicePixelRatio,
        'ratio': ratio,
        'dimension': dimension,
    })
    console.log(document.readyState, document.documentElement.clientWidth, window.devicePixelRatio);
    document.documentElement.style.setProperty('--dimension', String(dimension))
    document.documentElement.style.fontSize = String(dimension) + 'rem';
    document.documentElement.style.overflowY = '';
}

function fillDebug(data) {
    if (isDebug) {
        if (debugNode === null) {
            debugNode = document.getElementById('debug');
        }
        let line = '';
        for (let key in data) {
            line += key + ': ' + String(data[key]) + '<br>';
        }
        debugNode.innerHTML = line;
        debugNode.style.display = 'block';
    }
}

window.addEventListener('resize', () => {
    setDimensions()
})
document.addEventListener('DOMContentLoaded', () => {
    //setTimeout(() => window.dispatchEvent(new Event('resize')), 0);
    setDimensions();

    const tabs = document.querySelectorAll('.js-tab');
    Array.from(tabs).forEach(tab => {
        new Tab(tab);
    });

    Array.from(document.querySelectorAll('.js-pass-eye')).forEach(passEye => {
        const inputNode = document.getElementById(passEye.dataset.for);
        let holding = false;

        passEye.addEventListener('mousedown', (e) => {
            e.preventDefault();
            holding = true;
            inputNode.type = 'text';
            passEye.addEventListener('mouseleave', onMouseLeave);
            passEye.addEventListener('mouseup', onMouseUp);
        });

        function onMouseUp() {
            if (holding) {
                inputNode.type = 'password';

                document.removeEventListener('mouseup', onMouseUp);
                passEye.removeEventListener('mouseup', onMouseUp);
                passEye.removeEventListener('mouseleave', onMouseLeave);
                holding = false;
            }
        }

        function onMouseLeave () {
            if (holding) {
                document.addEventListener('mouseup', onMouseUp);
            }
        }




    })
})