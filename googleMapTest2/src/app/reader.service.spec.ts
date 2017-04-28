import { TestBed, inject } from '@angular/core/testing';

import { ReaderService } from './reader.service';

describe('ReaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReaderService]
    });
  });

  it('should ...', inject([ReaderService], (service: ReaderService) => {
    expect(service).toBeTruthy();
  }));
});
