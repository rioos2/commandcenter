import Ember from "ember";

export default Ember.Controller.extend({

  img: function() {
    if (this.get('model.profile.avatar') == null) {
      return "../images/user/default.png";
    }
    return "data:image/png;base64," + this.get('model.profile.avatar');
  }.property('model'),

  createdAt: function() {
    if(this.get('model.profile.created_at')) {
      return this.profileTimestamp(this.get('model.profile.created_at'));
    }
    return " ";
  }.property('model'),

  tableData: function() {
    let data = this.get('model.logData.content');
    if (!Ember.isEmpty(data)){
      data.forEach(function(e) {
        e.date = this.auditedTimestamp(e.timestamp);
      }.bind(this));
    }
    return data;
  }.property('model.logData'),

  tableLastData: function() {
    if (!Ember.isEmpty(this.get('tableData'))){
      return {show:true, type: 'warning',message: (this.get('tableData').slice(-1)[0]).event.message};
    }
    return {show:false};
  }.property('tableData'),

  profileTimestamp: function(date){
    return moment(date).utcOffset(date).format('MMM DD, YYYY').toString();
  },

  auditedTimestamp: function(date){
    return moment(date).utcOffset(date).format('MMM DD YYYY, h:mm:ss a').toString();
  },

});
