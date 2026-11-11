const YOUTUBE_REGEX = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

export function getYoutubeEmbedUrl(playLinks: { label: string; url: string }[]): string | null {
  const youtubeLink = playLinks.find((l) => YOUTUBE_REGEX.test(l.url));
  if (!youtubeLink) return null;
  const id = youtubeLink.url.match(YOUTUBE_REGEX)?.[1];
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

export function isYoutubeUrl(url: string): boolean {
  return YOUTUBE_REGEX.test(url);
}
