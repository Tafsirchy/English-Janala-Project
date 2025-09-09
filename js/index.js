const createElements = (arr) => {
    const htmlElements = arr.map((el) => `<span class="btn">${el}</span>`);
    return(htmlElements.join(" "));
}
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}
const manageSpinner = (status) => {
  if(status === true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("word-container").classList.add("hidden");
  }
  else {
    document.getElementById("word-container").classList.remove("hidden");
    document.getElementById("spinner").classList.add("hidden");
  }
}

const loadLessons = () =>{
    fetch("https://openapi.programming-hero.com/api/levels/all") // promise of response
    .then(response => response.json()) // promise of json data
    .then(json => displayLessons(json.data))
}

const removeActive = () =>{
  const lessonButtons = document.querySelectorAll(".lesson-btn")
  lessonButtons.forEach(button => button.classList.remove("active") )
}
 
const loadLevelWord = (id) =>{
  manageSpinner(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
    .then(response => response.json())
    .then(json => {
      removeActive(); // remove active class from all buttons
      const clickBtn = document.getElementById(`lesson-btn-${id}`);
      clickBtn.classList.add("active"); // add active class to clicked button
      displayLevelWord(json.data);
    })
}

// {
//     "id": 83,
//     "level": 1,
//     "word": "Door",
//     "meaning": "দরজা",
//     "pronunciation": "ডোর"
// }

const loadWordDetail=async(id)=>{
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const response = await fetch(url);
  const details = await response.json();
  displayWordDetails(details.data)
}

// {
//     "id": 88,
//     "level": 1,
//     "word": "Toy",
//     "meaning": "খেলনা",
//     "pronunciation": "টয়"
// }
const displayWordDetails = (word) =>{
  console.log(word)
  const detailsBox = document.getElementById("details-container");
  document.getElementById("word-modal").showModal();
  detailsBox.innerHTML = `
            <div class="text-[36px] font-bold">
            <h2 class="">
              ${word.word} (<i class="fa-solid fa-microphone-lines"></i> :${word.pronunciation})
            </h2>
          </div>
          <div class="">
            <h2 class="text-[24px] font-semibold font-bangla">meaning</h2>
            <p class="text-[24px] font-extralight">${word.meaning}</p>
          </div>
          <div class="">
            <h2 class="text-[24px] font-semibold font-bangla">Example</h2>
            <p>${word.sentence}</p>
          </div>
          <div class="">
            <h2 class="text-[24px] font-semibold font-bangla">
              সমার্থক শব্দ গুলো
            </h2>
            <div class="">${createElements(word.synonyms)}</div>
          </div>
  `
}

const displayLevelWord = (words) => {
    const wordContainer = document.getElementById("word-container")
    wordContainer.innerHTML = "";

    if(words.length === 0){
      wordContainer.innerHTML = `
      <div class="text-center py-[64px] col-span-full">
      <img class="mx-auto" src="./assets/alert-error.png" alt="" />

        <h3 class="text-[14px] mt-4 text-gray-500">
          <span class="font-bangla">এই</span> Lesson
          <span class="font-bangla">এ এখনো কোন</span>Vocabulary<span class="font-bangla"> যুক্ত করা হয়নি।</span>
        </h3>
        <h1 class="text-[36px] font-medium mt-[12px]">
          <span class="font-bangla">নেক্সট</span> Lesson
          <span class="font-bangla">এ যান</span>
        </h1>
      </div>
      `;  
      manageSpinner(false);
         return;
    }

    words.forEach(word => {
        console.log(word)
        const card = document.createElement("div")
        card.innerHTML = `
              <div class="bg-white text-center py-10 px-5">
        <h2 class="text-[32px] font-bold">${word.word ? word.word : "শব্দ খুঁজে পাওয়া যায়নি"}</h2>
        <p class="text-[18px] font-medium my-[24px]">Meaning /Pronounciation</p>
        <h2 class="text-[32px] font-semibold font-bangla">
                  <p class="text-[18px] font-medium">${word.meaning ? word.meaning : "অর্থ খুঁজে পাওয়া যায়নি"}/${word.pronunciation ? word.pronunciation : "প্রদোশ খুঁজে পাওয়া যায়নি"}</p>

        </h2>
        <div class="flex justify-between items-center mt-6">
          <button onclick="loadWordDetail(${word.id})"
            class="bg-[#1a91ff1a] hover:bg-blue-300 p-4 rounded-[8px] transition"
          >
            <i  class=" fa-solid fa-circle-info h-[24px] w-[24px]"></i>
          </button>

          <button onclick="pronounceWord('${word.word}')"
            class="bg-[#1a91ff1a] hover:bg-blue-300 p-4 rounded-[8px] transition"
          >
            <i class="fa-solid fa-volume-high h-[24px] w-[24px]"></i>
          </button>
        </div>
      </div>
        `
        wordContainer.append(card)
    })
    manageSpinner(false);
}

const displayLessons = (lessons) =>{
    // 1. get the container
    const levelContainer = document.getElementById("level-container")
    // 2. empty the container
    levelContainer.innerHTML = ""
    // 3. loop through the data or get every lession
    for(let lesson of lessons ) {
        // 4. create a card for each lesson
        console.log(lesson)
        const btnDiv = document.createElement("div")
        // 5. set the content of the card
        /////// for dynamic access od data (id, title, description......... use dot notation and bracket notation within template string (${abc.-paste the property path}))///////
        btnDiv.innerHTML = `
                <button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" href="" class=" btn btn-outline btn-primary lesson-btn">
                <i class="fa-solid fa-book-open"></i>Lesson-${lesson.level_no}</button>
        `;
        // 6. append the card to the container
        levelContainer.appendChild(btnDiv)

    }
   
   

}

loadLessons();

  document.getElementById("btn-search").addEventListener("click", () =>{
    removeActive();
  const input = document.getElementById("input-search");
  const searchValue = input.value.trim().toLowerCase();
  console.log(searchValue);

  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      const allWords = data.data;
      const filterWords = allWords.filter(word => word.word.toLowerCase().includes(searchValue));
      displayLevelWord(filterWords)
    })
});
