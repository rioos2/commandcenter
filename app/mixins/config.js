import Ember from 'ember';
import config from '../config/environment';

export default Ember.Mixin.create({

  defaultVPS() {
    return config.VPS;
  },

});
