/** Generate a time-of-day greeting, optionally personalised with the child's name. */
export function getGreeting(childName: string): string {
  const hour = new Date().getHours()
  const name = childName.trim()
  const base =
    hour < 12
      ? 'Good morning'
      : hour < 18
        ? 'Hi there'
        : 'Good evening'
  return name ? `${base}, ${name}!` : `${base}!`
}
