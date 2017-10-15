## `POST` Beer

### **URL**

`/api/v1/beers`

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
    "name": "The Bluest Moon",
    "is_organic": "N",
    "abv": "20.9",
    "style": "Red Ale",
    "brewery_id": "119",
    "token": "jwt-token-string" _optional_
}
```

### **Success Response:**
  * **Code:** 201 CREATED <br />
    **Content:** The newly created `beer` object<br />
    **Example Beer Object:**
    ```
    {
        "id": 175,
        "name": "The Bluest Moon",
        "abv": "20.90",
        "is_organic": "N",
        "style": "Red Ale",
        "brewery_id": 119,
        "created_at": "2017-10-15T05:22:01.218Z",
        "updated_at": "2017-10-15T05:22:01.218Z"
    }
    ```
 
### **Error Response:**
  * **Code:** 422 UNPROCESSABLE ENTRY <br />
    **Content:** `{ error: 'Could not create beer. Unexpected error' }`

  OR

  * **Code:** 422 UNPROCESSABLE ENTRY <br />
    **Content:**
    ```
    {
      error: 'Expected format:
        { name: <String>, abv: <decimal>, is_organic: <String>, style: <String>, brewery_id: <integer> }.
          You're missing a MISSING-PARAMETER property.'
    }
    ```
    **Troubleshoot:** make sure all required properties are included in the body.

#### **_Notes:_**

`A valid JWT Token is required for this resource.`**[details](POST_authenticate.md)**
