// 全域儲存選項
const selections = {};
let currentStep = 1;

document.addEventListener('DOMContentLoaded', () => {
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
          options.forEach(o => o.classList.remove('selected'));
          this.classList.add('selected');
          selections[name] = [{ value, label }];
        }
      });
    });
  });
});

function nextStep(stepNumber) {
  document.getElementById(`step${currentStep}`).classList.add('hidden');
  document.getElementById(`step${stepNumber}`).classList.remove('hidden');
  currentStep = stepNumber;
}

function previousStep() {
  if (currentStep > 1) {
    document.getElementById(`step${currentStep}`).classList.add('hidden');
    currentStep -= 1;
    document.getElementById(`step${currentStep}`).classList.remove('hidden');
  }
}

function calculateTotal() {
  const summaryList = document.getElementById('summaryList');
  const result = document.getElementById('result');
  summaryList.innerHTML = '';
  let total = 0;

  for (const name in selections) {
    selections[name].forEach(item => {
      total += item.value;
      const li = document.createElement('li');
      li.classList.add('summary-item');
      li.innerHTML = `
        <span class="item-label">${name} > ${item.label}</span>
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
  // 清除選項與畫面
  for (const key in selections) delete selections[key];
  document.querySelectorAll('.option-card').forEach(card => card.classList.remove('selected'));
  document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));

  // 重設到第一步
  document.getElementById('step1').classList.remove('hidden');
  document.getElementById('summary').classList.add('hidden');
  currentStep = 1;
}
