let currentStep = 1;
const selections = {};

// 處理點選選項
document.querySelectorAll('.options-container').forEach(container => {
  const options = container.querySelectorAll('.option-card');
  options.forEach(option => {
    option.addEventListener('click', function () {
      const name = this.dataset.name;
      const value = parseInt(this.dataset.value, 10);
      const label = this.dataset.label;

      options.forEach(o => o.classList.remove('selected'));
      this.classList.add('selected');

      selections[name] = [{ value, label }];
    });
  });
});

function nextStep(stepNumber) {
  // 檢查當前步驟是否有選擇
  const stepContainer = document.getElementById(`step${currentStep}`);
  const selectedOption = stepContainer.querySelector('.option-card.selected');
  if (!selectedOption) {
    alert('請選擇一個選項再繼續');
    return;
  }

  // 若是最後一步送出，執行存檔
  if (stepNumber === 'submit') {
    saveSelection();
    return;
  }

  document.getElementById(`step${currentStep}`).classList.add('hidden');
  document.getElementById(`step${stepNumber}`).classList.remove('hidden');
  currentStep = stepNumber;

  // 如果是最後步，改按鈕文字
  const nextBtn = document.getElementById('nextBtn');
  if (stepNumber === totalSteps) {
    nextBtn.textContent = '送出';
    nextBtn.setAttribute('data-action', 'submit');
  } else {
    nextBtn.textContent = '下一步';
    nextBtn.setAttribute('data-action', 'next');
  }
}

function previousStep() {
  if (currentStep > 1) {
    document.getElementById(`step${currentStep}`).classList.add('hidden');
    document.getElementById(`step${currentStep - 1}`).classList.remove('hidden');
    currentStep -= 1;

    const nextBtn = document.getElementById('nextBtn');
    nextBtn.textContent = '下一步';
    nextBtn.setAttribute('data-action', 'next');
  }
}

function calculateTotal() {
  const summaryList = document.getElementById('summaryList');
  const result = document.getElementById('result');
  summaryList.innerHTML = '';
  let total = 0;

  for (const key in selections) {
    selections[key].forEach(item => {
      total += item.value;
      const li = document.createElement('li');
      li.classList.add('summary-item');
      li.innerHTML = `
        <span class="item-label">${item.label}</span>
        <span class="item-price">$${item.value} NTD</span>
      `;
      summaryList.appendChild(li);
    });
  }

  result.textContent = `總金額：$${total} NTD`;
  document.getElementById(`step${currentStep}`).classList.add('hidden');
  document.getElementById('summary').classList.remove('hidden');
}

function resetForm() {
  Object.keys(selections).forEach(k => delete selections[k]);
  document.querySelectorAll('.option-card').forEach(card => card.classList.remove('selected'));
  document.getElementById('summary').classList.add('hidden');
  document.getElementById('step1').classList.remove('hidden');
  currentStep = 1;

  const nextBtn = document.getElementById('nextBtn');
  nextBtn.textContent = '下一步';
  nextBtn.setAttribute('data-action', 'next');

  document.getElementById('username').value = '';
}

// Firebase 初始化
const firebaseConfig = {
  apiKey: "AIzaSyB07VZNn1x58DI4fU8RiOsb1zj3xUtK7JQ",
  authDomain: "qipao-project.firebaseapp.com",
  databaseURL: "https://qipao-project-default-rtdb.firebaseio.com",
  projectId: "qipao-project",
  storageBucket: "qipao-project.appspot.com", // 修正這裡
  messagingSenderId: "746621216525",
  appId: "1:746621216525:web:692072a88f46431cc77244",
  measurementId: "G-BB5DRMH1W0"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

function saveSelection() {
  const name = document.getElementById("saveBtn").value.trim();
  if (!name) {
    alert("請輸入名字！");
    return;
  }

  // 確認該名字是否已有紀錄
  db.ref("users/" + name).once("value").then(snapshot => {
    if (snapshot.exists()) {
      if (!confirm("此名字已有紀錄，是否覆蓋？")) return;
    }

    const choiceList = [];
    for (const key in selections) {
      selections[key].forEach(item => {
        choiceList.push(`${key}: ${item.label}`);
      });
    }

    const now = new Date().toISOString();

    db.ref("users/" + name).set({
      selections: choiceList,
      time: now
    }).then(() => {
      alert("已儲存！");
      calculateTotal();
    }).catch(err => {
      alert("儲存失敗：" + err.message);
    });
  });
}

document.getElementById("username").addEventListener("blur", function () {
  const name = this.value.trim();
  if (!name) return;

  db.ref("users/" + name).once("value").then(snapshot => {
    const data = snapshot.val();
    if (data && data.selections) {
      alert("找到先前紀錄：\n" + data.selections.join("\n"));
    }
  });
});

// 按鈕監聽（下一步或送出）
const totalSteps = document.querySelectorAll('[id^="step"]').length - 1; // 假設最後一個是 summary
document.getElementById('nextBtn').addEventListener('click', () => {
  const action = document.getElementById('nextBtn').getAttribute('data-action');
  if (action === 'next') {
    nextStep(currentStep + 1);
  } else if (action === 'submit') {
    saveSelection();
  }
});

document.getElementById('prevBtn').addEventListener('click', () => {
  previousStep();
});

document.getElementById('resetBtn').addEventListener('click', () => {
  resetForm();
});
