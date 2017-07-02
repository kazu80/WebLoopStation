import {AfterViewInit, Component, DoCheck, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/scan';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import {RecordingService} from "../service/recording.service";
import {UsermediaService} from "../service/usermedia.service";

import {BufferLoaderFoo} from '../lib/BufferLoaderFoo';
import {PlayService} from "../service/play.service";
import {MicService} from "../service/mic.service";

@Component({
    selector   : 'app-main',
    templateUrl: './main.component.html',
    styleUrls  : ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit, DoCheck {
    public play                  = false;
    public rec                   = false;
    public time                  = 0;
    public beat: number;
           mediaRecorder: any;
    public recordedChunks: any[] = [];
           context: any;
           bufferLoader: any;

    kick: any;
    snare: any;
    hihat: any;
    analyzeCanvas: HTMLElement;
    source: any;

    /** Looper params **/
    urls: any[] = [];

    constructor(public service_recording: RecordingService,
                private service_user_media: UsermediaService,
                private service_play: PlayService,
                private service_mic: MicService) {
    }

    ngOnInit() {
        this.play    = this.service_play.start;
        this.rec     = this.service_recording.recording;
        this.context = new AudioContext();
    }

    ngAfterViewInit() {
        // analyze canvas
        this.analyzeCanvas = document.getElementById("analyze");

        //
        this.service_mic.analyze(this.analyzeCanvas);
    }

    /**
     * 変更チェックをngDoCheckで行なう。
     * AngularJS/Vueで言うところのwatch
     */
    ngDoCheck() {
        if (this.service_recording.audioURL) {
            const audioURLs: string[]       = [];
            const audioURL: string          = this.service_recording.audioURL;
            this.service_recording.audioURL = null;

            audioURLs.push(audioURL);

            this.bufferLoader = new BufferLoaderFoo(
                this.context,
                audioURLs,
                this.finishedLoadingLooper
            );

            this.bufferLoader.load();
        }


        if (!this.service_recording.recording && this.service_recording.start) {
            this.service_recording.start     = false;
            this.service_recording.recording = true;
            this.service_recording.on(this.service_mic.stream);

        } else if (this.service_recording.recording && this.service_recording.stop) {
            this.service_recording.stop      = false;
            this.service_recording.recording = false;
            this.service_recording.off();
        }

        if (this.service_play.start === true) {
            this.service_play.start   = false;
            this.service_play.playing = true;

            this.context = new AudioContext();

            this.bufferLoader = new BufferLoaderFoo(
                this.context,
                this.urls,
                this.finishedLoadingLooper
            );

            this.bufferLoader.load();
        }

        if (this.service_mic.isMic === true && !this.service_mic.stream && this.service_mic.isUserMedia === false) {
            this.service_mic.on();
        } else if (this.service_mic.isMic === false && this.service_mic.stream) {
            this.service_mic.off();
        }
    }

    public clickMic() {
        this.service_mic.isMic = !this.service_mic.isMic;
    }

    public clickLooper() {
        if (this.service_mic.isMic === true && this.service_recording.recording) {
            this.service_recording.stop = true;
        } else if (this.service_mic.isMic === true) {
            this.service_recording.start = true;
        }
    }

    /**
     * play Rock Sound
     */
    public playRockSound() {
        this.service_play.start = true;
        this.context            = new AudioContext();

        this.bufferLoader = new BufferLoaderFoo(
            this.context,
            [
                '/assets/sounds/hihat.mp3',
                '/assets/sounds/kick.mp3',
                '/assets/sounds/snare.mp3'
            ],
            this.finishedLoading
        );

        this.bufferLoader.load();
    }

    finishedLoadingLooper: any = (bufferList) => {
        const bufferSources: AudioBufferSourceNode[] = [];

        for (let i = 0; i < bufferList.length; i++) {
            bufferSources[i]        = this.context.createBufferSource();
            bufferSources[i].buffer = bufferList[i];

            this.playSound(bufferSources[i].buffer, 0);
        }
    };

    finishedLoading: any = (bufferList) => {
        // Create two sources and play them both together.
        this.kick  = this.context.createBufferSource();
        this.snare = this.context.createBufferSource();
        this.hihat = this.context.createBufferSource();

        this.hihat.buffer = bufferList[0];
        this.kick.buffer  = bufferList[1];
        this.snare.buffer = bufferList[2];

        // We'll start playing the rhythm 100 milliseconds from "now"
        const startTime      = this.context.currentTime + 0.100;
        const tempo          = 80; // BPM (beats per minute)
        const eighthNoteTime = (60 / tempo) / 2;

        for (let bar = 0; bar < 2; bar++) {
            const time = startTime + bar * 8 * eighthNoteTime;

            // Play the bass (kick) drum on beats 1, 5
            this.playSound(this.kick.buffer, time);
            this.playSound(this.kick.buffer, time + 4 * eighthNoteTime);

            // Play the snare drum on beats 3, 7
            this.playSound(this.snare.buffer, time + 2 * eighthNoteTime);
            this.playSound(this.snare.buffer, time + 6 * eighthNoteTime);

            // Play the hi-hat every eighth note.
            for (let i = 0; i < 8; ++i) {
                this.playSound(this.hihat.buffer, time + i * eighthNoteTime);
            }
        }
    };

    playSound(buffer, time) {
        this.source = this.service_play.playSound(buffer, time);
    }

    stopSound() {
        this.service_play.stopSound();
    }

    public click(): void {

        /*
        const stream = new Observable(observer => {
            let beat       = 0;
            const interval = setInterval(() => {
                observer.next([this.play, beat++]);
            }, 1000);

            return () => {
                clearInterval(interval);
            }
        });

        stream
            .map(value => {
                value[0] = !value[0];
                return value;
            })
            .subscribe((value) => {
                this.play = value[0];
                this.beat = value[1];

                if (value[1] % 4 === 0) {
                    this.time++;
                    this.service_recording.recording = !this.service_recording.recording;

                    if (this.service_recording.recording) {
                        this.service_recording.start = true;
                    } else {
                        this.service_recording.stop = true;
                    }
                }

                console.log(this.play, this.beat, this.time);
            });
         */

        this.rec = !this.rec;

        this.service_recording.recording = !this.service_recording.recording;
        console.log(this.service_recording.recording);

    }
}
