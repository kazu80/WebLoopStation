import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/scan';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit {
  play = false;
  rec = false;
  time = 0;
  beat: number;


  constructor() { }

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

          if (value[1] % 4 === 0) { this.time++ }

          console.log(this.play, this.beat, this.time);
        });


    /*
    const stream = new Observable(observer => {
      let count = 0;
      const interval = setInterval(() => {
        observer.next(count++);
      }, 1000);

      return () => {
        clearInterval(interval);
      }
    });
    */

    // stream.filter((value: number) => value % 2 === 0).subscribe(value => console.log(value));
    // stream.map((value: number) => value * value).subscribe(value => console.log(value));
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

  public onClickIncrements() {

  }

  onClickDecrements() {

  }
}
