# Who's That Pokemon Backend API

A REST API built for the Aegon technical assessment.

## Modules used
This project uses the following modules:

- **Development:**
    - Uses Koa as its framework for NodeJS, to handle all routing. I decided to use Koa over express for a few reasons, mainly because of its lightweight and modern approach with better control over middleware
    - Stores responses from PokeApi in Redis Cache for optimised performance
- **Testing:** 
    - All tests are written in jest, with the integration and component tests making use of supertest to provide full coverage of each endpoint
    - Code styling: ESLint/Prettier
  
## Starting the API
To use the api you will firstly need to have docker installed and run the following command:
```
docker compose up
```
This will start the application on port 3123. You will then be able to call certain routes via Postman or cURL.

Examples:

#### GET
Below is how to call the endpoint to get a random pokemon and 3 decoy answers:

```
curl --location 'http://localhost:3123/api/v0/pokemon'
```
#### PUT
Below is how to call the endpoint to verify a users guess:

```
curl --location --request PUT 'http://localhost:3123/api/v0/pokemon/39?pokemonName=jigglypuff'
```

## Testing
Similar to above, a prerequisite for testing is to have Docker installed, and for the component and integration testing, you will need to run the following commands:
```
docker compose -f docker-compose.test.yml up
npm run allTests
```
This will start a test instance of redis and then run the unit, integration and component tests.

## Documentation
Endpoint documentation can be found [here](./docs/api.yaml). When you are running the application, you will be able to see this in Swagger UI on http://localhost:3123/docs 

## CI/CD 
Github Actions workflow for assurance testing has been added and successfully runs. Improvements / additions to this are listed below.

## Approach
The API has 2 endpoints, one to fetch a random pokemon and 3 decoy answers, along with the correct pokemons ID and image URL, and the other for verifying a user's guess. Both of these endpoints will check against the cache to see if it exists, and if so it will use that, otherwise it will use axios to query PokeApi, before storing the data in the cache for future use. 

It has validation using Joi on the routes, and has sufficient error handling in each of the handlers/usecases.

## Scalability / Logging
To do this at scale, I would want to host this as a container either in EKS or ECS within AWS, ensuring that it could be load balanced and either have an assigned auto scaling group or a task definition that could handle demand. Logging is handled by Winston and can be used to determine how to handle it per environment, this could be used with Cloudwatch to view/debug any issues
in production.

## Potential Improvements 
  
- **CI/CD** - I would like to add in further workflows to check for any security vulnerabilities and for building and deploying this to ECR.
  
- **Authentication/Session Storage** - An improvement would be to add the ability to authenticate via a JWT or Cognito meaning that you would receive all the information on a logged in user. This would mean exposing two endpoints (or a new service) to handle Register/Login functionality. This would mean that a user could store their session within Redis, as currently it is being stored in the browser.

- **Analytics** - Track user interactions and game metrics (e.g., average score, time spent) using Google Analytics or a similar tool.

  
  