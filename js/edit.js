// ===== 編輯景點頁面邏輯 =====

document.addEventListener('DOMContentLoaded', async () => {
  const loadingState = document.getElementById('loadingState');
  const editCard = document.getElementById('editCard');
  const form = document.getElementById('editForm');
  const citySelect = document.getElementById('spotCity');
  const submitBtn = document.getElementById('submitBtn');
  const cancelBtn = document.getElementById('cancelBtn');

  // 填入縣市選單
  populateCitySelect(citySelect);

  // 從 URL 取得景點 ID
  const params = new URLSearchParams(window.location.search);
  const spotId = params.get('id');

  if (!spotId) {
    window.location.href = 'index.html';
    return;
  }

  // 取消按鈕導回詳情頁
  cancelBtn.href = 'detail.html?id=' + encodeURIComponent(spotId);

  try {
    const doc = await db.collection('spots').doc(spotId).get();

    if (!doc.exists) {
      showToast('找不到此景點', true);
      window.location.href = 'index.html';
      return;
    }

    const spot = doc.data();
    loadingState.style.display = 'none';
    editCard.style.display = 'block';

    // 填入現有資料
    document.getElementById('spotName').value = spot.name || '';
    citySelect.value = spot.city || '';

    // 分類
    const catRadio = document.querySelector('input[name="category"][value="' + (spot.category || '餐') + '"]');
    if (catRadio) catRadio.checked = true;

    document.getElementById('spotAddress').value = spot.address || '';
    document.getElementById('spotDescription').value = spot.description || '';

    // 評分
    const ratingRadio = document.querySelector('input[name="rating"][value="' + (spot.rating || 3) + '"]');
    if (ratingRadio) ratingRadio.checked = true;

    // 標籤
    document.getElementById('spotTags').value = (spot.tags || []).join(', ');

    // 提交修改
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('spotName').value.trim();
      const city = citySelect.value;
      const category = document.querySelector('input[name="category"]:checked').value;
      const address = document.getElementById('spotAddress').value.trim();
      const description = document.getElementById('spotDescription').value.trim();
      const ratingInput = document.querySelector('input[name="rating"]:checked');
      const rating = ratingInput ? parseInt(ratingInput.value) : 3;
      const tagsRaw = document.getElementById('spotTags').value.trim();
      const tags = tagsRaw ? tagsRaw.split(/[,，]/).map(t => t.trim()).filter(t => t) : [];

      if (!name || !city) {
        showToast('請填寫景點名稱和選擇縣市', true);
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = '儲存中...';

      try {
        await db.collection('spots').doc(spotId).update({
          name,
          city,
          category,
          address,
          description,
          rating,
          tags
        });

        showToast('修改成功！');
        setTimeout(() => {
          window.location.href = 'detail.html?id=' + encodeURIComponent(spotId);
        }, 1000);

      } catch (error) {
        console.error('修改失敗:', error);
        showToast('修改失敗：' + error.message, true);
        submitBtn.disabled = false;
        submitBtn.textContent = '儲存修改';
      }
    });

  } catch (error) {
    console.error('載入失敗:', error);
    loadingState.style.display = 'none';
    showToast('載入失敗：' + error.message, true);
  }
});
