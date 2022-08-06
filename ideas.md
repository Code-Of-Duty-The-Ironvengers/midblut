 - Calendar to remember everyones birthday
 - Todo List Task Manager Kind of Thing Vincent Doesnt Know What Do You Say Bullet Note Taking
 - Cookbook :shrug:
 - Medicine Reminder, Maybe. Elvan needs something like this
 - Playlist generator
 - Library / Good Reads but before you good reads, just getting the possible good reads!!!!!


Models
User
_id: ObjectId
username: String|Unique|Required
email: String|Unique|Required
password: String
books: [ObjectId]
<!-- Forgot password? -->

Book
_id: ObjectId
title: String|Required
author: [String|Required]|Required
publisher: String
nsfw: Boolean->false
genre: [ObjectId]
description: String

Genre
_id: ObjectId
title: String|Required|Unique



<!-- Look into searching book taken the most, currently -->
GET / Home Page -> Browse for Books? Login? Register? Maybe show most wanted books
GET /auth/login -> Login and click to go to register if not registered yet
POST /auth/login
GET /auth/register -> Register and click to login if user is already registered
POST /auth/register /user/userId
GET /user/:userId

GET /search -> List of books that are being searched

GET /book/:bookId -> Single Book Information | If it has genres, show books in the genre | if it has author show books from author
GET /book/add -> Add a new book to the collection
POST /book/add

GET /book/:bookId/request

GET /settings
GET /settings/update-user
POST /settings/update-user
GET /settings/update-password
POST /settings/update-password

<!-- IF WE HAVE TIME -->
GET /:username/:bookId -> Rating information
POST /:username/create-rating
GET /most-rated

Might have admin access. For us to figure out if we do have time
Might add dates (when do you have to return it, how long you keep it, etc)