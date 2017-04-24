import { GoogleMapTestPage } from './app.po';

describe('google-map-test App', () => {
  let page: GoogleMapTestPage;

  beforeEach(() => {
    page = new GoogleMapTestPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
