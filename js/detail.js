// ===== 景點詳情頁邏輯 =====

document.addEventListener('DOMContentLoaded', async () => {
  const loadingState = document.getElementById('loadingState');
  const detailCard = document.getElementById('detailCard');
  const errorState = document.getElementById('errorState');

  // 從 URL 取得景點 ID
  const params = new URLSearchParams(window.location.search);
  const spotId = params.get('id');

  if (!spotId) {
    loadingState.style.display = 'none';
    errorState.style.display = 'block';
    return;
  }

  try {
    const doc = await db.collection('spots').doc(spotId).get();

    if (!doc.exists) {
      loadingState.style.display = 'none';
      errorState.style.display = 'block';
      return;
    }

    const spot = doc.data();
    loadingState.style.display = 'none';
    detailCard.style.display = 'block';

    // 設定頁面標題
    document.title = spot.name + ' - 台灣景點資料庫';

    // 佔位圖示
    const noImg = document.createElement('div');
    noImg.className = 'no-image';
    noImg.textContent = '🏔️';
    detailCard.appendChild(noImg);

    // 內容區
    const body = document.createElement('div');
    body.className = 'detail-body';

    // 標題
    const title = document.createElement('h2');
    title.className = 'detail-title';
    title.textContent = spot.name;
    body.appendChild(title);

    // 縣市 & 地址
    const meta = document.createElement('div');
    meta.className = 'detail-meta';

    const citySpan = document.createElement('span');
    citySpan.textContent = '📍 ' + spot.city;
    meta.appendChild(citySpan);

    if (spot.address) {
      const addrSpan = document.createElement('span');
      addrSpan.textContent = spot.address;
      meta.appendChild(addrSpan);
    }

    if (spot.createdAt) {
      const dateSpan = document.createElement('span');
      const date = spot.createdAt.toDate();
      dateSpan.textContent = '新增於 ' + date.toLocaleDateString('zh-TW');
      meta.appendChild(dateSpan);
    }

    body.appendChild(meta);

    // 評分
    const rating = document.createElement('div');
    rating.className = 'detail-rating';
    rating.textContent = renderStars(spot.rating || 0) + ' ' + (spot.rating || 0) + ' / 5';
    body.appendChild(rating);

    // 描述
    if (spot.description) {
      const desc = document.createElement('div');
      desc.className = 'detail-description';
      desc.textContent = spot.description;
      body.appendChild(desc);
    }

    // 標籤
    if (spot.tags && spot.tags.length > 0) {
      const tagsDiv = document.createElement('div');
      tagsDiv.className = 'detail-tags';
      spot.tags.forEach(tagText => {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = tagText;
        tagsDiv.appendChild(tag);
      });
      body.appendChild(tagsDiv);
    }

    // 操作按鈕
    const actions = document.createElement('div');
    actions.className = 'detail-actions';

    const backBtn = document.createElement('a');
    backBtn.href = 'index.html';
    backBtn.className = 'btn btn-secondary';
    backBtn.textContent = '← 返回列表';
    actions.appendChild(backBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-danger';
    deleteBtn.textContent = '刪除景點';
    deleteBtn.addEventListener('click', async () => {
      if (!confirm('確定要刪除「' + spot.name + '」嗎？此操作無法復原。')) {
        return;
      }

      deleteBtn.disabled = true;
      deleteBtn.textContent = '刪除中...';

      try {
        await db.collection('spots').doc(spotId).delete();

        showToast('景點已刪除');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1000);
      } catch (error) {
        console.error('刪除失敗:', error);
        showToast('刪除失敗：' + error.message, true);
        deleteBtn.disabled = false;
        deleteBtn.textContent = '刪除景點';
      }
    });
    actions.appendChild(deleteBtn);

    body.appendChild(actions);
    detailCard.appendChild(body);

  } catch (error) {
    console.error('載入失敗:', error);
    loadingState.style.display = 'none';
    errorState.style.display = 'block';
  }
});
