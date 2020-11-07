const { response } = require('express');
const { restart } = require('nodemon');
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
    let arr = materialScope;
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
    sumData(arr).then(res => result(null,res))
}


module.exports = Exam;