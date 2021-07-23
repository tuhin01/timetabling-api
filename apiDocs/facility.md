## Student API Endpoints
* GET /api/facilities
* POST /api/facilities
* GET /api/facilities/:id
* PUT /api/facilities/:id
* DELETE /api/facilities/:id


## GET api/facilities
### Request
##### Query param /?byCollegeId=collegeId will send all facility by that college
```sh
curl --location --request GET 'http://localhost:3400/api/facilities'
```

### Response

#### Success:
```json
[
    {
        "_id": "5eb5b831e0b82e02086a4815",
        "name": "Jay Broke",
        "customFacilityId": "JB5535TR",
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

## POST api/facilities
### Request
```sh
curl --location --request POST 'http://localhost:3400/api/facilities' \
--header 'Content-Type: application/json' \
--data-raw '{
	"name": "Jhon Smith",
	"customFacilityId": "TRW5535TR",
	"collegeId": "5eb5b831e0b82e02086a4814"
}'
```

### Response

#### Success:
```json
{
    "_id": "5eb64d6beee87125c27a315d",
    "name": "Jhon Smith",
    "customFacilityId": "TRW5535TR",
    "college": "5eb5b831e0b82e02086a4814",
    "createdAt": "2020-05-09T06:27:55.808Z",
    "updatedAt": "2020-05-09T06:27:55.809Z",
    "__v": 0
}
```

## GET api/facilities/:id
### Request
```sh
curl --location --request GET 'http://localhost:3400/api/facilities/5eb7af1164d65f5e1c697499'
```

### Response

#### Success:
```json
{
    "_id": "5eb7af1164d65f5e1c697499",
    "name": "Facility 4ST",
    "customFacilityId": "FAC004ST",
    "college": "5eb5b831e0b82e02086a4814",
    "createdAt": "2020-05-10T07:36:49.695Z",
    "updatedAt": "2020-05-10T07:36:49.696Z",
    "__v": 0
}
```

## PUT api/facilities/:id
### Request
```sh
curl --location --request PUT 'http://localhost:3400/api/facilities/5eb5b831e0b82e02086a4815' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Jay B.",
    "customFacilityId": "JB2018DK",
    "college": "5eb5b831e0b82e02086a4814"
}'
```

### Response

#### Success:
```json
{
    "_id": "5eb5b831e0b82e02086a4815",
    "name": "Jay B.",
    "customFacilityId": "JB2018DK",
    "college": "5eb5b831e0b82e02086a4814",
    "createdAt": "2020-05-08T19:51:13.804Z",
    "updatedAt": "2020-05-08T19:51:13.804Z",
    "__v": 0
}
```

## DELETE api/facilities/:id
### Request
```sh
curl --location --request DELETE 'http://localhost:3400/api/facilities/5eb64d6beee87125c27a315d'
```

### Response

#### Success:
```json
{
    "_id": "5eb64d6beee87125c27a315d",
    "name": "Jhon Smith",
    "customFacilityId": "TRW5535TR",
    "college": "5eb5b831e0b82e02086a4814",
    "createdAt": "2020-05-09T06:27:55.808Z",
    "updatedAt": "2020-05-09T06:27:55.809Z",
    "__v": 0
}
```
