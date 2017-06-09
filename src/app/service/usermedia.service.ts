import {Injectable} from '@angular/core';

@Injectable()
export class UsermediaService {
    private _user_media: any = false;

    constructor() {
    }

    get user_media(): any {
        return this._user_media;
    }

    set user_media(value: any) {
        this._user_media = value;
    }
}
