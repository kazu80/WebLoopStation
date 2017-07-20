import {Injectable} from '@angular/core';
import {LooperAudioContext} from "../lib/LooperAudioContext";

@Injectable()
export class GainService {
    private _audioctx: AudioContext;
    private _master: GainNode;
    private _volume: number;

    constructor() {
        this._audioctx = LooperAudioContext.getInstance();
        this._master   = this._audioctx.createGain();
        this._volume   = 0.5;
    }

    connect(source: AudioBufferSourceNode): AudioBufferSourceNode {
        this._master.gain.value = this._volume;
        source.connect(this._master);

        return source;
    }

    disconnect(source: any): void {
        source.disconnect(this._master);
    }
}
