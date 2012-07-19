/**
 * © 2012 Aleksej Martirosyan
 * Alex-Martirosyan@ya.ru
 */

var cssWatch = {
    updateInterval: 100, // interval to check for updates, msecs

    arrayCssFiles: [], // paths to CSS files
    arrayCssObj: [], // link[type="text/css"] nodes
    arrayLastModified: [], // extracted from headers, used to properly form request headers

    counter: 0, // used to

    ajax: function (settings) {
        var _this = this,
            request = null,
            lastModified = '';

        try {
           request = new XMLHttpRequest();
        } catch (e) {
            try {
                request = new ActiveXObject('Msxml2.XMLHTTP');
            } catch (e) {
                request = new ActiveXObject('Microsoft.XMLHTTP');
            }
        }

        var url = settings.url + '?_=' + Math.random();
        request.onreadystatechange = function (text, text2) {
            if (request.readyState == 4) {
                if (request.status == 200) {
                    lastModified = /Last-Modified:\s+([^\n]+)/ig.exec(request.getAllResponseHeaders());
                    lastModified = lastModified[1];

                    _this.arrayCssObj[_this.counter].setAttribute('href', _this.arrayCssFiles[_this.counter] + '?_=' + Math.random());
                    if (lastModified) {
                        _this.arrayLastModified[_this.counter] = lastModified.replace(/^\s+/, '').replace(/\s+$/, '');
                    }
                }

                setTimeout(function () {
                    if (_this.counter < _this.arrayCssObj.length - 1) {
                        _this.counter++;
                        _this.loadCss();
                    } else {
                        _this.counter = 0;
                        _this.loadCss();
                    }
                }, _this.updateInterval);
           }
        };

        request.open('HEAD', url, true);

        if (_this.arrayLastModified[_this.counter]) {
            request.setRequestHeader('If-Modified-Since', _this.arrayLastModified[_this.counter]);
        }
        request.send(null);

        return request;
    },

    parse: function () {
        var _this = this,
            arrayLink = document.getElementsByTagName('link'),
            arrayLinkLength = arrayLink.length,
            linkItem;

        for (var i = 0; i < arrayLinkLength; i++) {
            linkItem = arrayLink[i];
            if (linkItem.getAttribute('href').indexOf('.css') > -1 && linkItem.getAttribute('cssWatch') != 'no') {
                _this.arrayCssFiles.push(linkItem.getAttribute('href'));
                _this.arrayCssObj.push(linkItem);
            }
        }

        if (_this.arrayCssFiles.length > 0) {
            this.loadCss();
        }
    },

    loadCss: function () {
         this.ajax({url: this.arrayCssFiles[this.counter]});
    },

    create: function (updateInterval) {
        var _this = this;

        if (updateInterval) {
            this.updateInterval = updateInterval;
        }

        if (document.readyState == 'complete') {
            this.parse();
        } else {
            setTimeout(function () {
                _this.create();
            }, 50);
        }
     }
 };

cssWatch.create();
