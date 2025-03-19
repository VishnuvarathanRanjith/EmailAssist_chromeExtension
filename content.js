const imageURL = chrome.runtime.getURL("assets/idea.png");
console.log(imageURL);

const API_KEY = "AIzaSyC2k93RFKWFLC5zNRW_kOS-MCr4wnx1iBA";

// Initialize the MutationObserver
const observer = new MutationObserver(() => addBookMark());
observer.observe(document.body, { childList: true, subtree: true });

// Initial call to add the bookmark button
addBookMark();

function addBookMark() {
    // Check if the current page is an email page
    if (!emailPage()) return;

    // Check if the bookmark button already exists
    if (document.getElementById("book-mark-btn")) {
        return;
    }

    // Find the forward button
    const forwardBtn = document.getElementsByClassName("ams bkG")[0];

    if (!forwardBtn) {
        console.error("Element with class 'ams bkG' not found.");
        return;
    }

    // Create the bookmark button
    const bookMarkBtn = document.createElement("img");
    bookMarkBtn.id = "book-mark-btn";
    bookMarkBtn.src = imageURL;
    bookMarkBtn.style.height = "30px";
    bookMarkBtn.style.width = "35px";
    bookMarkBtn.style.cursor = "pointer";
    bookMarkBtn.style.transition = "filter 0.3s ease";
    bookMarkBtn.addEventListener("mouseover", () => {
        bookMarkBtn.style.filter = "brightness(1.5) sepia(1) hue-rotate(30deg) saturate(2)";
    });
    bookMarkBtn.addEventListener("mouseout", () => {
        bookMarkBtn.style.filter = "none";
    });

    // Add the bookmark button to the DOM
    forwardBtn.parentNode.insertAdjacentElement("beforeend", bookMarkBtn);

    // Remove the existing chatbot container if it exists
    const existingChatbotContainer = document.getElementById("chatbot-container");
    if (existingChatbotContainer) {
        existingChatbotContainer.remove();
    }

    // Create the chatbot container
    const chatbotContainer = document.createElement("div");
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

    // Add the chatbot container to the DOM
    document.body.appendChild(chatbotContainer);

    // Add event listeners for the bookmark button and chatbot container
    bookMarkBtn.addEventListener("click", () => {
        chatbotContainer.style.display = chatbotContainer.style.display === "none" ? "block" : "none";
    });

    document.getElementById("close-chatbot").addEventListener("click", () => {
        chatbotContainer.style.display = "none";
    });

    document.getElementById("send-message").addEventListener("click", message);
}

function getEmailContent() {
    const emailElement = document.querySelector(".a3s.aiL");
    return emailElement ? emailElement.innerText : "No email content found.";
}

function message() {
    const input = document.getElementById("chatbot-input").value.trim();
    const chatBody = document.getElementById("chatbot-body");

    if (!input) return;

    // Add the user's message to the chat
    const userMessage = document.createElement("div");
    userMessage.style.background = "#007bff";
    userMessage.style.color = "white";
    userMessage.style.padding = "8px";
    userMessage.style.borderRadius = "5px";
    userMessage.style.margin = "5px 0";
    userMessage.style.textAlign = "right";
    userMessage.innerText = input;

    chatBody.appendChild(userMessage);

    // Send the message to Gemini AI
    const emailContent = getEmailContent();
    sendToGemini(input, emailContent);

    // Clear the input field
    document.getElementById("chatbot-input").value = "";
}

function emailPage() {
    return window.location.pathname.includes("/mail");
}

async function sendToGemini(userQuery, emailContent) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    const requestBody = {
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
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        console.log("Gemini Response:", data);

        if (data.candidates && data.candidates.length > 0) {
            const responseText = data.candidates[0].content.parts[0].text;
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
    const chatBody = document.getElementById("chatbot-body");

    const botMessage = document.createElement("div");
    botMessage.style.background = "#f1f1f1";
    botMessage.style.color = "black";
    botMessage.style.padding = "8px";
    botMessage.style.borderRadius = "5px";
    botMessage.style.margin = "5px 0";
    botMessage.style.textAlign = "left";
    botMessage.innerText = response;

    chatBody.appendChild(botMessage);
}