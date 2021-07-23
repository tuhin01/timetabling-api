## Student API Endpoints
* GET /api/students
* POST /api/students
* GET /api/students/:id
* PUT /api/students/:id
* DELETE /api/students/:id


## GET api/students
##### Query param /?byCollegeId=collegeId will send all students by that college
### Request
```sh
curl --location --request GET 'http://localhost:3400/api/students'
```

### Response

#### Success:
```json
[
    {
        "_id": "5eb5b831e0b82e02086a4815",
        "name": "Jay Broke",
        "customStudentId": "JB5535TR",
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

## POST api/students
### Request
```sh
curl --location --request POST 'http://localhost:3400/api/students' \
--header 'Content-Type: application/json' \
--data-raw '{
	"name": "Jhon Smith",
	"customStudentId": "TRW5535TR",
	"collegeId": "5eb5b831e0b82e02086a4814"
}'
```

### Response

#### Success:
```json
{
    "_id": "5eb64d6beee87125c27a315d",
    "name": "Jhon Smith",
    "customStudentId": "TRW5535TR",
    "college": "5eb5b831e0b82e02086a4814",
    "createdAt": "2020-05-09T06:27:55.808Z",
    "updatedAt": "2020-05-09T06:27:55.809Z",
    "__v": 0
}
```

## GET api/students/:id
### Request
```sh
curl --location --request GET 'http://localhost:3400/api/students/5eb5b831e0b82e02086a4815'
```

### Response

#### Success:
```json
{
    "_id": "5eb5b831e0b82e02086a4815",
    "name": "Jay Broke",
    "customStudentId": "JB5535TR",
    "college": "5eb5b831e0b82e02086a4814",
    "createdAt": "2020-05-08T19:51:13.804Z",
    "updatedAt": "2020-05-08T19:51:13.804Z",
    "__v": 0
}
```

## PUT api/students/:id
### Request
```sh
curl --location --request PUT 'http://localhost:3400/api/students/5eb5b831e0b82e02086a4815' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Jay B.",
    "customStudentId": "JB2018DK",
    "college": "5eb5b831e0b82e02086a4814"
}'
```

### Response

#### Success:
```json
{
    "_id": "5eb5b831e0b82e02086a4815",
    "name": "Jay B.",
    "customStudentId": "JB2018DK",
    "college": "5eb5b831e0b82e02086a4814",
    "createdAt": "2020-05-08T19:51:13.804Z",
    "updatedAt": "2020-05-08T19:51:13.804Z",
    "__v": 0
}
```

## DELETE api/students/:id
### Request
```sh
curl --location --request DELETE 'http://localhost:3400/api/students/5eb64d6beee87125c27a315d'
```

### Response

#### Success:
```json
{
    "_id": "5eb64d6beee87125c27a315d",
    "name": "Jhon Smith",
    "customStudentId": "TRW5535TR",
    "college": "5eb5b831e0b82e02086a4814",
    "createdAt": "2020-05-09T06:27:55.808Z",
    "updatedAt": "2020-05-09T06:27:55.809Z",
    "__v": 0
}
```
