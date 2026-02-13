export const normalizeUrl = (url) => {
  if (!url) return null;

  url = url.trim();

  if (url === "") return null;

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`;
  }

  return url;
};