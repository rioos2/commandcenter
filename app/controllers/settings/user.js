import Controller from '@ember/controller';

export default Controller.extend({

  img: function() {
    if (this.get('model.avatar') == null) {
      return "../images/user/default.png";
    }
    return this.get('model.avatar');
  }.property('model'),

  createdAt: function() {
    var options = {
      year: "numeric",
      month: "short",
      day: "numeric"
    };
    return new Date(this.get('model.created_at')).toLocaleDateString("en", options);
  }.property('model'),

});
