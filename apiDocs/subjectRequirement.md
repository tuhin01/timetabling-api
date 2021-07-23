## Student API Endpoints
* GET /api/subjectRequirements
* POST /api/subjectRequirements
* GET /api/subjectRequirements/:id
* PUT /api/subjectRequirements/:id
* DELETE /api/subjectRequirements/:id


## GET api/subjectRequirements
### Request
##### Query param /?byDepartmentId=departmentId will send all facility by that college
```sh
curl --location --request GET 'http://localhost:3400/api/subjectRequirements/?byDepartmentId=5eb7d3349e1d790636b222c4' \
--header 'X-Auth-Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWJhMzljYWY0MzQ0OGM3Y2RmMTc0ZTQiLCJuYW1lIjoiUlIgZmdmZyIsImVtYWlsIjoicmV6c2RxZGZ3QGVtLmNvbSIsImNvbGxlZ2VJZCI6IjVlYmEzOWNhZjQzNDQ4YzdjZGYxNzRlMiIsImlhdCI6MTU4OTI2Mjc5NCwiZXhwIjoxNjIwNzk4Nzk0fQ.W5W2Zo5SmQXCFh3XHtlD5LfHhPOsKbXUBQ7BGQ59H54'
```

### Response

#### Success:
```json
[
    {
        "_id": "5eb7d3349e1d790636b222c6",
        "title": "Department Electives",
        "department": "5eb7d3349e1d790636b222c4",
        "createdAt": "2020-05-10T10:11:00.249Z",
        "updatedAt": "2020-05-10T10:11:00.249Z",
        "__v": 0
    }
]
```

## POST api/subjectRequirements
### Request
```sh
curl --location --request POST 'http://localhost:3400/api/subjectRequirements' \
--header 'X-Auth-Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWI3YzlhNzc4YjVlYzAxMzZjODczZWMiLCJuYW1lIjoiUlIgZmdmZyIsImVtYWlsIjoicmV6QGVtLmNvbSIsImNvbGxlZ2VJZCI6IjVlYjdjOWE3NzhiNWVjMDEzNmM4NzNlYiIsImlhdCI6MTU4OTEwMzAxNSwiZXhwIjoxNjIwNjM5MDE1fQ.AdrTiLc37n4gvvjG7xTChkIXbWwvMI-FmP-7nieV8Ys' \
--header 'Content-Type: application/json' \
--data-raw '{
	"title": "Test Sb Rq",
	"departmentId": "5eb7d3349e1d790636b222c4"
}'
```

### Response

#### Success:
```json
{
    "_id": "5ebd852b89bb14d276b6ee09",
    "title": "Test Sb Rq",
    "department": "5eb7d3349e1d790636b222c4",
    "createdAt": "2020-05-14T17:51:39.944Z",
    "updatedAt": "2020-05-14T17:51:39.944Z",
    "__v": 0
}
```

## GET api/subjectRequirements/:id
### Request
```sh
curl --location --request GET 'http://localhost:3400/api/subjectRequirements/5eb7de41f3ef0f43f78803ce' \
--header 'X-Auth-Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWI3YzlhNzc4YjVlYzAxMzZjODczZWMiLCJuYW1lIjoiUlIgZmdmZyIsImVtYWlsIjoicmV6QGVtLmNvbSIsImNvbGxlZ2VJZCI6IjVlYjdjOWE3NzhiNWVjMDEzNmM4NzNlYiIsImlhdCI6MTU4OTEwMzAxNSwiZXhwIjoxNjIwNjM5MDE1fQ.AdrTiLc37n4gvvjG7xTChkIXbWwvMI-FmP-7nieV8Ys'
```

### Response

#### Success:
```json
{
    "_id": "5eb7d3349e1d790636b222c6",
    "title": "Department Electives",
    "department": "5eb7d3349e1d790636b222c4",
    "createdAt": "2020-05-10T10:11:00.249Z",
    "updatedAt": "2020-05-10T10:11:00.249Z",
    "__v": 0
}
```

## PUT api/subjectRequirements/:id
### Request
```sh
curl --location --request PUT 'http://localhost:3400/api/subjectRequirements/5eb7de41f3ef0f43f78803ce' \
--header 'X-Auth-Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWI3YzlhNzc4YjVlYzAxMzZjODczZWMiLCJuYW1lIjoiUlIgZmdmZyIsImVtYWlsIjoicmV6QGVtLmNvbSIsImNvbGxlZ2VJZCI6IjVlYjdjOWE3NzhiNWVjMDEzNmM4NzNlYiIsImlhdCI6MTU4OTEwMzAxNSwiZXhwIjoxNjIwNjM5MDE1fQ.AdrTiLc37n4gvvjG7xTChkIXbWwvMI-FmP-7nieV8Ys' \
--header 'Content-Type: application/json' \
--data-raw '{
	"title": "Test Sb",
	"departmentId": "5eb7d3349e1d790636b222c4"
}'
```

### Response

#### Success:
```json
{
    "_id": "5eb7d3349e1d790636b222c6",
    "title": "Test Sb",
    "department": "5eb7d3349e1d790636b222c4",
    "createdAt": "2020-05-10T10:11:00.249Z",
    "updatedAt": "2020-05-10T10:11:00.249Z",
    "__v": 0
}
```

## DELETE api/subjectRequirements/:id
### Request
```sh
curl --location --request DELETE 'http://localhost:3400/api/subjectRequirements/5eb7de41f3ef0f43f78803ce' \
--header 'X-Auth-Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWI3YzlhNzc4YjVlYzAxMzZjODczZWMiLCJuYW1lIjoiUlIgZmdmZyIsImVtYWlsIjoicmV6QGVtLmNvbSIsImNvbGxlZ2VJZCI6IjVlYjdjOWE3NzhiNWVjMDEzNmM4NzNlYiIsImlhdCI6MTU4OTEwMzAxNSwiZXhwIjoxNjIwNjM5MDE1fQ.AdrTiLc37n4gvvjG7xTChkIXbWwvMI-FmP-7nieV8Ys'
```

### Response

#### Success:
```json
{
    "_id": "5eb7d3349e1d790636b222c6",
    "title": "Test Sb",
    "department": "5eb7d3349e1d790636b222c4",
    "createdAt": "2020-05-10T10:11:00.249Z",
    "updatedAt": "2020-05-10T10:11:00.249Z",
    "__v": 0
}
```
