BASE_URL:    `http://localhost:5000`

# Blogs

## All Blogs

 route -> private

 GET, POST: `/blog`

## Single Blog

route -> private

GET :  `/blog/:id`

## Update Blog

route -> private

PUT :  `/blog/:id`

## Delete Blog

route -> private

DELETE :  `/blog/:id`

## Like blog

route -> private

POST :  `/blog/like/:id`

## Dislike Blog

route -> private

POST :  `/blog/dislike/:id`

## Comment o blog

route -> private

POST :  `/blog/comment`

## Delete comment

route -> private

DELETE :  `/blog/comment/:id`

# Users

## Registration

route -> public

POST :  `/user/register`

## Login

route -> public

POST :  `/user/login`

## Follow

route -> private

POST : `/user/follow/:id`

**Note:**
*All private routes requires Token*