import {AfterViewInit, Component, DoCheck, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/scan';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import {RecordingService} from "../service/recording.service";
import {UsermediaService} from "../service/usermedia.service";

import {PlayService} from "../service/play.service";
import {MicService} from "../service/mic.service";
import {BufferLoaderFoo} from "../lib/BufferLoaderFoo";

@Component({
    selector   : 'app-main',
    templateUrl: './main.component.html',
    styleUrls  : ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit, DoCheck {
    public play: boolean;
    public rec: boolean;
    public context: AudioContext;
    public analyzeCanvas: HTMLElement;

    constructor(public service_recording: RecordingService,
                private service_user_media: UsermediaService,
                public service_play: PlayService,
                public service_mic: MicService) {
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

        // audioURL
        if (this.service_recording.audioURL) {

            //
            this.service_play.stopSound();

            //
            const audioURL: string          = this.service_recording.audioURL;
            this.service_recording.audioURL = null;

            this.service_play.setAudioURLs(audioURL);
            this.service_play.playAudio(this.context);
        }

        // Recording Start / Stop
        if (!this.service_recording.recording && this.service_recording.start) {
            this.service_recording.start     = false;
            this.service_recording.recording = true;
            this.service_recording.on(this.service_mic.stream);

            if (this.service_play.soundDuration > 0) {
                setTimeout(() => {
                    this.service_recording.stop      = false;
                    this.service_recording.recording = false;
                    this.service_recording.off();
                }, this.service_play.soundDuration);
            }

        } else if (this.service_recording.recording && this.service_recording.stop) {
            this.service_recording.stop      = false;
            this.service_recording.recording = false;
            this.service_recording.off();
        }

        // mic ON / OFF
        if (this.service_mic.isMic === true && !this.service_mic.stream && this.service_mic.isUserMedia === false) {
            this.service_mic.on();
        } else if (this.service_mic.isMic === false && this.service_mic.stream) {
            this.service_mic.off();
        }

        // Destination
        if (this.service_mic.isDestination === true && this.service_mic.stream) {
            this.service_mic.destinationConnect();
        } else if (this.service_mic.isDestination === false && this.service_mic.stream) {
            this.service_mic.destinationDisconnect();
        }
    }

    public clickMic() {
        this.service_mic.isMic = !this.service_mic.isMic;
    }

    public clickDestination() {
        this.service_mic.isDestination = !this.service_mic.isDestination;
    }

    public clickLooper() {
        if (this.service_mic.isMic === true && this.service_recording.recording) {
            this.service_recording.stop = true;
        } else if (this.service_mic.isMic === true) {
            this.service_recording.start = true;
        }
    }

    public stopSound() {
        this.service_play.stopSound();
        this.service_play.resetSoundParam();
    }
}
