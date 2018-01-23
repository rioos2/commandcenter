import Controller from '@ember/controller';

export default Controller.extend({

  img: function() {
    if (this.get('model.profile.avatar') == null) {
      return "../images/user/default.png";
    }
    return "data:image/png;base64," + this.get('model.profile.avatar');
  }.property('model'),

  createdAt: function() {
    var options = {
      year: "numeric",
      month: "short",
      day: "numeric"
    };
    return new Date(this.get('model.profile.created_at')).toLocaleDateString("en", options);
  }.property('model'),

  tableData: function() {
    return this.get('model.logData.content');
  }.property('model.logData'),

});
