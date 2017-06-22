import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MainComponent } from './main/main.component';
import {RecordingService} from "./service/recording.service";
import {UsermediaService} from "./service/usermedia.service";
import {PlayService} from "./service/play.service";
import {MicService} from "./service/mic.service";

@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    RecordingService,
    UsermediaService,
    PlayService,
    MicService
  ],
  bootstrap: [MainComponent]
})
export class AppModule { }
