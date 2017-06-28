import {Injectable} from '@angular/core';

@Injectable()
export class RecordingService {
    private _recording: any = false;
    private _stream: any;
    private _start: any = false;
    private _stop: any = false;

    private _mediaRecorder: any;
    private _chunks: any[] = [];

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

    public on(stream: MediaStream) {
        console.log('MediaRecorder On');
        this._mediaRecorder = new MediaRecorder(stream);
        this._mediaRecorder.start();

        this._mediaRecorder.onstart = (e) => {
        };

        this._mediaRecorder.ondataavailable = (e) => {
            this._chunks.push(e.data);
        };

        this._mediaRecorder.onstop = (e) => {
            const blob     = new Blob(this._chunks, {'type': 'audio/ogg; codecs=opus'});
            const audioURL = URL.createObjectURL(blob);

            // temp play sound
            setTimeout(() => {
                const audio: HTMLAudioElement = new Audio(audioURL);
                audio.play();
            }, 600);
        };
    }

    public off() {
        this._mediaRecorder.stop();
    }
}
