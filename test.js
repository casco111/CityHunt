console.log("test")



/*
els.bar.style.width = "20%"
const div = document.createElement('div');
div.className = 'opt';
//div.setAttribute('role','radio');
//div.setAttribute('aria-checked','false');
//div.tabIndex = 0;
div.innerHTML = `<span class="dot"></span><span>test</span>`;
div.addEventListener("click", ()=>{
    let set = div.getAttribute('aria-checked')||"false";
    set = set == "false"? "true" : "false"; 
    div.setAttribute('aria-checked',set+"");
})

els.options.appendChild(div);

const div2 = document.createElement('input');
div2.type = "text";
div2.placeholder = "text";

els.textRow.appendChild(div2);

const q1 =   { type: "mc", q: "Which language runs in a web browser?", options: ["Python", "C++", "JavaScript", "Java"], answer: 2, explain: "JavaScript is built into browsers." };


let mc = new multipleChoice(q1);
//mc.show();

const q2 =  { type: "text", q: "What color do you get when you mix blue and yellow?", answer: ["green"], explain: "Blue + yellow = green.", img:"https://www.animenachrichten.de/wp-content/uploads/2018/11/OK-saitama-one-punch-man-39439986-1920-1080.png" };
let tq = new inputQuestion(q2);
tq.show();
els.btnSubmit.addEventListener("click", ()=>{
   // console.log(mc.check())
    console.log(tq.check())
})
*/

const q = new dragDropQuestion({
    q: "Match the country with its capital:",
    options: ["Paris", "Rome", "Tokyo"],
    targets: [
        { label: "France", answer: 0 },  // expects "Paris"
        { label: "Italy", answer: 1 },   // expects "Rome"
        { label: "Japan", answer: 2 }    // expects "Tokyo"
    ],
    explain: "Paris → France, Rome → Italy, Tokyo → Japan.",
    img: null
});

q.show();
