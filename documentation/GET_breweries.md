## `GET` Breweries

### **URL**

`/api/v1/breweries`

### **Method:**

`GET`

### **URL Params**

> **Required:**

`No required params`

> **Optional:**

`No optional params`

### **Headers**

`N/A`

### **Request Body**

`N/A`

### **Success Response:**
  * **Code:** 200 <br />
    **Content:** Array of `brewery` objects<br />
    **Example Brewery Object:**
    ```
    {
        "id": 82,
        "name": "(512) Brewing Company",
        "established": "2008",
        "website": "http://www.512brewing.com/",
        "created_at": "2017-10-10T23:38:03.425Z",
        "updated_at": "2017-10-10T23:38:03.425Z"
    }, ...
    ```

### **Error Response:**
  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ error: 'Could not find any Breweries' }`

#### **_Notes:_**

`N/A`
