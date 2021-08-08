Youtube-mini
============

# structure

### rootRouter
* / -> home (listing of trending video)
* /join -> join (user sign up)
* /login -> login (user sign in)
* /search -> search (search videos)

### userRouter
* /users/:id -> show the user *(not yet)*
* /users/logout -> user logout
* /users/edit -> edit user's profile *(need to handle some errors)*
* /users/github/start -> go to github Oauth
* /users/github/callback -> get code from github

### videoRouter
* /videos/:id -> watch the video
* /videos/:id/edit -> edit the video
* /videos/:id/delete -> delete the video
* /videos/upload -> upload video

