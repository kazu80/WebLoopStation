import {Injectable} from '@angular/core';

@Injectable()
export class RecordingService {
  private _recording: any = false;

  constructor() { }

  get recording(): boolean {
    return this._recording;
  }

  set recording(value: boolean) {
    this._recording = value;
  }


}
