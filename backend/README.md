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
412: User does not exist (must call /username first)
422: Invalid inputs

### POST `/start`
Called by the lobby leader to start the game

** Response **
204: Success
412: Prereqs not met (user must exst, must be in room)
401: Not leader

### POST `/play-card`

### POST `/select-winner`


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

### round-started
Emitted when a game round has started

** Payload **
```
{
  single: string (representing id of the single),
  turn: Turn
  playedCards: Map<string, Card[]>,
  likesHand: Card[],
  yikesHand: Card[]
}
```

### update-hand
Emitted to a player when they receive a new hand

### game-update
Emitted to a room when game state changes (e.g. a player plays a card)

### round-recap
Emitted to lobby members at the end of a round
