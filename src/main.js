const IAM_BASE = import.meta.env.VITE_IAM_BASE_URL
const REALM = import.meta.env.VITE_IAM_REALM
const CLIENT_ID = import.meta.env.VITE_IAM_CLIENT_ID
const REDIRECT_URI = import.meta.env.VITE_IAM_REDIRECT_URI

const AUTH_URL = `${IAM_BASE}/realms/${REALM}/protocol/openid-connect/auth`
const TOKEN_URL = `${IAM_BASE}/realms/${REALM}/protocol/openid-connect/token`
const ACCOUNT_URL = `${IAM_BASE}/realms/${REALM}/account/`

function randomBase64url(byteLength) {
  const bytes = crypto.getRandomValues(new Uint8Array(byteLength))
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

async function sha256Base64url(plain) {
  const data = new TextEncoder().encode(plain)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

async function login() {
  const codeVerifier = randomBase64url(64)
  const codeChallenge = await sha256Base64url(codeVerifier)
  const state = randomBase64url(16)

  sessionStorage.setItem('pkce_verifier', codeVerifier)
  sessionStorage.setItem('pkce_state', state)

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: 'openid profile email',
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  })

  window.location.href = `${AUTH_URL}?${params}`
}

async function handleCallback() {
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')
  const state = params.get('state')

  if (!code) return

  const storedState = sessionStorage.getItem('pkce_state')
  const codeVerifier = sessionStorage.getItem('pkce_verifier')

  if (state !== storedState) {
    console.error('[auth] state mismatch — possible CSRF')
    return
  }

  sessionStorage.removeItem('pkce_state')
  sessionStorage.removeItem('pkce_verifier')

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      code,
      code_verifier: codeVerifier,
    }),
  })

  if (!res.ok) {
    console.error('[auth] token exchange failed', res.status)
    return
  }

  const tokens = await res.json()
  localStorage.setItem('access_token', tokens.access_token)
  if (tokens.refresh_token) localStorage.setItem('refresh_token', tokens.refresh_token)
  if (tokens.id_token) localStorage.setItem('id_token', tokens.id_token)

  window.history.replaceState({}, '', '/')
}

function renderHeader() {
  const btn = document.getElementById('step-in')
  if (localStorage.getItem('access_token')) {
    btn.textContent = 'Account'
    btn.href = ACCOUNT_URL
    btn.target = '_blank'
    btn.rel = 'noopener noreferrer'
    btn.removeEventListener('click', onLoginClick)
  } else {
    btn.addEventListener('click', onLoginClick)
  }
}

function onLoginClick(e) {
  e.preventDefault()
  login()
}

async function init() {
  await handleCallback()
  renderHeader()
}

init()
