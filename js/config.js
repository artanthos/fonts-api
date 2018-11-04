const config = {

    dom: {
        wnd: window,
        doc: document,
        head: document.querySelector('head'),
        btn: document.querySelector('button'),
        modalWrapper: document.querySelector('.modal-wrapper'),
        modal: document.querySelector('.modal'),
        curtain: document.querySelector('.curtain'),
        loading: document.querySelector('.loading'),
        search: document.querySelector('.search input'),
        error: document.querySelector('.error'),
        listWrap: document.querySelector('.list-wrap'),
        list: document.querySelector('.list'),
        filtered: document.querySelector('.filtered'),
        fontInfo: document.querySelector('.font-info'),
        fontInfoList: document.querySelector('.info-list'),
    },

    localizations: {
        spinning: 'Loading...',
        error: 'Server error',
        previewText: 'Ana are mere',
        errorText: '<h1>No results found</h1>',
    },

    fontCollection: {}
};

export default config;