This is a simple registration and JWT-authorization server. During registration, it gets username and password, hashes the password, creates a new user, adds it to the array of users, overwrites the json file and responds with a message. Authorization process works far more interesting: 
1) it checks if the username and password are valid;
2) creates ACCESS_TOKEN and REFRESH_TOKEN; REFRESH_TOKEN gets stored with current user in data base and is also sent to a client as cookie; ACCESS_TOKEN is sent as a response so the user could copy and use it;
3) if the authenticated user is Admin, he can get access to nuclear codes by sending GET request to '../nuke' with his ACCESS_TOKEN in AUTH Bearer Token. But the access is limited for only 30 sec, and after expiring the client should get a new ACCESS_TOKEN by sending a blank GET request to '../refresh'. This is where the REFRESH_TOKEN in cookies joins the game. User doesn't need to
copy and paste, it works automatically;
4) after getting useful information, the user can logout by sending blank GET request to '../logout'. In that case, the server deletes REFRESH_TOKEN from current user in data base and from cookies.

In this project I used popular 'bcrypt' framework for hashing passwords, 'dotenv' for working with environment variables, and 'jsonwebtoken' for tokens.
