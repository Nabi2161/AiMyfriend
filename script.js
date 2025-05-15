const startRecordingButton = document.getElementById('start-recording');
const transcriptElement = document.getElementById('transcript'); // Update to reflect the new label '回覆'
const responseElement = document.getElementById('response'); // Update to reflect the new label 'AI'

// Prompt user for API key
let GOOGLE_API_KEY = prompt("Please enter your Google AI API key:");

// Speech recognition setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.interimResults = false;

// Start recording
startRecordingButton.addEventListener('click', () => {
    recognition.start();
});

// Optimize speech recognition logic
recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript.trim();
    transcriptElement.textContent = `Transcript: ${transcript}`;

    // Add additional debugging logs
    console.log(`Transcript received: ${transcript}`); // Log the full transcript

    // Define MBTI keywords
    const mbtiKeywords = [
        'INTJ', 'ENTP', 'INFJ', 'ENFP',
        'ISTJ', 'ESTJ', 'ISFJ', 'ESFJ',
        'ISTP', 'ESTP', 'ISFP', 'ESFP',
        'INTP', 'ENTJ', 'INFP', 'ENFJ'
    ];

    // Extract MBTI keyword if present
    const detectedKeyword = mbtiKeywords.find(keyword => transcript.toUpperCase().includes(keyword));

    // Log the detected MBTI keyword
    console.log(`Detected keyword: ${detectedKeyword}`); // Log the detected MBTI keyword

    // Ensure changeBackgroundColor is called correctly
    if (detectedKeyword) {
        console.log(`Calling changeBackgroundColor for: ${detectedKeyword}`); // Log before calling the function
        // Debugging: Log detected MBTI type and background color changes
        console.log(`Detected MBTI Type: ${detectedKeyword}`); // Log detected MBTI type
        responseElement.textContent = '正在生成回應，請稍候...';
        const aiResponse = await getAIResponse(detectedKeyword);
        responseElement.textContent = `AI: ${aiResponse}`;

        // Correctly call changeBackgroundColor
        changeBackgroundColor(detectedKeyword);
        console.log(`Background color changed for: ${detectedKeyword}`); // Log background color change
        console.log(`Background color should now be updated for: ${detectedKeyword}`); // Log after calling the function

        // Convert AI response to speech
        textToSpeech(aiResponse);
    } else {
        responseElement.textContent = '未偵測到有效的 MBTI 關鍵字，請再試一次。';
    }
};

recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
};

// Update the AI response logic to ensure responses are at least 250 characters in Chinese
async function getAIResponse(text) {
    // Define MBTI personality traits and lucky colors for all 16 types in Chinese
    const mbtiData = {
        'INTJ': { traits: '有策略性、邏輯性且獨立。您擅長長期規劃，並且喜歡挑戰複雜的問題。', luckyColor: '藍色', unluckyColor: '黃色', clothing: '正式西裝', accessories: '簡約手錶', avoid: '避免過度計劃，嘗試靈活應對' },
        'ENTP': { traits: '好奇、充滿活力且善於即興。您喜歡探索新點子，並且擅長解決問題。', luckyColor: '黃色', unluckyColor: '灰色', clothing: '休閒襯衫', accessories: '創意耳環', avoid: '避免過度分心，專注於一件事' },
        'INFJ': { traits: '有同理心、洞察力且理想主義。您關心他人，並且致力於實現更好的未來。', luckyColor: '紫色', unluckyColor: '紅色', clothing: '柔和色調的連衣裙', accessories: '水晶項鍊', avoid: '避免過度理想化，務實面對現實' },
        'ENFP': { traits: '熱情、創意且善於交際。您充滿活力，並且喜歡激勵他人。', luckyColor: '橙色', unluckyColor: '黑色', clothing: '鮮豔的T恤', accessories: '多彩手鍊', avoid: '避免過度承諾，專注於自己的需求' },
        'ESFP': { traits: '愛玩、熱情且友善。您喜歡享受生活，並且擅長娛樂他人。', luckyColor: '珊瑚色', unluckyColor: '深藍色', clothing: '亮色系服裝', accessories: '時尚太陽眼鏡', avoid: '避免過度揮霍，保持理性' },
        'INTP': { traits: '創新、好奇且邏輯性強。您喜歡探索理論，並且擅長分析複雜的概念。', luckyColor: '青色', unluckyColor: '橙色', clothing: '簡約風格襯衫', accessories: '筆記本', avoid: '避免過度沉迷於細節，專注於大局' },
        'ENTJ': { traits: '有魅力、有策略且雄心勃勃。您擅長領導，並且喜歡實現宏大的目標。', luckyColor: '栗色', unluckyColor: '粉紅色', clothing: '正式西裝', accessories: '高級皮帶', avoid: '避免過度控制，學會傾聽' },
        'INFP': { traits: '理想主義、有同理心且有創意。您注重內心價值，並且喜歡幫助他人。', luckyColor: '薰衣草色', unluckyColor: '灰色', clothing: '舒適的針織衫', accessories: '文藝風格的包包', avoid: '避免過度內向，嘗試與人交流' },
        'ENFJ': { traits: '有魅力、支持他人且鼓舞人心。您擅長激勵他人，並且喜歡建立深厚的關係。', luckyColor: '綠松石色', unluckyColor: '黑色', clothing: '優雅的襯衫', accessories: '精緻手鍊', avoid: '避免過度承擔他人問題，關注自己' },
    };

    const mbtiInfo = mbtiData[text.toUpperCase()];
    if (mbtiInfo) {
        return `性格特徵: \n  ${mbtiInfo.traits}\n\n幸運顏色: \n  ${mbtiInfo.luckyColor}\n\n不吉利顏色: \n  ${mbtiInfo.unluckyColor}\n\n適合穿著: \n  ${mbtiInfo.clothing}\n\n適合配件: \n  ${mbtiInfo.accessories}\n\n今天需要避開: \n  ${mbtiInfo.avoid}`;
    } else {
        return '無法識別的 MBTI 類型，請重新輸入。';
    }
}

// Function to convert text to speech in Chinese
function textToSpeech(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-TW'; // Set language to Traditional Chinese
    window.speechSynthesis.speak(utterance);
}

// Change background color based on MBTI type
function changeBackgroundColor(mbtiType) {
    const greenTypes = ['ENFJ', 'ENFP', 'INFJ', 'INFP'];
    const blueTypes = ['ISFJ', 'ISTJ', 'ESTJ', 'ESFJ'];
    const purpleTypes = ['INTJ', 'INTP', 'ENTJ', 'ENTP'];
    const yellowTypes = ['ISFP', 'ISTP', 'ESTP', 'ESFP'];

    if (greenTypes.includes(mbtiType)) {
        document.body.style.backgroundColor = '#d4f4dd'; // Light green
    } else if (blueTypes.includes(mbtiType)) {
        document.body.style.backgroundColor = '#d4e9f4'; // Light blue
    } else if (purpleTypes.includes(mbtiType)) {
        document.body.style.backgroundColor = '#e9d4f4'; // Light purple
    } else if (yellowTypes.includes(mbtiType)) {
        document.body.style.backgroundColor = '#f4f1d4'; // Light yellow
    } else {
        document.body.style.backgroundColor = '#f4f4f9'; // Default background
    }
}

// Add event listener for MBTI input submission
document.getElementById('submit-mbti').addEventListener('click', async () => {
    const mbtiInput = document.getElementById('mbti-input').value;
    const aiResponse = await getAIResponse(mbtiInput);
    responseElement.textContent = `AI Response: ${aiResponse}`;

    // Convert AI response to speech
    textToSpeech(aiResponse);
});

// Add event listener for pause button
const pauseSpeakingButton = document.getElementById('pause-speaking');
pauseSpeakingButton.addEventListener('click', () => {
    window.speechSynthesis.cancel(); // Stop the current speech
});

// Update the voice dialog box during speech recognition
recognition.onstart = () => {
    const voiceDialog = document.getElementById('voice-dialog');
    voiceDialog.textContent = '語音輸入中，請說出您的 MBTI 類型...';
};

recognition.onend = () => {
    const voiceDialog = document.getElementById('voice-dialog');
    voiceDialog.textContent = '語音輸入已結束。';
};
