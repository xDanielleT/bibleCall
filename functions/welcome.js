

const { VoiceResponse } = require('twilio').twiml;
const axios = require('axios');


exports.handler = async function(context, event, callback) {
    const twiml = new VoiceResponse();
    const assetUrl = 'https://demo1-1934.io/verses.json'; // Your asset URL


    try {
        const response = await axios.get(assetUrl);
        const psalmsText = response.data;
        console.log("Psalms Text Loaded:", psalmsText);


        const verseRequest = event.SpeechResult ? event.SpeechResult.trim() : '1:1';
        const responseText = getVerseFromPsalms(verseRequest, psalmsText);
        twiml.say(responseText);


        const gather = twiml.gather({
            input: 'speech',
            action: 'https://demo1-1934.twil.io/welcome',
            speechModel: "phone_call",
            enhanced: true
        });
        gather.say('Would you like to hear another verse or a different one? Speak now or press any key.');


        callback(null, twiml);
    } catch (error) {
        console.error("Error:", error.message);
        twiml.say("An error occurred while processing your request. Please try again.");
        callback(null, twiml);
    }
};

// This is your new function. To start, set the name and path on the left.
const VoiceResponse = require('twilio').twiml.VoiceResponse;
exports.handler = async function(context, event, callback) {
  const twiml = new VoiceResponse();
  function standardizeInput(input){
    let words = new Array();
    let str = "";
    for (let i = 0; i<input.length; i++){
      if (input.substring(i,i+1)==" "){
        words.push(str);
        str = "";
      } else {
        str += input.substring(i, i+1);
      }
    }
    words.push(str);
    let numbers = ["one", "two", "three", "four"];
    let replacements = ["1", "2", "3", "4"];
    for (wordIndex in words){
        for (let i = 0; i<numbers.length; i++){
            if (words[wordIndex] == numbers[i]){
                words[wordIndex] = replacements[i];
            }
        }
        upperCase = words[wordIndex][0].toUpperCase();
        words[wordIndex] = upperCase + words[wordIndex].substring(1);
    }
    return words.join(" ");
  }
  let book = context.BOOK || null;
  let chapterNumber = context.CHAPTER || null;
  let verseNumber = context.VERSE || null;
  console.log(book);
  console.log(chapterNumber);
  console.log(verseNumber);
  try {
    const gather = twiml.gather({
      input: 'speech',
      action: 'https://sturdy-palm-tree-q7p467qxq9w3jrq-3000.app.github.dev/hello-world',
      language:'en',
      speechModel:"phone_call",
      enhanced:true
    });
    const gatherDTMF = twiml.gather({ numDigits: 3 });
    while (true){
      console.log(event.Digits);
      if (event.Digits){
        if (chapterNumber == null){
          context.CHAPTER = event.Digits;
          twiml.say("Chapter " + context.CHAPTER + ", OK.");
          gatherDTMF.say("Please type on the keypad the number of the verse you would like to listen to.");
        } else {
          context.VERSE = event.Digits;
          twiml.say("Chapter " + context.VERSE + ", OK.");
          gatherDTMF.say("So, you would like to listen to Chapter " + chapterNumber + ", verse " + context.VERSE + ", of the book " + book + ".");
        }
      }
      else if (event.SpeechResult) { // Process gathered text if available
        let books = ['Genesis',
          'Exodus',
          'Leviticus',
          'Numbers',
          'Deuteronomy',
          'Joshua',
          'Judges',
          'Ruth',
          '1 Samuel',
          '2 Samuel',
          '1 Kings',
          '2 Kings',
          '1 Chronicles',
          '2 Chronicles',
          'Ezra',
          'Nehemiah',
          'Tobit',
          'Judith',
          'Esther',
          '1 Maccabees',
          '2 Maccabees',
          'Job',
          'Psalms',
          'Proverbs',
          'Ecclesiastes',
          'Song Of Songs',
          'Wisdom',
          'Sirach',
          'Isaiah',
          'Jeremiah',
          'Lamentations',
          'Baruch',
          'Ezekiel',
          'Daniel',
          'Hosea',
          'Joel',
          'Amos',
          'Obadiah',
          'Jonah',
          'Micah',
          'Nahum',
          'Habakkuk',
          'Zephaniah',
          'Haggai',
          'Zechariah',
          'Malachi',
          'Matthew',
          'Mark',
          'Luke',
          'John',
          'Acts',
          'Romans',
          '1 Corinthians',
          '2 Corinthians',
          'Galatians',
          'Ephesians',
          'Philippians',
          'Colossians',
          '1 Thessalonians',
          '2 Thessalonians',
          '1 Timothy',
          '2 Timothy',
          'Titus',
          'Philemon',
          'Hebrews',
          'James',
          '1 Peter',
          '2 Peter',
          '1 John',
          '2 John',
          '3 John',
          'Jude',
          'Revelation'];
          if (books.includes(standardizeInput(event.SpeechResult))){
            gather.say(event.SpeechResult + ", OK.");
            context.BOOK = standardizeInput(event.SpeechResult);
            gatherDTMF.say("Please input on your keypad the chapter number you would like to listen to.");
          } else {
            gather.say("I'm sorry - I didn't understand " + event.SpeechResult + " as a book of the Bible. Could you please repeat it?")
          }
      } else {
        gather.say('Tell me the name of the book you would like to listen to.');
        console.log(event.SpeechResult);
        console.log(event);
      }
      return callback(null, twiml);
  }
  } catch (error) {
    console.error("Error:", error);
    twiml.say("An error occurred while processing the request.");
    return callback(error);
  }
};



function getVerseFromPsalms(verseRequest, psalmsText) {
    const parts = verseRequest.split(':');
    if (parts.length !== 2) {
        return "Invalid verse format. Please use the 'Chapter:Verse' format.";
    }


    const chapter = parts[0];
    const verseNumber = parts[1];


    if (!psalmsText.hasOwnProperty(chapter)) {
        return "Chapter not found.";
    }


    if (!psalmsText[chapter].hasOwnProperty(verseNumber)) {
        return "Verse not found in chapter " + chapter + ".";
    }


    const verseText = psalmsText[chapter][verseNumber];
    return `${chapter}:${verseNumber} ${verseText} PRAISE THE LORD!!`;
}





