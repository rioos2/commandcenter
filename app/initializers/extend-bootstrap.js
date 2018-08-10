import BootstrapFixes from 'nilavu/utils/bootstrap-fixes';
import $ from 'jquery';

/* BootstrapFixes which helps for resource action dropdown positioning at where you click.*/
export function initialize(/* application*/) {
  $(document).on('shown.bs.dropdown.position-calculator', (event, data) => {
    BootstrapFixes.resizeDropdown(event, data);
  });
}

export default {
  name:       'extend-bootstrap',
  initialize
};
