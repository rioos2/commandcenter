import Route from '@ember/routing/route';

import DefaultHeaders from 'nilavu/mixins/default-headers';

export default Route.extend(DefaultHeaders, {
  resetController(controller, isExiting) {
    if (isExiting) {
      this.transitionTo({
        queryParams: {
          os:       '',
          location: '',
          db:       '',
          status:   '',
          network:  '',
          search:   ''
        }
      });
    }
  },
});
