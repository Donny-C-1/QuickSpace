navMenu();

function navMenu() {
  const toggleBtn = document.querySelector("[data-action='toggle_nav']");
  const navMenu = document.querySelector("[data-id='dropdown_nav']");

  toggleBtn.onclick = function () {
    navMenu.classList.toggle("open");
  };
}
