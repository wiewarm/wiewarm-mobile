import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import './i18n';

//export function shortenPos01 (pos) { return pos };
export function shortenPos (pos) {
    if (!pos){
        return;
    }
    const spos = pos.toString().replace(/^(.*)\.(....).*/, "$1.$2");
    //console.log("shortpos:", pos, spos);
    return spos;
};

export function geoOpts() {
    return {
        positionOptions: {
          enableHighAccuracy: false,
        },
        //onSuccess: () => console.log("gloc: success"),
        watchPosition: true,
        isOptimisticGeolocationEnabled: true,
        userDecisionTimeout: 15000,
      };
}

export function randomArrayIndex (arr) {
    const max = arr.length;
    return Math.floor(Math.random() * Math.floor(max));
};


ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
