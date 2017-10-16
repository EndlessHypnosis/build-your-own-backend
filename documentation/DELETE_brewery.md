## `DELETE` Brewery

### **URL**

`/api/v1/breweries/:id`

### **Method:**
  
`DELETE`
  
### **URL Params**

> **Required:**
 
`id`
    **ID of the _brewery_ resource to delete**

> **Optional:**
 
`token`
**Signed JWT Token** Request your API access token from:
**[`POST` /api/v1/authenticate](POST_authenticate.md)**
_may also submit token in the body or as Authorization Header_

### **Headers**

`Authorization: jwt-token-string` _optional_

### **Request Body**

`N/A`

### **Success Response:**
  * **Code:** 204 NO CONTENT <br />
    **Content:** N/A
 
### **Error Response:**
  * **Code:** 422 UNPROCESSABLE ENTRY <br />
    **Content:** `{ error: 'Invalid ID. Cannot delete brewery.' }`

#### **_Notes:_**

`A valid JWT Token is required for this resource.`**[details](POST_authenticate.md)**
