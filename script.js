import { mouse, ResetMode } from "./touch_screen.js";
import { Point, PointMove, MoveAllPoint, smode, SelectPoint } from "./point.js";
let svgdiv = document.getElementById('svgdiv'), svg = svgdiv.querySelector("svg"), toolbar = document.getElementById('objtls');
editor.container.style.fontSize = "16px"; 
editor.setValue("The Code will be visible once you click on the Code Editor Button.");
export let selectedSVG = null, svgselected = false, selected = [], scale = 1;
let offMX, offMY, offsetX = 0, offsetY = 0, Width = svgdiv.clientWidth, Height = svgdiv.clientHeight;
let properties = {
  obtype: document.getElementById("obtype"),
  name: document.getElementById("thename"),
  posx: document.getElementById("posx"),
  posy: document.getElementById("posy"),
  size: document.getElementById("sizee"),
  rotate: document.getElementById("rotatee"),
  thebc: document.getElementById("thebc"),
  thefc: document.getElementById("thefc"),
  thesw: document.getElementById("thesw"),
  theop: document.getElementById("theop"),
  css: document.getElementById("css"),
  layer: document.getElementById("layerto")
};
export function Menu(visible){  //  propertise menu
	const menu = document.getElementById('objtls');
  if (visible && selectedSVG) {
	  menu.style.display = "block"
  } else {
	  menu.style.display = "none"
  }
}
export function SelectSVG(event) { // select drawings.
  const circles = svg.querySelectorAll('.point-circle');
  circles.forEach(circle => {
      circle.parentNode.removeChild(circle);
  });
  if (!event.target.classList.contains("point-circle")){
    selectedSVG = event.target;
  } else {
    if (smode){
      SelectPoint();
      console.log("hmm")
    }
  }
    if (selectedSVG.tagName.toLowerCase() == "svg"){
      ResetMode();
    }
    if (!selectedSVG.classList.contains("point-circle")){
      LoadProperties(selectedSVG);
    }
    const bbox = selectedSVG.getBBox();
    const x = bbox.x + bbox.width / 2;
    const y = bbox.y + bbox.height / 2;
    if (event.touches) {
        event.preventDefault();
        offMX = mouse.x1 - x - offsetX;
        offMY = mouse.y1 - y - offsetY;
    } else {
        offMX = mouse.x1 - x - offsetX;
        offMY = mouse.y1 - y - offsetY;
    }
  if (selectedSVG.tagName.toLowerCase() === "path" && selectedSVG.getAttribute("transform") == null){
    selectedSVG.setAttribute("transform", `translate(${offMX}, ${offMY})`);
  }
  Point(selectedSVG);
}
export function DragSVG(event) {
    if (selectedSVG !== null && !event.target.classList.contains("point-circle") && !pointmoving) {
        MoveAllPoint(mouse.dragX, mouse.dragY);

        if (event.touches) {
            event.preventDefault();
        }

        const tagName = selectedSVG.tagName.toLowerCase();
        const offsetX = event.offsetX || event.touches[0].pageX;
        const offsetY = event.offsetY || event.touches[0].pageY;

        switch (tagName) {
            case 'circle':
            case 'ellipse':
                selectedSVG.setAttribute("cx", offsetX - offMX - mouse.dragX);
                selectedSVG.setAttribute("cy", offsetY - offMY - mouse.dragY);
                break;
            case 'line':
            case 'rect':
            case 'polygon':
            case 'path':
                let transform = selectedSVG.getAttribute('transform') || '';
                let newTransform = transform;

                // Extract translation values
                let currentTranslateX = 0;
                let currentTranslateY = 0;
                const translateMatch = transform.match(/translate\(([^,]+),([^)]+)\)/);
                if (translateMatch && translateMatch.length >= 3) {
                    currentTranslateX = parseFloat(translateMatch[1]);
                    currentTranslateY = parseFloat(translateMatch[2]);
                }

                // Update translation
                let newTranslateX = currentTranslateX + mouse.dragX;
                let newTranslateY = currentTranslateY + mouse.dragY;
                newTransform = newTransform.replace(/translate\([^)]+\)/, `translate(${newTranslateX}, ${newTranslateY})`);

                selectedSVG.setAttribute('transform', newTransform);
                break;
        }
    } else {
        PointMove();
    }
}

let pmx = 0, pmy = 0, mx = 0, my = 0, release = true;
export function Move(event){ // Move Paper
  pmx = mx;
  pmy = my;
  if (release == false){
    mx = event.clientX;
    my = event.clientY;
    offsetX -= (mx - pmx)/scale;
    offsetY -= (my - pmy)/scale;
    Refresh();
  } else {
    release = false;
    pmx = event.clientX;
    pmy = event.clientY;
    offsetX -= (mx - pmx)/scale;
    offsetY -= (my - pmy)/scale;
  }
}
export function ReleaseSVG() {  // Release Drawings
    release = true;
    svgselected = false;
    pointmoving = false;
}
svgdiv.addEventListener("wheel", function(event) {  // zoom with mouse wheel
  event.preventDefault();
  const scaleFactor = scale/10;
  const delta = event.deltaY;
  const zoomOut = delta > 0;
  if (zoomOut) {
    scale -= scaleFactor;
  } else {
    scale += scaleFactor;
  }
  const minScale = 1.0753054578045015e-9;
  const maxScale = 1000000;
  scale = Math.max(minScale, Math.min(maxScale, scale));
  Width = svgdiv.clientWidth/scale;
  Height = svgdiv.clientHeight/scale;
  Refresh();
});
let initialDistance = 0;
svgdiv.addEventListener('touchstart', function(event) {  // zoom with touch
    if (event.touches.length === 2) {
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        initialDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
    }
});
svgdiv.addEventListener('touchmove', function(event) {
    if (event.touches.length === 2) {
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        const currentDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
        const scaleFactor = currentDistance / initialDistance;
        scale *= scaleFactor;
        const minScale = 1.0753054578045015e-9;
        const maxScale = 1000000;
        scale = Math.max(minScale, Math.min(maxScale, scale));
        Width = svgdiv.clientWidth / scale;
        Height = svgdiv.clientHeight / scale;
        Refresh();
        initialDistance = currentDistance;
        event.preventDefault();
    }
});
export function Refresh(){ // Refresh Paper
  svg.setAttribute('viewBox', `${offsetX} ${offsetY} ${Width} ${Height}`);
}
Refresh();
export function DeleteSVG() { // delete drawings
  Menu(false);
  if (selectedSVG !== null){
    selectedSVG.remove();
    selectedSVG = null;
  }
  savedo()
}
export function CopySVG() {
    Menu(false);
    if (selectedSVG !== null) {
        const copy = selectedSVG.cloneNode(true);
        if (copy instanceof SVGElement) {
            switch (selectedSVG.tagName.toLowerCase()) {
                case 'circle':
                case 'ellipse':
                    const cx = parseFloat(selectedSVG.getAttribute('cx'));
                    const cy = parseFloat(selectedSVG.getAttribute('cy'));
                    copy.setAttribute('cx', cx - 15);
                    copy.setAttribute('cy', cy - 15);
                    break;
                case 'rect':
                case 'polygon':
                case 'path':
                case 'line':
                    const transform = `translate(15, 15) ${selectedSVG.getAttribute('transform') || ''}`;
                    copy.setAttribute('transform', transform);
                    break;
                default:
                    console.warn('Unsupported shape:', selectedSVG.tagName);
                    break;
            }
            svg.appendChild(copy);
        } else {
            console.error("Cloned element is not a valid SVG element.");
        }
    }
  savedo();
}
let donum = -1;
let dosvg = [];
export function undo(){
  if (donum > 0){
    donum -= 1;
    svg.innerHTML = dosvg[donum];
  }
}
export function redo(){
  if (donum < dosvg.length - 1){
    donum += 1;
    svg.innerHTML = dosvg[donum];
  }
}
export function savedo() {
    if (donum === dosvg.length) {
        dosvg.push(svg.innerHTML);
        donum = dosvg.length;
    } else {
        dosvg.splice(donum);
        dosvg.push(svg.innerHTML);
        donum = dosvg.length;
    }
}
function LoadProperties(s) {
  properties.obtype.innerText = "Type: " + s.tagName.toLowerCase();
  properties.name.value = s.getAttribute("id") || "";

  var transform = s.getAttribute("transform");
  var rotateValue = "";
  if (transform) {
    var rotateMatch = transform.match(/rotate\(([^)]+)\)/);
    if (rotateMatch && rotateMatch[1]) {
      rotateValue = rotateMatch[1];
    }
  }
  var scaleValue = "";
  if (transform) {
    var scaleMatch = transform.match(/scale\(([^),]+)(?:,([^)]+))?\)/);
    if (scaleMatch && scaleMatch[1]) {
      scaleValue = scaleMatch[1];
    }
  }
  properties.layer.value = getIndexInParent(s);
  properties.thebc.value = isValidColor(s.getAttribute("stroke")) ? s.getAttribute("stroke") : "#000000";
  properties.thefc.value = isValidColor(s.getAttribute("fill")) ? s.getAttribute("fill") : "#000000";
  properties.thesw.value = s.getAttribute("stroke-width") || "";
  properties.theop.value = s.getAttribute("opacity") || "";
  properties.css.innerText = s.getAttribute("class") || "";
  properties.posx.parentElement.style.display = "block";
  properties.posy.parentElement.style.display = "block";

  switch (s.tagName.toLowerCase()) {
    case 'circle':
    case 'ellipse':
      properties.posx.value = parseFloat(s.getAttribute("cx")) || "";
      properties.posy.value = parseFloat(s.getAttribute("cy")) || "";
      break;
    case 'path':
    case 'rect':
    case 'line':
    case 'polygon':
      let transformAttr = s.getAttribute("transform");
      if (transformAttr) {
        let translateMatch = transformAttr.match(/translate\(([^,]+),([^)]+)\)/);
        if (translateMatch && translateMatch.length >= 3) {
          let translateX = parseFloat(translateMatch[1]);
          let translateY = parseFloat(translateMatch[2]);
          properties.posx.value = isNaN(translateX) ? "" : translateX;
          properties.posy.value = isNaN(translateY) ? "" : translateY;
        } else {
          properties.posx.value = "";
          properties.posy.value = "";
        }
      } else {
        properties.posx.value = "";
        properties.posy.value = "";
      }
      break;
    default:
      // Hide position properties for unsupported elements
      properties.posx.parentElement.style.display = "none";
      properties.posy.parentElement.style.display = "none";
      break;
  }
}

function isValidColor(color) {
  return /^#[0-9A-F]{6}$/i.test(color);
}
function SaveProperties() {
  let s = selectedSVG;
  switch (s.tagName.toLowerCase()) {
    case 'circle':
    case 'ellipse':
      s.setAttribute("cx", properties.posx.value);
      s.setAttribute("cy", properties.posy.value);
      break;
    case 'path':
    case 'rect':
    case 'line':
    case 'polygon':
      let transformAttr = s.getAttribute("transform");
      let translateX = 0;
      let translateY = 0;

      // Extract existing translation values
      if (transformAttr) {
        let translateMatch = transformAttr.match(/translate\(([^,]+),([^,]+)\)/);
        if (translateMatch && translateMatch.length >= 3) {
          translateX = parseFloat(translateMatch[1]);
          translateY = parseFloat(translateMatch[2]);
        }
      }

      // Apply new translation
      if (properties.posx.value !== "") {
        translateX = parseFloat(properties.posx.value);
      }
      if (properties.posy.value !== "") {
        translateY = parseFloat(properties.posy.value);
      }

      // Construct combined transform attribute
      let newTransform = `translate(${translateX}, ${translateY})`;

      // Apply scaling if present
      if (properties.size.value !== "") {
        newTransform += ` scale(${properties.size.value})`;
      }

      s.setAttribute("transform", newTransform.trim());
      break;
  }

  if (properties.thebc.value !== "") {
    s.setAttribute("stroke", properties.thebc.value);
  } else {
    s.removeAttribute("stroke");
  }

  if (properties.thefc.value !== "") {
    s.setAttribute("fill", properties.thefc.value);
  } else {
    s.removeAttribute("fill");
  }

  if (properties.thesw.value !== "") {
    s.setAttribute("stroke-width", properties.thesw.value);
  } else {
    s.removeAttribute("stroke-width");
  }

  if (properties.theop.value !== "") {
    s.setAttribute("opacity", properties.theop.value);
  } else {
    s.removeAttribute("opacity");
  }

  if (properties.rotate.value !== "" && properties.scale && properties.scale.value !== undefined) {
      s.setAttribute("transform", (s.getAttribute("transform") || "") + " rotate(" + properties.rotate.value + ")" + " scale(" + properties.scale.value + ")");
  }

  if (properties.css.innerText !== "") {
    s.setAttribute("class", properties.css.innerText);
  } else {
    s.removeAttribute("class");
  }
  moveToBottom(s, properties.layer.value);
}
toolbar.addEventListener("change", SaveProperties);
function getIndexInParent(element) {
    const parent = element.parentNode;
    if (!parent) return -1; // Return -1 if the element has no parent
    const children = parent.children;
    for (let i = 0; i < children.length; i++) {
        if (children[i] === element) {
            return i; // Return the index if the element is found
        }
    }
    return -1; // Return -1 if the element is not found among the children
}
function moveToBottom(svgElement, index) {
    const parent = svgElement.parentNode;
    const referenceNode = parent.children[index];
    parent.insertBefore(svgElement, referenceNode);
}
