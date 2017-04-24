import { TestBed, inject } from '@angular/core/testing';

import { GMapServiceService } from './gmap-service.service';

describe('GMapServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GMapServiceService]
    });
  });

  it('should ...', inject([GMapServiceService], (service: GMapServiceService) => {
    expect(service).toBeTruthy();
  }));
});
