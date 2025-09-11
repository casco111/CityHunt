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


const quests = [
    // 🔹 Quest 1: Professor Falks Haus
    {
        location: {
            latitude: 48.200100,
            longitude: 16.370100
        },
        questions: [
            {
                type: "t",
                ht: "Professor Heinrich Falk",
                img: "https://i.pinimg.com/736x/45/49/81/4549812f34bc9f426f266491d2153b09.jpg",
                ct: "Es war ein Tag wie jeder andere. Du schlenderst die vertraute Straße entlang, vorbei an dem alten, ehrwürdigen Haus von Professor Heinrich Falk. Ein brillanter Wissenschaftler, bekannt für seinen scharfen Verstand und seinen immensen Fortschritt im Bereich von Quantum-Computing und KI. \n" +
                    "Doch dieser sonst so friedliche Ort ist mit Chaos und Hektik erfüllt. Blaulichter flackern, Polizeiautos stehen kreuz und quer, und Sanitäter laufen hektisch ins Haus. Ein leises Murmeln geht durch die Menge der Schaulustigen. Mord. \n  Neugier treibt dich näher an die Absperrung. Du bemerkst eine Überwachungskamera an einer Laterne in der Nähe. Wenn sie aktiv war, könnte sie den Täter gesehen haben. \n Schaffst du es, das System zu hacken, um an nützliche Informationen zu kommen?"
            },
            {
                type: "mc",
                q: "Beim Versuch eine Verbindung herzustellen wurde folgender Code zurückgegeben: 01101011 01100101 01111001",
                options: [
                    "Die Entfernung ist zu groß",
                    "Ein Passwort wird benötigt",
                    "Keine Stromversorgung",
                    "Keine Daten vorhanden"
                ],
                answer: 1,
                explain: "Der Binärcode ergibt 'key'. Es wird ein Passwort benötigt."
            },
            {
                type: "mc",
                q: "Wie findest du ein Passwort?",
                options: [
                    "Password probieren",
                    "Postleitzahl probieren",
                    "Kamera untersuchen",
                    "Falk probieren"
                ],
                answer: 2,
                explain: "Nur durch die Kamera-Inspektion findest du Hinweise."
            },
            {
                type: "mc",
                q: "In einem Fenster spiegelt sich die Rückseite der Kamera. Kannst du den Code erkennen?",
                img: "https://media.discordapp.net/attachments/846463038987304961/1347246974679777403/Code1.png?ex=68c44c85&is=68c2fb05&hm=efa99e04edddd8c4212a64a0b859b2620a4573f767246dd6db903eb4bba715e7&=&format=webp&quality=lossless",
                options: [
                    "AX8KQM14",
                    "AX8KQMN1",
                    "AX8KOV14",
                    "AX8ROMV4"
                ],
                answer: 0,
                explain: "Der richtige Code lautet AX8KQM14."
            },
            {
                type: "t",
                ht: "Gut gemacht!",
                ct: "Du hast Zugriff auf die Überwachungsaufnahmen. Vor 15 Minuten verließ ein Mann in Mantel das Haus. Er wirft etwas Kleines in den Mistkübel gegenüber…"
            }
        ]
    },

    // 🔹 Quest 2: Mistkübel / heiße Spur
    {
        location: {
            latitude: 48.200200,
            longitude: 16.370200
        },
        questions: [
            {
                type: "t",
                ht: "Eine heiße Spur",
                ct: "Zeit herauszufinden, was der Mann so dringend entsorgen musste!",
                img: "https://upload.wikimedia.org/wikipedia/commons/7/76/Trash_bin_in_Vienna_01.jpg"
            },
            {
                type: "mc",
                q: "Gehörte dies dem Täter?",
                img: "https://www.bio-einweggeschirr.at/media/image/product/27784/md/mwd08_just-paper-doppelwandbecher-braun-200ml-8oz-o-80-mm.jpg",
                options: ["möglich", "unwahrscheinlich"],
                answer: 1,
                explain: "Ein Becher hat keine Verbindung zum Täter."
            },
            {
                type: "mc",
                q: "Gehörte dies dem Täter?",
                img: "https://utopia.org/app/uploads/2021/10/you-can-you-eat-banana-peels-cc0-pixabay-alexas_fotos-211011.jpg",
                options: ["möglich", "unwahrscheinlich"],
                answer: 1,
                explain: "Eine Bananenschale – wohl kaum relevant."
            },
            {
                type: "mc",
                q: "Gehörte dies dem Täter?",
                img: "https://img.freepik.com/premium-photo/crumpled-paper-texture-crumpled-paper-isolated-white-background_570543-3210.jpg",
                options: ["möglich", "unwahrscheinlich"],
                answer: 0,
                explain: "Ein zerknüllter Zettel wirkt verdächtig!"
            },
            {
                type: "mc",
                q: "Gehörte dies dem Täter?",
                img: "https://media.istockphoto.com/id/515051993/de/foto/mcdonalds-fast-food-gericht-im-brown-paper-bag.jpg?s=612x612&w=0&k=20&c=K7IysEnNBA4Lrtr-8ZtH61vTiwcJsom07fUKF7asDGI=",
                options: ["möglich", "unwahrscheinlich"],
                answer: 1,
                explain: "Einen Cheesy hat er wohl kaum verwendet!"
            },
            {
                type: "t",
                ht: "Der Zettel",
                ct: "Das war alles! Es kann also nur der Zettel gewesen sein. Du beginnst ihn zu entziffern und bemerkst, dass es ein Zugticket von Wien Hbf nach Mödling für heute Vormittag war. Der Täter kommt also vermutlich aus Wien. \n Zeit die Verfolgung aufzunehmen!"
            }
        ]
    },

    // 🔹 Quest 3: Die Zugfahrt
    {
        location: {
            latitude: 48.200300,
            longitude: 16.370300
        },
        questions: [
            {
                type: "t",
                ht: "Die Zugfahrt",
                img: "https://assets.new.siemens.com/siemens/assets/api/uuid:c15f69f4-5123-496d-8582-8a881588fd7f/IM2021080596MO.jpg",
                ct: "Jetzt erstmal durchatmen! Ihr nutzt die Zugfahrt, um euch die Werke von dem verstorbenen Wissenschaftler genauer anzuschauen. Ein großer Teil seines Portfolios besteht aus generierter Kunst. Teilweise sind die Unterschiede zur Realität unverkennbar.",

            },
            {
                type: "mc",
                q: "Ist dieses Bild KI generiert?",
                img: "https://www.newsshooter.com/wp-content/uploads/2024/02/Screen-Shot-2024-02-15-at-5.09.45-PM.jpg",
                options: ["echt", "KI"],
                answer: 1,
                explain: "klarer Fake!"
            },
            {
                type: "mc",
                q: "Ist dieses Bild KI generiert?",
                img: "https://img.freepik.com/premium-photo/deep-forest-fantasy-backdrop-concept-art-realistic-illustration-video-game-digital-cg-artwork_21085-34823.jpg",
                options: ["echt", "KI"],
                answer: 1,
                explain: "klarer Fake!"
            },
            {
                type: "mc",
                q: "Ist dieses Bild KI generiert?",
                img: "https://t3.ftcdn.net/jpg/03/41/65/32/360_F_341653257_FFprp8DsN9o7wPf4KRzZKxiHDAOIcoGh.jpg",
                options: ["echt", "KI"],
                answer: 0,
                explain: "zu real!"
            },
            {
                type: "mc",
                q: "Ist dieses Bild KI generiert?",
                img: "https://photographylife.com/wp-content/uploads/2012/10/Capitol-Peak-Sunset.jpg",
                options: ["echt", "KI"],
                answer: 0,
                explain: "zu real!"
            },
            {
                type: "mc",
                q: "Ist dieses Bild KI generiert?",
                img: "https://promptstock.photos/wp-content/uploads/2023/06/Food-Photography-2.png",
                options: ["echt", "KI"],
                answer: 1,
                explain: "klarer Fake!"
            },
            {
                type: "t",
                ht: "Fake-Checked",
                ct: "Das war ein guter Zeitvertreib. Doch wie kann man an einem überrannten Ort wie dem Hauptbahnhof eine Spur aufnehmen? Vielleicht gibt es ja jemanden, der dort alles genau beobachtet hat, während er unscheinbar vor sich hinwippt."
            }
        ]
    },

    // 🔹 Quest 4: TU Hauptgebäude
    {
        location: {
            latitude: 48.200400,
            longitude: 16.370400
        },
        questions: [
            {
                type: "t",
                ht: "Der Wipp-Bre",
                ct: "Der Wipp-Bre sitzt an seinem Platz und beobachtet stets, wer sich an ihm vorbeibewegt. Das Gedächtnis dieses mystischen Herren funktioniert wie kein anderes, doch seine Art zu reden ist sehr kryptisch und rätselhaft. Schafft ihr es, seine Aussagen zu deuten?"
              },
              {
                type: "mc",
                q: "Was möchte er euch sagen: 'Ein Wort wird erst fallen, wenn der Drang nach Entsagung erlischt und ein Wunsch seine Ketten löst'",
                options: ["Er wird bedroht", "Er ist gefangen", "Er hat eine Bedingung", "Der Täter ist hingefallen"],
                answer: 2,
                explain:"Anscheinend hat er eine Bedingung"
              },
              {
                type: "mc",
                q: "Auf die Frage, was er möchte, sprach er: 'Cheeburburb'. Was will er?",
                options: ["Croissant", "Wasser", "Cheeseburger", "Geld"],
                answer: 2,
                explain:"Ein klassischer Cheesy ist nicht verwerflich!"
              },
              {
                type: "mc",
                q: "Glücklich über den Cheesy sagte er: 'Er folgte dem unsichtbaren Pfad, den nur die Informageeks kennen, jenseits der Schönheit und Normalität' \n Wo ist der Täter hingegangen?",
                options: ["Favoriten", "TU", "U6", "Oper"],
                answer: 1,
                explain:"Informageeks müssen auf die TU gehen"
              },
              {
                type: "t",
                ht: "Hinweis vom Wipp-Bre",
                ct: "Die Befragung lief gut. Der Täter ist also Richtung Karlsplatz gefahren. Das ist am schnellsten mit der U1. Möglicherweise hat er einen Bezug zur TU-Wien?"
              }
            ]
          
            
    },

    // 🔹 Quest 5: Die Enthüllung
    {
        location: {
            latitude: 48.200500,
            longitude: 16.370500
        },
        questions: [
            {
                type: "t",
                ht: "Die Enthüllung",
                ct: "Die Beweise sind erdrückend. Der Mann im Mantel war tatsächlich der Mörder! Du übergibst alle Infos der Polizei. Der Fall ist gelöst."
            }
        ]
    }
];



let currentQuestIndex = 0;
let lQ = null;
// Signal simulation for destination search

let signalSimulation = new SignalSimulation(quests[currentQuestIndex]);

// Add event listener for the destination button
els.btnGetDestination.addEventListener('click', () => {
    signalSimulation.startSearch();
});
els.btnStartQuest.addEventListener('click', () => {
    signalSimulation = null;
    els.searchLocation.classList.add("hidden")
    els.quizPanel.classList.remove("hidden")
    lQ = new loadQuest(quests[currentQuestIndex].questions);
    lQ.loadNextQuest();
});
els.btnNext.addEventListener("click", () => {
    lQ.loadNextQuest();
})
els.btnSubmit.addEventListener("click", () => {
    lQ.checkQuestion();
})
els.btnCloseQuiz.addEventListener('click', () => {
    lQ.closeQuiz(); //apply results
    currentQuestIndex++;
    if (currentQuestIndex >= quests.length) {
        return;
    }
    signalSimulation = new SignalSimulation(quests[currentQuestIndex]);
});




