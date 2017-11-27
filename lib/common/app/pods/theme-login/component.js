import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ["login"],

	initializeChart: Ember.on('didInsertElement', function() {
        var self = this;
        var navListItems = self.$('div.setup-panel div a'),
            allWells = self.$('.setup-content'),
            allNextBtn = self.$('.nextBtn');

        allWells.hide();

        navListItems.click(function(e) {
            if (self.$(this).attr("disabled") === "disabled") {
                return;
            }
            e.preventDefault();
            self.$(".main-container p").removeClass("sel-a");
            self.$(this).next().addClass("sel-a");
            var $target = self.$(self.$(this).attr('href')),
                $item = self.$(this);

            if (!$item.hasClass('disabled')) {
                navListItems.removeClass('btn-success').addClass('btn-default');
                $item.addClass('btn-success');
                allWells.hide();
                $target.show();
                $target.find('input:eq(0)').focus();
            }
        });
        self.$(".pending").click(function(e) {
            e.preventDefault();
            if (self.$(this).attr("disabled") === "disabled") {
                return;
            }
            // alert("this");
            self.$(".select-btn").addClass("pending").removeClass("select-btn");
            self.$(this).addClass("select-btn").removeClass("pending");
        });
        
        allNextBtn.click(function() {
            var curStep = self.$(this).closest(".setup-content"),
                curStepBtn = curStep.attr("id"),
                nextStepWizard = self.$('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children("a"),
                curInputs = curStep.find("input[type='text'],input[type='url']"),
                isValid = true;

            self.$(".form-group").removeClass("has-error");
            for (var i = 0; i < curInputs.length; i++) {
                if (!curInputs[i].validity.valid) {
                    isValid = false;
                    self.$(curInputs[i]).closest(".form-group").addClass("has-error");
                }
            }

            if (isValid) {
                nextStepWizard.removeAttr('disabled').trigger('click');
                nextStepWizard = self.$('div.setup-panel div a[href="#' + curStepBtn + '"]').removeClass("select-btn").addClass("success").removeClass("pending");
            }
        });

        self.$('div.setup-panel div a.btn-success').trigger('click');

  })

});
