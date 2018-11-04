import cfg from './config.js';
import _ from './utils.js';

class Fonts {
    constructor() {
        this.settings = {
            timeoutAmount: 1500,
            totalFontsAmount: 0,
            isLoadingGifVisible: false,
            infiniteScrollNextPage: 1,
            allFontsRendered: false,
        }
    }

    init() {
        this.requestFor(`/api/getJson?file=fonts_1`, `thenAddToList`);
        this.requestFor(`/api/getJson?file=totalNumberOfFonts`, `thenSetTotalFontsAmount`);
        this.initEvents();
    }

    initEvents() {
        this.initBtn();
        this.initSearchInput();
        this.initInfiniteScroll();
        this.initToolBtns();
    }

    // ====================================================== \\
    // EVENTS ----------------------------------------------- \\
    // ====================================================== \\

    initBtn() {
        _.event({
            "onElement": cfg.dom.btn,
            "event": "click",
            "callback": (e) => {
                cfg.dom.modal.classList.add('visible');
            }
        });
    }

    initSearchInput() {

        _.event({
            "onElement": cfg.dom.search,
            "event": "keyup",
            "callback": _.debounce((e) => {
                let keyword = e.target.value;

                if (keyword) {
                    cfg.dom.listWrap.classList.remove('visible');
                    e.target.setAttribute(`disabled`, `disabled`);
                    this.requestFor(`/api/filter?keyword=${keyword}`, 'thenFilter')
                    return;
                }

                cfg.dom.filtered.classList.remove('visible');
                cfg.dom.listWrap.classList.add('visible');

            }, this.settings.timeoutAmount)
        });



        _.event({
            "onElement": cfg.dom.curtain,
            "event": "click",
            "callback": (e) => {
                cfg.dom.modal.classList.remove('visible');
            }
        });
    }

    initInfiniteScroll() {
        _.event({
            "onElement": cfg.dom.listWrap,
            "event": "scroll",
            "callback": (e) => {
                if (_.hasScrollReachedBottomOfThePage()) {
                    if (this.settings.infiniteScrollNextPage <= this.settings.totalFontsAmount) {
                        let page = ++this.settings.infiniteScrollNextPage;
                        this.requestFor(`/api/getJson?file=fonts_${page}`, `thenAddToList`);
                    }
                }
            }
        });
    }

    initToolBtns() {
        // select-font
        _.event({
            "onElement": document,
            "event": "click",
            "callback": (e) => {
                //SELECT FONT BTN
                // if (e.target.clasList && e.target.clasList.contains("select-font")) { // -- FOR SOME REASON, THIS DOESN'T WORK;
                if (e.target.getAttribute('class') === "select-font") {
                    this.initSelectFont(e.target);
                }

                // CLOSE BTN
                if (e.target.getAttribute('data-target') === 'modal' ) {
                    cfg.dom.modal.classList.remove('visible');
                }

                // CLOSE FONT INFO BTN
                if (e.target.getAttribute('data-target') === 'info-list' ) {
                    cfg.dom.fontInfo.classList.remove('visible');
                }
            }
        });
    }

    initSelectFont(btn) {
        let identifier = btn.getAttribute(`data-fetch-config`),
            fontConfig = cfg.fontCollection[identifier];
            //document.querySelector(`[data-font-config="${identifier}"]`).innerHTML;
        cfg.dom.fontInfoList.innerHTML = "";
        Object.entries(fontConfig).map( entry => {
            cfg.dom.fontInfoList.innerHTML += `<p><strong>${entry[0]}</strong>: ${entry[1]}</p>`;
        } );
        cfg.dom.fontInfo.classList.add('visible');
    }

    // ====================================================== \\
    // ACTIONS ---------------------------------------------- \\
    // ====================================================== \\

    requestFor(file, callback = null) {
        this.toggleLoadingGif();
        let request = _.fetchFrom(file);

        request.then(answer => {

            if (answer.result.status > 200) {
                cfg.dom.error.innerHTML = this.settings.localizations.error;
                return;
            }

            this.toggleLoadingGif();

            if (callback)
                this[callback](answer);
        });
    }

    thenAddToList(data) {
        let results = JSON.parse(data.json);
        _.showResults(results, `list`);
        cfg.dom.listWrap.classList.add('visible');
        this.settings.infiniteScrollCount++;
    }

    thenSetTotalFontsAmount(data) {
        let total = JSON.parse(data.json).total;
        this.settings.totalFontsAmount = total;
    }

    thenFilter(data) {
        let results = JSON.parse(data.json);
        cfg.dom.listWrap.classList.remove('visible');
        cfg.dom.filtered.classList.add('visible');
        cfg.dom.search.removeAttribute(`disabled`);

        cfg.dom.filtered.innerHTML = ``;

        if (results.length) {
            _.showResults(results, `filtered`);
            return;
        }

        cfg.dom.filtered.innerHTML = cfg.localizations.errorText;
    }

    toggleLoadingGif() {
        this.settings.isLoadingGifVisible = !this.settings.isLoadingGifVisible;

        this.settings.isLoadingGifVisible ?
            cfg.dom.loading.classList.add('visible') :
            cfg.dom.loading.classList.remove('visible')
    }
}

let app = new Fonts();
app.init();