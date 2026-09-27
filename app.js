const cultureData = {
  peiligang: {
    index: "01", period: "c. 7000–5000 BCE", region: "Central Plains · early village life", title: "Peiligang Culture",
    text: "Peiligang communities are often discussed through the evidence of early villages, pottery and plant cultivation. Look for the quiet clues: storage, tools and everyday vessels tell us how people organised life around food.",
    tags: ["settlement", "pottery", "food"], prompt: "What would a storage vessel tell you about a community?", object: "grain"
  },
  liangzhu: {
    index: "02", period: "c. 3300–2300 BCE", region: "Lower Yangtze · rice and water", title: "Liangzhu Culture",
    text: "Liangzhu is known for a highly organised society in the lower Yangtze region. Rice cultivation, water management, planned spaces and distinctive jade objects offer clues about cooperation, ritual and social difference.",
    tags: ["rice", "jade", "water systems"], prompt: "Why might jade appear in both ritual and social contexts?", object: "jade"
  },
  cishan: {
    index: "03", period: "c. 6500–5000 BCE", region: "North China · food storage", title: "Cishan Culture",
    text: "Cishan sites help researchers think about early farming and storage in North China. Pits, stone tools and pottery connect the practical work of growing, processing and keeping food with the rhythm of village life.",
    tags: ["millet", "storage", "tools"], prompt: "What does a storage pit suggest about planning for the future?", object: "seed"
  },
  yangshao: {
    index: "04", period: "c. 5000–3000 BCE", region: "Yellow River · painted pottery", title: "Yangshao Culture",
    text: "Yangshao is widely recognised for painted pottery and village communities along the Yellow River region. Patterns on vessels are not just decoration: they invite questions about identity, craft and the sharing of ideas.",
    tags: ["painted pottery", "villages", "millet"], prompt: "What can a repeated pattern tell us about makers and users?", object: "pot"
  },
  longshan: {
    index: "05", period: "c. 3000–1900 BCE", region: "Lower Yellow River · social change", title: "Longshan Culture",
    text: "Longshan sites are often associated with black, highly polished pottery and increasingly complex settlements. Differences in craft, burials and defensive features prompt questions about status, labour and social organisation.",
    tags: ["black pottery", "craft", "social change"], prompt: "How could specialised craft point to changing social roles?", object: "wheel"
  }
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function renderCulture(key) {
  const data = cultureData[key];
  if (!data) return;
  $$(".culture-card, .timeline-pill").forEach((item) => item.classList.toggle("active", item.dataset.culture === key));
  $("#detailIndex").textContent = data.index;
  $("#detailPeriod").textContent = data.period;
  $("#detailRegion").textContent = data.region;
  $("#detailTitle").textContent = data.title;
  $("#detailText").textContent = data.text;
  $("#detailPrompt").textContent = data.prompt;
  $("#detailTags").innerHTML = data.tags.map((tag) => "<span>" + tag + "</span>").join("");
  const visual = $("#detailVisual");
  visual.dataset.object = data.object;
  const object = visual.querySelector(".visual-object");
  object.className = "visual-object object-" + data.object;
}

$$('[data-culture]').forEach((item) => item.addEventListener("click", () => renderCulture(item.dataset.culture)));

$("#contrastToggle").addEventListener("click", (event) => {
  const pressed = event.currentTarget.getAttribute("aria-pressed") === "true";
  event.currentTarget.setAttribute("aria-pressed", String(!pressed));
  document.body.classList.toggle("focus-mode", !pressed);
  event.currentTarget.textContent = !pressed ? "Exit focus" : "Focus mode";
});

$("#copyFrame").addEventListener("click", async (event) => {
  const text = "The evidence suggests that ______ because ______.";
  try { await navigator.clipboard.writeText(text); event.currentTarget.textContent = "Copied"; }
  catch { event.currentTarget.textContent = "Select to copy"; }
  setTimeout(() => { event.currentTarget.textContent = "Copy"; }, 1600);
});

const quiz = [
  { question: "Which clue is most closely associated with Liangzhu?", options: ["A. Painted red pottery motifs", "B. Jade objects and planned water systems", "C. A black, highly polished thin-walled cup"], correct: 1, note: "Liangzhu is a useful case for connecting rice agriculture, water management and jade ritual objects." },
  { question: "Which evidence best helps us discuss Yangshao craft?", options: ["A. Painted pottery with repeated motifs", "B. Only bronze weapons", "C. Written imperial records"], correct: 0, note: "Painted pottery is a strong visual clue, while the wider story still includes villages, food and exchange." },
  { question: "Why should we compare overlapping dates carefully?", options: ["A. Cultures changed at exactly the same speed", "B. Every site belongs to only one culture", "C. Communities could overlap and develop differently across regions"], correct: 2, note: "Archaeological cultures are regional patterns; their boundaries and dates are not always neat lines." }
];
let quizIndex = 0;
let selectedAnswer = null;

function renderQuiz() {
  const item = quiz[quizIndex];
  $("#quizStep").textContent = String(quizIndex + 1).padStart(2, "0") + " / 03";
  $("#quizQuestion").textContent = item.question;
  $("#quizOptions").innerHTML = item.options.map((option, index) => '<button data-answer="' + index + '" type="button">' + option + '</button>').join("");
  $$("#quizOptions button").forEach((button) => button.addEventListener("click", () => selectAnswer(button)));
  $$(".progress-dots i").forEach((dot, index) => dot.classList.toggle("filled", index <= quizIndex));
  $("#quizFeedback").textContent = "";
  $("#nextQuestion").disabled = true;
  $("#nextQuestion").innerHTML = "Check answer <span>→</span>";
  selectedAnswer = null;
}

function selectAnswer(button) {
  if (selectedAnswer !== null) return;
  selectedAnswer = Number(button.dataset.answer);
  $$("#quizOptions button").forEach((option) => option.classList.remove("selected"));
  button.classList.add("selected");
  const item = quiz[quizIndex];
  const isCorrect = selectedAnswer === item.correct;
  button.classList.add(isCorrect ? "correct" : "incorrect");
  if (!isCorrect) $$("#quizOptions button")[item.correct].classList.add("correct");
  
  $("#quizFeedback").textContent = (isCorrect ? "Good reading." : "Try the evidence again.") + " " + item.note;
  $("#nextQuestion").disabled = false;
  $("#nextQuestion").innerHTML = quizIndex === quiz.length - 1 ? "Restart quiz <span>↻</span>" : "Next question <span>→</span>";
}

$("#nextQuestion").addEventListener("click", () => {
  quizIndex = quizIndex === quiz.length - 1 ? 0 : quizIndex + 1;
  renderQuiz();
});

renderQuiz();
renderCulture("peiligang");
