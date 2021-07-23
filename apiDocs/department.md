## Student API Endpoints
* GET /api/departments
* POST /api/departments
* GET /api/departments/:id
* PUT /api/departments/:id
* DELETE /api/departments/:id


## GET api/departments
### Request
##### Query param /?byCollegeId=collegeId will send all department by that college
```sh
curl --location --request GET 'http://localhost:3400/api/departments/?byCollegeId=5eb7c9a778b5ec0136c873eb' \
--header 'X-Auth-Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWI2ODk5YWJjM2IxMjk1YTUxNDc3ZjIiLCJuYW1lIjoiUlIgZmdmZyIsImVtYWlsIjoicmV6MXNkMkBlbS5jb20iLCJpYXQiOjE1ODkwMjU1NTR9.yL3jPpixJ-f2rcD3iK1Gb6a-7BriTbFRECutEGfHMV8'
```

### Response

#### Success:
```json
[
    {
        "_id": "5eb7d3349e1d790636b222c4",
        "name": "Department of Computer Science",
        "college": {
            "_id": "5eb7c9a778b5ec0136c873eb",
            "name": "BL College 1589103015726",
            "createdAt": "2020-05-10T09:30:15.729Z",
            "updatedAt": "2020-05-10T09:30:15.729Z",
            "__v": 0
        },
        "createdAt": "2020-05-10T10:11:00.239Z",
        "updatedAt": "2020-05-10T10:11:00.239Z",
        "__v": 0
    }
]
```

## POST api/departments
### Request
```sh
curl --location --request POST 'http://localhost:3400/api/departments/' \
--header 'X-Auth-Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWI2ODk5YWJjM2IxMjk1YTUxNDc3ZjIiLCJuYW1lIjoiUlIgZmdmZyIsImVtYWlsIjoicmV6MXNkMkBlbS5jb20iLCJpYXQiOjE1ODkwMjU1NTR9.yL3jPpixJ-f2rcD3iK1Gb6a-7BriTbFRECutEGfHMV8' \
--header 'Content-Type: application/json' \
--data-raw '{
	"collegeId": "5eb7c9a778b5ec0136c873eb",
	"name": "Department of Mathemetics"
}'
```

### Response

#### Success:
```json
{
    "_id": "5ebe221af56daafde1a7620f",
    "name": "Department of Mathemetics",
    "college": "5eb7c9a778b5ec0136c873eb",
    "createdAt": "2020-05-15T05:01:14.344Z",
    "updatedAt": "2020-05-15T05:01:14.344Z",
    "__v": 0
}
```

## GET api/departments/:id
### Request
```sh
curl --location --request GET 'http://localhost:3400/api/departments/5ebe221af56daafde1a7620f' \
--header 'X-Auth-Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWI2ODk5YWJjM2IxMjk1YTUxNDc3ZjIiLCJuYW1lIjoiUlIgZmdmZyIsImVtYWlsIjoicmV6MXNkMkBlbS5jb20iLCJpYXQiOjE1ODkwMjU1NTR9.yL3jPpixJ-f2rcD3iK1Gb6a-7BriTbFRECutEGfHMV8'
```

### Response

#### Success:
```json
{
    "_id": "5ebe221af56daafde1a7620f",
    "name": "Department of Mathemetics",
    "college": "5eb7c9a778b5ec0136c873eb",
    "createdAt": "2020-05-15T05:01:14.344Z",
    "updatedAt": "2020-05-15T05:01:14.344Z",
    "__v": 0
}
```

## PUT api/departments/:id
### Request
```sh
curl --location --request GET 'http://localhost:3400/api/departments/5ebe221af56daafde1a7620f' \
--header 'X-Auth-Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWI2ODk5YWJjM2IxMjk1YTUxNDc3ZjIiLCJuYW1lIjoiUlIgZmdmZyIsImVtYWlsIjoicmV6MXNkMkBlbS5jb20iLCJpYXQiOjE1ODkwMjU1NTR9.yL3jPpixJ-f2rcD3iK1Gb6a-7BriTbFRECutEGfHMV8'
```

### Response

#### Success:
```json
{
    "_id": "5ebe221af56daafde1a7620f",
    "name": "Department of Mathemetics",
    "college": "5eb7c9a778b5ec0136c873eb",
    "createdAt": "2020-05-15T05:01:14.344Z",
    "updatedAt": "2020-05-15T05:01:14.344Z",
    "__v": 0
}
```



## DELETE api/departments/:id
### Request
```sh
curl --location --request DELETE 'http://localhost:3400/api/departments/5ebe221af56daafde1a7620f' \
--header 'X-Auth-Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWI2ODk5YWJjM2IxMjk1YTUxNDc3ZjIiLCJuYW1lIjoiUlIgZmdmZyIsImVtYWlsIjoicmV6MXNkMkBlbS5jb20iLCJpYXQiOjE1ODkwMjU1NTR9.yL3jPpixJ-f2rcD3iK1Gb6a-7BriTbFRECutEGfHMV8'
```

### Response

#### Success:
```json
{
    "_id": "5ebe221af56daafde1a7620f",
    "name": "Department of Mathemetics",
    "college": "5eb7c9a778b5ec0136c873eb",
    "createdAt": "2020-05-15T05:01:14.344Z",
    "updatedAt": "2020-05-15T05:01:14.344Z",
    "__v": 0
}
```
