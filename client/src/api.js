import io from 'socket.io-client'

export const BASE_URL = 'https://yikes-api.terranceli.com'

export let socket = null;
export const connectSocket = () => {
  socket = io(BASE_URL)

  socket.on('error', (e) => {
    console.log(e)
  })

  socket.on('disconnect', (reason) => {
    console.log('socket disconnected: ' + reason)
  })
}

export const setUsername = (username) => {
  return fetch(BASE_URL + '/username', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username }),
    credentials: 'include'
  })
}

export const joinRoom = (code) => {
  return fetch(BASE_URL + '/join', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ code }),
    credentials: 'include'
  })
}

export const createRoom = () => {
  return fetch(BASE_URL + '/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })
}

export const startGame = () => {
  return fetch(BASE_URL + '/start', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })
}

export const playCards = (indices) => {
  return fetch(BASE_URL + '/play-card', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ indices }),
    credentials: 'include'
  })
}

export const selectWinner = (id) => {
  return fetch(BASE_URL + '/select-winner', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id }),
    credentials: 'include'
  })
}
