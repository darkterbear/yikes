# yikes backend documentation
The yikes API is comprised of a RESTful service and a Socket.io service. 

## REST API

### POST `/username`
Creates the player and sets the user's username.

** Request **
```
body: { username: string }
```

** Response **
```
body: Player
```

200: Success
422: Invalid inputs

### POST `/create`
Creates a new room, and places this user as a leader in this room.

** Response **
```
{ code: string }
```
200: Success
412: User does not exist (must call /username first)

### POST `/join`
Joins the user into the specified room

** Request **
```
body: { code: string }
```

** Response **
```
{
  code: string,
  players: Player[],
  leader: Player
}
```

200: Success
401: Incorrect room code (or, room is already in game)
403: Full room (8 people)
409: User already in room
412: User does not exist (must call /username first)
422: Invalid inputs

### POST `/start`
Called by the lobby leader to start the game

** Response **
204: Success
400: Less than 3 people in the lobby
401: Not leader
412: Prereqs not met (user must exist, must be in room)

### POST `/play-card`
Called by the player specified by room.turn to play a like or a yike.

** Request **
body
```
{
  indices: number[] (indices of the cards to play in the likes/yikes hand)
}
```

** Response **
204: Success
400: Incorrect number of cards
401: Not in game
403: Not your turn (or not correct type of turn; single selecting winner must use /select-winner)
404: Card index not in bounds
412: Prereqs not met (user must exist, must be in room)

### POST `/select-winner`
Called by the single to choose a winning date.

** Request **
body
```
{
  id: string (id of the player that wins)
}
```

** Response **
204: Success
401: Not in game
403: Not your turn (or you're not the single)
404: Player not found
412: Prereqs not met (user must exist, must be in room)

## SOCKET.IO API

### new-player
Emitted to lobby members when a new player joins the lobby

** Payload **
```
{
  id: string,
  username: string
}
```

### player-left
Emitted to lobby members when a player leaves; also includes new leader information if the leader leaves

### start-game
Emitted when a lobby goes in-game

** Payload **
```
{
  singleId: string (representing id of the single),
  turn: Turn
  playedCards: { [key: string id]: Card[] },
  likesHand: Card[],
  yikesHand: Card[]
}
```

### update-hand
Emitted to a player when they receive a new hand

** Payload **
```
{
  likesHand: Card[],
  yikesHand: Card[]
}
```

### game-update
Emitted to a room when game state changes (e.g. a player plays a card)

** Payload **
```
{
  singleId: string,
  turn: Turn,
  playedCards: { [key: string id]: Card[] ,
  scores: [{
    id: string,
    score: number
  }]
}
```
