import { TestBed, inject } from '@angular/core/testing';

import { DrawingOnSvgService } from './drawing-on-svg.service';

describe('DrawingOnSvgService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DrawingOnSvgService]
    });
  });

  it('should ...', inject([DrawingOnSvgService], (service: DrawingOnSvgService) => {
    expect(service).toBeTruthy();
  }));
});
