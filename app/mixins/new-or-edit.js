import Resource from  'ember-api-store/models/resource';
import Errors from 'nilavu/utils/errors';
import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';
import { alias } from '@ember/object/computed';
import { resolve } from 'rsvp';
import { get, set } from '@ember/object';

export default Mixin.create({
  originalModel:           null,
  errors:                  null,
  saving:                  false,
  editing:                 true,
  primaryResource:         alias('model'),
  originalPrimaryResource: alias('originalModel'),
  userStore:               service('user-store'),
  access:                  service(),

  initFields() {
    this._super();
    set(this, 'errors', null);
    set(this, 'saving', false);
  },

  didReceiveAttrs() {
    this._super();
    set(this, 'errors', null);
    set(this, 'saving', false);
  },

  validate() {
    var model = get(this, 'primaryResource');
    var errors = model.validationErrors();

    if ( errors ) {
      set(this, 'errors', errors);
      set(this, 'primaryResource.error', errors);

      return false;
    }

    set(this, 'errors', null);

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

        set(this, 'errors', [body]);
      } else {
        set(this, 'errors', null);
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
          // return;
        }

        this.doSave()
          .then(this.didSave.bind(this))
          .then(this.doneSaving.bind(this))
          .catch((err) => {
            this.send('error', err);
            this.errorSaving(err);
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
    set(this, 'errors', null);
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
    const self = this;

    return get(this, 'primaryResource').save(opt).then((newData) => {
      if (newData.objects && newData.type === 'Template') {
        let objects = newData.objects;

        async.eachSeries(objects, (object, cb) => {
          return self.get('userStore').rawRequest({
            url:    self.generateUrl(object),
            method: 'POST',
            data:   {
              kind:       object.kind,
              apiVersion: object.apiVersion,
              metadata:   object.metadata,
              spec:       object.spec,
              selector:   object.selector,
              status:     object.status
            },
          }).then(() => {
            return cb();
          }).catch((err) => {
            cb(err);
          });
        });
      }

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

  // errorSaving can be used to do additional cleanup of dependent resources on failure
  errorSaving( /* err*/ ) {},
});
