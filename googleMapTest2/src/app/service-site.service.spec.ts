import { TestBed, inject } from '@angular/core/testing';

import { ServiceSiteService } from './service-site.service';

describe('ServiceSiteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServiceSiteService]
    });
  });

  it('should ...', inject([ServiceSiteService], (service: ServiceSiteService) => {
    expect(service).toBeTruthy();
  }));
});
