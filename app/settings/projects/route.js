import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend({
  model() {
    var userStore = this.get('userStore');

    return hash({
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
