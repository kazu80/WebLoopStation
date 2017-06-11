import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import {RecordingService} from "./service/recording.service";
import {UsermediaService} from "./service/usermedia.service";
import {PlayService} from "./service/play.service";

@NgModule({
  declarations: [
    AppComponent,
    MainComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    RecordingService,
    UsermediaService,
    PlayService
  ],
  bootstrap: [MainComponent]
})
export class AppModule { }
