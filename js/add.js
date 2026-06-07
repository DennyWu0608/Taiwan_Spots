// ===== 新增景點頁面邏輯 =====

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('addForm');
  const citySelect = document.getElementById('spotCity');
  const submitBtn = document.getElementById('submitBtn');

  // 填入縣市選單
  populateCitySelect(citySelect);

  // 提交表單
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('spotName').value.trim();
    const city = citySelect.value;
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
      // 寫入 Firestore
      await db.collection('spots').add({
        name,
        city,
        address,
        description,
        rating,
        tags,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      showToast('景點新增成功！');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);

    } catch (error) {
      console.error('新增失敗:', error);
      showToast('新增失敗：' + error.message, true);
      submitBtn.disabled = false;
      submitBtn.textContent = '新增景點';
    }
  });
});
