// ===== 主頁邏輯：瀏覽、搜尋、篩選 =====

document.addEventListener('DOMContentLoaded', () => {
  const spotsGrid = document.getElementById('spotsGrid');
  const loadingState = document.getElementById('loadingState');
  const emptyState = document.getElementById('emptyState');
  const filterCity = document.getElementById('filterCity');
  const searchInput = document.getElementById('searchInput');
  const sortBy = document.getElementById('sortBy');

  // 填入縣市篩選
  populateCitySelect(filterCity, true);

  // 儲存所有景點資料
  let allSpots = [];

  // 即時監聽 Firestore
  db.collection('spots')
    .orderBy('createdAt', 'desc')
    .onSnapshot((snapshot) => {
      allSpots = [];
      snapshot.forEach(doc => {
        allSpots.push({ id: doc.id, ...doc.data() });
      });

      loadingState.style.display = 'none';
      renderSpots();
    }, (error) => {
      console.error('載入失敗:', error);
      loadingState.style.display = 'none';
      showToast('載入失敗：' + error.message, true);
    });

  // 篩選和排序事件
  filterCity.addEventListener('change', renderSpots);
  searchInput.addEventListener('input', renderSpots);
  sortBy.addEventListener('change', renderSpots);

  function renderSpots() {
    const cityFilter = filterCity.value;
    const searchText = searchInput.value.trim().toLowerCase();
    const sort = sortBy.value;

    // 篩選
    let filtered = allSpots.filter(spot => {
      if (cityFilter && spot.city !== cityFilter) return false;
      if (searchText && !spot.name.toLowerCase().includes(searchText)) return false;
      return true;
    });

    // 排序
    if (sort === 'rating') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name, 'zh-TW'));
    }
    // 'newest' 已經由 Firestore 排序

    // 顯示
    spotsGrid.innerHTML = '';

    if (filtered.length === 0) {
      emptyState.style.display = 'block';
      spotsGrid.style.display = 'none';
      return;
    }

    emptyState.style.display = 'none';
    spotsGrid.style.display = 'grid';

    filtered.forEach(spot => {
      const card = document.createElement('a');
      card.className = 'spot-card';
      card.href = 'detail.html?id=' + encodeURIComponent(spot.id);

      // 圖片
      if (spot.photoURL) {
        const img = document.createElement('img');
        img.className = 'card-img';
        img.src = spot.photoURL;
        img.alt = spot.name;
        img.loading = 'lazy';
        card.appendChild(img);
      } else {
        const noImg = document.createElement('div');
        noImg.className = 'no-image';
        noImg.textContent = '🏔️';
        card.appendChild(noImg);
      }

      // 內容
      const body = document.createElement('div');
      body.className = 'card-body';

      const title = document.createElement('div');
      title.className = 'card-title';
      title.textContent = spot.name;
      body.appendChild(title);

      const city = document.createElement('div');
      city.className = 'card-city';
      city.textContent = spot.city;
      body.appendChild(city);

      const rating = document.createElement('div');
      rating.className = 'card-rating';
      rating.textContent = renderStars(spot.rating || 0);
      body.appendChild(rating);

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
