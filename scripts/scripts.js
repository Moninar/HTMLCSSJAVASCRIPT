// progress bar
function module_progress_bar(init = 0) {
  let _percent = init;
  let _subscribe = null;
  return {
    subscribe: (fn) => {_subscribe = fn;},
    update: () => {
      console.log("update");
      for (let i = init; i <= 100; ++i) {
        _percent = i;
        setTimeout(per => _subscribe(per), 100 * i, _percent);
      }
    }
  }
}

function view_progress_bar(module, selector) {
  let container = document.querySelector(selector);
  let bar = container.querySelector('.bar');
  window.onload = () => {
    console.log("loaded");
    module.update();
  };
  function render(percent) {
     bar.style.width = percent + '%';
  }
  module.subscribe(render);
  render(0);
}

// progress bar controller
let m = module_progress_bar(0);
view_progress_bar(m, ".progress-bar");

