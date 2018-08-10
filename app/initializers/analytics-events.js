/* eslint-disable */
import config from 'nilavu/config/environment';

/* A singleton Countly preconfigured with standard push events.
This is responsible  for sending events for studying the usage behaviour of users.
The events are segmented by labels. We'll have to decide the segmentation.*/
export function initialize(application) {
  // Make this intialized from the ui.toml file as follows.
  //
  // Indicates if analytics is enabled or not.
  // send_analytics = true
  //
  // The countly app key. Refer admin guide for more details.
  // countly_app_key = true
  //
  // The countly server to send analytic data to
  // countly_server = http://countly.rioos.xyz

  Countly.init({
    app_key: config.APP.appKey,
    url:     config.APP.countlyServer,
    debug:   config.APP.sendAnalytics
  });

  console.log(`[»] ✔ Countly ${  config.APP.appKey  },${  config.APP.countlyServer }`);

  Countly.q.push(['track_sessions']);
  Countly.q.push(['track_pageview']);
  Countly.q.push(['track_clicks']);
  Countly.q.push(['track_errors']);
  Countly.q.push(['track_links']);
}

export default {
  name:       'analytics-events',
  initialize
};
