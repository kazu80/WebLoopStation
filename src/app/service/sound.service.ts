import {Injectable} from '@angular/core';
import {BufferLoader} from "../lib/BufferLoader";
import {LooperAudioContext} from "../lib/LooperAudioContext";

const sounds: string[] = [
    "../../assets/sounds/angular_83.m4a",
    "../../assets/sounds/angular_c.m4a",
    "../../assets/sounds/angular_q.m4a",
];

@Injectable()
export class SoundService {
    private _context: AudioContext;
    private _loader: BufferLoader;

    private _buffer_1: any;
    private _buffer_2: any;
    private _buffer_3: any;
    private _sound_source_1: AudioBufferSourceNode;
    private _sound_source_2: AudioBufferSourceNode;
    private _sound_source_3: AudioBufferSourceNode;
    private _sound_gain_1: GainNode;
    private _sound_gain_2: GainNode;
    private _sound_gain_3: GainNode;

    constructor() {
        this._context = LooperAudioContext.getInstance();
        this._loader  = new BufferLoader();

        this._sound_source_1 = this._context.createBufferSource();
        this._sound_source_2 = this._context.createBufferSource();
        this._sound_source_3 = this._context.createBufferSource();

        this._sound_gain_1 = this._context.createGain();
        this._sound_gain_2 = this._context.createGain();
        this._sound_gain_3 = this._context.createGain();

        this.init();
    }

    private init() {
        this._sound_gain_1.gain.value = 0.5;
        this._sound_gain_2.gain.value = 0.5;
        this._sound_gain_3.gain.value = 0.5;

        // connect destination
        this._sound_gain_1.connect(this._context.destination);
        this._sound_gain_2.connect(this._context.destination);
        this._sound_gain_3.connect(this._context.destination);

        // connect gain
        this._sound_source_1.connect(this._sound_gain_1);
        this._sound_source_2.connect(this._sound_gain_2);
        this._sound_source_3.connect(this._sound_gain_3);

        // load sound
        this._loader.loadBufferFromURL(sounds[0], (buffer) => {
            this._buffer_1              = buffer;
            this._sound_source_1.buffer = this._buffer_1;
        });

        this._loader.loadBufferFromURL(sounds[1], (buffer) => {
            this._buffer_2              = buffer;
            this._sound_source_2.buffer = this._buffer_2;
        });


        this._loader.loadBufferFromURL(sounds[2], (buffer) => {
             this._buffer_3 = buffer;
             this._sound_source_3.buffer = this._buffer_3;
        });
    }

    start(num: number, master_gain: GainNode, time: number = 0) {
        switch (num) {
            case 1:
                this._sound_source_1.start(time);
                this._sound_source_1.onended = () => {
                    this._sound_source_1        = this._context.createBufferSource();
                    this._sound_source_1.buffer = this._buffer_1;
                    this._sound_source_1.connect(this._sound_gain_1);
                    this._sound_gain_1.connect(master_gain);
                };
                break;
            case 2:
                this._sound_source_2.start(time);
                this._sound_source_2.onended = () => {
                    this._sound_source_2        = this._context.createBufferSource();
                    this._sound_source_2.buffer = this._buffer_2;
                    this._sound_source_2.connect(this._sound_gain_2);
                    this._sound_gain_2.connect(master_gain);
                };
                break;
            case 3:
                this._sound_source_3.start(time);
                this._sound_source_3.onended = () => {
                    this._sound_source_3        = this._context.createBufferSource();
                    this._sound_source_3.buffer = this._buffer_3;
                    this._sound_source_3.connect(this._sound_gain_3);
                    this._sound_gain_3.connect(master_gain);
                };
                break;
        }
    }

    stop(num: number) {
        switch (num) {
            case 1:
                this._sound_source_1.stop();
                break;
            case 2:
                this._sound_source_2.stop();
                break;
            case 3:
                this._sound_source_3.stop();
                break;
        }
    }

    volume(num: number) {
        if (num < 1 || num > 9) {
            return console.error('volume fail');
        }

        const volume = num * 0.1;

        this._sound_gain_1.gain.value = volume;
        this._sound_gain_2.gain.value = volume;
        this._sound_gain_3.gain.value = volume;
    }
}
