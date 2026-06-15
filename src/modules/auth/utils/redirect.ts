const authPaths = ['/auth', '/login', '/signup']

export function resolveAuthRedirect(redirectTo: string): string {
  if (!redirectTo.startsWith('/') || redirectTo.startsWith('//')) {
    return '/'
  }

  if (authPaths.some((path) => redirectTo === path || redirectTo.startsWith(`${path}?`))) {
    return '/'
  }

  return redirectTo
}
