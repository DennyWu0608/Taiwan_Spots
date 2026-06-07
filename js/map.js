// ===== 台灣地圖互動 =====

document.addEventListener('DOMContentLoaded', () => {
  const tooltip = document.createElement('div');
  tooltip.className = 'map-tooltip';
  tooltip.style.display = 'none';
  document.body.appendChild(tooltip);

  document.querySelectorAll('.county').forEach(group => {
    const city = group.getAttribute('data-city');

    // 點擊 → 進入城市頁面
    group.addEventListener('click', () => {
      window.location.href = 'city.html?city=' + encodeURIComponent(city);
    });

    // Hover 顯示完整名稱
    group.addEventListener('mouseenter', (e) => {
      tooltip.textContent = city;
      tooltip.style.display = 'block';
    });

    group.addEventListener('mousemove', (e) => {
      tooltip.style.left = (e.clientX + 12) + 'px';
      tooltip.style.top = (e.clientY - 30) + 'px';
    });

    group.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none';
    });
  });
});
