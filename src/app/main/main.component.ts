import {AfterViewInit, Component, DoCheck, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/scan';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import {RecordingService} from "../service/recording.service";

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

  constructor(private service: RecordingService) { }

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
            this.service.recording = !this.service.recording;
          }

          console.log(this.play, this.beat, this.time);
        });
  }

  ngAfterViewInit() {
    const counter: HTMLElement = document.getElementById('counter');
    const incrementBtn: HTMLElement = document.getElementById("increments");
    const decrementBtn: HTMLElement = document.getElementById("decrements");

    const incrementClick = Observable.fromEvent(incrementBtn, 'click');
    const decrementClick = Observable.fromEvent(decrementBtn, 'click');

    const clicks = Observable
        .merge(incrementClick, decrementClick)
        .map((event: any) => parseInt(event.target.value, 10));

    const total = clicks
        .scan((total, value) => total + value, 0);

    total.subscribe(total => {
      counter.innerText = total.toString();
    });


    // ------i-------------------------------->
    // -----------------------d-------d------->
    //             merge
    // ------i----------------d-------d------->
    //             map
    // ------p----------------n-------n------->
    //             scan
    // 0-----1----------------0-----(-1)------>

  }

  /**
   * 変更チェックをngDoCheckで行なう。
   * AngularJS/Vueで言うところのwatch
   */
  ngDoCheck() {
    if (this.service.recording) {
      console.log("recording!!");
    }
  }
}
