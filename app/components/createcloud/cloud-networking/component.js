import Component from '@ember/component';

export default Component.extend({
    radioValue: "pri4",

    actions: {
        radioChanged() {
            let radioValue = this.get('radioValue');
            switch(radioValue) {
                case "pri4":
                    this.set('networking.isIPv4', true);
                    this.set('networking.isPrivate', true);
                    break;
                case "pri6":
                    this.set('networking.isIPv4', false);
                    this.set('networking.isPrivate', true);
                    break;
                case "pub4":
                    this.set('networking.isIPv4', true);
                    this.set('networking.isPrivate', false);
                    break;
                case "pub6":
                    this.set('networking.isIPv4', false);
                    this.set('networking.isPrivate', false);
                    break;
            }
        }
    }
});
