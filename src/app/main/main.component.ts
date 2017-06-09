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
  public mediaRecorder: any;

  constructor(private service_recording: RecordingService,
              private service_user_media: UsermediaService) {
  }

  ngOnInit() {
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
          }

          console.log(this.play, this.beat, this.time);
        });
  }

  ngAfterViewInit() {
    navigator.mediaDevices.getUserMedia({audio: true, video: false}).then(this.handleSuccess);

  }

  /**
   * 変更チェックをngDoCheckで行なう。
   * AngularJS/Vueで言うところのwatch
   */
  ngDoCheck() {
    if (this.service_recording.recording) {
      if (this.service_user_media.user_media) {


      }
    }


  }

  private handleSuccess (stream): void {
    console.log("get user media success!");

    /*
     this.mediaRecorder = new MediaRecorder(stream, {mimeType: 'audio/webm'});
     this.mediaRecorder.ondataavailable = (event: any) => {
     if (event.data.size > 0) this.recordedChunks.push(event.data);
     };
     */

    this.service_recording.stream = stream;
    this.service_user_media.user_media = true;
  }
}
