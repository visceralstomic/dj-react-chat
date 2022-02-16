

export const blankUser = {
    id: 1,
    username: 'testuser',
    photo: null
}

export const rooms = [
	{id: 25, name: "room 1", creator: {id: 1, username: "testuser"}},
	{id: 26, name: "room 2", creator: {id: 2, username: "testuser2"}}
]

export const partic = [
    {id: 15, user: {id: 1, username: 'testuser'}, room: 25},
    {id: 16, user: {id: 2, username: 'testuser2'}, room: 25},
]

export const new_room = {id: 27, name: "new room",  creator: {id: 1, username: "testuser"}};