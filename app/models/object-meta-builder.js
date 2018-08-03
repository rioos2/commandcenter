import Haikunator from 'npm:haikunator';
import C from 'nilavu/utils/constants';
import D from 'nilavu/utils/default';
import { denormalizeName } from 'nilavu/utils/denormalize';
const ObjectMetaBuilder = Ember.Object.extend({});

ObjectMetaBuilder.reopenClass({

  randomName() {
    return new Haikunator({ defaults: { delimiter: '-', }, });
  },

  buildObjectMeta(setting = {}) {
    var objectMeta;

    objectMeta = {
      name:         ((this.randomName().haikunate()) + (setting[denormalizeName(`${ C.SETTING.DOMAIN }`)] || D.VPS.domain)).replace(/\s/g, ''),
      uid:          ' ',
      created_at:   '',
      cluster_name: '',
      labels:       {
        rioos_category:    setting.cloudType,
        rioos_environment: 'development'
      },
      annotations: {
        key1: 'value1',
        key2: 'value2'
      },
      owner_references: [{
        kind:                 '',
        api_version:          '',
        name:                 '',
        uid:                  '',
        block_owner_deletion: true
      }],
      account:                       '',
      deleted_at:                    '',
      deletion_grace_period_seconds: 0,
      finalizers:                    []
    };

    return objectMeta;
  },

});
export default ObjectMetaBuilder;
