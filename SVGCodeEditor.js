let svgdiv = document.getElementById('svgdiv');
let svg = svgdiv.querySelector("svg");
let ex = document.getElementById('ex');
let im = document.getElementById('im');
let groups = svg.querySelectorAll("g");
let upbtn = document.getElementById('codebackbyn');
im.addEventListener("click", function () {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/svg+xml";
  input.addEventListener("change", handleFileSelect);
  document.body.appendChild(input);
  input.click();
  document.body.removeChild(input);
});
ex.addEventListener("click", function () {
  const svgData = new XMLSerializer().serializeToString(svg);
  const blob = new Blob([svgData], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "my-drawing.svg";
  a.click();
  URL.revokeObjectURL(url);
});
function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const svgContent = e.target.result;
      svg.innerHTML = svgContent;
    };
    reader.readAsText(file);
  }
}
upbtn.addEventListener("click", function (){
  let code = editor.getValue();
	svg.innerHTML = code;
});