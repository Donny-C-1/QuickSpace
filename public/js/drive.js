initCreateFolder();

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
