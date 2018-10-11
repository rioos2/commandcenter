import Resource from  'ember-api-store/models/resource';
import Errors from 'nilavu/utils/errors';
import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';
import { alias } from '@ember/object/computed';
import { resolve } from 'rsvp';
import { get, set } from '@ember/object';

import DefaultHeaders from 'nilavu/mixins/default-headers';

export default Mixin.create(DefaultHeaders, {
  originalModel:           null,
  saving:                  false,
  editing:                 true,
  primaryResource:         alias('model'),
  originalPrimaryResource: alias('originalModel'),
  userStore:               service('user-store'),
  access:                  service(),
  intl:                    service(),

  initFields() {
    this._super();
    set(this, 'saving', false);
  },

  didReceiveAttrs() {
    this._super();
    set(this, 'saving', false);
  },

  validate() {
    var model = get(this, 'primaryResource');
    var errors = model.validationErrors();

    if ( errors ) {
      set(this, 'primaryResource.error', errors);

      return false;
    }
    set(this, 'primaryResource.error', '');


    return true;
  },

  generateUrl(object) {
    var name = get(this, 'access').namespaceName();
    var kind = object.kind;
    var url = '';

    if (kind.toLowerCase() === 'deploymentconfig') {
      url = `/oapi/v1/namespaces/${  name  }/${  kind.toLowerCase()  }s`;
    } else {
      url = `namespaces/${  name  }/${  kind.toLowerCase()  }s`;
    }

    return url;
  },

  actions: {
    error(err) {
      if (err) {
        var body = Errors.stringify(err);

        set(this, 'primaryResource.error', [body]);
      } else {
        set(this, 'primaryResource.error', '');
      }
    },

    save(cb) {

      // Will save can return true/false or a promise
      resolve(this.willSave()).then((ok) => {
        if (!ok) {
          // Validation or something else said not to save
          if (cb) {
            cb();
          }

          return;
        }

        this.doSave()
          .then(this.didSave.bind(this))
          .then(this.doneSaving.bind(this))
          .catch((err) => {
            this.send('error', err);
          })
          .finally(() => {
            try {
              set(this, 'saving', false);

              if (cb) {
                cb();
              }
            } catch (e) {}
          });
      });
    }
  },

  // willSave happens before save and can stop the save from happening
  willSave() {
    set(this, 'primaryResource.error', '');
    var ok = this.validate();

    if (!ok) {
      // Validation failed
      return false;
    }

    if (get(this, 'saving')) {
      // Already saving
      return false;
    }

    set(this, 'saving', true);

    return true;
  },

  doSave(opt) {
    var session = this.get('session');

    opt = {
      headers: {
        'X-AUTH-RIOOS-EMAIL': session.get('email'),
        'Authorization':      `Bearer ${  this.encodedHeaderFromTabSession() }`,
      },
    }

    return get(this, 'primaryResource').save(opt).then((newData) => {
      return this.mergeResult(newData);
    });
  },

  mergeResult(newData) {
    var original = get(this, 'originalPrimaryResource');

    if (original) {
      if (Resource.detectInstance(original)) {
        original.merge(newData);

        return original;
      }
    }

    return newData;
  },

  // didSave can be used to do additional saving of dependent resources
  didSave(neu) {
    return neu;
  },

  // doneSaving happens after didSave
  doneSaving(neu) {
    return neu || get(this, 'originalPrimaryResource') || get(this, 'primaryResource');
  },

});
