import cfg from './config.js';

export default {
    async fetchFrom(uri) {

        let result = await fetch(uri),
            json = await result.json();

        return {
            result,
            json
        };

    },

    showResults(results, where) {
        Object.entries(results).map(item => {
            this.addToFontCollection(item[1]);
            this.import(item[1].family);
            this.showItem(item[1], where);
        })
    },

    noSpaces(item) {
        return item.split(' ').join('-');
    },

    addToFontCollection(font) {
        if (!cfg.fontCollection[this.noSpaces(font.family)])
            cfg.fontCollection[this.noSpaces(font.family)] = font;
    },

    import(font) {
        if (!cfg.dom.head.querySelector(`#${this.noSpaces(font)}`))
            cfg.dom.head.innerHTML += `<style id="${this.noSpaces(font)}">@import url('https://fonts.googleapis.com/css?family=${font}')</style>`;
    },

    showItem(font, where) {
        const fontBlock = `<div class="preview">
            <span>${font.family}</span>
            <span class="select-font" data-fetch-config="${this.noSpaces(font.family)}">+</span>
            <p style="font-family: ${font.family}">${cfg.localizations.previewText}</p>
        </div>`;


        cfg.dom[where].innerHTML += fontBlock;
    },

    event(data) {
        this.addEvent(data.onElement, data.event, data.callback);
    },

    addEvent(element, event, callback) {
        // return element.addEventListener(event, callback, false);
        if (element.attachEvent)
            return element.attachEvent('on' + event, callback);
        else
            return element.addEventListener(event, callback, false);
    },

    debounce(func, wait, immediate) {
        var timeout;
        return function () {
            var context = this,
                args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    },

    // aflu daca am ajuns la capatul scrollului
    hasScrollReachedBottomOfThePage() {
        let currentScroll = cfg.dom.listWrap.scrollTop,
            elementHeight = cfg.dom.listWrap.clientHeight,
            scrollHeight = cfg.dom.listWrap.scrollHeight;


        return (scrollHeight - currentScroll === elementHeight);
    },

};