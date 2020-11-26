const db = require("../database/index");

const Exam = (questions) => {
  this.id = NULL;
  this.questions = questions;
};

Exam.create = async (materialScope, result) => {
  const getExamMaterial = (section_id) => {
    return new Promise((res, rej) => {
      try {
        db.query(
          `SELECT * FROM \`words\` WHERE \`section_id\` = ${section_id}`,
          (err, data) => {
            if (err) {
              console.log(err);
              rej(err);
              return;
            } else res(data);
          }
        );
      } catch (err) {
        result(err, null);
        return;
      }
    });
  };
  const sumData = async (arr) => {
    return new Promise((res, rej) => {
      let dataArr = [];
      arr.forEach(async (el) => {
        let promise = new Promise(async (resp, rej) =>
          resp(await getExamMaterial(el))
        );
        dataArr.push(promise);
      });
      Promise.all(dataArr).then((response) => res(response));
    });
  };
  sumData(materialScope).then((res) => {
    let data = [];
    let questionTemp = [];
    let resLength = 0;
    let examQuestions = [];
    let questionWord = "";
    let translation = Math.floor(Math.random() * 2);
    let questionIndex = Math.floor(Math.random() * (data.length - 1));
    res.forEach((el) => {
      resLength += el.length;
      data.push(...el);
    });
    let examLength = Math.round(resLength / 3);
    for (let i = 0; i < examLength; i++) {
      let questionType = parseInt(Math.floor(Math.random() * 3));
      switch (questionType) {
        case 0:
          let words = [];
          if (questionTemp.length < 1) {
            if (questionIndex + 2 > data.length)
              questionIndex = questionIndex + 1 - data.length;
            else questionIndex += 1;
            questionWord = data[questionIndex];
            questionTemp.push(questionWord);
          } else {
            if (questionIndex + 2 > data.length)
              questionIndex = questionIndex + 1 - data.length;
            else questionIndex += 1;
            questionWord = data[questionIndex];
            questionTemp.push(questionWord);
          }
          let wordTemp = [];
          let correctIndex = Math.floor(Math.random() * 4);
          for (let j = 0; j < 4; j++) {
            let wordIndex = Math.floor(Math.random() * (data.length - 1));
            if (j == correctIndex) {
              words.push(questionWord);
              wordTemp.push(questionWord);
            } else {
              wordTemp.forEach((ele) => {
                if (ele == data[wordIndex]) {
                  if (wordIndex + 2 > data.length) {
                    wordIndex = wordIndex + 1 - data.length;
                  } else wordIndex += 1;
                }
              });
              if (wordIndex == questionIndex) {
                if (wordIndex + 2 > data.length) {
                  wordIndex = wordIndex + 1 - data.length;
                } else wordIndex += 1;
              }
              wordTemp.push(data[wordIndex]);
              words.push(data[wordIndex]);
            }
          }
          let question = {
            question:
              translation === 1 ? questionWord.word : questionWord.definition,
            answers: {
              a: translation === 0 ? words[0].word : words[0].definition,
              b: translation === 0 ? words[1].word : words[1].definition,
              c: translation === 0 ? words[2].word : words[2].definition,
              d: translation === 0 ? words[3].word : words[3].definition,
            },
            correctAnswer:
              translation === 1
                ? words[correctIndex].definition
                : words[correctIndex].word,
            questionType: "chooseOne",
          };
          examQuestions.push(question);

          break;
        case 1:
          if (questionTemp.length < 1) {
            if (questionIndex + 2 > data.length)
              questionIndex = questionIndex + 1 - data.length;
            else questionIndex += 1;
            questionWord = data[questionIndex];
            questionTemp.push(questionWord);
          } else {
            if (questionIndex + 2 > data.length)
              questionIndex = questionIndex + 1 - data.length;
            else questionIndex += 1;
            questionWord = data[questionIndex];
            questionTemp.push(questionWord);
          }
          let question1 = {
            question:
              translation === 1 ? questionWord.word : questionWord.definition,
            answer:
              translation === 1 ? questionWord.definition : questionWord.word,
            questionType: "Complete",
          };
          examQuestions.push(question1);
          break;
        case 2:
          if (questionTemp.length < 1) {
            if (questionIndex + 2 > data.length)
              questionIndex = questionIndex + 1 - data.length;
            else questionIndex += 1;
            questionWord = data[questionIndex];
            questionTemp.push(questionWord);
          } else {
            if (questionIndex + 2 > data.length)
              questionIndex = questionIndex + 1 - data.length;
            else questionIndex += 1;
            questionWord = data[questionIndex];
            questionTemp.push(questionWord);
          }
          let goodAnswer = Math.floor(Math.random() * 2);
          let proposition = "";
          switch (goodAnswer) {
            case 0:
              proposition = questionWord;
              break;
            case 1:
              let propositionIndex = Math.floor(
                Math.random() * (data.length - 1)
              );
              proposition = data[propositionIndex];
          }
          let question2 = {
            question:
              translation === 1 ? questionWord.word : questionWord.definition,
            proposition:
              translation === 1 ? proposition.definition : proposition.word,
            correctAnswer:
              translation === 1 ? questionWord.definition : questionWord.word,
            questionType: "True/False",
          };
          examQuestions.push(question2);
          break;
      }
    }
    result(null, { questions: examQuestions, testLen: examQuestions.length });
  });
};

Exam.saveResults = (examResults, result) => {
  const procentage = (examResults.gainedPoints / examResults.maxPoints) * 100;
  let passed = false;
  if (procentage.toFixed(2) > 80) {
    passed = true;
  }
  db.query(
    "INSERT INTO `test_results` (`username`,`maxPoints`,`gainedPoints`, `procentage`, `passed`) VALUES (?,?,?,?,?)",
    [
      examResults.username,
      examResults.maxPoints,
      examResults.gainedPoints,
      procentage.toFixed(2),
      passed,
    ],
    (err, res) => {
      if (err) {
        console.log("Error: ", err);
        result(err, null);
        return;
      } else {
        result(null, res);
        return;
      }
    }
  );
};
module.exports = Exam;
