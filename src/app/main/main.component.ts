import {AfterViewInit, Component, DoCheck, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/scan';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import {RecordingService} from "../service/recording.service";
import {UsermediaService} from "../service/usermedia.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit, DoCheck {
  public play = false;
  public rec = false;
  public time = 0;
  public beat: number;
  mediaRecorder: any;
  public recordedChunks: any[] = [];

  constructor(private service_recording: RecordingService,
              private service_user_media: UsermediaService) {
  }

  ngOnInit() {

  }

  ngAfterViewInit() {

    // Get User Media
    navigator.mediaDevices.getUserMedia({audio: true, video: false}).then(stream => {
      this.mediaRecorder = new MediaRecorder(stream, {mimeType: 'audio/webm'});
      this.mediaRecorder.ondataavailable = (event: any) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data)
        }
      };

      this.service_recording.stream = stream;
      this.service_user_media.user_media = true;
    });
  }

  /**
   * 変更チェックをngDoCheckで行なう。
   * AngularJS/Vueで言うところのwatch
   */
  ngDoCheck() {
    if (this.service_user_media.user_media) {

      if (!this.service_recording.recording && this.service_recording.start) {
        this.mediaRecorder.start();
        this.service_recording.start = false;
      } else if (this.service_recording.recording && this.service_recording.stop) {
        this.mediaRecorder.stop();
        this.service_recording.stop = false;

        const superBuffer: Blob = new Blob(this.recordedChunks);
        const recordingSoundUrl: string = window.URL.createObjectURL(superBuffer);
        console.log(recordingSoundUrl);
      }
    }
  }

  public click(): void {
    const stream = new Observable(observer => {
      let beat = 0;
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
  }
}
