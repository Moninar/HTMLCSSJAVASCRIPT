// progress bar
function module_progress_bar(init = 0) {
  let _percent = init;
  let _subscriber = null;
  return {
    subscribe: (fn) => {_subscriber = fn;},
    update: () => {
      for (let i = init; i <= 100; ++i) {
        _percent = i;
        setTimeout(per => _subscriber(per), 100 * i, _percent);
      }
    }
  }
}

function view_progress_bar(module, selector) {
  let container = document.querySelector(selector);
  let bar = container.querySelector('.bar');
  window.onload = () => {
    module.update();
  };
  function render(percent) {
     bar.style.width = percent + '%';
  }
  module.subscribe(render);
  render(0);
}

// progress bar controller
let mpb = module_progress_bar(0);
view_progress_bar(mpb, ".progress-bar");

// type ahead
function module_type_ahead() {
  let _nameArr = [];
  let _subscriber = null;
  return {
    subscribe: (fn) => {_subscriber = fn},
    update: (input) => {
      let url = 'https://swapi.co/api/people/?search=' + ('' === input ? null : input);
      fetch(url)
      .then(response => response.json())
      .then(data => {
        let arr = data.results;
        _nameArr.length = 0;
        arr.forEach(elem => {
          _nameArr.push(elem['name']);
        });
        _subscriber(_nameArr);
      })
      .catch(e => console.log(e)); 
    }
  }
}

function view_type_ahead(module, selector) {
  let container = document.querySelector(selector);
  let search = container.querySelector(".search");
  let dropdown = container.querySelector(".dropdown");
  search.addEventListener('input', (event) => {
    let input = event.target.value;
    module.update(input);
  });
  function render(nameArr) {
    dropdown.innerHTML = '';
    nameArr.forEach(elem => {
      dropdown.innerHTML += '<li class="option">' + elem + '</li>';
    })
  }
  module.subscribe(render);
  render([]);
}

// type ahead controller
let mta = module_type_ahead();
view_type_ahead(mta, ".type-ahead");

// auto complete
function module_auto_complete(init = []) {
  let _data = [];
  let _subscriber = null;
  return {
    subscribe: (fn) => {_subscriber = fn},
    update: (input) => {
      input = input.toUpperCase();
      if ("" === input) _data = [];
      else 
        _data = init.filter(item => item.toUpperCase().includes(input));
      _subscriber(_data);
    }
  }
}

function view_auto_complete(module, selector) {
  let container = document.querySelector(selector);
  let search = container.querySelector(".search");
  let dropdown = container.querySelector(".dropdown");
  search.addEventListener('input', (event) => {
    let input = event.target.value;
    module.update(input);
  });
  function render(data) {
    dropdown.innerHTML = '';
    data.forEach(elem => {
      dropdown.innerHTML += '<li class="option">' + elem + '</li>';
    })
  }
  module.subscribe(render);
  render([]);
}

// auto complete controller
let givenOptions = [
  'CA',
  'AZ',
  'WA',
  'NY',
  'OR',
  'TX',
  'TS',
  'ML',
  'MX'
];
let mac = module_auto_complete(givenOptions);
view_auto_complete(mac, ".auto-complete");
