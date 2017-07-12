import {Injectable} from '@angular/core';
import {LooperAudioContext} from "../lib/LooperAudioContext";

@Injectable()
export class MicService {
    private _isMic: boolean;
    private _stream: any;
    private _audioctx: AudioContext;
    private _analyzeMode: number;
    private _analyze: any;
    private _timerId: any;
    private _isUserMedia: boolean;
    private _isDestination: boolean;
    private _micsrc: any;

    constructor() {
        this._analyzeMode   = 0;
        this._audioctx      = LooperAudioContext.getInstance();
        this._analyze       = this._audioctx.createAnalyser();
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

    destinationConnect() {
        this._micsrc = this._audioctx.createMediaStreamSource(this._stream);
        this._micsrc.connect(this._audioctx.destination);
    }

    destinationDisconnect() {
        if (this._micsrc) {
            this._micsrc.disconnect();
            this._micsrc = null;
        }
    }

    on() {
        this._isUserMedia = true;

        navigator.getUserMedia(
            {audio: true, video: false},
            (mediaStream) => {
                this._stream = mediaStream;
                const micsrc = this._audioctx.createMediaStreamSource(mediaStream);
                micsrc.connect(this._analyze);
            },
            (e) => {
                console.error(e);
            }
        );
    }

    off() {
        (this._stream.getTracks())[0].stop();
        cancelAnimationFrame(this._timerId);
        this._stream        = null;
        this._isUserMedia   = false;
        this._isDestination = false;
    }

    analyze(canvas: any) {
        const ctx = canvas.getContext("2d");

        this._analyze.fftSize = 1024;

        const DrawGraph = () => {
            ctx.fillStyle = "rgba(34, 34, 34, 1.0)";
            ctx.fillRect(0, 0, 512, 256);
            ctx.strokeStyle = "rgba(255, 255, 255, 1)";
            const data      = new Uint8Array(512);

            if (this._analyzeMode === 0) {
                this._analyze.getByteFrequencyData(data);
            } else {
                this._analyze.getByteTimeDomainData(data);
            }

            if (this._analyzeMode !== 0) {
                ctx.beginPath();
            }

            for (let i = 0; i < 256; ++i) {
                if (this._analyzeMode === 0) {
                    ctx.fillStyle = "rgba(204, 204, 204, 0.8)";
                    ctx.fillRect(i * 2, 256 - data[i], 1, data[i]);
                } else {
                    ctx.lineTo(i * 2, 256 - data[i]);
                }
            }
            if (this._analyzeMode !== 0) {
                ctx.stroke();
            }
            requestAnimationFrame(DrawGraph);
        };

        this._timerId = requestAnimationFrame(DrawGraph);
    }
}
