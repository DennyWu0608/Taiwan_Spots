// ===== 新增景點頁面邏輯 =====

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('addForm');
  const citySelect = document.getElementById('spotCity');
  const submitBtn = document.getElementById('submitBtn');

  // 填入縣市選單
  populateCitySelect(citySelect);

  // 如果 URL 有帶城市參數，自動選取
  const params = new URLSearchParams(window.location.search);
  const presetCity = params.get('city');
  if (presetCity) {
    citySelect.value = presetCity;
  }

  // 提交表單
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

    // 停用按鈕
    submitBtn.disabled = true;
    submitBtn.textContent = '新增中...';

    try {
      await db.collection('spots').add({
        name,
        city,
        category,
        address,
        description,
        rating,
        tags,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      showToast('景點新增成功！');
      setTimeout(() => {
        // 導回該城市頁面
        window.location.href = 'city.html?city=' + encodeURIComponent(city);
      }, 1000);

    } catch (error) {
      console.error('新增失敗:', error);
      showToast('新增失敗：' + error.message, true);
      submitBtn.disabled = false;
      submitBtn.textContent = '新增景點';
    }
  });
});
