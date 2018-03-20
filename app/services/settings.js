
import Ember from 'ember';
import C from 'nilavu/utils/constants';

export function normalizeName(str) {
  return str.replace(/\./g, C.SETTING.DOT_CHAR).toLowerCase();
}
import { denormalizeName } from 'nilavu/utils/denormalize';



export default Ember.Service.extend(Ember.Evented, {
  intl: Ember.inject.service(),
  userStore: Ember.inject.service('user-store'),

  all: null,
  promiseCount: 0,

  init() {
    this._super();
    this.set('all', this.get('userStore').all('settingsMap'));
  },


  unknownProperty(key) {
    var obj = this.findByName(key);
    if (obj) {
      var val = obj.get('value');
      if (val === 'false') {
        return false;
      }
      else if (val === 'true') {
        return true;
      }
      else {
        return val;
      }
    }

    return null;
  },

  findByName(name) {
    return this.get('asMap')[normalizeName(name)];
  },

  //Convert the setttings to a map.
  //BUG, the settings map is assumed to be {name: "sample settings key", "value": "sample value"}
  //BUG, in our setup the map is {"sample settings key", "sample value"}
  asMap: function () {
    var out = {};
    (this.get('all') || []).forEach((setting) => {
      var name = normalizeName(setting.get('name'));
      out[name] = setting;
    });

    return out;
  }.property('all.@each.{name,value}'),

  promiseCountObserver: function () {
    if (this.get('promiseCount') <= 0) {
      this.trigger('settingsPromisesResolved');
    }
  }.observes('promiseCount'),

  //shall be used in t
  uiVersion: function () {
    return 'v' + this.get('app.version');
  }.property('app.version'),

  docsBase: function () {
    let full = this.get('uiVersion');
    let version = 'latest';

    let lang = ((this.get('intl._locale') || [])[0] || '').replace(/-.*$/, '');
    if (!lang || lang === 'none' || C.LANGUAGE.DOCS.indexOf(lang) === -1) {
      lang = 'en';
    }

    return `${C.EXT_REFERENCES.DOCS}/${version}/${lang}`;
  }.property('intl._locale')

});
