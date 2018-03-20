import Ember from 'ember';

export default Ember.Mixin.create({
  session: Ember.inject.service(),

  opts(url = '', forceReload = false) {
    var session = this.get('session');
    let rioos_headers = {
      headers: {
        'X-AUTH-RIOOS-EMAIL': session.get("email"),
        'Authorization': 'Bearer ' + session.get("token"),
      },
      url: url,
      forceReload: forceReload,
      filter: false,
      removeAfterDelete: true,
      isForAll: true,
    };
    return rioos_headers;
  },

  rawRequestOpts(frame) {
    var session = this.get('session');
    let rioos_headers = {
      headers: {
        'X-AUTH-RIOOS-EMAIL': session.get("email"),
        'Authorization': 'Bearer ' + session.get("token"),
      },
      url: frame.url,
      data: frame.data,
      method: frame.method
    };
    return rioos_headers;
  },

});
