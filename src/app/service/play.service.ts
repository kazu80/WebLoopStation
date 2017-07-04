import {Injectable} from '@angular/core';
import {BufferLoaderFoo} from "../lib/BufferLoaderFoo";

@Injectable()
export class PlayService {
    private _context: AudioContext;
    private _playing: any = false;
    private _start: any   = false;
    private _stop: any    = false;

    private _sources: any[];
    private _soundDuration: number;

    private _audioURLs: string[];
    private _bufferList: any[];

    constructor() {
        this._context       = new AudioContext;
        this._sources       = [];
        this._soundDuration = 0;
        this._audioURLs     = [];
        this._bufferList    = [];
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

    get soundDuration(): number {
        return this._soundDuration;
    }

    get audioURLs(): string[] {
        return this._audioURLs;
    }

    stopSound() {
        for (let i = 0; i < this._sources.length; i++) {
            const source = this._sources[i];
            source.stop();
        }
    }

    resetSoundParam() {
        this._sources       = [];
        this._soundDuration = 0;
        this._audioURLs     = [];
    }

    createGain(context: AudioContext): GainNode {
        const gainNode      = context.createGain();
        gainNode.gain.value = 0.5;
        gainNode.connect(context.destination);
        return gainNode
    }

    public setAudioURLs(url: string): void {
        this._audioURLs.push(url);
    }

    public playAudio(context: AudioContext): void {

        // audioURLsの中で既にLoadしているのはもうLoadしない。これをBufferLoaderのなかで制御する
        const bufferLoader = new BufferLoaderFoo(
            context,
            this._audioURLs,
            (bufferList) => {
                const bufferSources: AudioBufferSourceNode[] = [];

                for (let i = 0; i < bufferList.length; i++) {
                    bufferSources[i]        = context.createBufferSource();
                    bufferSources[i].buffer = bufferList[i];

                    this.playSound(bufferSources[i].buffer, 0);
                }
            }
        );

        bufferLoader.load();
    }

    public playSound(buffer, time) {
        const source = this._context.createBufferSource();

        if (this._soundDuration === 0) {
            this._soundDuration = buffer.duration * 1000;
        }

        source.buffer = buffer;
        source.loop   = true;

        source.connect(this.createGain(this._context));
        source.start(time);

        this._sources.push(source);

        return source;
    }

}
