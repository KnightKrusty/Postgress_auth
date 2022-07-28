# Start Postgres Container

create a db with name auth before running the app

`sudo docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -d -p 5432:5432 postgres`

# Install dependencies

`npm install`
`node version: 18`

# API URL's

## SignUP

`localhost:3000/api/users/signup`

JSON Data

```
{
    "email": "somefakeemail@gmail.com",
    "firstName": "Vaibhav",
    "lastName": "Gupta",
    "password": "thereisweare1A@",
    "mobile": "+919019203129",
    "role": trainers
}
```

## Login

`localhost:3000/api/users/login`

JSON Data

```
{
    "email": "somefakeemail@gmail.com",
    "password": "fakepassword1@2",
    "role": "member"
}
```

## User own Info

`localhost:3000/api/users/me`

Add bearer header with JWT token

## Get All user

`localhost:3000/api/users/alluser?role=member`

Pass and the desired filter as a query string
