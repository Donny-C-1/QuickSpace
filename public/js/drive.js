initCreateFolder();
setupUploadFeature();
tabSetup();

function initCreateFolder() {
  const showDialog = document.querySelector("[data-action='show_dialog']");
  const dialog = document.querySelector("[data-id='dialog']");
  const closeDialog = document.querySelector("[data-action='close_dialog']");
  const textField = document.querySelector("[data-id='create_folder_input']");

  showDialog.onclick = (e) => dialog.showModal();
  closeDialog.onclick = (e) => {
    dialog.close();
    textField.value = null;
  };
}

function setupUploadFeature() {
  const fileUpload = document.querySelector("[data-id='file_upload']");
  const form = document.querySelector("[data-id='upload_form']");

  fileUpload.addEventListener("change", (_) => form.submit());
}

function tabSetup() {
  const tabButtons = document.querySelectorAll("[data-action='tab']");
  const slider = document.querySelector("[data-id='tab_cont']");

  for (let btn of tabButtons) {
    btn.addEventListener("click", function (e) {
      tabButtons.forEach((v) => v.classList.remove("active"));
      this.classList.add("active");
      slider.style.setProperty("--_left", this.offsetLeft + "px");
      slider.style.setProperty("--_width", this.offsetWidth + 20 + "px");
      console.log(this.offsetLeft);
    });
  }
}
