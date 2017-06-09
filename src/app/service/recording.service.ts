import {Injectable} from '@angular/core';

@Injectable()
export class RecordingService {
  private _recording: any = false;
    private _stream: any;

  constructor() { }

  get recording(): boolean {
    return this._recording;
  }

  set recording(value: boolean) {
    this._recording = value;
  }

    get stream(): any {
        return this._stream;
    }

    set stream(value: any) {
        this._stream = value;
    }

}
