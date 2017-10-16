## Authentication endpoint for API Access

> NOTES

- This endpoint can be used to request a JWT Token for access to the byob API

- Details on the Authentication/Authorization process can be found in the main README file.

### **URL**

`/api/v1/authenticate`

### **Method:**
  
`POST`
  
### **URL Params**

> **Required:**

`N/A`

> **Optional:**

`N/A`

### **Headers**

`N/A`

### **Request Body**

> Example

```
{
	"email": "example@turing.io",
	"appName": "byob"
}
```

### **Success Response:**
  * **Code:** 201 CREATED <br />
    **Content:** The signed `JWT Token`<br />
    **Example Token Object:**
    ```
    {
        "token": "eyJhbGciOiJIUzI1NiIsIeR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5pY2tAdHVyaW5nLmlvcCIsImFwcE5hbWUiOiJieW9iIiwiYWRtaW4iOmZIbHNlLCJpYXQiOjE1MDgwNDQ0MzMsImV4cCP6MTUwODIxNzIzM30.813d0w87z2x4EZUNdEbUcamDysHxM0bI31cm239algI",
        "adminVerification": true
    }
    ```
 
### **Error Response:**
  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{ error: 'Invalid Request. Please enter valid appName and email' }`
    **Troubleshoot:** make sure all required properties are included in the body.

#### **_Notes:_**

`N/A'
