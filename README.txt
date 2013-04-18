15237 F12 HW7
Bingying Xia (bxia)
Zi Wang (ziw)

You need to replace several ip addresses with your own ip address so the program can get the socket.
Specifically go to
1) /HW7/server/static/index.html    Line 9, replace '192.168.1.19' with your own ip
2) /HW7/server/static/controller.js Line 5, replace '192.168.1.19' with your own ip
3) /HW7/server/static/PongGame.js   Line 5, replace '192.168.1.19' with your own ip
4) /HW7/server/static/player.html   Line 7, replace '192.168.1.19' with your own ip

Then you need to start two servers 
cd into /HW7/server, and use 'node server.js'
cd into /HW7/socket, and use 'node socketserver.js'


Go to YOURSERVER:8889/static/player.html on controllers to play
Go to YOURSERVER:8889/static/index.html to watch the game


Logins:
ID: luke    PW: theforce
ID: vader   PW: iamyourfather
ID: leia    PW: onlyhope

