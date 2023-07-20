import { init, track, trackPages } from 'insights-js'

!__DEVELOPMENT__ && !localStorage.NO_STATS && init(__INSIGHTS_ID__);
const { stop } = trackPages({
  search: true,
});

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
