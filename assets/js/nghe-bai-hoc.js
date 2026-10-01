/* =========================================================
   HỌC TỪ ĐẦU
   LISTENING SYSTEM
========================================================= */


/* =========================================================
   1. TEST DATA
========================================================= */

const listeningTests = {

    A1: {

        title: "A Day at a Café",

        text: `
            Anna: Hello! What would you like to drink?
            Ben: I'd like a cup of coffee, please.
            Anna: Would you like something to eat?
            Ben: Yes. I'd like a sandwich.
            Anna: Sure. That will be five dollars.
        `,

        questions: [

            {
                question:
                    "What does Ben want to drink?",

                options: [
                    "Tea",
                    "Coffee",
                    "Water",
                    "Juice"
                ],

                answer: 1
            },

            {
                question:
                    "What does Ben want to eat?",

                options: [
                    "A sandwich",
                    "A cake",
                    "A salad",
                    "Pizza"
                ],

                answer: 0
            },

            {
                question:
                    "Where are Anna and Ben?",

                options: [
                    "At school",
                    "At a café",
                    "At home",
                    "At a hospital"
                ],

                answer: 1
            },

            {
                question:
                    "How much does it cost?",

                options: [
                    "Three dollars",
                    "Four dollars",
                    "Five dollars",
                    "Ten dollars"
                ],

                answer: 2
            }

        ]

    },


    A2: {

        title: "A Busy Morning",

        text: `
            Emma usually gets up at seven o'clock.
            She has breakfast with her family.
            Then she takes the bus to university.
            Today, however, she is late because the bus is delayed.
        `,

        questions: [

            {
                question:
                    "What time does Emma usually get up?",

                options: [
                    "Six o'clock",
                    "Seven o'clock",
                    "Eight o'clock",
                    "Nine o'clock"
                ],

                answer: 1
            },

            {
                question:
                    "Where does Emma go after breakfast?",

                options: [
                    "School",
                    "The hospital",
                    "University",
                    "The supermarket"
                ],

                answer: 2
            },

            {
                question:
                    "Why is Emma late today?",

                options: [
                    "She wakes up late",
                    "She misses breakfast",
                    "The bus is delayed",
                    "She loses her phone"
                ],

                answer: 2
            }

        ]

    },


    B1: {

        title: "Learning a New Skill",

        text: `
            David recently decided to learn how to cook.
            At first, he found it difficult to follow recipes.
            However, after practicing for several weeks,
            he became more confident in the kitchen.
            Now he enjoys preparing meals for his friends.
        `,

        questions: [

            {
                question:
                    "What skill is David learning?",

                options: [
                    "Driving",
                    "Cooking",
                    "Swimming",
                    "Photography"
                ],

                answer: 1
            },

            {
                question:
                    "What was difficult for David at first?",

                options: [
                    "Buying food",
                    "Following recipes",
                    "Finding a kitchen",
                    "Cooking for friends"
                ],

                answer: 1
            },

            {
                question:
                    "How does David feel now?",

                options: [
                    "More confident",
                    "More worried",
                    "Bored",
                    "Angry"
                ],

                answer: 0
            }

        ]

    },


    B2: {

        title: "Technology and Education",

        text: `
            Technology has changed the way students learn.
            Online platforms allow learners to access educational
            materials from almost anywhere.
            However, technology also creates challenges.
            Students may become distracted by social media
            or spend too much time looking at screens.
        `,

        questions: [

            {
                question:
                    "What has technology changed?",

                options: [
                    "The way students learn",
                    "The price of books",
                    "The number of schools",
                    "University buildings"
                ],

                answer: 0
            },

            {
                question:
                    "What is one advantage of online platforms?",

                options: [
                    "They eliminate homework",
                    "They provide access to learning materials",
                    "They make exams easier",
                    "They replace teachers"
                ],

                answer: 1
            },

            {
                question:
                    "What is one challenge mentioned?",

                options: [
                    "Expensive computers",
                    "Bad weather",
                    "Social media distraction",
                    "Too many teachers"
                ],

                answer: 2
            }

        ]

    },


    C1: {

        title: "The Future of Work",

        text: `
            The future of work is likely to be shaped by automation,
            artificial intelligence, and changing workplace expectations.
            While some repetitive tasks may disappear,
            new occupations will probably emerge.
            As a result, workers may need to continuously develop
            their skills throughout their careers.
        `,

        questions: [

            {
                question:
                    "What may shape the future of work?",

                options: [
                    "Tourism only",
                    "Automation and artificial intelligence",
                    "Traditional farming",
                    "Sports"
                ],

                answer: 1
            },

            {
                question:
                    "What may happen to some repetitive tasks?",

                options: [
                    "They may disappear",
                    "They may become easier to find",
                    "They may become more expensive",
                    "They may increase immediately"
                ],

                answer: 0
            },

            {
                question:
                    "What may workers need to do?",

                options: [
                    "Stop learning",
                    "Change countries",
                    "Continuously develop their skills",
                    "Work fewer hours"
                ],

                answer: 2
            }

        ]

    },


    C2: {

        title: "Critical Thinking in Modern Society",

        text: `
            In an increasingly complex information environment,
            critical thinking has become an essential intellectual skill.
            Individuals are constantly exposed to competing claims,
            persuasive narratives, and incomplete evidence.
            The ability to evaluate sources carefully,
            recognize assumptions, and distinguish correlation from causation
            can therefore play a crucial role in making informed decisions.
        `,

        questions: [

            {
                question:
                    "What skill is described as essential?",

                options: [
                    "Memorization",
                    "Critical thinking",
                    "Fast reading",
                    "Public speaking"
                ],

                answer: 1
            },

            {
                question:
                    "What are people constantly exposed to?",

                options: [
                    "Only reliable information",
                    "Competing claims and incomplete evidence",
                    "Scientific experiments",
                    "Traditional textbooks"
                ],

                answer: 1
            },

            {
                question:
                    "What can help people make informed decisions?",

                options: [
                    "Ignoring sources",
                    "Accepting every claim",
                    "Evaluating sources carefully",
                    "Avoiding information"
                ],

                answer: 2
            }

        ]

    }

};


/* =========================================================
   2. LESSON DATA
========================================================= */

const listeningLessons = {

    "a1-lesson-1": {

        level: "A1",
        number: 1,

        title: "Hello & Introductions",

        description:
            "Luyện nghe cách chào hỏi và giới thiệu bản thân.",

        duration: "1:10",

        difficulty: "Dễ",

        transcript: [

            "Hello! My name is Anna.",

            "Nice to meet you, Anna.",

            "Nice to meet you too.",

            "Where are you from?",

            "I'm from Vietnam."

        ],

        dictation:
            "Hello! My name is Anna.",

        vocabulary: [

            {
                word: "hello",
                meaning: "xin chào",
                example:
                    "Hello! My name is Anna."
            },

            {
                word: "name",
                meaning: "tên",
                example:
                    "My name is Anna."
            },

            {
                word: "nice to meet you",
                meaning: "rất vui được gặp bạn",
                example:
                    "Nice to meet you."
            },

            {
                word: "from",
                meaning: "đến từ",
                example:
                    "I'm from Vietnam."
            }

        ],

        questions: [

            {
                question:
                    "What is the woman's name?",

                options: [
                    "Anna",
                    "Mary",
                    "Lisa",
                    "Kate"
                ],

                answer: 0
            },

            {
                question:
                    "Where is Anna from?",

                options: [
                    "Japan",
                    "Vietnam",
                    "Canada",
                    "England"
                ],

                answer: 1
            },

            {
                question:
                    "What are they doing?",

                options: [
                    "Ordering food",
                    "Introducing themselves",
                    "Going to school",
                    "Buying clothes"
                ],

                answer: 1
            }

        ],

        audio: ""

    },


    "a1-lesson-2": {

        level: "A1",
        number: 2,

        title: "My Family",

        description:
            "Luyện nghe cách nói về các thành viên trong gia đình.",

        duration: "1:25",

        difficulty: "Dễ",

        transcript: [

            "This is my family.",

            "My mother is a teacher.",

            "My father works in a hospital.",

            "I have one brother."

        ],

        dictation:
            "My mother is a teacher.",

        vocabulary: [

            {
                word: "family",
                meaning: "gia đình",
                example:
                    "This is my family."
            },

            {
                word: "mother",
                meaning: "mẹ",
                example:
                    "My mother is a teacher."
            },

            {
                word: "father",
                meaning: "bố",
                example:
                    "My father works in a hospital."
            },

            {
                word: "brother",
                meaning: "anh/em trai",
                example:
                    "I have one brother."
            }

        ],

        questions: [

            {
                question:
                    "Who is a teacher?",

                options: [
                    "The father",
                    "The mother",
                    "The brother",
                    "The sister"
                ],

                answer: 1
            },

            {
                question:
                    "Where does the father work?",

                options: [
                    "At a school",
                    "At a restaurant",
                    "At a hospital",
                    "At a bank"
                ],

                answer: 2
            }

        ],

        audio: ""

    },


    "a1-lesson-3": {

        level: "A1",
        number: 3,

        title: "Food & Drinks",

        description:
            "Luyện nghe hội thoại cơ bản về đồ ăn và thức uống.",

        duration: "1:35",

        difficulty: "Dễ",

        transcript: [

            "What would you like to eat?",

            "I'd like some chicken and rice.",

            "Would you like something to drink?",

            "Yes, I'd like some water."

        ],

        dictation:
            "I'd like some chicken and rice.",

        vocabulary: [

            {
                word: "eat",
                meaning: "ăn",
                example:
                    "What would you like to eat?"
            },

            {
                word: "drink",
                meaning: "uống / đồ uống",
                example:
                    "Would you like something to drink?"
            },

            {
                word: "chicken",
                meaning: "thịt gà",
                example:
                    "I'd like some chicken."
            },

            {
                word: "water",
                meaning: "nước",
                example:
                    "I'd like some water."
            }

        ],

        questions: [

            {
                question:
                    "What would the person like to eat?",

                options: [
                    "Fish",
                    "Chicken and rice",
                    "Pizza",
                    "Bread"
                ],

                answer: 1
            },

            {
                question:
                    "What would the person like to drink?",

                options: [
                    "Coffee",
                    "Tea",
                    "Water",
                    "Juice"
                ],

                answer: 2
            }

        ],

        audio: ""

    }

};


/* =========================================================
   3. COMMON FUNCTIONS
========================================================= */

function normalizeText(text) {

    return text
        .toLowerCase()
        .replace(/[.,!?;:'"]/g, "")
        .replace(/\s+/g, " ")
        .trim();

}


function similarity(text1, text2) {

    const a =
        normalizeText(text1)
            .split(" ");

    const b =
        normalizeText(text2)
            .split(" ");

    if (!b.length) {
        return 0;
    }

    let correct = 0;

    a.forEach(word => {

        if (b.includes(word)) {
            correct++;
        }

    });

    return Math.min(
        correct / b.length,
        1
    );

}


/* =========================================================
   4. TEXT TO SPEECH
========================================================= */

let speechUtterance = null;


function speak(text, rate = 1) {

    if (
        !("speechSynthesis" in window)
    ) {

        alert(
            "Trình duyệt của bạn không hỗ trợ phát giọng đọc."
        );

        return;

    }


    window.speechSynthesis.cancel();


    speechUtterance =
        new SpeechSynthesisUtterance(
            text
        );


    speechUtterance.lang =
        "en-US";


    speechUtterance.rate =
        rate;


    speechUtterance.pitch =
        1;


    window.speechSynthesis.speak(
        speechUtterance
    );

}


/* =========================================================
   5. TEST PAGE
========================================================= */

const testForm =
    document.getElementById("testForm");


if (testForm) {

    let selectedLevel =
        "A1";


    const playButton =
        document.getElementById(
            "testPlayBtn"
        );


    const questionContainer =
        document.getElementById(
            "questions"
        );


    function loadTest(level) {

        selectedLevel =
            level;


        const test =
            listeningTests[level];


        document.getElementById(
            "testTitle"
        ).textContent =
            test.title;


        renderTestQuestions(
            test
        );


        document.getElementById(
            "testResult"
        ).classList.remove(
            "show"
        );

    }


    function renderTestQuestions(
        test
    ) {

        questionContainer.innerHTML =
            "";


        test.questions.forEach(
            (question, index) => {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "question";


                let options = "";


                question.options.forEach(
                    (option, optionIndex) => {

                        options += `

                            <label class="option">

                                <input
                                    type="radio"
                                    name="test-${index}"
                                    value="${optionIndex}"
                                >

                                <span>
                                    ${option}
                                </span>

                            </label>

                        `;

                    }
                );


                div.innerHTML = `

                    <div class="question-number">
                        Câu ${index + 1}
                    </div>

                    <div class="question-text">
                        ${question.question}
                    </div>

                    ${options}

                `;


                questionContainer.appendChild(
                    div
                );

            }
        );

    }


    /*
     * LEVEL BUTTONS
     */

    document
        .querySelectorAll(".level-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".level-btn"
                        )
                        .forEach(btn =>
                            btn.classList.remove(
                                "active"
                            )
                        );


                    button.classList.add(
                        "active"
                    );


                    const level =
                        button.dataset.level;


                    localStorage.setItem(
                        "listening_test_level",
                        level
                    );


                    loadTest(level);

                }
            );

        });


    /*
     * PLAY TEST AUDIO
     */

    playButton.addEventListener(
        "click",
        () => {

            const test =
                listeningTests[
                    selectedLevel
                ];


            speak(
                test.text,
                0.9
            );

        }
    );


    /*
     * SPEED
     */

    document
        .querySelectorAll(
            ".speed-btn"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".speed-btn"
                        )
                        .forEach(
                            btn =>
                                btn.classList.remove(
                                    "active"
                                )
                        );


                    button.classList.add(
                        "active"
                    );

                }
            );

        });


    /*
     * SUBMIT TEST
     */

    testForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const test =
                listeningTests[
                    selectedLevel
                ];


            let correct = 0;


            test.questions.forEach(
                (question, index) => {

                    const selected =
                        document.querySelector(
                            `input[name="test-${index}"]:checked`
                        );


                    if (
                        selected &&
                        Number(
                            selected.value
                        ) ===
                        question.answer
                    ) {

                        correct++;

                    }

                }
            );


            const total =
                test.questions.length;


            const score =
                Math.round(
                    correct /
                    total *
                    100
                );


            showTestResult(
                score,
                selectedLevel
            );

        }
    );


    /*
     * RESULT
     */

    function showTestResult(
        score,
        level
    ) {

        const result =
            document.getElementById(
                "testResult"
            );


        const scoreElement =
            document.getElementById(
                "score"
            );


        const title =
            document.getElementById(
                "resultTitle"
            );


        const description =
            document.getElementById(
                "resultDescription"
            );


        scoreElement.textContent =
            `${score}/100`;


        if (score >= 80) {

            title.textContent =
                "🎉 Bạn làm rất tốt!";

            description.textContent =
                `Bạn đã hoàn thành tốt bài test ${level}. Hãy bắt đầu lộ trình Listening ở trình độ này.`;

        }

        else if (score >= 60) {

            title.textContent =
                "👍 Khá tốt!";

            description.textContent =
                `Bạn đã nắm được phần lớn nội dung. Hãy luyện Listening ${level} thường xuyên để tiến bộ hơn.`;

        }

        else {

            title.textContent =
                "🌱 Hãy luyện thêm!";

            description.textContent =
                `Đừng lo. Hãy bắt đầu từ những bài nghe ${level} ngắn và đơn giản rồi tăng dần độ khó.`;

        }


        /*
         * Link học
         */

        const startButton =
            document.getElementById(
                "startLearningBtn"
            );


        const firstLessons = {

            A1: "a1-lesson-1",

            A2: "a1-lesson-1",

            B1: "a1-lesson-1",

            B2: "a1-lesson-1",

            C1: "a1-lesson-1",

            C2: "a1-lesson-1"

        };


        startButton.href =
            `nghe-bai-hoc.html?lesson=${firstLessons[level]}`;


        result.classList.add(
            "show"
        );


        result.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }


    /*
     * RETRY
     */

    document
        .getElementById(
            "retryBtn"
        )
        .addEventListener(
            "click",
            () => {

                testForm.reset();


                document
                    .getElementById(
                        "testResult"
                    )
                    .classList.remove(
                        "show"
                    );


                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );


    /*
     * LOAD SAVED LEVEL
     */

    const savedLevel =
        localStorage.getItem(
            "listening_test_level"
        );


    if (
        savedLevel &&
        listeningTests[savedLevel]
    ) {

        selectedLevel =
            savedLevel;


        document
            .querySelectorAll(
                ".level-btn"
            )
            .forEach(button => {

                button.classList.toggle(
                    "active",
                    button.dataset.level ===
                    savedLevel
                );

            });

    }


    loadTest(
        selectedLevel
    );

}


/* =========================================================
   6. LESSON PAGE
========================================================= */

const lessonTitle =
    document.getElementById(
        "lessonTitle"
    );


if (lessonTitle) {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const lessonId =
        params.get("lesson") ||
        "a1-lesson-1";


    const lesson =
        listeningLessons[
            lessonId
        ] ||
        listeningLessons[
            "a1-lesson-1"
        ];


    let quizScore = 0;


    /*
     * BASIC INFO
     */

    document.getElementById(
        "lessonLevel"
    ).textContent =
        `${lesson.level} • LESSON ${lesson.number}`;


    document.getElementById(
        "lessonTitle"
    ).textContent =
        lesson.title;


    document.getElementById(
        "lessonDescription"
    ).textContent =
        lesson.description;


    document.getElementById(
        "lessonDuration"
    ).textContent =
        `⏱ ${lesson.duration}`;


    document.getElementById(
        "lessonDifficulty"
    ).textContent =
        lesson.difficulty;


    /*
     * AUDIO
     */

    const audio =
        document.getElementById(
            "audioPlayer"
        );


    /*
     * Nếu có file audio thật
     */

    if (lesson.audio) {

        audio.src =
            lesson.audio;

    }


    /*
     * PLAY
     */

    document
        .getElementById("play")
        .addEventListener(
            "click",
            () => {

                if (lesson.audio) {

                    if (audio.paused) {

                        audio.play();

                    } else {

                        audio.pause();

                    }

                } else {

                    speak(
                        lesson.transcript.join(" "),
                        0.85
                    );

                }

            }
        );


    /*
     * BACK 10
     */

    document
        .getElementById("back10")
        .addEventListener(
            "click",
            () => {

                if (
                    lesson.audio &&
                    !isNaN(audio.duration)
                ) {

                    audio.currentTime =
                        Math.max(
                            0,
                            audio.currentTime - 10
                        );

                }

            }
        );


    /*
     * FORWARD 10
     */

    document
        .getElementById("forward10")
        .addEventListener(
            "click",
            () => {

                if (
                    lesson.audio &&
                    !isNaN(audio.duration)
                ) {

                    audio.currentTime =
                        Math.min(
                            audio.duration,
                            audio.currentTime + 10
                        );

                }

            }
        );


    /*
     * SPEED
     */

    document
        .querySelectorAll(".speed")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const speed =
                        Number(
                            button.dataset.speed
                        );


                    if (lesson.audio) {

                        audio.playbackRate =
                            speed;

                    }


                    document
                        .querySelectorAll(
                            ".speed"
                        )
                        .forEach(
                            btn =>
                                btn.classList.remove(
                                    "active"
                                )
                        );


                    button.classList.add(
                        "active"
                    );

                }
            );

        });


    /*
     * QUIZ
     */

    renderLessonQuiz();


    function renderLessonQuiz() {

        const container =
            document.getElementById(
                "quizContainer"
            );


        container.innerHTML =
            "";


        lesson.questions.forEach(
            (question, index) => {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "question";


                let html = "";


                question.options.forEach(
                    (option, optionIndex) => {

                        html += `

                            <label class="option">

                                <input
                                    type="radio"
                                    name="lesson-question-${index}"
                                    value="${optionIndex}"
                                >

                                <span>
                                    ${option}
                                </span>

                            </label>

                        `;

                    }
                );


                div.innerHTML = `

                    <div class="q-number">
                        Câu ${index + 1}
                    </div>

                    <div class="q-text">
                        ${question.question}
                    </div>

                    ${html}

                `;


                container.appendChild(
                    div
                );

            }
        );

    }


    /*
     * SUBMIT QUIZ
     */

    document
        .getElementById("quizForm")
        .addEventListener(
            "submit",
            event => {

                event.preventDefault();


                let correct = 0;


                lesson.questions.forEach(
                    (question, index) => {

                        const selected =
                            document.querySelector(
                                `input[name="lesson-question-${index}"]:checked`
                            );


                        if (
                            selected &&
                            Number(
                                selected.value
                            ) ===
                            question.answer
                        ) {

                            correct++;

                        }

                    }
                );


                quizScore =
                    Math.round(
                        correct /
                        lesson.questions.length *
                        100
                    );


                localStorage.setItem(
                    `listening_score_${lessonId}`,
                    quizScore
                );


                const result =
                    document.getElementById(
                        "quizResult"
                    );


                result.innerHTML = `

                    <strong>
                        ${correct}/${lesson.questions.length}
                        câu đúng
                    </strong>

                    <br>

                    Điểm:
                    <strong>
                        ${quizScore}/100
                    </strong>

                `;


                result.classList.add(
                    "show"
                );


                updateFinalResult();


            }
        );


    /*
     * DICTATION
     */

    document
        .getElementById(
            "checkDictation"
        )
        .addEventListener(
            "click",
            () => {

                const input =
                    document
                        .getElementById(
                            "dictationInput"
                        )
                        .value;


                if (!input.trim()) {

                    alert(
                        "Hãy nhập câu bạn nghe được."
                    );

                    return;

                }


                const score =
                    Math.round(
                        similarity(
                            input,
                            lesson.dictation
                        ) * 100
                    );


                const result =
                    document.getElementById(
                        "dictationResult"
                    );


                result.innerHTML = `

                    <strong>
                        Độ chính xác: ${score}%
                    </strong>

                    <br><br>

                    <strong>
                        Câu chuẩn:
                    </strong>

                    <br>

                    ${lesson.dictation}

                `;


                result.classList.add(
                    "show"
                );

            }
        );


    /*
     * TRANSCRIPT
     */

    const transcript =
        document.getElementById(
            "transcript"
        );


    lesson.transcript.forEach(
        (sentence, index) => {

            const line =
                document.createElement(
                    "div"
                );


            line.className =
                "line";


            line.innerHTML = `

                <span class="line-number">
                    ${index + 1}.
                </span>

                ${sentence}

            `;


            line.addEventListener(
                "click",
                () => {

                    speak(
                        sentence,
                        0.85
                    );

                }
            );


            transcript.appendChild(
                line
            );

        }
    );


    /*
     * VOCABULARY
     */

    const vocab =
        document.getElementById(
            "vocab"
        );


    lesson.vocabulary.forEach(
        item => {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "word";


            div.innerHTML = `

                <strong>
                    ${item.word}
                </strong>

                <div class="meaning">
                    ${item.meaning}
                </div>

                <div class="example">
                    ${item.example}
                </div>

            `;


            vocab.appendChild(
                div
            );

        }
    );


    /*
     * TABS
     */

    const tabs =
        document.querySelectorAll(
            ".tab"
        );


    const sections =
        document.querySelectorAll(
            ".content-section"
        );


    function showSection(
        name
    ) {

        sections.forEach(
            section => {

                section.classList.toggle(
                    "active",
                    section.id ===
                    `section-${name}`
                );

            }
        );


        tabs.forEach(
            tab => {

                tab.classList.toggle(
                    "active",
                    tab.dataset.section ===
                    name
                );

            }
        );

    }


    tabs.forEach(
        tab => {

            tab.addEventListener(
                "click",
                () => {

                    showSection(
                        tab.dataset.section
                    );

                }
            );

        }
    );


    /*
     * GO QUIZ
     */

    document
        .getElementById(
            "goQuiz"
        )
        .addEventListener(
            "click",
            () => {

                showSection(
                    "quiz"
                );

            }
        );


    /*
     * MODES
     */

    document
        .querySelectorAll(
            ".mode"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        document
                            .querySelectorAll(
                                ".mode"
                            )
                            .forEach(
                                btn =>
                                    btn.classList.remove(
                                        "active"
                                    )
                            );


                        button.classList.add(
                            "active"
                        );


                        const mode =
                            button.dataset.mode;


                        const transcriptTab =
                            document.querySelector(
                                '[data-section="transcript"]'
                            );


                        if (
                            mode ===
                            "challenge"
                        ) {

                            transcriptTab.style.display =
                                "none";

                        } else {

                            transcriptTab.style.display =
                                "";

                        }

                    }
                );

            }
        );


    /*
     * FINAL RESULT
     */

    function updateFinalResult() {

        const scoreElement =
            document.getElementById(
                "finalScore"
            );


        const message =
            document.getElementById(
                "finalMessage"
            );


        scoreElement.textContent =
            quizScore;


        if (quizScore >= 90) {

            message.textContent =
                "🎉 Xuất sắc! Bạn đã hiểu rất tốt nội dung bài nghe.";

        }

        else if (quizScore >= 70) {

            message.textContent =
                "👍 Rất tốt! Bạn đã nắm được phần lớn nội dung.";

        }

        else if (quizScore >= 50) {

            message.textContent =
                "📚 Khá tốt. Hãy nghe lại bài và luyện thêm từ vựng.";

        }

        else {

            message.textContent =
                "🌱 Đừng lo. Hãy nghe lại ở tốc độ chậm và thử lại.";

        }

    }


    /*
     * COMPLETE
     */

    document
        .getElementById(
            "completeLesson"
        )
        .addEventListener(
            "click",
            () => {

                let progress =
                    JSON.parse(
                        localStorage.getItem(
                            "listening_progress"
                        ) || "{}"
                    );


                if (
                    !progress[lesson.level]
                ) {

                    progress[lesson.level] =
                        [];

                }


                if (
                    !progress[lesson.level]
                        .includes(
                            lessonId
                        )
                ) {

                    progress[
                        lesson.level
                    ].push(
                        lessonId
                    );

                }


                localStorage.setItem(
                    "listening_progress",
                    JSON.stringify(
                        progress
                    )
                );


                alert(
                    "🎉 Bạn đã hoàn thành bài học!"
                );


                window.location.href =
                    "nghe.html";

            }
        );

}