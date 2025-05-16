const selections = {};

document.querySelectorAll('.options-container').forEach(container => {
  const options = container.querySelectorAll('.option-card');

  options.forEach(option => {
    option.addEventListener('click', function () {
      const name = this.dataset.name;
      const value = parseInt(this.dataset.value);
      const label = this.dataset.label;
      const isCheckbox = this.dataset.type === 'checkbox';

      if (isCheckbox) {
        this.classList.toggle('selected');
        if (!selections[name]) selections[name] = [];
        const index = selections[name].findIndex(item => item.label === label);
        if (this.classList.contains('selected')) {
          if (index === -1) selections[name].push({ value, label });
        } else {
          if (index !== -1) selections[name].splice(index, 1);
        }
      } else {
        // 把同一組內其他選項的 selected 移除
        options.forEach(o => o.classList.remove('selected'));
        // 新選項加上 selected
        this.classList.add('selected');
        selections[name] = [{ value, label }];
      }
    });
  });
});

function nextStep(step) {
  document.querySelector('.section:not(.hidden)').classList.add('hidden');
  document.getElementById(`step${step}`).classList.remove('hidden');
}

function calculateTotal() {
  let total = 0;
  const summaryList = document.getElementById('summaryList');
  summaryList.innerHTML = '';

  for (const key in selections) {
    selections[key].forEach(item => {
      total += item.value;
      const li = document.createElement('li');
li.classList.add('summary-item');
li.innerHTML = `
  <span class="item-label">${name} > ${label}</span>
  <span class="item-price">$${value} NTD</span>
`;
summaryList.appendChild(li);

    });
  }

  document.getElementById('result').textContent = `總金額：${total} 元`;
  document.getElementById('summary').classList.remove('hidden');
}

function resetForm() {
  for (const key in selections) delete selections[key];
  document.querySelectorAll('.option-card').forEach(card => card.classList.remove('selected'));
  document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
  document.getElementById('step1').classList.remove('hidden');
  document.getElementById('summary').classList.add('hidden');
}
let currentStep = 1;

function nextStep(stepNumber) {
  document.getElementById(`step${currentStep}`).classList.add('hidden');
  document.getElementById(`step${stepNumber}`).classList.remove('hidden');
  currentStep = stepNumber;
}

function previousStep() {
  if (currentStep > 1) {
    document.getElementById(`step${currentStep}`).classList.add('hidden');
    document.getElementById(`step${currentStep - 1}`).classList.remove('hidden');
    currentStep -= 1;
  }
}
currentStep = 1;

function nextStep(stepNumber) {
  document.getElementById(`step${currentStep}`).classList.add('hidden');
  document.getElementById(`step${stepNumber}`).classList.remove('hidden');
  currentStep = stepNumber;
}

function calculateTotal() {
  const selectedOptions = document.querySelectorAll('.option-card.selected');
  let total = 0;
  const summaryList = document.getElementById('summaryList');
  summaryList.innerHTML = '';

  selectedOptions.forEach(option => {
    const label = option.getAttribute('data-label');
    const value = parseInt(option.getAttribute('data-value'), 10);
    if (!isNaN(value)) total += value;

    const li = document.createElement('li');
    li.textContent = label;
    summaryList.appendChild(li);
  });

  document.getElementById('result').textContent = `Total: $${total} NTD`;
  document.getElementById(`step${currentStep}`).classList.add('hidden');
  document.getElementById('summary').classList.remove('hidden');
}

function resetForm() {
  const selected = document.querySelectorAll('.option-card.selected');
  selected.forEach(el => el.classList.remove('selected'));

  document.getElementById('summary').classList.add('hidden');
  document.getElementById(`step1`).classList.remove('hidden');
  currentStep = 1;
}

function calculateTotal() {
  const selections = document.querySelectorAll('.option-card.selected');
  const summaryList = document.getElementById('summaryList');
  const result = document.getElementById('result');
  let total = 0;

  summaryList.innerHTML = ''; // 清空上次結果

  selections.forEach(item => {
    const label = item.dataset.label;
    const value = parseInt(item.dataset.value);
    total += value;

    const li = document.createElement('li');
li.classList.add('summary-item');
li.innerHTML = `
  <span class="item-label">${label}</span>
  <span class="item-price">$${value} NTD</span>
`;
summaryList.appendChild(li);
  });

  result.textContent = `Total：$${total} NTD`;

  document.getElementById('summary').classList.remove('hidden');
  document.querySelector(`#step6`).classList.add('hidden');
}
 // ✅ 使用你的 Firebase 設定碼
 const firebaseConfig = {
  apiKey: "AIzaSyB07VZNn1x58DI4fU8RiOsb1zj3xUtK7JQ",
  authDomain: "qipao-project.firebaseapp.com",
  databaseURL: "https://qipao-project-default-rtdb.firebaseio.com",
  projectId: "qipao-project",
  storageBucket: "qipao-project.firebasestorage.app",
  messagingSenderId: "746621216525",
  appId: "1:746621216525:web:692072a88f46431cc77244",
  measurementId: "G-BB5DRMH1W0"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 儲存資料
function saveSelection() {
  const name = document.getElementById("username").value.trim();
  const choice = document.getElementById("qipaoOption").value;
  if (!name) {
    alert("請輸入名字！");
    return;
  }
  db.ref("users/" + name).set({
    qipao: choice,
    time: new Date().toISOString()
  });
  document.getElementById("savedSelection").innerText = `已儲存：${choice}`;
}

// 讀取資料
document.getElementById("username").addEventListener("blur", function () {
  const name = this.value.trim();
  if (!name) return;
  db.ref("users/" + name).once("value").then(snapshot => {
    const data = snapshot.val();
    if (data && data.qipao) {
      document.getElementById("savedSelection").innerText = `上次選擇：${data.qipao}`;
      document.getElementById("qipaoOption").value = data.qipao;
    } else {
      document.getElementById("savedSelection").innerText = "尚未有紀錄";
    }
  });
});