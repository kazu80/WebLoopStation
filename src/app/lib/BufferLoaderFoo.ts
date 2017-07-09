export class BufferLoaderFoo {
    context: any;
    urlList: any;
    onload: any;
    bufferList: any;
    loadCount: any;
    private _loadedCount: number;
    _bufferFromURL: any;

    constructor(context, callback) {
        this.context      = context;
        this.onload       = callback;
        this.bufferList   = [];
        this.loadCount    = 0;
        this._loadedCount = 0;
    }

    loadBufferFromURL(url: string, callback) {
        const request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";

        const loader = this;

        request.onload = function () {
            // Asynchronously decode the audio file data in request.response
            loader.context.decodeAudioData(
                request.response,
                function (buffer) {
                    if (!buffer) {
                        alert('error decoding file data: ' + url);
                        return;
                    }

                    callback(buffer);
                },
                function (error) {
                    console.error('decodeAudioData error', error);
                }
            );
        };

        request.onerror = function () {
            alert('BufferLoader: XHR error');
        };

        request.send();

    }

    loadBuffer(url, index) {
        const request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";

        const loader = this;

        request.onload = function () {
            // Asynchronously decode the audio file data in request.response
            loader.context.decodeAudioData(
                request.response,
                function (buffer) {
                    if (!buffer) {
                        alert('error decoding file data: ' + url);
                        return;
                    }
                    loader.bufferList[index] = buffer;
                    if (++loader.loadCount === loader.urlList.length) {
                        loader.onload(loader.bufferList);
                    }

                },
                function (error) {
                    console.error('decodeAudioData error', error);
                }
            );
        };

        request.onerror = function () {
            alert('BufferLoader: XHR error');
        };

        request.send();
    }

    load(urlList: string[]) {
        this.urlList = urlList;

        for (let i = this._loadedCount; i < this.urlList.length; ++i) {
            this.loadBuffer(this.urlList[i], i);
            this._loadedCount++;
        }
    }

    resetParam() {
        this._loadedCount = 0;
        this.loadCount    = 0;
        this.bufferList   = [];
    }
}
