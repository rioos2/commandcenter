import BootstrapFixes from 'nilavu/utils/bootstrap-fixes';
import Service from '@ember/service';
import $ from 'jquery';
import { next } from '@ember/runloop';
import { get } from '@ember/object';
export default Service.extend({
  model:          null,
  open:           false,
  tooltipActions: null,
  actionToggle:   null,
  actionMenu:     null,

  show(model, trigger, toggle) {
    let $parent = this.set('actionParent', $('#resource-actions-parent'));
    let $menu = this.set('actionMenu', $('#resource-actions'));
    let $toggle = this.set('actionToggle', $(toggle || trigger));

    if (model === this.get('model') && this.get('open')) {
      event.preventDefault();

      return;
    }

    this.set('model', model);

    $('BODY').one('click', () => {
      // check to see if we've opened the menu
      // we can get into a state (via accessability navigation) where the
      // menu has been closed but the body click was never fired
      // this will just prevent an null error
      if (this.get('actionMenu') && this.get('actionToggle')) {
        this.hide();
      }
    });

    next(() => {
      if (this.get('tooltipActions')) {
        $menu.addClass('tooltip-actions');
      } else {
        if ($menu.hasClass('tooltip-actions')) {
          $menu.removeClass('tooltip-actions');
        }
      }

      $menu.css('visibility', 'hidden');
      $menu.removeClass('hide');
      $toggle.addClass('open');
      $parent.addClass('open');

      this.set('open', true);
      // Delay ensure it works in firefox
      next(() => {
        BootstrapFixes.positionDropdown($menu, trigger, false);
        $('#resource-actions-first')[0].focus();
        $menu.css('visibility', 'visible');
      });
    });
  },

  hide() {
    this.get('actionToggle').removeClass('open');
    this.get('actionParent').removeClass('hide');
    this.get('actionMenu').addClass('hide');
    this.setProperties({
      actionToggle: null,
      actionMenu:   null,
      open:         false,
      model:        null,
    });
  },

  triggerAction(actionName) {
    this.get('model').send(actionName);
  },

  activeActions: function() {
    let list = (this.get('model.availableActions') || []).filter((act) => {
      return get(act, 'enabled') !== false || get(act, 'divider');
    });

    // Remove dividers at the beginning
    while (list.get('firstObject.divider') === true) {
      list.shiftObject();
    }

    // Remove dividers at the end
    while (list.get('lastObject.divider') === true) {
      list.popObject();
    }

    // Remove consecutive dividers
    let last = null;

    list = list.filter((act) => {
      let cur = (act.divider === true);
      let ok = !cur || (cur && !last);

      last = cur;

      return ok;
    });

    return list;
  }.property('model.availableActions.[]', 'model.availableActions.@each.enabled', 'model.availableActions.@each.class', 'model'),
});
