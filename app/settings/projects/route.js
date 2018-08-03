import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    var userStore = this.get('userStore');

    return Ember.RSVP.hash({
      projects: userStore.find('project', null, {
        url:           'projects',
        filter:        { all: 'true' },
        forceReload:   true,
        removeMissing: true
      }),
    }).then(() => {
      return {
        projects: userStore.find('project', null, {
          url:           'projects',
          filter:        { all: 'true' },
          forceReload:   true,
          removeMissing: true
        }),
      };
    });
  },
});
