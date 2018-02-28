function increase_brightness (hex, percent) {
  // strip the leading # if it's there
  hex = hex.replace(/^\s*#|\s*$/g, '')

  // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
  if (hex.length == 3) {
    hex = hex.replace(/(.)/g, '$1$1')
  }

  var r = parseInt(hex.substr(0, 2), 16),
    g = parseInt(hex.substr(2, 2), 16),
    b = parseInt(hex.substr(4, 2), 16)

  return '#' +
    ((0 | (1 << 8) + r + (256 - r) * percent / 100).toString(16)).substr(1) +
    ((0 | (1 << 8) + g + (256 - g) * percent / 100).toString(16)).substr(1) +
    ((0 | (1 << 8) + b + (256 - b) * percent / 100).toString(16)).substr(1)
}

function getColor () {
  return '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6)
}

function colorize () {
  let elements = document.getElementsByClassName('action-button')
  for (let index = 0; index < elements.length; index++) {
    let color = getColor()
    let bColor = increase_brightness(color, 20)
    elements[index].style.backgroundColor = bColor
    elements[index].style.borderBottom = '5px solid ' + color
    elements[index].style.textShadow = '0px -2px ' + color
  }
}



function init () {
  playx()
  pole = []
  zvuky = []
  Object.keys(x).forEach(function (key) {
    section = x[key].split('/')[1]
    name = x[key]
    if (!document.getElementById(section)) {
      let div = document.createElement('div');
      div.id = section;
      document.getElementById('body').appendChild(div);
      sec = document.getElementById(section);
      h3 = document.createElement('h3');
      h3.innerHTML= section;
      sec.appendChild(h3);
    }
    let a = document.createElement('a')
    //            a.onclick="playSound('"+x[key]+"');"
    a.onclick = function () { playSound(x[key]); }
    a.classList = 'action-button shadow animate'
    a.innerHTML = key
    a.href = '#'+key
    document.getElementById(section).appendChild(a)
  })
  colorize();
}
function playSound (path) {
  let x = document.getElementById('kokot');
  let source = document.getElementById('audioSource');
  source.src = path;
  //x.onended = function () { playSound(x[key]); }
  x.load();
  x.play();
}

function playx () {
  if (location.hash.length > 1) {
    //playSound('data/' + location.hash.substr(1) + '.mp3')
    
    let toPlay = location.hash.split("|")
    if (toPlay.length > 1 ){
        for (let i=0; i<toPlay.length; i++){
            playSound(x[toPlay[i].replace("#","")])
        }
    }
    else {
        playSound(x[location.hash.substr(1)])
    }

  }
}
