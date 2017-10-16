## `GET` Brewery

### **URL**

`/api/v1/breweries/:id`

### **Method:**

`GET`

### **URL Params**

> **Required:**

`id`
    **ID of requested _brewery_ resource**

> **Optional:**

`N/A`

### **Headers**

`N/A`

### **Request Body**

`N/A`

### **Success Response:**
  * **Code:** 200 <br />
    **Content:** Single `brewery` object<br />
    **Example Brewery Object:**
    ```
    {
      "id": 82,
      "name": "(512) Brewing Company",
      "established": "2008",
      "website": "http://www.512brewing.com/",
      "created_at": "2017-10-10T23:38:03.425Z",
      "updated_at": "2017-10-10T23:38:03.425Z"
    }
    ```

### **Error Response:**
  * **Code:** 404 NOT FOUND <br />
    **Content:** error: `Could not find brewery with id 123`

  OR

  * **Code:** 422 UNPROCESSABLE ENTRY <br />
    **Content:** `{ error: 'Invalid input data type: id' }` <br />
    **Troubleshoot:** query param `id` of type integer must be included

#### **_Notes:_**

`N/A`
