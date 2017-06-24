import {Injectable} from '@angular/core';

@Injectable()
export class MicService {
    private _isMic: boolean;
    private _stream: any;

    constructor() {

    }

    get isMic(): boolean {
        return this._isMic;
    }

    set isMic(value: boolean) {
        this._isMic = value;
    }

    get stream(): any {
        return this._stream;
    }

    on() {
        const audioctx = new AudioContext();

        navigator.getUserMedia(
            {audio: true, video: false},
            (mediaStream) => {
                this._stream = mediaStream;
                const micsrc = audioctx.createMediaStreamSource(mediaStream);
                micsrc.connect(audioctx.destination);
                // micsrc.connect(analyser);
            },
            (e) => {
                console.error(e);
            }
        );
    }

    off() {
        (this._stream.getTracks())[0].stop();
    }
}
