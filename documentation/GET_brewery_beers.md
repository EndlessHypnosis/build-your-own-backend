## `GET` Beers associated with Brewery

### **URL**

`/api/v1/breweries/:id/beers`

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
    **Content:** Array of `beer` objects<br />
    **Example Beer Object:**
    ```
    {
        "id": 32,
        "name": "\"Small Batch\" Hazelwood Farmhouse IPA",
        "abv": "6.00",
        "is_organic": "Y",
        "style": "French & Belgian-Style Saison",
        "brewery_id": 93,
        "created_at": "2017-10-10T23:38:03.493Z",
        "updated_at": "2017-10-10T23:38:03.493Z"
    },...
    ```
    
### **Error Response:**
  * **Code:** 404 NOT FOUND <br />
    **Content:** error: `Could not find beers for brewery with id 123`


#### **_Notes:_**

`N/A`
