import { WebLoopStationPage } from './app.po';

describe('web-loop-station App', () => {
  let page: WebLoopStationPage;

  beforeEach(() => {
    page = new WebLoopStationPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
