# slotbooking

*******************************************
To Run This Project 

    node index.js
*******************************************
Import All required Librarys
*******************************************
Added Curl For Test And Check



*******************************************
For Create Conference

    curl --location 'http://localhost:3000/rooms' \
    --header 'Content-Type: application/json' \
    --data '{"name": "Conference Room A", "capacity": 10}'
*******************************************
For Create User

    curl --location 'http://localhost:3000/users' \
    --header 'Content-Type: application/json' \
    --data-raw '    {
            "name": "John Doe",
            "email": "john@example.com"
                    
        }'
*******************************************
For Create Meet 

        curl --location 'http://localhost:3000/schedule' \
        --header 'Content-Type: application/json' \
        --data '{
        "title": "Team Meeting",
        "date": "2024-06-16",
        "startTime": "11:00",
        "endTime": "12:00",
        "participants": ["666edb627995ca65db4e18a9", "666ea22291270ba7a6924916"],
        "room": "666ec60471d2791604f2bcf6"
        }'
*******************************************
For Check Avliablity

        curl --location 'http://localhost:3000/availability' \
        --header 'Content-Type: application/json' \
        --data '{
            "userId": "666edb627995ca65db4e18a9",
            "date": "2024-06-16",
            "startTime": "11:00",
            "endTime": "12:00"
        }'
*******************************************



