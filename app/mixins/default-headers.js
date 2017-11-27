import Ember from 'ember';

export default Ember.Mixin.create({
  session: Ember.inject.service(),

  opts(url = '') {
    var session = this.get('session');
    let rioos_headers = {
      headers: {
        'X-AUTH-RIOOS-EMAIL': session.get("email"),
        'Authorization': 'Bearer ' + session.get("token"),
      },
      url: url,
      forceReload: true,
      removeAfterDelete: true
    };
    return rioos_headers;
  },

});
