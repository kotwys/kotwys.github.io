import { init, track, trackPages } from 'insights-js'

!__DEVELOPMENT__ && init(__INSIGHTS_ID__);
const { stop } = trackPages();

let readTimes = 0;
const articleRead = () => readTimes++ == 0 && track({
  id: 'article-read',
  parameters: {
    url: location.href,
  }
});

export {
  articleRead,
  stop,
  track,
};