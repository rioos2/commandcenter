import Route from '@ember/routing/route';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import { hash } from 'rsvp';

export default Route.extend(DefaultHeaders, {
  currentOrigin: null,
  model(params) {
    return {
      'id':          '1045474111066767360',
      'name':        '',
      'description': 'test',
      'type_meta':   {
        'kind':        'Team',
        'api_version': 'v1'
      },
      'member': [{
        'id':          '1234',
        'invite_from': '',
        'invite_to':   'test1@gmail.com',
        'team_id':     '',
        'origin_id':   '',
        'created_at':  '',
        'updated_at':  '',
      },
      {
        'id':          '1235',
        'invite_from': '',
        'invite_to':   'test2@gmail.com',
        'team_id':     '',
        'origin_id':   '',
        'created_at':  '',
        'updated_at':  '',
      }
      ],
      'object_meta': {
        'name':                          'test',
        'account':                       '1045345563744149504',
        'created_at':                    '2018-08-10T10:20:17.000298009+00:00',
        'deleted_at':                    '',
        'deletion_grace_period_seconds': 30,
        'labels':                        {},
        'annotations':                   {},
        'owner_references':              [],
        'initializers':                  {
          'pending': [],
          'result':  {
            'type_meta': {
              'kind':        '',
              'api_version': ''
            },
            'status':  '',
            'message': '',
            'reason':  '',
            'details': {
              'name':                '',
              'group':               '',
              'kind':                '',
              'causes':              [],
              'uid':                 '',
              'retry_after_seconds': 0
            },
            'code': 0
          }
        },
        'finalizers':   ['orphan'],
        'cluster_name': ''
      },
      'metadata':   {},
      'created_at': ''
    };
  },

  setupController(controller) {
    controller.set('currentOrigin', this.get('currentOrigin'));
    this._super(...arguments);
  }
});
