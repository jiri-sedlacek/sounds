
function increase_brightness(hex, percent) {
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

function getColor() {
  return '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
}

function colorize(button) {
  let color = getColor();
  let bColor = increase_brightness(color, 20);
  button.style.backgroundColor = bColor;
  button.style.borderBottom = '5px solid ' + color;
  button.style.textShadow = '0px -2px ' + color;
}

function createButton(soundID) {
  let a = document.createElement('a');
  a.classList = 'action-button shadow animate';
  a.innerHTML = soundID;
  a.href = '#' + soundID;
  a.id = soundID;
  a.draggable = true;

  a.addEventListener('click', function () {
    playSound(soundID);
  });

  colorize(a);

  return a;
}

let playingSound = null, mixPanelSounds = [];

function init() {

  Object.keys(x).forEach(function (key) {
    let source = x[key];
    let section = source.split('/')[1];

    if (!document.getElementById(section)) {
      let sectionDiv = document.createElement('div');
      let h3 = document.createElement('h3');

      sectionDiv.id = h3.innerHTML = section;
      sectionDiv.classList = 'section section-collapsed';
      sectionDiv.appendChild(h3);

      document.getElementById('body').appendChild(sectionDiv);

      h3.addEventListener('click', function () {
        sectionDiv.classList.toggle('section-collapsed');
      });
    }

    let button = createButton(key);
    document.getElementById(section).appendChild(button);
  });

  let hashSounds = location.hash.replace('#', '').split('|');
  if (hashSounds.length) {
    playSoundSeries(hashSounds);
  }

  initMixPanel();
}

function playSound(soundID) {
  let soundPath = x[soundID];

  if (soundPath === undefined) {
    return Promise.resolve();
  }
  if (playingSound && playingSound instanceof Audio) {
    playingSound.pause();
  }
  let audio = new Audio(soundPath);

  return new Promise(function (resolve, reject) {
    audio.addEventListener('ended', resolve);
    audio.addEventListener('error', reject);
    audio.load();
    audio.play();

    playingSound = audio;
  });
}

function playSoundSeries(soundIDs) {
  if (soundIDs.length === 0) {
    return false;
  }
  let currentSound = soundIDs.shift();

  playSound(currentSound).then(function () {
    playSoundSeries(soundIDs);
  });
}

function dragStart(e) {
  e.stopPropagation();
  this.classList.add('is-dragged');
  e.dataTransfer.effectAllowed = 'copy';
  e.dataTransfer.setData('id', this.id);
}

function dragEnd(e) {
  e.stopPropagation();
  this.classList.remove('is-dragged');
}

function dragEnter(e) {
  if (e.stopPropagation) e.stopPropagation();
  this.classList.add('dropover');
}

function dragLeave(e) {
  if (e.stopPropagation) e.stopPropagation();
  this.classList.remove('dropover');
}

function dragOver(e) {
  if (e.stopPropagation) e.stopPropagation();
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
  return false;
}

function drop(e) {
  if (e.stopPropagation) e.stopPropagation();

  var droppedID = e.dataTransfer.getData('id'),
    sounds = document.getElementsByClassName('action-button'),
    dropZone = document.getElementById('mix-panel'),
    soundMix = document.getElementById('mix-panel-sounds');

  dropZone.classList.remove('dropover');

  for (var i = 0; i < sounds.length; i++) {

    if (sounds[i].id == droppedID) {
      let droppedSound = sounds[i];
      droppedSound.classList.remove('is-dragged');
      let droppedClone = droppedSound.cloneNode(true);

      soundMix.appendChild(droppedClone);
      mixPanelSounds.push(droppedSound.id);
      return;
    }
  }
}

function initMixPanel() {
  var sounds = document.querySelectorAll('.action-button'),
    dropZone = document.getElementById('mix-panel'),
    playButton = document.getElementById('mix-panel-play'),
    clearButton = document.getElementById('mix-panel-clear'),
    soundMix = document.getElementById('mix-panel-sounds');

  for (var i = 0, len = sounds.length; i < len; i++) {
    sounds[i].addEventListener('dragstart', dragStart, false);
    sounds[i].addEventListener('dragend', dragEnd, false);
  }

  dropZone.addEventListener('dragenter', dragEnter, false);
  dropZone.addEventListener('dragleave', dragLeave, false);
  dropZone.addEventListener('dragover', dragOver, false);
  dropZone.addEventListener('drop', drop, false);

  clearButton.addEventListener('click', function (event) {
    event.preventDefault();
    mixPanelSounds = [];
    soundMix.innerHTML = '';
    window.location.hash = '';
  });

  playButton.addEventListener('click', function (event) {
    event.preventDefault();
    playSoundSeries(mixPanelSounds.slice());
    window.location.hash = mixPanelSounds.join('|');
  });
}
