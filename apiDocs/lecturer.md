## Lecturer API Endpoints
* GET /api/lecturers
* POST /api/lecturers
* GET /api/lecturers/:id
* PUT /api/lecturers/:id
* DELETE /api/lecturers/:id


## GET api/lecturers
### Request
##### Query param /?byCollegeId=collegeId will send all lecturers by that college
```sh
curl --location --request GET 'http://localhost:3400/api/lecturers'
```

### Response

#### Success:
```json
[
    {
        "_id": "5eb5b831e0b82e02086a4815",
        "name": "Jay Broke",
        "customLecturerId": "JB5535TR",
        "college": {
            "_id": "5eb5b831e0b82e02086a4814",
            "name": "BIl Clg",
            "createdAt": "2020-05-08T19:51:13.789Z",
            "updatedAt": "2020-05-08T19:51:13.789Z",
            "__v": 0
        }
    }
]
```

## POST api/lecturers
### Request
```sh
curl --location --request POST 'http://localhost:3400/api/lecturers' \
--header 'Content-Type: application/json' \
--data-raw '{
	"name": "Jhon Smith",
	"customLecturerId": "TRW5535TR",
	"collegeId": "5eb5b831e0b82e02086a4814"
}'
```

### Response

#### Success:
```json
{
    "_id": "5eb64d6beee87125c27a315d",
    "name": "Jhon Smith",
    "customLecturerId": "TRW5535TR",
    "college": "5eb5b831e0b82e02086a4814",
    "createdAt": "2020-05-09T06:27:55.808Z",
    "updatedAt": "2020-05-09T06:27:55.809Z",
    "__v": 0
}
```

## GET api/lecturers/:id
### Request
```sh
curl --location --request GET 'http://localhost:3400/api/lecturers/5eb5b831e0b82e02086a4815'
```

### Response

#### Success:
```json
{
    "_id": "5eb5b831e0b82e02086a4815",
    "name": "Jay Broke",
    "customLecturerId": "JB5535TR",
    "college": "5eb5b831e0b82e02086a4814",
    "createdAt": "2020-05-08T19:51:13.804Z",
    "updatedAt": "2020-05-08T19:51:13.804Z",
    "__v": 0
}
```

## PUT api/lecturers/:id
### Request
```sh
curl --location --request PUT 'http://localhost:3400/api/lecturers/5eb5b831e0b82e02086a4815' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Jay B.",
    "customLecturerId": "JB2018DK",
    "college": "5eb5b831e0b82e02086a4814"
}'
```

### Response

#### Success:
```json
{
    "_id": "5eb5b831e0b82e02086a4815",
    "name": "Jay B.",
    "customLecturerId": "JB2018DK",
    "college": "5eb5b831e0b82e02086a4814",
    "createdAt": "2020-05-08T19:51:13.804Z",
    "updatedAt": "2020-05-08T19:51:13.804Z",
    "__v": 0
}
```

## DELETE api/lecturers/:id
### Request
```sh
curl --location --request DELETE 'http://localhost:3400/api/lecturers/5eb64d6beee87125c27a315d'
```

### Response

#### Success:
```json
{
    "_id": "5eb64d6beee87125c27a315d",
    "name": "Jhon Smith",
    "customLecturerId": "TRW5535TR",
    "college": "5eb5b831e0b82e02086a4814",
    "createdAt": "2020-05-09T06:27:55.808Z",
    "updatedAt": "2020-05-09T06:27:55.809Z",
    "__v": 0
}
```
