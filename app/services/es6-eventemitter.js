
import Service from '@ember/service';
import C from '../utils/constants';
import EventEmitter from 'npm:es6-eventemitter';

const emitter = new EventEmitter();

export default Service.extend({

  init() {
    this._super();
    C.ANALYTIC_EVENTS_ALL.forEach((cTrack) => {
      emitter.on(cTrack, (cTrack) => {
        Countly.add_event(cTrack);
      });
    });
  },

  emit(events, key) {
    emitter.emit(events, key);
  },
});
