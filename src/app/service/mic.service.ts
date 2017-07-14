import {Injectable} from '@angular/core';
import {LooperAudioContext} from "../lib/LooperAudioContext";

@Injectable()
export class MicService {
    private _isMic: boolean;
    private _stream: any;
    private _audioctx: AudioContext;
    private _isUserMedia: boolean;
    private _isDestination: boolean;
    private _source: MediaStreamAudioSourceNode;

    constructor() {
        this._audioctx      = LooperAudioContext.getInstance();
        this._isUserMedia   = false;
        this._isDestination = false;
    }

    get isMic(): boolean {
        return this._isMic;
    }

    set isMic(value: boolean) {
        this._isMic = value;
    }

    get isDestination(): boolean {
        return this._isDestination;
    }

    set isDestination(value: boolean) {
        this._isDestination = value;
    }

    get stream(): any {
        return this._stream;
    }

    get isUserMedia(): boolean {
        return this._isUserMedia;
    }

    get source(): MediaStreamAudioSourceNode {
        return this._source;
    }

    destinationConnect() {
        this._source.connect(this._audioctx.destination);
        this._isDestination = true;
    }

    destinationDisconnect() {
        try {
            this._source.disconnect(this._audioctx.destination);
        } catch (e) {
            console.warn(`error: ${e}`);
        }

        this._isDestination = false;
    }

    on() {
        this._isUserMedia = true;

        navigator.getUserMedia(
            {audio: true, video: false},
            (mediaStream) => {
                this._stream = mediaStream;
                this._source = this._audioctx.createMediaStreamSource(mediaStream);
            },
            (e) => {
                console.error(e);
            }
        );
    }

    off() {
        (this._stream.getTracks())[0].stop();
        this._stream        = null;
        this._isUserMedia   = false;
        this._isDestination = false;
    }

}
