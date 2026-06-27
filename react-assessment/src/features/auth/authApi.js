/**
 * Fetches an access token from Keycloak using the Resource Owner Password grant.
 * Returns { access_token, refresh_token } on success.
 */
export async function fetchToken(username, password) {
  const tokenUrl = import.meta.env.VITE_KEYCLOAK_TOKEN_URL
  const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID
  const clientSecret = import.meta.env.VITE_KEYCLOAK_CLIENT_SECRET

  const params = new URLSearchParams()
  params.append('grant_type', 'password')
  params.append('client_id', clientId)
  params.append('client_secret', clientSecret)
  params.append('username', username)
  params.append('password', password)

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  })

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}))
    throw new Error(errData.error_description || 'Invalid credentials or server error.')
  }

  return response.json()
}

/**
 * Refreshes the access token using a refresh_token grant.
 */
export async function refreshTokenRequest(refreshToken) {
  const tokenUrl = import.meta.env.VITE_KEYCLOAK_TOKEN_URL
  const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID
  const clientSecret = import.meta.env.VITE_KEYCLOAK_CLIENT_SECRET

  const params = new URLSearchParams()
  params.append('grant_type', 'refresh_token')
  params.append('client_id', clientId)
  params.append('client_secret', clientSecret)
  params.append('refresh_token', refreshToken)

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  })

  if (!response.ok) {
    throw new Error('Failed to refresh token')
  }

  return response.json()
}
