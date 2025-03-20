const imageURL = chrome.runtime.getURL("assets/idea.png");
console.log(imageURL);

const API_KEY = "AIzaSyB6kWec0cSgjfNC1Elgcq27xATU3mN3Abs";

const observer = new MutationObserver(() => addBookMark());
observer.observe(document.body, { childList: true, subtree: true });

addBookMark();

function addBookMark() {
    if (!emailPage()) return;

    if (document.getElementById("book-mark-btn")) return;

    const forwardBtn = document.getElementsByClassName("ams bkG")[0];

    if (!forwardBtn) {
        console.error("Element with class 'ams bkG' not found.");
        return;
    }

    const bookMarkBtn = document.createElement("img");
    bookMarkBtn.id = "book-mark-btn";
    bookMarkBtn.className = "book-mark-btn";
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

    forwardBtn.parentNode.insertAdjacentElement("beforeend", bookMarkBtn);

    const existingChatbotContainer = document.getElementById("chatbot-container");
    if (existingChatbotContainer) {
        existingChatbotContainer.remove();
    }

    const chatbotContainer = document.createElement("div");
    chatbotContainer.id = "chatbot-container";
    chatbotContainer.className = "chatbox-container";

    chatbotContainer.innerHTML = `
        <div class="chatbot-header">
            Chatbot
            <button id="close-chatbot" class="close-btn">✖</button>
        </div>
        <div id="chatbot-body" class="chatbot-body">
            <!-- Chat messages will be appended here -->
        </div>
        <div class="chatbot-footer">
            <input type="text" id="chatbot-input" placeholder="Type a message..." class="chatbot-input">
            <button id="send-message" class="send-btn">Send</button>
        </div>
    `;

    document.body.appendChild(chatbotContainer);

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

    const userMessage = document.createElement("div");
    userMessage.className = "user-message";
    userMessage.innerText = input;

    chatBody.appendChild(userMessage);

    const emailContent = getEmailContent();
    sendToGemini(input, emailContent);

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
                    {
                        text: `This is an email: "${emailContent}". Based on this, answer the following: "${userQuery}". Please respond in a professional tone.`
                    }
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
            displayBotResponse(responseText, userQuery); // Pass userQuery here
        } else {
            displayBotResponse("Sorry, I couldn't process the request.", userQuery);
        }
    } catch (error) {
        console.error("Error calling Gemini AI:", error);
        displayBotResponse("Error processing request.", userQuery);
    }
}

function displayBotResponse(response, userInput) {
    const chatBody = document.getElementById("chatbot-body");

    const botMessage = document.createElement("div");
    botMessage.className = "bot-message";
    botMessage.innerText = response;

    chatBody.appendChild(botMessage);

    // Check if the user's input includes the word "reply"
    if (userInput.toLowerCase().includes("reply")) {
        // Add Reply Button
        const replyBtn = document.createElement("button");
        replyBtn.className = "reply-btn";
        replyBtn.innerText = "Reply";
        replyBtn.style.display = "block";
        replyBtn.style.margin = "10px auto";
        replyBtn.style.padding = "8px 12px";
        replyBtn.style.border = "none";
        replyBtn.style.background = "linear-gradient(135deg, #42a5f5, #1e88e5)";
        replyBtn.style.color = "white";
        replyBtn.style.borderRadius = "8px";
        replyBtn.style.cursor = "pointer";
        replyBtn.style.fontSize = "14px";
        replyBtn.style.transition = "background 0.3s ease, transform 0.2s ease";

        replyBtn.addEventListener("mouseover", () => {
            replyBtn.style.background = "linear-gradient(135deg, #1e88e5, #1565c0)";
            replyBtn.style.transform = "scale(1.05)";
        });

        replyBtn.addEventListener("mouseout", () => {
            replyBtn.style.background = "linear-gradient(135deg, #42a5f5, #1e88e5)";
            replyBtn.style.transform = "scale(1)";
        });

        replyBtn.addEventListener("click", () => openReplyBox(response));

        chatBody.appendChild(replyBtn);
    }
}

function openReplyBox(replyText) {
    const replyBtn = document.querySelector('div[aria-label="Reply"]');
    if (replyBtn) {
        replyBtn.click(); 
        setTimeout(() => insertReply(replyText), 2000); 
    } else {
        alert("Please manually open the reply box.");
    }
}

function insertReply(replyText) {
    const replyBox = document.querySelector(".Am.Al.editable");
    if (replyBox) {
        replyBox.innerHTML = replyText.replace(/\n/g, "<br>");
        replyBox.focus();
    } else {
        alert("Reply box not found. Please click Reply manually.");
    }
}



const style = document.createElement("style");
style.textContent = `
   /* Chatbot Container */


`;
document.head.appendChild(style);


