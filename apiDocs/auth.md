## Student API Endpoints
* GET /api/auth


## GET api/auth
### Request
```sh
curl --location --request POST 'http://localhost:3400/api/auth' \
--header 'Content-Type: application/json' \
--data-raw '{
	"email": "rez1sd2@em.com",
	"password": "asd123asd"
}'
```

### Response

#### Success:
##### jwt token send directly to the response body with status code 200. 
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWJkODA0MDJhYzk1YTNlNGQ2ODQ2NDQiLCJuYW1lIjoiUlIgZmdmZyIsImVtYWlsIjoicmV6c2RxZGZ3QGVtLmNvbSIsImNvbGxlZ2VJZCI6IjVlYmQ4MDQwMmFjOTVhM2U0ZDY4NDY0MiIsImlhdCI6MTU4OTQ3NzQ1NSwiZXhwIjoxNjIxMDEzNDU1fQ.UPe0TnaQiA6k1Ujl4atZQ9s4vGszPpRkYNNnHZrUqJ4
```

#### Fail:
##### Error message sent directly to the response body with status code 400. 
```
Invalid email or password.
```
