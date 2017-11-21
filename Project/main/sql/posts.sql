SELECT *
FROM (
       select *, distancia(?, ?, Post.latitude, Post.longitude) as dist
       FROM Post
     ) AS Post
WHERE Post.dist < Post.score;