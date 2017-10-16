## `POST` Brewery

### **URL**

`/api/v1/breweries`

### **Method:**
  
`POST`
  
### **URL Params**

> **Required:**
 
`N/A`

> **Optional:**
 
`token`
**Signed JWT Token** Request your API access token from:
**[`POST` /api/v1/authenticate](POST_authenticate.md)**
_may also submit token in the body or as Authorization Header_

### **Headers**

`Content-Type: application/json`

`Authorization: jwt-token-string` _optional_

### **Request Body**

> Example

```
{
	"name": "Epic Cider House",
	"established": "2013",
	"website": "http://www.ciderhouse.com",
	"token": "jwt-token-string" _optional_
}
```

### **Success Response:**
  * **Code:** 201 CREATED <br />
    **Content:** The newly created `brewery` object<br />
    **Example Brewery Object:**
    ```
    {
        "id": 175,
        "name": "Epic Cider House",
        "established": "2013",
        "website": "http://www.ciderhouse.com",
        "created_at": "2017-10-15T05:22:01.218Z",
        "updated_at": "2017-10-15T05:22:01.218Z"
    }
    ```
 
### **Error Response:**
  * **Code:** 422 UNPROCESSABLE ENTRY <br />
    **Content:** `{ error: 'Could not create brewery. Unexpected error' }`

  OR

  * **Code:** 422 UNPROCESSABLE ENTRY <br />
    **Content:**
    ```
    {
      error: 'Expected format: { name: <String>, established: <String>, website: <String> }.
          You're missing a MISSING-PARAMETER property.'
    }
    ```
    **Troubleshoot:** make sure all required properties are included in the body.

#### **_Notes:_**

`A valid JWT Token is required for this resource.`**[details](POST_authenticate.md)**
