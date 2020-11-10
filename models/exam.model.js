const db = require('../database/index');

const Exam = (questions) => {
    this.id = NULL
    this.questions = questions;
}

Exam.create = async(materialScope, result) => {
    const getExamMaterial = (section_id) => {
        return new Promise((res, rej)=>{
            try{
                db.query(`SELECT * FROM \`words\` WHERE \`section_id\` = ${section_id}`, (err, data)=>{
                    if(err){
                        console.log(err)
                        rej(err)
                        return;
                    }else res(data);
                })
            }catch(err){
                result(err, null);
                return;
            }
        })  
    }
    const sumData = async (arr) => {
        return new Promise((res, rej)=>{
            let dataArr = []
            arr.forEach(async(el) => {
                let promise = new Promise(async(resp, rej) =>resp(await getExamMaterial(el)))
                dataArr.push(promise)
            })
            Promise.all(dataArr).then(response => res(response))
        })
    }
    sumData(materialScope).then(res => {
        let data = [];
        let questionTemp = [];
        let resLength = 0;
        let examQuestions = [];
        res.forEach(el =>{
            resLength += el.length;
            data.push(...el);
        });
        let examLength = Math.round(resLength/3);
        for(let i = 0; i<examLength; i++){
            let questionType = parseInt(Math.floor(Math.random()*3));
            switch(questionType){
                case 0:
                    let words = [];
                    let translation = Math.floor(Math.random() * (2-1));
                    let questionIndex = Math.floor(Math.random() * (data.length - 1));
                    let questionWord = '';
                    switch(translation){
                        case 0:
                            questionTemp.forEach(el => {
                                if(el == questionWord){
                                    if(questionIndex+2>data.length)
                                        questionIndex=(questionIndex+1)-data.length;
                                    else questionIndex+=1;
                                    questionTemp.push(data[questionIndex].definition);
                                    questionWord = data[questionIndex].definition;
                                }
                            })                  
                            break;
                        case 1:
                            questionTemp.forEach(el => {
                                if(el == questionWord){
                                    if(questionIndex+2>data.length)
                                        questionIndex=(questionIndex+1)-data.length;
                                    else questionIndex+=1;
                                    questionTemp.push(data[questionIndex].word);
                                    questionWord = data[questionIndex].word;
                                }
                            }) 
                        break;
                    }
                    let wordTemp=[];
                    let correctIndex = Math.floor(Math.random() * 4)-1;
                    for(let j = 0; j<4; j++){ 
                        let wordIndex = Math.floor(Math.random() * (data.length - 1));
                        if(j == correctIndex) {
                            words.push(questionWord);
                            wordTemp.push(questionWord);
                        }else{
                            wordTemp.forEach(ele =>{
                                if(ele == data[wordIndex]){
                                    if(wordIndex+2>data.length){
                                        wordIndex = (wordIndex+1)-data.length;
                                    }else wordIndex+=1;
                                }
                            })
                            if(wordIndex == questionIndex){
                                if(wordIndex+2>data.length){
                                    wordIndex = (wordIndex+1)-data.length;
                                }else wordIndex+=1;
                            }
                            wordTemp.push(data[wordIndex]);
                            words.push(data[wordIndex]);
                        }
                    }
                    let question = {
                        question: questionWord,
                        answers: {
                            a: words[0],
                            b: words[1],
                            c: words[2],
                            d: words[3],
                        },
                        correctAnswer: words[correctIndex-1] 
                    }
                    examQuestions.push(question);

                break;
                case 1:
                    let translation1 = Math.floor(Math.random() * (2-1));
                    let questionIndex1 = Math.floor(Math.random() * (data.length - 1));
                    let questionWord1 = '';
                    switch(translation1){
                        case 0:
                            questionTemp.forEach(el => {
                                if(el == questionWord1){
                                    if(questionIndex1+2>data.length)
                                        questionIndex1=(questionIndex1+1)-data.length;
                                    else questionIndex1+=1;
                                    questionTemp.push(data[questionIndex1].definition);
                                    questionWord1 = data[questionIndex1].definition;
                                }
                            })                  
                            break;
                        case 1:
                            questionTemp.forEach(el => {
                                if(el == questionWord1){
                                    if(questionIndex1+2>data.length)
                                        questionIndex1=(questionIndex1+1)-data.length;
                                    else questionIndex1+=1;
                                    questionTemp.push(data[questionIndex1].word);
                                    questionWord1 = data[questionIndex1].word;
                                }
                            }) 
                        break;
                    }
                    let question1 = {
                        question: questionWord1,
                        correctAnswer: questionWord1
                    }
                    examQuestions.push(question1);
                break;
                case 2:
                    let translation2 = Math.floor(Math.random() * 2) -1;
                    let questionIndex2 = Math.floor(Math.random() * (data.length - 1));
                    let questionWord2="";
                    switch(translation2){
                        case 0:
                            questionTemp.forEach(el => {
                                if(el == questionWord2){
                                    if(questionIndex2+2>data.length)
                                        questionIndex2=(questionIndex2+1)-data.length;
                                    else questionIndex2+=1;
                                    questionTemp.push(data[questionIndex2].definition);
                                    questionWord2 = data[questionIndex2].definition;
                                }
                            })                  
                            break;
                        case 1:
                            questionTemp.forEach(el => {
                                if(el == questionWord2){
                                    if(questionIndex2+2>data.length)
                                        questionIndex2=(questionIndex2+1)-data.length;
                                    else questionIndex2+=1;
                                    questionTemp.push(data[questionIndex2].word);
                                    questionWord2 = data[questionIndex2].word;
                                }
                            }) 
                        break;
                    }
                    let goodAnswer = Math.floor(Math.random() * (2-1));
                    let proposition = '';
                    switch(goodAnswer){
                        case 0:
                            proposition = questionWord2;
                        break;
                        case 1:
                            let propositionIndex = Math.floor(Math.random() * (data.length - 1));
                            proposition = data[propositionIndex];
                    }
                    let question2 = {
                        question: questionWord2,
                        proposition: proposition,
                        correctAnswer: questionWord2
                    }
                    examQuestions.push(question2);
                break;
            }
        }
        // result(null,{...data,recordsAmount: resLength,examL:examLength});
        result(null,examQuestions);
    })
}


module.exports = Exam;