import { alias } from '@ember/object/computed';
import Component from '@ember/component';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import ObjectMetaBuilder from 'nilavu/models/object-meta-builder';
import C from 'nilavu/utils/constants';
import D from 'nilavu/utils/default';
import NewOrEdit from 'nilavu/mixins/new-or-edit';
import { denormalizeName } from 'nilavu/utils/denormalize';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import {  get, set, computed} from '@ember/object';


export default Component.extend(DefaultHeaders,NewOrEdit,{
  intl:                    service(),
  session:                 service(),
  notifications:           service('notification-messages'),
  showDomainEditBox:       true,
  activate:                false,
  showSpinner:             false,
  stacksfactoryObjectMeta: alias('stacksfactory.object_meta'),
  secretObjectMeta:        alias('secret.object_meta'),
  model:        alias('secret'),


  bitsInKey: computed('settings', function() {
    return get(this, 'settings')[denormalizeName(`${ C.SETTING.SECRET_KEY_LENGTH }`)] || D.VPS.bitsInKey;
  }),

  secretTypes: computed('settings', function() {
    let secret = [];

    this.validateSecretTypes().split(',').map((chr) => {
      secret.push(chr);
    });

    return secret;
  }),

  actions: {
    getSecretType(type) {
      set(this, 'secretType', type);
      this.toggleProperty('activate');
    },

    createSecret() {
      if (!this.checkDomain()) {
        set(this, 'showSpinner', true);
        set(this, 'secret.secret_type', get(this, 'secretType'));
        set(this, 'secret.data.ssh_keypair_size', get(this, 'bitsInKey'));
        set(this, 'secretObjectMeta', ObjectMetaBuilder.buildObjectMeta());
        set(this, 'secretObjectMeta.name', get(this, 'stacksfactoryObjectMeta.name'));

        var id = get(this, 'session').get('id');

        set(this, 'secretObjectMeta.account', id);
        var url = 'secrets';

        this.send('save', (success) =>  {
          set(this, 'doneCreate', true);
          set(this, 'stacksfactory.secret.id', result.id);
          set(this, 'showSpinner', true);
          set(this, 'saving', false);
          set(this, 'saved', ( success === true ));
          if (get(this, 'saved')){
            set(this, 'showSpinner', false);
          }
        });
      } else {
        set(this, 'showSpinner', false);
        get(this, 'notifications').warning(get(this, 'errorMsg'), {
          autoClear:     true,
          clearDuration: 4200,
          cssClasses:    'notification-warning'
        });
      }
    },
  },

  validateSecretTypes() {
    return get(this, 'settings')[denormalizeName(`${ C.SETTING.SECRET_TYPE_NAMES }`)] || D.VPS.secretTypes;
  },



  checkDomain() {
  let checkDomain =  isEmpty(get(this, 'stacksfactoryObjectMeta.name'));
  if (checkDomain) {
    set(this, 'errorMsg', get(this, 'intl').t('launcherPage.domain.keyGenerate.emptyDomain'));
  }

  return checkDomain;
  },


});
