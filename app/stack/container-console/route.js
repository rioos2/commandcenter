import Route from '@ember/routing/route';

export default Route.extend({

  model(params) {
    return {
      host:  params.vnchost,
      accid: params.account_id,
      id:    params.id
    }
  },
});
