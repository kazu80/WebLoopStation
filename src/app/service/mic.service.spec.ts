import {TestBed, inject} from '@angular/core/testing';

import {MicService} from './mic.service';

describe('MicService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MicService]
        });
    });

    it('should be created', inject([MicService], (service: MicService) => {
        expect(service).toBeTruthy();
    }));
});
