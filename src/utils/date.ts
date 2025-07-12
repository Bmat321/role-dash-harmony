export function formatDateTime(dateString: string, locale = 'en-US') {
  if (!dateString) return '';
  const date = new Date(dateString);

  return date.toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
