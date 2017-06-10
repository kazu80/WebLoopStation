import {Injectable} from '@angular/core';

@Injectable()
export class RecordingService {
    private _recording: any = false;
    private _stream: any;
    private _start: any = false;
    private _stop: any = false;

    constructor() {
    }

    get recording(): boolean {
        return this._recording;
    }

    set recording(value: boolean) {
        this._recording = value;
    }

    get stream(): any {
        return this._stream;
    }

    set stream(value: any) {
        this._stream = value;
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
