## `GET` Beer

### **URL**

`/api/v1/beers/:id`

### **Method:**
  
`GET`
  
### **URL Params**

> **Required:**
 
`id`
    **ID of requested _beer_ resource**

> **Optional:**
 
`N/A`

### **Headers**

`N/A`

### **Request Body**

`N/A`

### **Success Response:**
  * **Code:** 200 <br />
    **Content:** Single `beer` object<br />
    **Example Beer Object:**
    ```
    {
        "id": 135,
        "name": "\"Hey Victor\" Smoked Porter",
        "abv": "5.50",
        "is_organic": "N",
        "style": "Smoke Beer (Lager or Ale)",
        "brewery_id": 109,
        "created_at": "2017-10-13T00:27:56.585Z",
        "updated_at": "2017-10-13T00:27:56.585Z"
    }
    ```
 
### **Error Response:**
  * **Code:** 404 NOT FOUND <br />
    **Content:** error: `Could not find beer with id 123`

  OR

  * **Code:** 422 UNPROCESSABLE ENTRY <br />
    **Content:** `{ error: 'Invalid input data type: id' }` <br />
    **Troubleshoot:** query param `id` of type integer must be included

#### **_Notes:_**

`N/A`
