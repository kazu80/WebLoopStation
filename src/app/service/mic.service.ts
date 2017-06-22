import {Injectable} from '@angular/core';

@Injectable()
export class MicService {
    private _isMic: boolean;
    private _mic: any;
    private _stream: any;

    constructor() {
        const audioctx = new AudioContext();

        let micsrc;

        const conditions = {audio: true, video: false};

        this._mic = () => {
            navigator.getUserMedia(
                conditions,
                (stream) => {
                    this._stream = stream;
                    micsrc       = audioctx.createMediaStreamSource(stream);
                    micsrc.connect(audioctx.destination);
                    // micsrc.connect(analyser);
                },
                (e) => {
                    console.error(e);
                }
            );
        };

    }

    get isMic(): boolean {
        return this._isMic;
    }

    set isMic(value: boolean) {
        this._isMic = value;
    }

    get mic(): any {
        return this._mic;
    }

    set mic(value: any) {
        this._mic = value;
    }

    get stream(): any {
        return this._stream;
    }

    set stream(value: any) {
        this._stream = value;
    }
}
