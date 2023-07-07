(function() {
  // object assign polyfill
  polyfill();

  var colorMap = [
    "#292929",
    "#ACE229",
    "#FCF229",
    "#FAB229",
    "#F23225",
     "#F229EE"
  ];

  var cities=[{id:"新北",lv:-1,},{id:"台北",lv:-1,},{id:"基隆",lv:-1,},{id:"桃園",lv:-1,},{id:"新竹",lv:-1,},{id:"苗栗",lv:-1,},{id:"台中",lv:-1,},{id:"彰化",lv:-1,},{id:"雲林",lv:-1,},{id:"嘉義",lv:-1,},{id:"南投",lv:-1,},{id:"台南",lv:-1,},{id:"高雄",lv:-1,},{id:"屏東",lv:-1,},{id:"台東",lv:-1,},{id:"花蓮",lv:-1,},{id:"宜蘭",lv:-1,},{id:"馬祖",lv:-1,},{id:"金門",lv:-1,},{id:"澎湖",lv:-1,}];
  var contextMenu = document.querySelector("#contextMenu");
  var menuTitle = document.querySelector('#menuTitle');
  var currentId = '';
  var total = 0;

  // city name text
  var cityTexts = [].map.call(document.querySelectorAll('text.city'), function (ele) { return ele; });
  cityTexts.map(function (cityText) {
    cityText.style.cursor = 'pointer';
    cityText.addEventListener('click', bindContextMenu);
  });

  // city area
  cities.map(function (city) {
    var doms = [].map.call(document.querySelectorAll('[id^=' + city.id + ']'), function (ele) { return ele; });
    doms.map(function (dom) {
      dom.style.fill = '#292929';
      dom.style.cursor = 'pointer';
      dom.addEventListener('click', bindContextMenu);
    });
  });

  // hide context menu
  document.addEventListener('mouseup', closeWhenClickOutside);
  document.addEventListener('touchend', closeWhenClickOutside);

  function closeWhenClickOutside (e) {
    if (!contextMenu === e.target || !contextMenu.contains(e.target)) {
      contextMenu.style.display = 'none';
    }
  }

  // set level
  var levels = [].map.call(document.querySelectorAll("div[id^='lv']"), function (ele) { return ele; });
  levels.map(function (level) {
    level.addEventListener('click', function (e) {
      var lv = parseInt(e.currentTarget.id.replace('lv', ''), 10);
      cities = cities.map(function (city) {
        if (city.id === currentId) {
          return Object.assign({}, city, { lv: lv });
        }
        return city;
      });
      contextMenu.style.display = 'none';
      changeCityColor(lv);
      calcTotal();
    });
  });

  //set name
  const setNameButton = document.getElementById("setName");
  setNameButton.addEventListener("click", function() {  
  const output = document.getElementById("name");
  output.textContent = prompt("請輸入您的姓名：");
  });

  // save as png
  document.querySelector('#saveAs').addEventListener('click', function () {
    var svgString = new XMLSerializer().serializeToString(document.querySelector('#map'));
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext("2d");
    canvas.width = 1124;
    canvas.height = 1124;
    ctx.fillStyle = '#444444';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    var img = new Image();
    img.onload = function() {
        ctx.drawImage(img, 187, 0);
        canvas.toBlob(function (blob) { saveAs(blob, 'taiwan-running-scouter.png'); });
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
    });

  function bindContextMenu (e) {
    // 180: context menu width, 20: buffer
    // 165: context menu height, 30: buffer
    const widthOffset = window.innerWidth - e.pageX - 80 - 20;
    const heightOffset = window.innerHeight - e.pageY - 165 - 30;
    const x = widthOffset > 0 ? e.pageX : e.pageX + widthOffset;
    const y = heightOffset > 0 ? e.pageY : e.pageY + heightOffset;
    contextMenu.style.top = y + 'px';
    contextMenu.style.left= x + 'px';
    contextMenu.style.display = 'block';
    currentId = (e.target.id || e.target.textContent).replace(/\d*/g, '');
    menuTitle.textContent = currentId;
  }

  function calcTotal () {
    total = 0;
    var score = new Map([
    [-1, 0],
    [0, 5],
    [1, 50],
    [2, 89],
    [3, 567],
    [4, 1234] 
    ]);
    cities.map(function (city) {
      total += score.get(city.lv);
      //total += city.lv;
    });
    document.querySelector('#total').textContent= total;
  }

  function changeCityColor (lv) {
    var doms = [].map.call(document.querySelectorAll('[id^=' + currentId + ']'), function (ele) { return ele; });
    doms.map(function (dom) {
      dom.style.fill = colorMap[lv+1];
    });
  }

  /**
   ** Object assign polyfill
   ** https://github.com/rubennorte/es6-object-assign
   **/

  function assign(target, firstSource) {
    if (target === undefined || target === null) {
      throw new TypeError('Cannot convert first argument to object');
    }

    var to = Object(target);
    for (var i = 1; i < arguments.length; i++) {
      var nextSource = arguments[i];
      if (nextSource === undefined || nextSource === null) {
        continue;
      }

      var keysArray = Object.keys(Object(nextSource));
      for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
        var nextKey = keysArray[nextIndex];
        var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
        if (desc !== undefined && desc.enumerable) {
          to[nextKey] = nextSource[nextKey];
        }
      }
    }
    return to;
  }

  function polyfill() {
    if (!Object.assign) {
      Object.defineProperty(Object, 'assign', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: assign
      });
    }
  }
})();
