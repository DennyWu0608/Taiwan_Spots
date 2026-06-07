// ============================================
// Firebase 設定檔
// 請將下方的 firebaseConfig 替換為你自己的設定
// 取得方式：Firebase Console → 專案設定 → 你的應用程式 → 複製 config
// ============================================

const firebaseConfig = {
  apiKey: "AIzaSyBrAMwzvRZwtCpsmuQ8UkCWNZ9XWEohVK0",
  authDomain: "taiwan-spots-joanna0211.firebaseapp.com",
  projectId: "taiwan-spots-joanna0211",
  storageBucket: "taiwan-spots-joanna0211.firebasestorage.app",
  messagingSenderId: "347132464422",
  appId: "1:347132464422:web:394bb0df6c72081f7785e7"
};

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 台灣 22 縣市
const TAIWAN_CITIES = [
  '台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市',
  '基隆市', '新竹市', '嘉義市',
  '新竹縣', '苗栗縣', '彰化縣', '南投縣', '雲林縣', '嘉義縣',
  '屏東縣', '宜蘭縣', '花蓮縣', '台東縣',
  '澎湖縣', '金門縣', '連江縣'
];

// 產生星星 HTML（純文字，用 textContent 安全）
function renderStars(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    stars += i <= rating ? '\u2605' : '\u2606';
  }
  return stars;
}

// 顯示 toast 通知
function showToast(message, isError = false) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast' + (isError ? ' error' : '');
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}

// 填入縣市下拉選單
function populateCitySelect(selectElement, includeAll = false) {
  if (includeAll) {
    const allOption = document.createElement('option');
    allOption.value = '';
    allOption.textContent = '所有縣市';
    selectElement.appendChild(allOption);
  }
  TAIWAN_CITIES.forEach(city => {
    const option = document.createElement('option');
    option.value = city;
    option.textContent = city;
    selectElement.appendChild(option);
  });
}
