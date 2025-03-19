// const API_KEY = "AIzaSyC2k93RFKWFLC5zNRW_kOS-MCr4wnx1iBA";


// document.getElementById("summarizeBtn").addEventListener("click", () => {
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         chrome.tabs.sendMessage(tabs[0].id, { action: "getEmailContent" }, (response) => {
//             if (response && response.text) {
//                 summarizeEmail(response.text);
//             }
//         });
//     });
// });


// document.getElementById("replyBtn").addEventListener("click", () => {
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         chrome.tabs.sendMessage(tabs[0].id, { action: "getEmailContent" }, (response) => {
//             if (response && response.text) {
//                 suggestReply(response.text);
//             }
//         });
//     });
// });


// async function summarizeEmail(emailText) {
//     const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//             contents: [{
//                 parts: [{
//                     text: "Extract only the most important key points from this email and format them as bullet points:\n\n" + emailText
//                 }]
//             }]
//         })
//     });

//     const data = await response.json();
//     if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
//         document.getElementById("summary").innerText = data.candidates[0].content.parts[0].text;
//     } else {
//         document.getElementById("summary").innerText = "Error: Could not generate summary.";
//     }
// }

// async function suggestReply(emailText) {
//     const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//             contents: [{
//                 parts: [{
//                     text: "Analyze this email and suggest a brief, context-aware reply. Keep it concise and in the same tone as the email:\n\n" + emailText
//                 }]
//             }]
//         })
//     });

//     const data = await response.json();
//     if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
//         document.getElementById("reply").innerText = data.candidates[0].content.parts[0].text;
//     } else {
//         document.getElementById("reply").innerText = "Error: Could not generate reply.";
//     }
// }
