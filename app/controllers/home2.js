import Ember from "ember";

export default Ember.Controller.extend({

  cacheNodes: [],
  cacheOs: [],

  modelchanged: function() {
    if(this.get('model.content')) {
      this._addCache();
      this._removeCache();
    }
  }.observes('model'),

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
    stat = self.get('model.content').objectAt(0);
    stat.results.statistics.nodes.forEach(function(node) {
      if (self._hasAddRecordFor(node)) {
        self.get('cacheNodes').addObject(node);
      }
    });

    stat.results.osusages.item.forEach(function(os) {
      if (self._hasAddOsFor(os)) {
        self.get('cacheOs').addObject(os);
      }
    });
  },

  _hasAddRecordFor: function(node) {
    var flag = true;
    const self = this;
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
    stat = self.get('model.content').objectAt(0);
    stat.results.statistics.nodes.forEach(function(cache) {
      if (cache.id === node.id) {
        flag = false;
      }
    });
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
    stat = self.get('model.content').objectAt(0);
    stat.results.osusages.item.forEach(function(cache) {
      if (cache.id === os.id) {
        flag = false;
      }
    });
    return flag;
  },

});
