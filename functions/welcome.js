// const Groq = require('groq-sdk');
// const VoiceResponse = require('twilio').twiml.VoiceResponse;
 
// exports.handler = async function(context, event, callback) {
//   const twiml = new VoiceResponse();
 
//   try {
//     const rolePrompt = "You are a database that only outputs verses from the first book of psalms in the king james version of the bible. If only one verse is given, you only output that verse. If a range of verses is given you only output that range. If only the book is given, you only output the first verse of psalms. You always end your output asking 'PRAISE THE LORD!! Would you like to hear the next verse or a new one? Do not output anything other than the verse and question.";
//     const client = new Groq({
//       apiKey: process.env.GROQ_API,
//     });
//     console.log(event.SpeechResult);
//     console.log(event);
//     if (event.SpeechResult) { // Process gathered text if available
//       const result = await client.chat.completions.create({
//         messages: [
//           {
//             role:"assistant",
//             content: rolePrompt,
//           },
//           {
//             role: "user",
//             content: event.SpeechResult,
//           }
//         ],
//         model: "mixtral-8x7b-32768",
//         max_tokens: 500, //250 is max word count for any verse in psalms + prompt ? + user msg ? included?
//         temperature: 0.1,
//         top_p: 0.2
//       });
//       twiml.say(result.choices[0].message.content);
//     } else { // Gather voice input if no text present
//       const gather = twiml.gather({
//         input: 'speech',
//         action: 'https://demo1-1934.twil.io/welcome',
//         speechModel:"phone_call",
//         enhanced:true
//       });
 
//       gather.say('Tell me a verse or verses you would like to hear from psalms.');
//     }
 
//     return callback(null, twiml);
 
//   } catch (error) {
//     console.error("Error:", error);
//     twiml.say("An error occurred while processing the request.");
//     return callback(error);
//   }
// };


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





