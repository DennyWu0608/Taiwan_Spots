// ===== 城市頁面邏輯 =====

document.addEventListener('DOMContentLoaded', () => {
  const cityTitle = document.getElementById('cityTitle');
  const spotsGrid = document.getElementById('spotsGrid');
  const loadingState = document.getElementById('loadingState');
  const emptyState = document.getElementById('emptyState');
  const searchInput = document.getElementById('searchInput');
  const tabs = document.querySelectorAll('.tab');
  const addBtn = document.getElementById('addBtn');
  const addEmptyBtn = document.getElementById('addEmptyBtn');

  // 從 URL 取得城市名稱
  const params = new URLSearchParams(window.location.search);
  const city = params.get('city');

  if (!city) {
    window.location.href = 'index.html';
    return;
  }

  cityTitle.textContent = city;
  document.title = city + ' - 台灣景點資料庫';

  // 新增景點時帶入城市
  const addUrl = 'add.html?city=' + encodeURIComponent(city);
  addBtn.href = addUrl;
  addEmptyBtn.href = addUrl;

  let allSpots = [];
  let currentCategory = '食';

  // 即時監聽該城市的景點
  db.collection('spots')
    .where('city', '==', city)
    .onSnapshot((snapshot) => {
      allSpots = [];
      snapshot.forEach(doc => {
        allSpots.push({ id: doc.id, ...doc.data() });
      });

      // 在 JS 端排序（最新優先）
      allSpots.sort((a, b) => {
        const ta = a.createdAt ? a.createdAt.toMillis() : 0;
        const tb = b.createdAt ? b.createdAt.toMillis() : 0;
        return tb - ta;
      });

      loadingState.style.display = 'none';
      renderSpots();
    }, (error) => {
      console.error('載入失敗:', error);
      loadingState.style.display = 'none';
      showToast('載入失敗：' + error.message, true);
    });

  // 分類標籤切換
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCategory = tab.getAttribute('data-cat');
      renderSpots();
    });
  });

  // 搜尋
  searchInput.addEventListener('input', renderSpots);

  function renderSpots() {
    const searchText = searchInput.value.trim().toLowerCase();

    const filtered = allSpots.filter(spot => {
      if (spot.category !== currentCategory) return false;
      if (searchText && !spot.name.toLowerCase().includes(searchText)) return false;
      return true;
    });

    spotsGrid.innerHTML = '';

    if (filtered.length === 0) {
      emptyState.style.display = 'block';
      spotsGrid.style.display = 'none';
      document.getElementById('emptyText').textContent =
        '「' + currentCategory + '」分類尚無景點';
      return;
    }

    emptyState.style.display = 'none';
    spotsGrid.style.display = 'grid';

    filtered.forEach(spot => {
      const card = document.createElement('a');
      card.className = 'spot-card';
      card.href = 'detail.html?id=' + encodeURIComponent(spot.id);

      // 圖示
      const noImg = document.createElement('div');
      noImg.className = 'no-image';
      const icons = { '食': '🍽️', '住': '🏨', '行': '🚗' };
      noImg.textContent = icons[spot.category] || '🏔️';
      card.appendChild(noImg);

      // 內容
      const body = document.createElement('div');
      body.className = 'card-body';

      const title = document.createElement('div');
      title.className = 'card-title';
      title.textContent = spot.name;
      body.appendChild(title);

      const rating = document.createElement('div');
      rating.className = 'card-rating';
      rating.textContent = renderStars(spot.rating || 0);
      body.appendChild(rating);

      if (spot.address) {
        const addr = document.createElement('div');
        addr.className = 'card-city';
        addr.textContent = '📍 ' + spot.address;
        body.appendChild(addr);
      }

      // 標籤
      if (spot.tags && spot.tags.length > 0) {
        const tagsDiv = document.createElement('div');
        tagsDiv.className = 'card-tags';
        spot.tags.slice(0, 3).forEach(tagText => {
          const tag = document.createElement('span');
          tag.className = 'tag';
          tag.textContent = tagText;
          tagsDiv.appendChild(tag);
        });
        body.appendChild(tagsDiv);
      }

      card.appendChild(body);
      spotsGrid.appendChild(card);
    });
  }
});
