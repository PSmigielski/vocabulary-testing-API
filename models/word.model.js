const db = require('../database/index');
const formidable = require('formidable');
const EventEmitter = require('events');
const fs = require('fs');
const { response } = require('express');

const Word = (word) => {
  this.id = NULL
  this.word = word.word;
  this.definition = word.definition; 
  this.section_id = word.section_id;
}

Word.create = (newWord, result) => {
  db.query(`SELECT * FROM \`words\` WHERE \`word\` = '${newWord.word}'`, (err, res)=>{
    if(err){
      result(err, null);
      return;
    }
    if(res.length > 0){
      result({kind:'conflict'}, null);
      return;
    } else {
      db.query('INSERT INTO `words` (`id`,`word`,`definition`,`section_id`) VALUES (?,?,?,?)', [newWord.id, newWord.word, newWord.definition, newWord.section_id], (err, res) => {
        if(err){
          result(err, null);
          return;
        } else {
          result(null, {message: 'word has been added'});
          return;
        }
      })
    }
  })
}
Word.upload = (req ,result) =>{
  const count = (str) => {
    let m = str.match(/;+/g)
    return m ? m.length : 0;
  }
  new formidable.IncomingForm().parse(req)
  .on('fileBegin', (name, file) => {
      file.name = `baza.txt`
      file.path = __dirname + '/' + file.name
  })
  .on('file', async (name, file) => {
    const handleFile = (file) => {
        return new Promise((res, rej) => {
            try{
                class MyEmitter extends EventEmitter {}
                const lineReader = require('readline').createInterface({
                    input: require('fs').createReadStream(__dirname+'/'+file.name)
                }); 
                const myEmitter = new MyEmitter();
                myEmitter.on('failed', () => res(false));  
                lineReader.on('line', function (line) {
                    if(count(line) != 3) myEmitter.emit('failed')
                }).on('close', () => res(true));
            } catch(err) {
                rej(err);
                result(err, null);
              }
        });
    }
    const loadData = (file) => {
        return new Promise((res,rej)=>{
            try{
                db.query(`LOAD DATA LOCAL INFILE '${__dirname}/${file.name}' INTO TABLE \`words\` FIELDS TERMINATED BY ";" LINES TERMINATED BY "\n" `,(err, data)=>{
                    if(err){
                      throw err;
                    }
                    else res(data)
                })
            }catch(err){
                result(err, null);
                rej(err);
            }
        })
    }
    console.log('Uploaded file', file.name);
    let isValid = await handleFile(file)
    if(isValid){
      result(null, {message: 'file has been uploaded'})
      loadData(file).then(response =>{
        console.log('data has been loaded')
        fs.unlinkSync(__dirname + '/baza.txt')
      })
    }
    else {
      result({type: 'invalid'},null )
      fs.unlinkSync(__dirname + '/baza.txt');
    }
  })
}
Word.show = (sectionID , result) => {
  db.query(`SELECT * FROM \`words\` WHERE \`section_id\` = ${sectionID}`, (err, data) => {
    if(err){
      result(err, null);
      return;
    }      
    if(data.length == 0){
      result({type: '404'}, null);
      return;
    }
    else {
      console.log(data)
      result(null, data);
    }
  })
}
Word.delete = (sectionID, result) => {
  sql.query("DELETE FROM users WHERE id = ?", id, (err, data) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ type: "404" }, null);
      return;
    }
    console.log("deleted users with id: ", id);
    result(null, res);
  });
}

module.exports = Word;