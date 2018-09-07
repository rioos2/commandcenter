import config from '../config/environment';
import Mixin from '@ember/object/mixin';
export default Mixin.create({

  defaultVPS() {
    return config.VPS;
  },

});
