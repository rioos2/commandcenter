
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
  cookies: Ember.inject.service(),

  all: null,
  promiseCount: 0,


  siteSettings() {
  return this.get('userStore').all('settingsMap');
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

setUnknownProperty(key, value) {
  var obj = this.findByName(key);

  if ( value === undefined )
  {
    // Delete by set to undefined is not needed for settings
    throw new Error('Deleting settings is not supported');
  }

  if ( !obj )
  {
    obj = this.get('userStore').createRecord({
      type: 'setting',
      name: denormalizeName(key),
    });
  }

  this.incrementProperty('promiseCount');

  obj.set('value', value+''); // Values are all strings in settings.
  obj.save().then(() => {
    this.notifyPropertyChange(normalizeName(key));
  }).catch((err) => {
    console.log('Error saving setting:', err);
  }).finally(() => {
    this.decrementProperty('promiseCount');
  });

  return value;
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
