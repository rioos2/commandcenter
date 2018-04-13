import Ember from "ember";
const {
  get
} = Ember;
export default Ember.Controller.extend({

  cacheNodes: [],
  cacheOs: [],

  intl: Ember.inject.service(),
  notifications: Ember.inject.service('notification-messages'),

  modelchanged: function() {
    if(this.get('model.content')) {
      this._addCache();
      this._removeCache();
    }
  }.observes('model'),

  alertMessage: function() {
    if (this.get("model.code") == "502") {
      this.get('notifications').warning(get(this, 'intl').t('dashboard.error'), {
        htmlContent: true,
        autoClear: true,
        clearDuration: 6000,
        cssClasses: 'notification-warning'
      });
    }
  }.observes('model.code'),

  checkEmptyNode: function() {
    return Ember.isEmpty(this.get('cacheNodes'));
  }.property('cacheNodes'),

  _removeCache: function() {
    const self = this;
    self.get('cacheNodes').forEach(function(node) {
      if (self._hasRemoveRecordFor(node)) {
        self.get('cacheNodes').removeObject(node);
      }
    });

    self.get('cacheOs').forEach(function(os) {
      if (self._hasRemoveOsFor(os)) {
        self.get('cacheOs').removeObject(os);
      }
    });
  },

  _addCache: function() {
    var stat = null;
    const self = this;
    if(self.get('model.content').length >0){
    stat = self.get('model.content').objectAt(0);
    stat.results.statistics.nodes.forEach(function(node) {
      if (self._hasAddRecordFor(node)) {
        self.get('cacheNodes').addObject(node);
      }
    });

    stat.results.osusages.items.forEach(function(os) {
      if (self._hasAddOsFor(os)) {
        self.get('cacheOs').addObject(os);
      }
    });
  }
  },

  _hasAddRecordFor: function(node) {
    var flag = true;
    const self = this;
      if (Ember.isEmpty(node.id)){
      flag = false;
    }
    self.get('cacheNodes').forEach(function(cache) {
      if (cache.id === node.id) {
        flag = false;
      }
    });
    return flag;
  },

  _hasRemoveRecordFor: function(node) {
    var stat = null;
    var flag = true;
    const self = this;
    if(self.get('model.content').length >0){
    stat = self.get('model.content').objectAt(0);
    stat.results.statistics.nodes.forEach(function(cache) {
      if (cache.id === node.id) {
        flag = false;
      }
    });
  }
    return flag;
  },

  _hasAddOsFor: function(os) {
    var flag = true;
    const self = this;
    self.get('cacheOs').forEach(function(cache) {
      if (cache.id === os.id) {
        flag = false;
      }
    });
    return flag;
  },

  _hasRemoveOsFor: function(os) {
    var stat = null;
    var flag = true;
    const self = this;
    if(self.get('model.content').length >0){
    stat = self.get('model.content').objectAt(0);
    stat.results.osusages.items.forEach(function(cache) {
      if (cache.id === os.id) {
        flag = false;
      }
    });
  }
    return flag;
  },

});
