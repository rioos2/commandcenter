import C from 'nilavu/utils/constants';
import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Service.extend({
  userStore: service('user-store'),

  unremoved: function() {
    return this.get('userStore').all('userpreference');
  }.property('userStore.generation'),

  findByName(key) {
    return this.get('unremoved').filterBy('name', key)[0];
  },

  unknownProperty(key) {
    var value; // = undefined;
    var existing = this.findByName(key);

    if (existing) {
      try {
        value = JSON.parse(existing.get('value'));
      } catch (e) {
        console.log(`Error parsing storage ['${  key  }']`);
        // this.notifyPropertyChange(key);
      }
    }

    return value;
  },

  // setUnknownProperty: function(key, value) {
  //   var obj = this.findByName(key);
  //
  //   // Delete by set to undefined
  //   if ( value === undefined )
  //   {
  //     if ( obj )
  //     {
  //       obj.set('value',undefined);
  //       obj.delete();
  //       this.notifyPropertyChange(key);
  //     }
  //
  //     return;
  //   }
  //
  //   if ( !obj )
  //   {
  //     obj = this.get('userStore').createRecord({
  //       type: 'userPreference',
  //       name: key,
  //     });
  //   }
  //
  //   let neu = JSON.stringify(value);
  //   if ( !obj.get('id') || obj.get('value') !== neu ) {
  //     obj.set('value', neu);
  //     obj.save().then(() => {
  //       Ember.run(() => {
  //         this.notifyPropertyChange(key);
  //       });
  //     });
  //   }
  //
  //   return value;
  // },

  clear() {
    this.beginPropertyChanges();

    this.get('unremoved').forEach((obj) => {
      this.set(obj.get('name'), undefined);
    });

    this.endPropertyChanges();
  },

  tablePerPage: computed(`${ C.PREFS.TABLE_COUNT }`, function() {
    let out = this.get(`${ C.PREFS.TABLE_COUNT }`);

    if (!out) {
      out = C.TABLES.DEFAULT_COUNT;
    }

    return out;
  }),
});
