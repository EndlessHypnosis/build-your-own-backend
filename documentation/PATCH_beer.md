## `PATCH` Beer

### **URL**

`/api/v1/beers/:id`

### **Method:**

`PATCH`

### **URL Params**

> **Required:**

`id`
    **ID of the _beer_ resource to partially update**

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
  "name": "\"Tractor Beam\" Oatmeal Stout",
  "abv": "5.80"
}
```

### **Success Response:**
  * **Code:** 200 <br />
    **Content:** The newly updated `beer` object<br />
    **Example Beer Object:**
    ```
    {
        "id": 29,
        "name": "\"Tractor Beam\" Oatmeal Stout",
        "abv": "5.80",
        "is_organic": "N",
        "style": "Oatmeal Stout",
        "brewery_id": 100,
        "created_at": "2017-10-10T23:38:03.492Z",
        "updated_at": "2017-10-10T23:38:03.492Z"
    }
    ```

### **Error Response:**
  * **Code:** 422 UNPROCESSABLE ENTRY <br />
    **Content:** `{ error: 'Invalid ID. Cannot update beer.' }`

  OR

  * **Code:** 422 UNPROCESSABLE ENTRY <br />
    **Content:**
    ```
    {
      error: 'Could not update beer. Unexpected error'
    }
    ```

#### **_Notes:_**

`A valid JWT Token is required for this resource.`**[details](POST_authenticate.md)**
