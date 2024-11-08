const grid = document.getElementById("grid");
const message = document.getElementById("message");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const playerNameDisplay = document.getElementById("player-name-display"); // عرض اسم اللاعب
let playerName = ""; // اسم اللاعب
let score = 0;
let currentLevel = 1;
const totalLevels = 15;
let mistakes = 0;
let gameTimer; // مؤقت اللعبة بالكامل

// بدء اللعبة
function startGame(difficulty) {
    if (!playerName) {
        playerName = document.getElementById('playerName').value.trim(); // أخذ اسم اللاعب مع إزالة المسافات
        if (!playerName) {
            alert("من فضلك، أدخل اسم اللاعب!"); // إذا كان الاسم فارغًا
            return;
        }
        document.getElementById('player-name-display').textContent = playerName; // عرض اسم اللاعب في اللعبة
        document.getElementById('player-name-input').style.display = 'none'; // إخفاء خانة إدخال الاسم
        document.getElementById('game-area').style.display = 'block'; // عرض واجهة اللعبة
    }
    
    score = 0;
    mistakes = 0;
    currentLevel = 1;
    updateScore();
    startGameTimer(60); // ضبط مؤقت اللعبة على 60 ثانية
    nextTurn();
}

// إعداد جولة جديدة
function nextTurn() {
    if (currentLevel > totalLevels) {
        endGame();
        return;
    }
    
    grid.innerHTML = "";
    message.textContent = "";
    
    const { gridSize, colorDifference } = getLevelConfig(currentLevel);
    grid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    
    const baseColor = getRandomColor();
    const colors = generateColors(baseColor, gridSize * gridSize, colorDifference);
    const targetIndex = Math.floor(Math.random() * colors.length);
    colors[targetIndex] = alterColorForColorBlindTest(baseColor);
    
    colors.forEach((color, i) => createColorBlock(color, i, targetIndex));
}

// إعدادات الصعوبة بناءً على المستوى
function getLevelConfig(level) {
    const gridSize = Math.min(3 + Math.floor(level / 5), 6); // زيادة حجم الشبكة تدريجيًا
    const colorDifference = Math.max(10 - level, 1); // تقليل الفرق بين الألوان لزيادة الصعوبة
    return { gridSize, colorDifference };
}

// إنشاء عنصر لون في الشبكة
function createColorBlock(color, index, targetIndex) {
    const colorDiv = document.createElement("div");
    colorDiv.style.backgroundColor = color;
    colorDiv.onclick = () => checkChoice(index, targetIndex);
    grid.appendChild(colorDiv);
}

// التحقق من الاختيار
function checkChoice(index, targetIndex) {
    if (index === targetIndex) {
        score++;
        message.textContent = "Correct! Great job! Moving to the next level...";
        message.style.color = "blue"; // جعل لون الرسالة أزرق عند الإجابة الصحيحة
    } else {
        mistakes++;
        message.textContent = "Incorrect! Moving to the next level...";
        message.style.color = "red"; // جعل لون الرسالة أحمر عند الإجابة الخاطئة
    }
    currentLevel++;
    updateScore();
    setTimeout(nextTurn, 1000);
}

// تحديث النقاط
function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}

// بدء مؤقت اللعبة بالكامل
function startGameTimer(seconds) {
    let timeLeft = seconds;
    timerDisplay.textContent = `Time: ${timeLeft}s`;
    
    gameTimer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time: ${timeLeft}s`;
        
        if (timeLeft <= 0) {
            clearInterval(gameTimer);
            endGame(); // إنهاء اللعبة عند انتهاء المؤقت
        }
    }, 1000);
}

// إنهاء اللعبة وعرض النتيجة النهائية
function endGame() {
    grid.innerHTML = "";
    clearInterval(gameTimer);
    
    const successRate = ((totalLevels - mistakes) / totalLevels) * 100;
    let diagnosis;

    if (successRate >= 90) {
        diagnosis = "You likely have normal color vision.";
    } else if (successRate >= 60) {
        diagnosis = `You may have mild color vision deficiency. Accuracy: ${successRate.toFixed(2)}%`;
    } else if (successRate >= 30) {
        diagnosis = `You may have moderate color vision deficiency. Accuracy: ${successRate.toFixed(2)}%`;
    } else {
        diagnosis = `You may have severe color vision deficiency. Accuracy: ${successRate.toFixed(2)}%`;
    }

    message.textContent = `Test Completed! ${diagnosis}`;
}

// الحصول على لون عشوائي
function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

// تعديل اللون لخلق فرق بسيط جدًا مثل اختبارات عمى الألوان
function alterColorForColorBlindTest(color) {
    const [r, g, b] = color.match(/\d+/g).map(Number);
    const colorComponent = Math.floor(Math.random() * 3);
    const adjustment = Math.random() > 0.5 ? 10 : -10;

    if (colorComponent === 0) return `rgb(${clamp(r + adjustment)}, ${g}, ${b})`;
    if (colorComponent === 1) return `rgb(${r}, ${clamp(g + adjustment)}, ${b})`;
    return `rgb(${r}, ${g}, ${clamp(b + adjustment)})`;
}

// دالة لضبط القيم ضمن النطاق الصحيح [0, 255]
function clamp(value) {
    return Math.max(0, Math.min(255, value));
}

// توليد قائمة من الألوان المشابهة
function generateColors(baseColor, count, colorDifference) {
    const colors = [];
    for (let i = 0; i < count; i++) {
        colors.push(alterColor(baseColor, colorDifference));
    }
    return colors;
}

// تعديل اللون بدرجة بسيطة
function alterColor(baseColor, difference) {
    const [r, g, b] = baseColor.match(/\d+/g).map(Number);
    return `rgb(${clamp(r + getRandomDifference(difference))}, ${clamp(g + getRandomDifference(difference))}, ${clamp(b + getRandomDifference(difference))})`;
}

function getRandomDifference(difference) {
    return Math.floor(Math.random() * difference) - difference / 2;
}
