## `PUT` Brewery

### **URL**

`/api/v1/breweries/:id`

### **Method:**

`PUT`

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
    "id": 93,
    "name": "1188 Brewing Company",
    "established": "2012",
    "website": "http://www.1188brewing.com/",
    "token": "jwt-token-string" _optional_
}
```

### **Success Response:**
  * **Code:** 200 <br />
    **Content:** The newly updated `brewery` object<br />
    **Example Beer Object:**
    ```
    {
        "id": 93,
        "name": "1188 Brewing Company",
        "established": "2012",
        "website": "http://www.1188brewing.com/",
        "created_at": "2017-10-10T23:38:03.441Z",
        "updated_at": "2017-10-10T23:38:03.441Z"
    }
    ```

### **Error Response:**
  * **Code:** 422 UNPROCESSABLE ENTRY <br />
    **Content:** `{ error: 'Invalid ID. Incorrect ID format.' }`

  OR

  * **Code:** 422 UNPROCESSABLE ENTRY <br />
    **Content:**
    ```
    {
      error: `Expected format: { name: <String>, established: <String>, website: <String> }.
      You're missing a "specific missing parameter" property.`
    }
    ```
    OR

    * **Code:** 422 UNPROCESSABLE ENTRY <br />
      **Content:**
      ```
      {
        error: 'Unable to update brewery. Unexpected Error.'
      }
      ```

    **Troubleshoot:** make sure all required properties are included in the body.

#### **_Notes:_**

`A valid JWT Token is required for this resource.`**[details](POST_authenticate.md)**
