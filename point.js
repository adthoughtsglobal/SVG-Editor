import { scale, selectedSVG } from "./script.js";
import { mouse, ResetMode } from "./touch_screen.js";
let selP = [];
function Split(str){
  let txtarry = [];
  let sel = "";
  let arry = [];
  let sel2 = "";
  for(var i = 0; i < str.length; i++){
    if(str[i] == "M" || str[i] == "L" || str[i] == "Q" || str[i] == "C" || str[i] == "Z" && sel !== null){
      sel = sel + str[i];
      txtarry.push(sel);
      sel = "";
    } else {
      sel = sel + str[i];
    }
  }
  for(var i = 0; i < str.length; i++){
    let txt = `${txtarry[i]}`
    for(var j = 0; j < txt.length; j++){
      if(txt[j] == " "){
        sel2 = sel2 + txt[j];
        arry.push(sel2);
        sel2 = "";
      } else {
        sel2 = sel2 + txt[j];
      }
    }
  }
  return arry;
}
function Combine(arry){
  let txt = "";
  for(var i = 0; i < arry.length; i++){
    txt = txt + arry[i];
  }
  return txt + " Z";
}
function Filter(splitarry) {
  let arry = [];
  let kom = false;
  for (var i = 0; i < splitarry.length; i++) {
    let currentString = splitarry[i];
    let filteredString = "";
    let deeparr = [];
    for (var j = 0; j < currentString.length; j++) {
      if (currentString[j] !== "M" && currentString[j] !== "L" && currentString[j] !== "Q" && currentString[j] !== "C" && currentString[j] !== "Z") {
        filteredString += currentString[j];
        if (currentString[j+1] == "," || currentString[j+1] == " "){
          kom = true;
        } else if (currentString[j] == "," || currentString[j] == " "){
          filteredString = "";
        }
        if (filteredString !== "" && currentString[j] !== "," && kom && currentString[j] !== " ") {
          deeparr.push(parseFloat(filteredString));
          kom = false;
        }
      }
    }
    if (deeparr.length > 0) {
      arry.push(deeparr);
    }
  }
  return arry;
}
function React(element, chemical, mix){
  if (chemical[element] !== null){
    if (chemical[element].includes("M")){
      chemical[element] = `M${mix[0]},${mix[1]} `;
    } else if(chemical[element].includes("L")){
      chemical[element] = `L${mix[0]},${mix[1]} `;
    } else if(chemical[element].includes("Q")){
      chemical[element] = `Q${mix[0]},${mix[1]} `;
    } else if(chemical[element].includes("C")){
      chemical[element] = `C${mix[0]},${mix[1]} `;
    } else {
      chemical[element] = `${mix[0]},${mix[1]} `;
    }
  }
  return chemical;
}


let svgdiv = document.getElementById('svgdiv'), svg = svgdiv.querySelector("svg"), toolbar = document.getElementById('objtls'), svgNS = 'http://www.w3.org/2000/svg'
let p = [];
let clickedP = null;
let splited = [];
export function Point(s) {
  let positions;
  const bbox = s.getBBox();
  const X = bbox.x + bbox.width / 2;
  const Y = bbox.y + bbox.height / 2;
  if (s.tagName.toLowerCase() === "circle") {
    positions = [[X + parseFloat(s.getAttribute("r")), Y]];
    positions.forEach((position, index) => {
      const [x, y] = position;
      p.push(document.createElementNS(svgNS, 'circle'));
      p[index].setAttribute('r', `${10/scale}`);
      p[index].setAttribute('cx', x);
      p[index].setAttribute('cy', y);
      p[index].setAttribute('fill', '#000');
      p[index].classList.add('point-circle');
      p[index].addEventListener('mousedown', () => {
        pointmoving = true;
        clickedP = index;
      });
      svg.appendChild(p[index]);
    });
  }
  if (s.tagName.toLowerCase() === "ellipse") {
    positions = [[X + parseFloat(s.getAttribute("rx")), Y], [X, Y + parseFloat(s.getAttribute("ry"))]];
    positions.forEach((position, index) => {
      const [x, y] = position;
      p.push(document.createElementNS(svgNS, 'circle'));
      p[index].setAttribute('r', `${10/scale}`);
      p[index].setAttribute('cx', x);
      p[index].setAttribute('cy', y);
      p[index].setAttribute('fill', '#000');
      p[index].classList.add('point-circle');
      p[index].addEventListener('mousedown', () => {
        pointmoving = true;
        clickedP = index;
      });
      svg.appendChild(p[index]);
    });
  }
  const transformAttr = s.getAttribute("transform");
  const scaleMatch = transformAttr.match(/scale\(([^)]+)\)/);
  let transscale;
  if (scaleMatch) {
      transscale = parseFloat(scaleMatch[1]);
  } else {
      transscale = 1;
  }
  if (s.tagName.toLowerCase() === "path"){
    let X, Y;
    splited = Split(selectedSVG.getAttribute("d"))
    positions = Filter(splited);
    let transformAttr = s.getAttribute("transform");
    if (transformAttr) {
      [X, Y] = transformAttr.split("(")[1].split(")")[0].split(",");
    } else {
      console.error("The 'transform' attribute is null or undefined.");
    }
    positions.forEach((position, index) => {
      const [x, y] = position;
      p.push(document.createElementNS(svgNS, 'circle'));
      p[index].setAttribute('r', `${10/scale}`);
      p[index].setAttribute('cx', x * transscale + parseFloat(X));
      p[index].setAttribute('cy', y * transscale + parseFloat(Y));
      p[index].setAttribute('fill', '#000');
      p[index].classList.add('point-circle');
      p[index].addEventListener('mousedown', () => {
        pointmoving = true;
        clickedP = index;
      });
      svg.appendChild(p[index]);
    });
  }
}
export function PointMove() {
  if (selectedSVG.tagName.toLowerCase() === "circle") {
    const cx = parseFloat(p[0].getAttribute('cx')) + mouse.dragX;
    const r = parseFloat(selectedSVG.getAttribute('r')) + mouse.dragX;
    if (r > 1) {
      p[0].setAttribute('cx', cx);
      selectedSVG.setAttribute("r", r);
    }
  }
  if (selectedSVG.tagName.toLowerCase() === "ellipse") {
    const dx = mouse.dragX;
    const dy = mouse.dragY;
    if (clickedP == 0) {
      const cx = parseFloat(p[0].getAttribute('cx')) + dx;
      const rx = parseFloat(selectedSVG.getAttribute('rx')) + dx;
      if (rx > 1) {
        p[0].setAttribute('cx', cx);
        selectedSVG.setAttribute("rx", rx);
      }
    }
    if (clickedP == 1) {
      const cy = parseFloat(p[1].getAttribute('cy')) + dy;
      const ry = parseFloat(selectedSVG.getAttribute('ry')) + dy;
      if (ry > 1) {
        p[1].setAttribute('cy', cy);
        selectedSVG.setAttribute("ry", ry);
      }
    }
  }
  const transformAttr = selectedSVG.getAttribute("transform");
  const scaleMatch = transformAttr.match(/scale\(([^)]+)\)/);
  let transscale;
  if (scaleMatch) {
      transscale = parseFloat(scaleMatch[1]);
  } else {
      transscale = 1;
  }
  if (selectedSVG.tagName.toLowerCase() === "path") {
      let X, Y;
      const dx = mouse.dragX;
      const dy = mouse.dragY;
      transscale = 1 / transscale; // Inverse of the scale factor

      if (clickedP !== null && selP.length == 0) {
          const draggedCircle = p[clickedP];
          const newCx = parseFloat(draggedCircle.getAttribute('cx')) + dx;
          const newCy = parseFloat(draggedCircle.getAttribute('cy')) + dy;
          draggedCircle.setAttribute('cx', newCx);
          draggedCircle.setAttribute('cy', newCy);
          const transformAttr = selectedSVG.getAttribute("transform");
          if (transformAttr) {
              [X, Y] = transformAttr.split("(")[1].split(")")[0].split(",");
          } else {
              console.error("The 'transform' attribute is null or undefined.");
          }
          const updatedPathData = Combine(React(clickedP, splited, [(newCx - parseFloat(X)) * transscale, (newCy - parseFloat(Y)) * transscale]));
          selectedSVG.setAttribute('d', updatedPathData);
      } else if (selP.length !== 0) {
          selP.forEach(sel => {
              const draggedCircle = p[sel];
              const newCx = parseFloat(draggedCircle.getAttribute('cx')) + dx;
              const newCy = parseFloat(draggedCircle.getAttribute('cy')) + dy;
              draggedCircle.setAttribute('cx', newCx);
              draggedCircle.setAttribute('cy', newCy);
              const transformAttr = selectedSVG.getAttribute("transform");
              if (transformAttr) {
                  [X, Y] = transformAttr.split("(")[1].split(")")[0].split(",");
              } else {
                  console.error("The 'transform' attribute is null or undefined.");
              }
              const updatedPathData = Combine(React(sel, splited, [(newCx - parseFloat(X)) * transscale, (newCy - parseFloat(Y)) * transscale]));
              selectedSVG.setAttribute('d', updatedPathData);
          });
      }
  }

}
export function MoveAllPoint(dx, dy) {
  const circles = svg.querySelectorAll('.point-circle');
  circles.forEach(circle => {
    const cx = parseFloat(circle.getAttribute('cx')) + dx;
    const cy = parseFloat(circle.getAttribute('cy')) + dy;
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
  });
}
function DeletePoint(){
  if (clickedP !== null && selP == []) {
    p[clickedP].remove();
    //p.splice(clickedP, 1);
    clickedP = null;
  } else if (selP !== []){
    selP.forEach(sel => {
      sel.remove();
    });
    selP = [];
  }
}
export function SelectPoint(){
  if (clickedP !== null){
    selP.push(clickedP);
  } else {
    console.error("The 'clickedP' variable is null or undefined.");
  }
}
function AddPoint(){
  if (clickedP !== null && selP.length == 0){
    p.push(document.createElementNS(svgNS, 'circle'));
    p[p.length - 1].setAttribute('r', `${10/scale}`);
    p[p.length - 1].setAttribute('cx', p[clickedP].getAttribute('cx'));
    p[p.length - 1].setAttribute('cy', p[clickedP].getAttribute('cy'));
    p[p.length - 1].setAttribute('fill', '#000');
    p[p.length - 1].classList.add('point-circle');
    p[p.length - 1].addEventListener('mousedown', () => {
      pointmoving = true;
      clickedP = p.length - 1;
    });
    svg.appendChild(p[p.length - 1]);
  } else if (selP.length !== 0){
    let tempP = [];
    selP.forEach(sel => {
      p.push(document.createElementNS(svgNS, 'circle'));
      p[p.length - 1].setAttribute('r', `${10/scale}`);
      p[p.length - 1].setAttribute('cx', p[sel].getAttribute('cx'));
      p[p.length - 1].setAttribute('cy', p[sel].getAttribute('cy'));
      p[p.length - 1].setAttribute('fill', '#000');
      p[p.length - 1].classList.add('point-circle');
      p[p.length - 1].addEventListener('mousedown', () => {
        pointmoving = true;
        clickedP = p.length - 1;
        tempP.push(clickedP);
      });
      svg.appendChild(p[p.length - 1]);
    });
    selP = [];
    selP = tempP;
  }
}
export let smode;
document.addEventListener('keydown', function(event) {
  if (event.shiftKey) {
    smode = true;
  }
});
document.addEventListener('keyup', function(event){
    smode = false;
    selP = [];
});