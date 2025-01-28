// API配置
const API_KEY = 'sk-8854137232d84db68c7332c231ef08be'; // ← 必须替换！！！
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

// 初始化元素
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const voiceBtn = document.getElementById('voice-btn');
let chatHistory = [];

// 添加消息
function addMessage(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    messageDiv.textContent = content;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 语音输入
if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    voiceBtn.addEventListener('click', () => {
        recognition.start();
        voiceBtn.style.backgroundColor = '#ff7675';
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        userInput.value = transcript;
        voiceBtn.style.backgroundColor = '';
    };
}

// API调用
async function getAIResponse(prompt) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7
            })
        });

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('错误:', error);
        return '暂时无法响应，请稍后再试';
    }
}

// 处理用户输入
async function handleUserInput() {
    const prompt = userInput.value.trim();
    if (!prompt) return;

    addMessage(prompt, true);
    userInput.value = '';

    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message';
    typingDiv.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot" style="animation-delay: 0.2s"></div>
        <div class="typing-dot" style="animation-delay: 0.4s"></div>
    `;
    chatBox.appendChild(typingDiv);

    const response = await getAIResponse(prompt);
    chatBox.removeChild(typingDiv);
    addMessage(response);
}

// 事件监听
sendBtn.addEventListener('click', handleUserInput);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleUserInput();
});

// 主题切换
function changeTheme(theme) {
    const root = document.documentElement;
    if (theme === 'cyberpunk') {
        root.style.setProperty('--primary-color', '#ff6b6b');
        root.style.setProperty('--bg-pattern', 'linear-gradient(45deg, #2d3436 0%, #000000 100%)');
    } else {
        root.style.setProperty('--primary-color', '#6c5ce7');
        root.style.setProperty('--bg-pattern', "url('assets/theme-pattern.svg')");
    }
}

// 初始化欢迎语
addMessage("您好！我是DeepSeek AI“段泽文”，有什么可以帮您？");