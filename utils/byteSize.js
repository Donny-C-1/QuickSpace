export function sizeString(numberOfBytes) {
  if (typeof numberOfBytes !== "number") return "NAN";
  const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const exponent = Math.min(
    Math.floor(Math.log(numberOfBytes) / Math.log(1024)),
    units.length - 1
  );
  const approx = numberOfBytes / 1024 ** exponent;
  return `${approx.toFixed(2)} ${units[exponent]}`;
}

export function getSize(size) {
  if (typeof size !== "number") return "NAN";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  if (size < 1024 * 1024 * 1024)
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}
