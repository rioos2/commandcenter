import Component from '@ember/component';

export default Component.extend({
    showField: false,

    actions: {
        showInputField: function() {
            this.set('showField', true);
        },
        closeInputField: function() {
            this.set('showField', false);
        },

        addLocation: function() {
          this.set("model.assemblyfactory.object_meta.cluster_name", this.get('location'));
          let noCountry = true;
          this.get("model.datacenters.content").forEach((item) => {
            if (this.get('location') == item.object_meta.name) {
              this.set("model.assemblyfactory.country", item.advanced_settings.country);
              noCountry = false;
            }
          });
          if(noCountry) {
            this.set("model.assemblyfactory.country","");
          }
        }

    }
});
