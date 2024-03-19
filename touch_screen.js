import { SelectSVG, DragSVG, ReleaseSVG, Move, DeleteSVG, CopySVG, Menu, savedo, undo, redo } from "./script.js";
let svg = document.getElementById("svgdiv").querySelector("svg");
export let mouse = {
    x1: 0,  // mouse down position
    y1: 0,
    x2: 0,  // mouse up position
    y2: 0,
    x: 0,   // mouse position when moving
    y: 0,
    rx: 0,  // right-click position
    ry: 0,
    down: false,  // mouse click type
    right: false,
    drag: false,
    dragX: 0,  // mouse moving px per ms
    dragY: 0
};
let selectedShape, selectmode = 0;
export function ResetMode() {
  selectmode = 0;
  selectedShape = null;
  move.setAttribute("using", "");
  select.removeAttribute("using");
}
let [Line, Circle, Rect] = [
  document.getElementById('line'),
  document.getElementById('circle'),
  document.getElementById('rect')
]
Line.addEventListener('click', function(){
  selectedShape = 1;
  selectmode = 1;
});
Circle.addEventListener('click', function(){
  selectedShape = 2;
  selectmode = 1;
});
Rect.addEventListener('click', function(){
  selectedShape = 3;
  selectmode = 1;
});
let [move, select, del, cop, und, red] = [
    document.querySelector('button[title="Offset"]'),
    document.querySelector('button[title="Cursor"]'),
    document.querySelector('button[title="delete"]'),
    document.querySelector('button[title="Copy"]'),
    document.querySelector('button[title="undo"]'),
    document.querySelector('button[title="redo"]'),
];
move.addEventListener("mousedown", function(event){
    selectmode = 0;
    Menu(false);
    selectedShape = null;
    move.setAttribute("using", "");
    select.removeAttribute("using");
});
move.addEventListener("touchstart", function(event){
    selectmode = 0;
    Menu(false);
    selectedShape = null;
    move.setAttribute("using", "");
    select.removeAttribute("using");
});
select.addEventListener("mousedown", function(event){
    selectmode = 1;
    Menu(false);
    selectedShape = null;
    select.setAttribute("using", "");
    move.removeAttribute("using");
});
select.addEventListener("touchstart", function(event){
    selectmode = 1;
    Menu(false);
    selectedShape = null;
    select.setAttribute("using", "");
    move.removeAttribute("using");
});
del.addEventListener("click", DeleteSVG);
cop.addEventListener("click", CopySVG);
und.addEventListener("click", undo);
red.addEventListener("click", redo);
function handleMouseDown(e) {
    mouse.drag = true;
    mouse.down = true;
    const mousePos = getMousePositionRelativeToViewBox(e);
    mouse.x1 = mousePos.x;
    mouse.y1 = mousePos.y;
    if (selectmode == 1){
        Menu(true);
        SelectSVG(e);
    } else {
      Menu(false);
    }
}
function handleMouseUp(e) {
    mouse.drag = false;
    mouse.down = false;
    const mousePos = getMousePositionRelativeToViewBox(e);
    mouse.x2 = mousePos.x;
    mouse.y2 = mousePos.y;
    ReleaseSVG(e);
  if (selectmode == 1){
    if (selectedShape == 1){
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", mouse.x1);
      line.setAttribute("y1", mouse.y1);
      line.setAttribute("x2", mouse.x2);
      line.setAttribute("y2", mouse.y2);
      line.setAttribute("stroke", "black");
      line.setAttribute("stroke-width", "5");
      svg.appendChild(line);
    }
  }
  if (selectedShape == 2){
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", mouse.x1);
    circle.setAttribute("cy", mouse.y1);
    circle.setAttribute("r", Math.sqrt(Math.pow(mouse.x2 - mouse.x1, 2) + Math.pow(mouse.y2 - mouse.y1, 2)));
    circle.setAttribute("stroke", "black");
    circle.setAttribute("stroke-width", "5");
    svg.appendChild(circle);
  }
  if (selectedShape == 3){
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", mouse.x1);
    rect.setAttribute("y", mouse.y1);
    rect.setAttribute("width", Math.abs(mouse.x2 - mouse.x1));
    rect.setAttribute("height", Math.abs(mouse.y2 - mouse.y1));
    rect.setAttribute("stroke", "black");
    rect.setAttribute("stroke-width", "5");
    svg.appendChild(rect);
  }
  selectedShape = 0;
}
function handleMouseMove(e) {
    const mousePos = getMousePositionRelativeToViewBox(e);
    mouse.x = mousePos.x;
    mouse.y = mousePos.y;
    mouse.dragX = mouse.x - preMouse.x;
    mouse.dragY = mouse.y - preMouse.y;
    preMouse.x = mouse.x;
    preMouse.y = mouse.y;
    if (selectmode == 1 && mouse.drag){
        DragSVG(e);
    }
    if (selectmode == 0 && mouse.drag){
      Move(e);
    }
}
function handleContextMenu(event) {
    event.preventDefault();
    if (event.button === 2) {
        mouse.right = true;
        const mousePos = getMousePositionRelativeToViewBox(event);
        mouse.rx = mousePos.x;
        mouse.ry = mousePos.y;
    } else {
        mouse.right = false;
    }
}
function handleTouchStart(e) {
    e.preventDefault();
    let touch = e.touches[0];
    mouse.down = true;
    const mousePos = getMousePositionRelativeToViewBox(touch);
    mouse.x1 = mousePos.x;
    mouse.y1 = mousePos.y;
    if (selectmode == 1){
        Menu(true);
        SelectSVG(e);
    } else {
      Menu(false);
    }
}
function handleTouchEnd(e) {
    e.preventDefault();
    mouse.drag = false;
    mouse.down = false;
    let touch = e.changedTouches[0];
    const mousePos = getMousePositionRelativeToViewBox(touch);
    mouse.x2 = mousePos.x;
    mouse.y2 = mousePos.y;
    ReleaseSVG(e);
  if (selectmode == 1){
    if (selectedShape == 1){
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", mouse.x1);
      line.setAttribute("y1", mouse.y1);
      line.setAttribute("x2", mouse.x2);
      line.setAttribute("y2", mouse.y2);
      line.setAttribute("stroke", "black");
      line.setAttribute("stroke-width", "5");
      svg.appendChild(line);
    }
  }
  if (selectedShape == 2){
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", mouse.x1);
    circle.setAttribute("cy", mouse.y1);
    circle.setAttribute("r", Math.sqrt(Math.pow(mouse.x2 - mouse.x1, 2) + Math.pow(mouse.y2 - mouse.y1, 2)));
    circle.setAttribute("stroke", "black");
    circle.setAttribute("stroke-width", "5");
    svg.appendChild(circle);
  }
  if (selectedShape == 3){
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", mouse.x1);
    rect.setAttribute("y", mouse.y1);
    rect.setAttribute("width", Math.abs(mouse.x2 - mouse.x1));
    rect.setAttribute("height", Math.abs(mouse.y2 - mouse.y1));
    rect.setAttribute("stroke", "black");
    rect.setAttribute("stroke-width", "5");
    svg.appendChild(rect);
  }
  selectedShape = 0;
}
function handleTouchMove(e) {
    e.preventDefault();
    let touch = e.touches[0];
    mouse.drag = true;
    const mousePos = getMousePositionRelativeToViewBox(touch);
    mouse.x = mousePos.x;
    mouse.y = mousePos.y;
    mouse.dragX = mouse.x - preMouse.x;
    mouse.dragY = mouse.y - preMouse.y;
    preMouse.x = mouse.x;
    preMouse.y = mouse.y;
    if (selectmode == 1){
        DragSVG(touch);
    }
    if (selectmode == 0){
        Move(touch);
    }
}
svg.addEventListener("mousedown" , handleMouseDown);
svg.addEventListener("mouseup" , handleMouseUp);
svg.addEventListener("mousemove" , handleMouseMove);
svg.addEventListener('contextmenu', handleContextMenu);
svg.addEventListener("touchstart", handleTouchStart);
svg.addEventListener("touchend", handleTouchEnd);
svg.addEventListener("touchmove", handleTouchMove);
let preMouse = {x: 0, y: 0};
function getMousePositionRelativeToViewBox(event) {
    const rect = svg.getBoundingClientRect();
    const scaleX = svg.viewBox.baseVal.width / rect.width;
    const scaleY = svg.viewBox.baseVal.height / rect.height;
    const viewBoxX = svg.viewBox.baseVal.x;
    const viewBoxY = svg.viewBox.baseVal.y;
    const mouseX = (event.clientX - rect.left) * scaleX + viewBoxX;
    const mouseY = (event.clientY - rect.top) * scaleY + viewBoxY;
    return { x: mouseX, y: mouseY };
}
