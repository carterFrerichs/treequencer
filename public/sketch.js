let canvas;
let isRecording = false;
let gifFrameCount = 0;
let tree;
let frameCount;
let gui;
let thetaSlider;
let rules = [['F', 'F', '-', '[', '-', 'F', '+', 'F', '+', 'F', ']', '+', '[', '+', 'F', '-', 'F', '-', 'F', ']'], ['F', '[', '+', 'F', ']', 'F', '[', '-', 'F', ']', '[', 'F', ']'], ['F', '[', '+', 'F', ']', 'F', '[', '-', 'F', ']', 'F'], ['F', '[', 'F', '+', 'F', '+', 'F', ']', 'F', '[', 'F', '-', 'F', '-', 'F', ']'], ['F', 'F', '[', '+', 'F', ']', '[', '-', 'F', ']', 'F', 'F', '[', '-', 'F', '+', 'F', '+', 'F', ']'], ['F', '-', 'F', '+', 'F', '-', 'F', '-', 'F']];
let selected_value;
let list;
let rule = '';
let ul;


$(document).ready(function () {

  ul = document.getElementById('sortable');

  function innerTextToClass(character){
    switch(character){
      case 'F':
        return 'F';
      case '-':
        return 'minus';
      case '+':
        return 'plus';
      case '[':
        return 'open'
      case ']':
        return 'close';
    }
  };

  $('#treeRadio').change(function () {
    selected_value = $("input[name='tree']:checked").val();
    while (ul.hasChildNodes()) {
      ul.removeChild(ul.firstChild)
    }
    switch (selected_value) {
      case '0':
        for (let i of rules[0]) {
          let node = document.createElement("li");                 // Create a <li> node
          let textnode = document.createTextNode(`${i}`);         // Create a text node
          node.appendChild(textnode);
          node.classList.add("ui-state-default");
          node.classList.add(innerTextToClass(i));
          ul.appendChild(node);
        }
        break;
      case '1':
        for (let i of rules[1]) {
          let node = document.createElement("li");                 // Create a <li> node
          let textnode = document.createTextNode(`${i}`);         // Create a text node
          node.appendChild(textnode);
          node.classList.add("ui-state-default");
          node.classList.add(innerTextToClass(i));
          ul.appendChild(node);
        }
        break;
      case '2':
        for (let i of rules[2]) {
          let node = document.createElement("li");                 // Create a <li> node
          let textnode = document.createTextNode(`${i}`);         // Create a text node
          node.appendChild(textnode);
          node.classList.add("ui-state-default");
          node.classList.add(innerTextToClass(i));
          ul.appendChild(node);
        }
        break;
      case '3':
        for (let i of rules[3]) {
          let node = document.createElement("li");                 // Create a <li> node
          let textnode = document.createTextNode(`${i}`);         // Create a text node
          node.appendChild(textnode);
          node.classList.add("ui-state-default");
          node.classList.add(innerTextToClass(i));
          ul.appendChild(node);
        }
        break;
      case '4':
        for (let i of rules[4]) {
          let node = document.createElement("li");
          let textnode = document.createTextNode(`${i}`);
          node.appendChild(textnode);
          node.classList.add("ui-state-default");
          node.classList.add(innerTextToClass(i));
          ul.appendChild(node);
        }
        break;
      case '5':
        for (let i of rules[5]) {
          let node = document.createElement("li");
          let textnode = document.createTextNode(`${i}`);
          node.appendChild(textnode);
          node.classList.add("ui-state-default");
          node.classList.add(innerTextToClass(i));
          ul.appendChild(node);
        }
        break;
    }
  });
});

let recButton;

function setup() {
  let p5Canvas = createCanvas(400, 400);
  canvas = p5Canvas.canvas;

  gui = createGui();

  recButton = document.getElementById('record')

  recButton.onclick = function () {
    capturer.start();
    isRecording = true;
    recButton.setAttribute('disabled', true);
  };





  thetaSlider = createSliderV("theta", 20, 40, 32, 300, 0, TWO_PI);
  thetaSlider.val = radians(25);

  tree = new Lsystem();
  frameCount = 0;

}

function draw() {
  background(220);
  drawGui();




  list = selectAll('li');
  rule = '';
  list.forEach(el => rule += el.html());
  tree.setRules(rule);

  if (thetaSlider.isChanged) {
    tree.setAngle(thetaSlider.val);
  }

  frameCount++;
  if (frameCount % 7 === 0) {
    tree.generate();
  }


  tree.turtle();



  if (gifFrameCount === 30) {
    capturer.stop();
    capturer.save((blob) => {

      var reader = new FileReader();
      reader.readAsDataURL(blob);

      let photo;

      reader.onloadend = function () {

        let base64 = reader.result;
        let rule = tree.getRule();
        rule = rule.replaceAll("[", "o");
        rule = rule.replaceAll("]", "c");
        rule = rule.replaceAll("+", "p");
        rule = rule.replaceAll("-", "m");

        photo = JSON.stringify({ "name": rule + ".gif", "uri": base64 });

        console.log(photo)

        fetch('/upload', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: photo
        }).then(function (response) {
          return response;
        })
          .then(function (result) {
            console.log(result.status);
            isRecording = false;
            console.log("done");
            gifFrameCount = 0;

            location.reload();
            return false;
          })
          .catch(function (error) {
            console.log('Request failed', error);
          });
      }

    });




  }

  if (isRecording) {
    capturer.capture(canvas);
    gifFrameCount++;
  }
  else {
    recButton.removeAttribute('disabled', true)
  }


}

function touchMoved() {
  // do some stuff
  return false;
}

