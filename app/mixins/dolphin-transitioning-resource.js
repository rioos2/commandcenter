import C from 'nilavu/utils/constants';
import Util from 'nilavu/utils/util';
import Ember from 'ember';
import Resource from 'ember-api-store/models/resource';
import { normalizeType } from '../utils/normalize';

const defaultStateMap = {
  'activating':              {
    icon:  'icon icon-tag',
    color: 'text-info'
  },
  'active':                  {
    icon:  'icon icon-circle-o',
    color: 'text-success'
  },
  'backedup':                {
    icon:  'icon icon-backup',
    color: 'text-success'
  },
  'created':                 {
    icon:  'icon icon-tag',
    color: 'text-info'
  },
  'creating':                {
    icon:  'icon icon-tag',
    color: 'text-info'
  },
  'deactivating':            {
    icon:  'icon icon-adjust',
    color: 'text-info'
  },
  'degraded':                {
    icon:  'icon icon-alert',
    color: 'text-warning'
  },
  'disconnected':            {
    icon:  'icon icon-alert',
    color: 'text-warning'
  },
  'error':                   {
    icon:  'icon icon-alert',
    color: 'text-danger'
  },
  'inactive':                {
    icon:  'icon icon-circle',
    color: 'text-danger'
  },
  'initializing':            {
    icon:  'icon icon-alert',
    color: 'text-warning'
  },
  'purged':                  {
    icon:  'icon icon-purged',
    color: 'text-danger'
  },
  'purging':                 {
    icon:  'icon icon-purged',
    color: 'text-info'
  },
  'removed':                 {
    icon:  'icon icon-trash',
    color: 'text-danger'
  },
  'removing':                {
    icon:  'icon icon-trash',
    color: 'text-info'
  },
  'requested':               {
    icon:  'icon icon-tag',
    color: 'text-info'
  },
  'registering':             {
    icon:  'icon icon-tag',
    color: 'text-info'
  },
  'reinitializing':          {
    icon:  'icon icon-alert',
    color: 'text-warning'
  },
  'restoring':               {
    icon:  'icon icon-medicalcross',
    color: 'text-info'
  },
  'running':                 {
    icon:  'icon icon-circle-o',
    color: 'text-success'
  },
  'snapshotted':             {
    icon:  'icon icon-snapshot',
    color: 'text-warning'
  },
  'started-once':            {
    icon:  'icon icon-dot-circlefill',
    color: 'text-success'
  },
  'starting':                {
    icon:  'icon icon-adjust',
    color: 'text-info'
  },
  'stopped':                 {
    icon:  'icon icon-circle',
    color: 'text-danger'
  },
  'stopping':                {
    icon:  'icon icon-adjust',
    color: 'text-info'
  },
  'unhealthy':               {
    icon:  'icon icon-alert',
    color: 'text-danger'
  },
  'updating':                {
    icon:  'icon icon-tag',
    color: 'text-info'
  },
  'updating-active':         {
    icon:  'icon icon-tag',
    color: 'text-info'
  },
  'updating-healthy':        {
    icon:  'icon icon-tag',
    color: 'text-info'
  },
  'updating-unhealthy':      {
    icon:  'icon icon-tag',
    color: 'text-info'
  },
  'updating-reinitializing': {
    icon:  'icon icon-alert',
    color: 'text-info'
  },
  'updating-inactive':       {
    icon:  'icon icon-tag',
    color: 'text-info'
  },
  'waiting':                 {
    icon:  'icon icon-tag',
    color: 'text-info'
  },
  'delete':                  {
    icon:  'icon icon-tag',
    color: 'text-info'
  },
  'console':                 {
    icon:  'icon icon-tag',
    color: 'text-info'
  },
};
const stateColorSortMap = {
  'danger':  1,
  'warning': 2,
  'info':    3,
  'success': 4
};
const stateColorUnknown = 5;

export default Ember.Mixin.create({
  endpointSvc: Ember.inject.service('endpoint'), // Some machine drivers have a property called 'endpoint'
  cookies:     Ember.inject.service(),
  // growl: Ember.inject.service(),
  // intl: Ember.inject.service(),

  // modalService: Ember.inject.service('modal'),
  reservedKeys: ['waitInterval', 'waitTimeout'],

  state:                 null,
  transitioning:         null,
  transitioningMessage:  null,
  transitioningProgress: null,

  availableActions: function() {
    /*
      Override me and return [
        {
          enabled: true/false,    // Whether it's enabled or greyed out
          detail: true/false,     // If true, this action will only be shown on detailed screens
          label: 'Delete',        // Label shown on hover or in menu
          icon: 'icon icon-trash',// Icon shown on screen
          action: 'promptDelete', // Action to call on the controller when clicked
          altAction: 'delete'     // Action to call on the controller when alt+clicked
          divider: true,          // Just this will make a divider
        },
        ...
      ]
    */
    return [];
  }.property(),

  translatedAvailableActions: Ember.computed('availableActions', 'intl._locale', function() {
    // use this if you need to pass translated actions to addons
    var availableActions = this.get('availableActions');

    if (availableActions) {
      availableActions.forEach((action) => {
        action.translatedLabel = this.get('intl').findTranslationByKey(action.label);
      });
    }

    return availableActions;
  }),

  primaryAction: function() {
    // The default implementation returns the first enabled item that has an icon
    // and is before the first divider.  If you want a different behavior or
    // multiple primaryActions, you can override this in a specific model.
    var all = this.get('availableActions');
    var obj;
    var seenAnAction = false;

    for (var i = 0; i < all.get('length'); i++) {
      obj = all.objectAt(i);
      if (Ember.get(obj, 'divider')) {
        // Nothing was found, stop at the first divider;
        if (seenAnAction) {
          return null;
        }
      } else if (Ember.get(obj, 'enabled')) {
        seenAnAction = true;
        if (Ember.get(obj, 'icon') && Ember.get(obj, 'action') !== 'promptDelete') {
          return obj;
        }
      }
    }

    return null;
  }.property('availableActions.@each.enabled', 'model.availableActions.@each.class'),

  actions: {
    // promptDelete: function() {
    //   this.get('modalService').toggleModal('confirm-delete', [this]);
    // },

    delete() {
      return this.delete();
    },

    restore() {
      return this.doAction('restore');
    },

    purge() {
      return this.doAction('purge');
    },

    goToApi() {
      let url      = this.get('links.self'); // http://a.b.c.d/v1/things/id, a.b.c.d is where the UI is running
      let endpoint = this.get('endpointSvc.absolute'); // http://e.f.g.h/ , does not include version.  e.f.g.h is where the API actually is.

      url          = url.replace(/https?:\/\/[^\/]+\/?/, endpoint);

      // For local development where API doesn't match origin, add basic auth token
      if (url.indexOf(window.location.origin) !== 0) {
        let token = this.get('cookies').get(C.COOKIE.TOKEN);

        if (token) {
          url = Util.addAuthorization(url, C.USER.BASIC_BEARER, token);
        }
      }

      window.open(url, '_blank');
    },
  },

  displayName: function() {
    return this.get('name') || `(${  this.get('id')  })`;
  }.property('name', 'id'),

  isTransitioning: Ember.computed.equal('transitioning', 'yes'),
  isError:         Ember.computed.equal('transitioning', 'error'),
  isRemoved:       Ember.computed('state', () => {
    return !C.MANAGEMENT.STATUS.TERMINATE.includes(this.state);
  }),
  isPurged:        Ember.computed.equal('state', 'purged'),
  isActive:        Ember.computed.equal('state', 'active'),

  relevantState: function() {
    return this.get('combinedState') || this.get('state');
  }.property('combinedState', 'state'),

  displayState: function() {
    var state = this.get('relevantState') || '';

    return state.split(/-/).map((word) => {
      return Util.ucFirst(word);
    }).join('-');
  }.property('relevantState'),

  showTransitioningMessage: function() {
    var trans = this.get('transitioning');

    return (trans === 'yes' || trans === 'error') && (this.get('transitioningMessage') || '').length > 0;
  }.property('transitioning', 'transitioningMessage'),

  stateIcon: function() {
    var trans = this.get('transitioning');
    var icon = '';

    if (trans === 'yes') {
      icon = 'icon icon-spinner icon-spin';
    } else if (trans === 'error') {
      icon = 'icon icon-alert';
    } else {
      var map = this.constructor.stateMap;
      var key = (this.get('relevantState') || '').toLowerCase();

      if (map && map[key] && map[key].icon !== undefined) {
        if (typeof map[key].icon === 'function') {
          icon = map[key].icon(this);
        } else {
          icon = map[key].icon;
        }
      }

      if (!icon && defaultStateMap[key] && defaultStateMap[key].icon) {
        icon = defaultStateMap[key].icon;
      }

      if (!icon) {
        icon = this.constructor.defaultStateIcon;
      }

      if (icon.indexOf('icon ') === -1) {
        icon = `icon ${  icon }`;
      }
    }

    return icon;
  }.property('relevantState', 'transitioning'),

  stateColor: function() {
    if (this.get('isError')) {
      return 'text-danger';
    }

    var map = this.constructor.stateMap;
    var key = (this.get('relevantState') || '').toLowerCase();

    if (map && map[key] && map[key].color !== undefined) {
      if (typeof map[key].color === 'function') {
        return map[key].color(this);
      } else {
        return map[key].color;
      }
    }

    if (defaultStateMap[key] && defaultStateMap[key].color) {
      return defaultStateMap[key].color;
    }

    return this.constructor.defaultStateColor;
  }.property('relevantState', 'isError'),

  stateSort: function() {
    var color = this.get('stateColor').replace('text-', '');

    return `${ stateColorSortMap[color] || stateColorUnknown  } ${  this.get('relevantState') }`;
  }.property('stateColor', 'relevantState'),

  stateBackground: function() {
    return this.get('stateColor').replace('text-', 'bg-');
  }.property('stateColor'),

  trimValues(depth, seenObjs) {
    if (!depth) {
      depth = 0;
    }

    if (!seenObjs) {
      seenObjs = [];
    }
    this.eachKeys((val, key) => {
      Ember.set(this, key, recurse(val, depth));
    }, false);

    return this;

    function recurse(val, depth) {
      if (depth > 10) {
        console.log(`---${  val }`);

        return val;
      } else if (typeof val === 'string') {
        return val.trim();
      } else if (Ember.isArray(val)) {
        val.beginPropertyChanges();
        val.forEach((v, idx) => {
          var out = recurse(v, depth + 1);

          if (val.objectAt(idx) !== out) {
            val.replace(idx, 1, out);
          }
        });
        val.endPropertyChanges();

        return val;
      } else if (Resource.detectInstance(val)) {
        // Don't include a resource we've already seen in the chain
        if (seenObjs.indexOf(val) > 0) {
          return null;
        }

        seenObjs.pushObject(val);

        return val.trimValues(depth + 1, seenObjs);
      } else if (val && typeof val === 'object') {
        Object.keys(val).forEach((key) => {
          // Skip keys with dots in them, like container labels
          if (key.indexOf('.') === -1) {
            Ember.set(val, key, recurse(val[key], depth + 1));
          }
        });

        return val;
      } else {
        return val;
      }
    }
  },

  validationErrors() {
    let intl = this.get('intl');

    var errors = [];
    var type = this.get('type');

    if (type) {
      type = normalizeType(this.get('type'));
    } else {
      console.warn('No type found to validate', this);

      return [];
    }

    var schema = this.get('store').getById('schema', type);

    if (!schema) {
      console.warn('No schema found to validate', type, this);

      return [];
    }

    // Trim all the values to start so that empty strings become nulls
    this.trimValues();

    var fields = schema.resourceFields;
    var keys = Object.keys(fields);
    var field, key, val;
    let displayKey, intlKey;

    for (var i = 0; i < keys.length; i++) {
      key = keys[i];
      field = fields[key];
      val = this.get(key);

      intlKey = `model.${ this.get('type') }.${ key }`;
      if (intl.exists(`${ intlKey }.label`)) {
        displayKey = intl.t(`${ intlKey }.label`);
      } else if (intl.exists(intlKey)) {
        displayKey = intl.t(intlKey);
      } else {
        displayKey = Util.camelToTitle(key);
      }

      if (val === undefined) {
        val = null;
      }

      if (field.type.indexOf('[') >= 0) {
        // array, map, reference
        // @TODO something...
      } else if (['string', 'password', 'float', 'int', 'date', 'blob', 'boolean', 'enum'].indexOf(field.type) === -1) {
        // embedded schema type
        if (val && val.validationErrors) {
          errors.pushObjects(val.validationErrors());
        }
      }

      // Coerce strings to numbers
      if (field.type === 'float' && typeof val === 'string') {
        val = parseFloat(val) || null; // NaN becomes null
        this.set(key, val);
      }

      if (field.type === 'int' && typeof val === 'string' && key !== 'id') // Sigh: ids are all marked int, rancher/rancher#515
      {
        val = parseInt(val, 10) || null;
        this.set(key, val);
      }

      // Empty strings on nullable fields -> null
      if (['string', 'password', 'float', 'int', 'date', 'blob', 'enum', 'multiline', 'masked'].indexOf(field.type) >= 0) {
        if ((typeof val === 'string' && !val) || val === null) // empty/null strings or null numbers
        {
          if (field.nullable) {
            val = null;
            this.set(key, val);
          }
        }
      }

      var len = (val ? Ember.get(val, 'length') : 0);

      if (field.required && (val === null || (typeof val === 'string' && len === 0) || (Ember.isArray(val) && len === 0))) {
        errors.push(intl.t('validation.required', { key: displayKey }));
        continue;
      }

      let min, max;
      let lengthKey = (field.type.indexOf('array[') === 0 ? 'arrayLength' : 'stringLength');

      if (val !== null) {
        // String and array length:
        min = field.minLength;
        max = field.maxLength;
        if (min && max) {
          if ((len < min) || (len > max)) {
            if (min === max) {
              errors.push(intl.t(`validation.${ lengthKey }.exactly`, {
                key:   displayKey,
                count: min
              }));
            } else {
              errors.push(intl.t(`validation.${ lengthKey }.between`, {
                key: displayKey,
                min,
                max
              }));
            }
          }
        } else if (min && (len < min)) {
          errors.push(intl.t(`validation.${ lengthKey }.min`, {
            key:   displayKey,
            count: min
          }));
        } else if (max && (len > max)) {
          errors.push(intl.t(`validation.${ lengthKey }.max`, {
            key:   displayKey,
            count: max
          }));
        }

        // Number min/max
        min = field.min;
        max = field.max;
        if (val !== null && min && max) {
          if ((val < min) || (val > max)) {
            if (min === max) {
              errors.push(intl.t('validation.number.exactly', {
                key: displayKey,
                val: max
              }));
            } else {
              errors.push(intl.t('validation.number.between', {
                key: displayKey,
                min,
                max
              }));
            }
          }
        } else if (min && (val < min)) {
          errors.push(intl.t('validation.number.min', {
            key: displayKey,
            val: min
          }));
        } else if (max && (val > max)) {
          errors.push(intl.t('validation.number.max', {
            key: displayKey,
            val: max
          }));
        }

        var test = [];

        if (field.validChars) {
          test.push(`[^${  field.validChars  }]`);
        }

        if (field.invalidChars) {
          test.push(`[${  field.invalidChars  }]`);
        }

        if (test.length) {
          var regex = new RegExp(`(${  test.join('|')  })`, 'g');
          var match = val.match(regex);

          if (match) {
            match = match.uniq().map((chr) => {
              if (chr === ' ') {
                return '[space]';
              } else {
                return chr;
              }
            });

            errors.push(intl.t('validation.chars', {
              key:   displayKey,
              count: match.length,
              chars: match.join(' ')
            }));
          }
        }
      }
    }

    return errors;
  },

  cloneForNew() {
    var copy = this.clone();

    delete copy.id;
    delete copy.actionLinks;
    delete copy.links;
    delete copy.uuid;

    return copy;
  },

  serializeForNew() {
    var copy = this.serialize();

    delete copy.id;
    delete copy.actionLinks;
    delete copy.links;
    delete copy.uuid;

    return copy;
  },

  // Show growls for errors on actions
  delete(/* arguments*/) {
    var promise = this._super.apply(this, arguments);

    return promise.catch((err) => {
      // this.get('growl').fromError('Error deleting',err);
    });
  },

  doAction(name, data, opt) {
    var promise = this._super.apply(this, arguments);

    // if ( !opt || opt.catchGrowl !== false )
    // {
    //   return promise.catch((err) => {
    //     this.get('growl').fromError(Util.ucFirst(name) + ' Error', err);
    //     return Ember.RSVP.reject(err);
    //   });
    // }

    return promise;
  },

  // You really shouldn't have to use any of these.
  // Needing these is a sign that the API is bad and should feel bad.
  // Yet here they are, nonetheless.
  waitInterval:   1000,
  waitTimeout:    30000,
  _waitForTestFn(testFn, msg) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      var timeout = setTimeout(() =>  {
        clearInterval(interval);
        clearTimeout(timeout);
        reject(this);
      }, this.get('waitTimeout'));

      var interval = setInterval(() => {
        if (testFn.apply(this)) {
          clearInterval(interval);
          clearTimeout(timeout);
          resolve(this);
        }
      }, this.get('waitInterval'));
    }, msg || 'Wait for it...');
  },

  waitForState(state) {
    return this._waitForTestFn(function() {
      return this.get('state') === state;
    }, `Wait for state=${  state }`);
  },

  waitForNotTransitioning() {
    return this._waitForTestFn(function() {
      return this.get('transitioning') !== 'yes';
    }, 'Wait for not transitioning');
  },

  waitForAction(name) {
    return this._waitForTestFn(function() {
      // console.log('waitForAction('+name+'):', this.hasAction(name));
      return this.hasAction(name);
    }, `Wait for action=${  name }`);
  },

  waitForAndDoAction(name, data) {
    return this.waitForAction(name).then(() => {
      return this.doAction(name, data);
    }, `Wait for and do action=${  name }`);
  },
});
