import {TestBed, inject} from '@angular/core/testing';

import {UsermediaService} from './usermedia.service';

describe('UsermediaService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [UsermediaService]
        });
    });

    it('should be created', inject([UsermediaService], (service: UsermediaService) => {
        expect(service).toBeTruthy();
    }));
});
