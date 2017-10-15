## `GET` Beers

### **URL**

`/api/v1/beers`

`/api/v1/beers?abv=NUM`

### **Method:**
  
`GET`
  
### **URL Params**

> **Required:**
 
`No required params`

> **Optional:**
 
`abv=[numeric]`
    _Alcohol By Volume:_ The `abv` query param may be included to search all beers that are `>=` the specified abv. The value should be an integer or 2 place decimal.

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
        "id": 135,
        "name": "\"Hey Victor\" Smoked Porter",
        "abv": "5.50",
        "is_organic": "N",
        "style": "Smoke Beer (Lager or Ale)",
        "brewery_id": 109,
        "created_at": "2017-10-13T00:27:56.585Z",
        "updated_at": "2017-10-13T00:27:56.585Z"
    }, ...
    ```
 
### **Error Response:**
  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ error: 'Could not find any beers' }`

  OR

  * **Code:** 422 UNPROCESSABLE ENTRY <br />
    **Content:** `{ error: 'Invalid abv param. Please enter valid number.' }` <br />
    **Troubleshoot:** If submitting `abv` query param, value must be numeric

#### **_Notes:_**

`N/A`
