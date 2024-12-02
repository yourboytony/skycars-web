export function formatDistance(distance: number): string {
  return `${distance.toFixed(1)} nm`
}

export function formatDuration(duration: number): string {
  const hours = Math.floor(duration / 3600)
  const minutes = Math.floor((duration % 3600) / 60)
  return `${hours}h ${minutes}m`
}

export function formatHeading(heading: number): string {
  return `${Math.round(heading)}°`
} 