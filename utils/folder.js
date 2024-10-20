import folderModel from "../models/folder_schema.js";

export async function getFolderDirectory(id, rootID) {
  const directories = [];

  let currentID = id;
  while (currentID !== rootID) {
    let currentFolder = await folderModel.findById(currentID);
    directories.unshift([currentFolder.name, currentFolder.id]);
    currentID = currentFolder.location.toString();
  }

  return directories;
}
