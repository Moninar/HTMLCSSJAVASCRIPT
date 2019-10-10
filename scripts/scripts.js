// progress bar
function module_progress_bar(init = 0) {
  let _percent = init;
  let _subscriber = null;
  return {
    subscribe: (fn) => { _subscriber = fn; },
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
    subscribe: (fn) => { _subscriber = fn },
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
    subscribe: (fn) => { _subscriber = fn },
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

// whack a mole
// params (M's: number, click's: number)
function module_whack_mole(m, click) {
  let _score = 0;
  let _arrM = [];
  let _click = 0;
  let _subscriber = null;

  function _shuffle() {
    _arrM.length = 0;
    while (_arrM.length < m) {
      let num = Math.floor(Math.random() * click);
      if (!_arrM.includes(num)) _arrM.push(num);
    }
    return _arrM.slice(0);
  }

  return {
    subscribe: (fn) => { _subscriber = fn; },
    update: (idx) => {
      if (_click < click) {
        if (_arrM.includes(idx)) _score++;
        if (++_click >= click) {
          _subscriber(true, _score, _arrM.slice(0));
        } else {
          _shuffle();
          // console.log(_arrM.slice(0));
          _subscriber(false, _score, _arrM.slice(0));
        }
      } 
    },
    shuffle: () => _shuffle()
  }
}

function view_whack_mole(module, selector) {
  let container = document.querySelector(selector);
  let grid = container.querySelector('.grid');
  let score = container.querySelector('.score');
  grid.addEventListener('click', e => {
    let target = e.target;
    let id = parseInt(target.getAttribute('id'));
    module.update(id);
  });
  function render(done, num, ms) {
    console.log(ms);
    score.innerHTML = num;
    if (done) {
      grid.style.display = 'none';
      score.style.display = 'block';
    } else {
      grid.style.display = 'flex';
      score.style.display = 'none';
      let children = [...grid.children];
      console.log("children", grid.children);
      children.forEach(child => {
        if (ms.includes(parseInt(child.id))) {
          child.innerHTML = 'M';
        } else {
          child.innerHTML = '';
        }
      })
    }
  }
  module.subscribe(render);
  render(false, 0, module.shuffle());
}

// whack a mole controller
let mwm = module_whack_mole(3, 9);
view_whack_mole(mwm, '.whack-mole');


