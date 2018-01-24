
import Ember from 'ember';
import C from 'nilavu/utils/constants';
export function normalizeName(str) {
  return str.replace(/\./g, C.SETTING.DOT_CHAR).toLowerCase();
}
export function denormalizeName(str) {
  return str.replace(new RegExp('['+C.SETTING.DOT_CHAR+']','g'),'.').toLowerCase();
}


export default Ember.Service.extend({
  userStore: Ember.inject.service('store'),

  all: null,

  init() {
    this._super();
    this.set('all', this.get('userStore').all('settingsMap'));
  },


  unknownProperty(key) {
  var obj = this.findByName(key);
  if ( obj )
  {
    var val = obj.get('value');
    if ( val === 'false' )
    {
      return false;
    }
    else if ( val === 'true' )
    {
      return true;
    }
    else
    {
      return val;
    }
  }

  return null;
},

findByName(name) {
    return this.get('asMap')[normalizeName(name)];
  },
  asMap: function() {
    var out = {};
    (this.get('all')||[]).forEach((setting) => {
      var name = normalizeName(setting.get('name'));
      out[name] = setting;
    });

    return out;
  }.property('all.@each.{name,value}'),
  promiseCountObserver: function() {

    if (this.get('promiseCount') <= 0) {
      this.trigger('settingsPromisesResolved');
    }
  }.observes('promiseCount'),


});
