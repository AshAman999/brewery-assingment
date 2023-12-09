
# Brewery Backend Documentation

This documentation provides an overview of the backend code for the Brewery application.

## Technologies Used

- Node.js
- Express.js
- MySQL
- JWT (JSON Web Tokens)
- Bcrypt
- Cors

## Installation

To run the backend server, follow these steps:

1. Clone the repository.
2. Install the required dependencies using the command `npm install`.
3. Set up the MySQL database and update the connection details in the code.
4. Start the server using the command `npm start`.

## API Endpoints

### Sign Up

- Endpoint: `/signup`
- Method: `POST`
- Description: Creates a new user account.
- Request Body:
  - `email` (string): User's email address.
  - `password` (string): User's password.
- Response:
  - Success (Status 201):
    - `message` (string): "User created successfully".
  - Error (Status 400/500):
    - `message` (string): Error message.

### Sign In

- Endpoint: `/signin`
- Method: `POST`
- Description: Authenticates a user and returns a JWT token.
- Request Body:
  - `email` (string): User's email address.
  - `password` (string): User's password.
- Response:
  - Success (Status 200):
    - `token` (string): JWT token.
  - Error (Status 401/500):
    - `message` (string): Error message.

### Get Brewery Ratings

- Endpoint: `/brewery/:id`
- Method: `GET`
- Description: Retrieves the average rating, review count, and all ratings for a brewery.
- Request Parameters:
  - `id` (string): Brewery ID.
- Request Headers:
  - `Authorization` (string): JWT token.
- Response:
  - Success (Status 200):
    - `avgRating` (number): Average rating for the brewery.
    - `reviewCount` (number): Total number of reviews for the brewery.
    - `ratings` (array): Array of objects containing rating, comment, and user email for each review.
  - Error (Status 403/500):
    - `message` (string): Error message.

### Post Brewery Rating

- Endpoint: `/rating`
- Method: `POST`
- Description: Posts a new rating and comment for a brewery.
- Request Body:
  - `breweryId` (string): Brewery ID.
  - `rating` (number): Rating value (1-5).
  - `comment` (string): Review comment.
- Request Headers:
  - `Authorization` (string): JWT token.
- Response:
  - Success (Status 201):
    - `message` (string): "Rating posted successfully".
  - Error (Status 400/500):
    - `message` (string): Error message.

### Update Brewery Rating

- Endpoint: `/rating/:breweryId`
- Method: `PUT`
- Description: Updates an existing rating and comment for a brewery.
- Request Parameters:
  - `breweryId` (string): Brewry ID.
- Request Body:
  - `rating` (number): Updated rating value (1-5).
  - `comment` (string): Updated review comment.
- Request Headers:
  - `Authorization` (string): JWT token.
- Response:
  - Success (Status 200):
    - `message` (string): "Rating updated successfully".
  - Error (Status 404/500):
    - `message` (string): Error message.

# React Frontend

The frontend code for the Brewery application is developed separately and integrated with this backend. Documentation for the frontend will be provided in a separate file.

### Login/Signup Page

- Route: `/login`
- Route: `/signup`

This page should provide options for users to log in or sign up for a new account.

### Search Page

- Route: `/`

This page should allow users to search for breweries by city, name, or type. The search results should display the following details per brewery:
- Brewery name
- Brewery address
- Phone number
- Website URL
- Current rating (based on point 4)
- State and city

### Brewery Page

- Route: `/brewery/:id`

This page should display all the information about a specific brewery, including existing reviews pulled from the hosted database. Users should also have the ability to add a review for the brewery. The review should include a rating from 1-5 and a description.
