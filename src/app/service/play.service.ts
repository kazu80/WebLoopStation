import {Injectable} from '@angular/core';

@Injectable()
export class PlayService {
    private _playing: any = false;
    private _start: any   = false;
    private _stop: any    = false;

    constructor() {
    }

    get playing(): any {
        return this._playing;
    }

    set playing(value: any) {
        this._playing = value;
    }

    get start(): any {
        return this._start;
    }

    set start(value: any) {
        this._start = value;
    }

    get stop(): any {
        return this._stop;
    }

    set stop(value: any) {
        this._stop = value;
    }
}
