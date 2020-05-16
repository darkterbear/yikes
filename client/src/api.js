import io from 'socket.io-client'

export const BASE_URL = 'http://localhost:3000'

export let socket = null;
export const connectSocket = () => {
  socket = io(BASE_URL)

  socket.on('error', (e) => {
    console.log(e)
  })

  socket.on('disconnect', (e) => {
    console.log('socket disconnected')
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