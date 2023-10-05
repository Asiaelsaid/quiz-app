//Get Elements
let countSpan = document.querySelector(".count span");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-btn");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let countdownElement = document.querySelector(".count-down");
let resultsContainer = document.querySelector(".result");
let currentIndex = 0;
let rightAnswer = 0;
function getData() {
	let myData = new XMLHttpRequest();
	myData.onreadystatechange = function () {
		if (this.readyState === 4 && this.status === 200) {
			let questionsObject = JSON.parse(this.responseText);
			let questionsCount = questionsObject.length;
			createBullets(questionsCount);
			addQuestionData(questionsObject[currentIndex], questionsCount);
			countdown(90, questionsCount);
			submitButton.onclick = () => {
				let theRightAnswer = questionsObject[currentIndex].right_answer;
				currentIndex++;
				checkAnswer(theRightAnswer);
				quizArea.innerHTML = "";
				answersArea.innerHTML = "";
				addQuestionData(questionsObject[currentIndex], questionsCount);
				handleBullets();
				clearInterval(countdownInterval);
				countdown(90, questionsCount);
				showResult(questionsCount);
			};
		}
	};
	myData.open("GET", "html_questions.json");
	myData.send();
}
getData();
function createBullets(num) {
	countSpan.innerHTML = num;
	for (let i = 0; i < num; i++) {
		let span = document.createElement("span");
		bulletsSpanContainer.appendChild(span);
		if (i === 0) {
			span.className = "on";
		}
	}
}

function addQuestionData(obj, count) {
	if (currentIndex < count) {
		let quizHeading = document.createElement("h2");
		let quizTitle = document.createTextNode(obj["title"]);
		quizHeading.appendChild(quizTitle);
		quizArea.appendChild(quizHeading);
		for (let i = 1; i <= 4; i++) {
			let answerContainer = document.createElement("div");
			let input = document.createElement("input");
			let label = document.createElement("label");
			let textLabel = document.createTextNode(obj[`answer_${i}`]);
			answerContainer.className = "answer";
			input.type = "radio";
			input.id = `answer-${i}`;
			input.name = "questions";
			label.htmlFor = `answer-${i}`;
			input.dataset.answer = obj[`answer_${i}`];
			label.appendChild(textLabel);
			answerContainer.appendChild(input);
			answerContainer.appendChild(label);
			answersArea.appendChild(answerContainer);
		}
	}
}
function checkAnswer(rAnswer) {
	let answers = document.getElementsByName("questions");
	let theChosenAnswer;
	for (let i = 0; i < answers.length; i++) {
		if (answers[i].checked) {
			theChosenAnswer = answers[i].dataset.answer;
		}
		if (theChosenAnswer === rAnswer) {
			rightAnswer++;
		}
	}
}
function handleBullets() {
	let bulletsSpnans = document.querySelectorAll(".bullets .spans span");
	bulletsSpnans.forEach((span, index) => {
		if (index === currentIndex) {
			span.className = "on";
		}
	});
}
function countdown(duration, count) {
	if (currentIndex < count) {
		let minutes, seconds;
		countdownInterval = setInterval(() => {
			minutes =
				parseInt(duration / 60) < 10
					? `0${parseInt(duration / 60)}`
					: parseInt(duration / 60);
			seconds =
				parseInt(duration % 60) < 10
					? `0${parseInt(duration % 60)}`
					: parseInt(duration % 60);
			countdownElement.innerHTML = `${minutes} :${seconds}`;
			if (--duration < 0) {
				clearInterval(countdownInterval);
				submitButton.click();
			}
		}, 1000);
	}
}
function showResult(count) {
	let theResults;
	if (currentIndex === count) {
		quizArea.remove();
		answersArea.remove();
		submitButton.remove();
		bulletsSpanContainer.remove();
		if (rightAnswer > count / 2 && rightAnswer < count) {
			theResults = `<span class="good">Good</span>, ${rightAnswer} From ${count}`;
		} else if (rightAnswer === count) {
			theResults = `<span class="perfect">Perfect</span>, All Answers Is Good`;
		} else {
			theResults = `<span class="bad">Bad</span>, ${rightAnswer} From ${count}`;
		}

		resultsContainer.innerHTML = theResults;
		resultsContainer.style.padding = "10px";
		resultsContainer.style.backgroundColor = "white";
		resultsContainer.style.marginTop = "10px";
	}
}
