import Ember from 'ember';
import Resource from 'ember-api-store/models/resource';
import Errors from 'nilavu/utils/errors';

export default Ember.Mixin.create({
  originalModel: null,
  errors: null,
  saving: false,
  editing: true,
  primaryResource: Ember.computed.alias('model'),
  originalPrimaryResource: Ember.computed.alias('originalModel'),
  userStore: Ember.inject.service('user-store'),
  access: Ember.inject.service(),

  initFields: function() {
    this._super();
    this.set('errors', null);
    this.set('saving', false);
  },

  didReceiveAttrs: function() {
    this._super();
    this.set('errors', null);
    this.set('saving', false);
  },

  validate: function() {
    return true;
  },

  generateUrl: function(object) {
    var name = this.get('access').namespaceName();
    var kind = object.kind;
    var url = "";
    if (kind.toLowerCase() === "deploymentconfig") {
      url = "/oapi/v1/namespaces/" + name + "/" + kind.toLowerCase() + 's';
    } else {
      url = "namespaces/" + name + "/" + kind.toLowerCase() + 's';
    }
    return url;
  },

  actions: {
    error: function(err) {
      if (err) {
        var body = Errors.stringify(err);
        this.set('errors', [body]);
      } else {
        this.set('errors', null);
      }
    },

    save: function(cb) {
      // Will save can return true/false or a promise
      Ember.RSVP.resolve(this.willSave()).then((ok) => {
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
          }).finally(() => {
            try {
              this.set('saving', false);

              if (cb) {
                cb();
              }
            } catch (e) {}
          });
      });
    }
  },

  // willSave happens before save and can stop the save from happening
  willSave: function() {
    this.set('errors', null);
    var ok = this.validate();
    if (!ok) {
      // Validation failed
      return false;
    }

    if (this.get('saving')) {
      // Already saving
      return false;
    }

    this.set('saving', true);
    return true;
  },

  doSave: function(opt) {
    const self = this;
    return this.get('primaryResource').save(opt).then((newData) => {
      if (newData.objects && newData.type === "Template") {
        let objects = newData.objects;
        async.eachSeries(objects, function(object, cb) {
          return self.get('userStore').rawRequest({
            url: self.generateUrl(object),
            method: 'POST',
            data: {
              kind: object.kind,
              apiVersion: object.apiVersion,
              metadata: object.metadata,
              spec: object.spec,
              selector: object.selector,
              status: object.status
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

  mergeResult: function(newData) {
    var original = this.get('originalPrimaryResource');
    if (original) {
      if (Resource.detectInstance(original)) {
        original.merge(newData);
        return original;
      }
    }

    return newData;
  },

  // didSave can be used to do additional saving of dependent resources
  didSave: function(neu) {
    return neu;
  },

  // doneSaving happens after didSave
  doneSaving: function(neu) {
    return neu || this.get('originalPrimaryResource') || this.get('primaryResource');
  },

  // errorSaving can be used to do additional cleanup of dependent resources on failure
  errorSaving: function( /*err*/ ) {},
});
