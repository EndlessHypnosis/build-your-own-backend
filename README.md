# Build Your Own Backend `Brewery`

### by Jason Lucas & Nick Svetnicka for Turing

![ScreenShot of App](https://media.giphy.com/media/26Fffp4Lt7Y1YxEdy/giphy-downsized-large.gif?raw=true "ScreenShot of App")

## Introduction

> This application constructs an entire backend database and api using Brewery data from the Brewery DB API. This data is imported into a local .json file which is then used to seed the local database. The application also supports jwt Tokens, in which the client must request a token with a valid email address before they are allowed to make any modifications to the database.

## Built With

```
* HTML
* CSS
* JavaScript
* Knex
* Express
* PostgreSQL
* JWT Tokens
* Chai/Mocha
```


## API Documentation

### `Authentication`

> This API requires a JWT Token in order to modify any of the data in the BYOB database. A token must be requested through the following endpoint:

`/api/v1/authenticate`

> The request body for the token must must include the properties **appName** and **email**

> Example body for Token **request:**
```
{
    "appName": "byob",
    "email": "someone@turing.io"
}
```

> Example body for Token **response:**
```
{
    "token": "eyJhbGciOiJIUzI1NiIsIeR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5pY2tAdHVyaW5nLmlvcCIsImFwcE5hbWUiOiJieW9iIiwiYWRtaW4iOmZIbHNlLCJpYXQiOjE1MDgwNDQ0MzMsImV4cCP6MTUwODIxNzIzM30.813d0w87z2x4EZUNdEbUcamDysHxM0bI31cm239algI",
    "adminVerification": true
}
```

> This token must be included when making requests against the following endpoints:
```
    POST
    DELETE
    PUT
    PATCH
```
> The token may be included in any of the following 3 methods:

- **Request Body:** Include the token in a property called 'token' in the body of the request.

- **Authorization Header:** Add an 'Authorization' header to the request with the token as the value.

- **Query Parameter:** Include an '?token=' query parameter to the request path with the token as value.

### `Authorization`

> The JWT Token issued to the client is 'stamped' with either admin access (ability to call API endpoints in BYOB database which modifies data), or grants access to only GET request endpoints with read-only access.

> This validation is based on detection of an email address with '@turing.io'

### `Resources`

> **NOTES**

- The response format for all API requests is JSON format.
- Errors will be returned also as JSON objects with an 'error' property.
- The value of 'error' is the error message as a string.

#### _HTTP Response Codes_
Each response will be returned with one of the following HTTP status codes:

**See documentation of individual endpoints for possible status code return values**

* `200` `OK` The request was successful
* `400` `Bad Request` There was a problem with the request (security, malformed, data validation, etc.)
* `401` `Unauthorized` The supplied API credentials are invalid
* `403` `Forbidden` The credentials provided do not have permission to access the requested resource
* `404` `Not found` An attempt was made to access a resource that does not exist in the API
* `405` `Method not allowed` The resource being accessed doesn't support the method specified (GET, POST, etc.).
* `500` `Server Error` An error on the server occurred

#### _Endpoints_

### Authentication _for_ `JWT Token`

- **[<code>POST</code> /api/v1/authenticate](documentation/POST_authenticate.md)**

### Beers

- **[<code>GET</code> /api/v1/beers`?abv=NUM`](documentation/GET_beers.md)**
- **[<code>GET</code> /api/v1/beers/:id](documentation/GET_beers_id.md)**
- **[<code>GET</code> /api/v1/breweries/:id/beers](documentation/GET_brewery_beers.md)**
- **[<code>POST</code> /api/v1/beers](documentation/POST_beer.md)**
- **[<code>PATCH</code> /api/v1/beers/:id](documentation/PATCH_beer.md)**
- **[<code>DELETE</code> /api/v1/beers/:id](documentation/DELETE_beer.md)**

### Breweries

- **[<code>GET</code> /api/v1/breweries](documentation/GET_breweries.md)**
- **[<code>GET</code> /api/v1/breweries/:id](documentation/GET_breweries_id.md)**
- **[<code>POST</code> /api/v1/breweries](documentation/POST_brewery.md)**
- **[<code>PUT</code> /api/v1/breweries/:id](documentation/PUT_brewery.md)**
- **[<code>DELETE</code> /api/v1/breweries/:id](documentation/DELETE_brewery.md)**
