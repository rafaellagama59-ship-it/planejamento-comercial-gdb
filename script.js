const menuItems = document.querySelectorAll('.menu-item');
const pages = document.querySelectorAll('.page');
const title = document.getElementById('page-title');
const subtitle = document.getElementById('page-subtitle');

menuItems.forEach((item) => {
  item.addEventListener('click', () => {
    const pageId = item.dataset.page;
    menuItems.forEach((button) => button.classList.remove('active'));
    pages.forEach((page) => page.classList.remove('active-page'));
    item.classList.add('active');
    const page = document.getElementById(pageId);
    page.classList.add('active-page');
    title.textContent = page.dataset.title || item.textContent.trim();
    subtitle.textContent = page.dataset.subtitle || '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
