const imageURL = chrome.runtime.getURL("assets/idea.png");
console.log(imageURL);

const API_KEY = "AIzaSyC2k93RFKWFLC5zNRW_kOS-MCr4wnx1iBA";

addBookMark();
const observer = new MutationObserver(() => addBookMark());
observer.observe(document.body, { childList: true, subtree: true });

function addBookMark() {

    if (!emailPage() || document.getElementById("book-mark-btn")) return;

    const forwardBtn = document.getElementsByClassName("ams bkG")[0];

    if (!forwardBtn) {
        console.error("Element with class 'ams bkG' not found.");
        return;
    }

    const bookMarkBtn = document.createElement("img");
    bookMarkBtn.id = "book-mark-btn";
    bookMarkBtn.src = imageURL;
    bookMarkBtn.style.height = "20px";
    bookMarkBtn.style.width = "20px";
    bookMarkBtn.style.cursor = "pointer";



    
    forwardBtn.parentNode.insertAdjacentElement("beforeend", bookMarkBtn);
    

    let chatbotContainer = document.createElement("div");
    chatbotContainer.id = "chatbot-container";
    chatbotContainer.style.position = "fixed";
    chatbotContainer.style.bottom = "80px";
    chatbotContainer.style.right = "20px";
    chatbotContainer.style.width = "350px";
    chatbotContainer.style.background = "white";
    chatbotContainer.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    chatbotContainer.style.borderRadius = "10px";
    chatbotContainer.style.fontFamily = "Arial, sans-serif";
    chatbotContainer.style.zIndex = "99999";
    chatbotContainer.style.display = "none";

    chatbotContainer.innerHTML = `
    <div style="background:rgb(255, 0, 4); color: white; padding: 12px; font-size: 16px; font-weight: bold; display: flex; justify-content: space-between; align-items: center; border-radius: 10px 10px 0 0;">
        Chatbot
        <button id="close-chatbot" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer;">✖</button>
    </div>
    <div id="chatbot-body" style="padding: 10px; max-height: 300px; overflow-y: auto;"></div>
    <div style="display: flex; padding: 10px; border-top: 1px solid #ddd;">
        <input type="text" id="chatbot-input" placeholder="Type a message..." style="flex: 1; padding: 8px; border: 1px solid #ccc; border-radius: 5px;">
        <button id="send-message" style="background:rgb(255, 123, 0); color: white; border: none; padding: 8px 15px; margin-left: 5px; cursor: pointer; border-radius: 5px;">Send</button>
    </div>
`;

    document.body.appendChild(chatbotContainer);

    bookMarkBtn.addEventListener("click", () => {
    chatbotContainer.style.display = chatbotContainer.style.display === "none" ? "block" : "none";
    });

    document.getElementById("close-chatbot").addEventListener("click", () => {
    chatbotContainer.style.display = "none";
    });

    document.getElementById('send-message').addEventListener('click',message);
   
}

function getEmailContent() {
    let emailElement = document.querySelector(".a3s.aiL");
    return emailElement ? emailElement.innerText : "No email content found.";
}

function message() {
    let input = document.getElementById("chatbot-input").value.trim();
    let chatBody = document.getElementById("chatbot-body");

    if (!input) return;

    let userMessage = document.createElement("div");
    userMessage.style.background = "#007bff";
    userMessage.style.color = "white";
    userMessage.style.padding = "8px";
    userMessage.style.borderRadius = "5px";
    userMessage.style.margin = "5px 0";
    userMessage.style.textAlign = "right";
    userMessage.innerText = input;

    chatBody.appendChild(userMessage);
    
    let emailContent = getEmailContent();
    sendToGemini(input, emailContent);
}


function emailPage() {
    return window.location.pathname.includes("/mail");
}


async function sendToGemini(userQuery, emailContent) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    let requestBody = {
        contents: [
            {
                role: "user",
                parts: [
                    { text: `This is an email: "${emailContent}". Based on this, answer the following: "${userQuery}"` }
                ]
            }
        ]
    };

    try {
        let response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        let data = await response.json();
        console.log("Gemini Response:", data);

        if (data.candidates && data.candidates.length > 0) {
            let responseText = data.candidates[0].content.parts[0].text;
            displayBotResponse(responseText);
        } else {
            displayBotResponse("Sorry, I couldn't process the request.");
        }
    } catch (error) {
        console.error("Error calling Gemini AI:", error);
        displayBotResponse("Error processing request.");
    }
}

function displayBotResponse(response) {
    let chatBody = document.getElementById("chatbot-body");

    let botMessage = document.createElement("div");
    botMessage.style.background = "#f1f1f1";
    botMessage.style.color = "black";
    botMessage.style.padding = "8px";
    botMessage.style.borderRadius = "5px";
    botMessage.style.margin = "5px 0";
    botMessage.style.textAlign = "left";
    botMessage.innerText = response;

    chatBody.appendChild(botMessage);
}
