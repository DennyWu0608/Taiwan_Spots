// ===== 台灣地圖互動 =====

document.addEventListener('DOMContentLoaded', () => {
  // 點擊縣市 → 進入城市頁面
  document.querySelectorAll('.city-group').forEach(group => {
    group.addEventListener('click', () => {
      const city = group.getAttribute('data-city');
      window.location.href = 'city.html?city=' + encodeURIComponent(city);
    });
  });
});
