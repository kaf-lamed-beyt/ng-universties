Here's a comprehensive documentation guide for ng-universities API:

---

## University API Documentation

### Base URL
```shell
/api/v1/universities
```

### Description
This API allows you to retrieve university data and filter universities based on specific criteria like type, city, state, or acronym. Pagination is also supported.

---

### Endpoints

#### **1. GET {{baseURL}}**
Fetches all universities or filters universities based on query parameters.

#### **Query Parameters**

| Parameter  | Type     | Description                                                                                                                                 |
|------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------|
| `name`     | `string` | Filter universities by name (e.g., `Kwara State University`).     |
| `type`     | `string` | Filter universities by type (e.g., `federal`, `state`, `private`).                                                                          |
| `city`     | `string` | Filter universities by the city they are located in (e.g., `Ile-Ife`).                                                                      |
| `state`    | `string` | Filter universities by the state they are located in (e.g., `Osun`).                                                                        |
| `acronym`  | `string` | Filter universities by their acronym (e.g., `OAU`).                                                                                        |
| `page`     | `number` | (Optional) The page number for pagination. Default: `1`.                                                                                   |
| `limit`    | `number` | (Optional) The number of results per page. Default: `20`.                                                                                  |

---

### Example Requests

#### **1. GET All Universities**
**Request:**
```http
GET {{baseURL}}
```
**Response:**
```json
[
  {
    "logo": "https://university.edu.ng/logo.png",
    "current_vc": "Prof. Stephen Gbolagade",
    "name": "Obafemi Awolowo University",
    "acronym": "OAU",
    "location": { "city": "Ile-Ife", "state": "Osun" },
    "founded": 1961,
    "website": "https://oauife.edu.ng",
    "faculties": [
      {
        "acronym": "SCI",
        "name": "Faculty of Science",
        "departments": [
          { "acronym": "CSC", "name": "Computer Science" },
          { "acronym": "PHY", "name": "Physics" }
        ]
      }
    ]
  }
]
```

---

#### **2. GET Universities by Name**

Pass the full university name only:

**Request:**
```http
GET {{baseURL}}?name=Obafemi Awolowo University
```
**Response:**
```json
[
  {
    "logo": "https://university.edu.ng/logo.png",
    "current_vc": "Prof. Stephen Gbolagade",
    "name": "Obafemi Awolowo University",
    "acronym": "OAU",
    "location": { "city": "Ile-Ife", "state": "Osun" },
    "founded": 1961,
    "website": "https://oauife.edu.ng",
    "faculties": [
      {
        "acronym": "SCI",
        "name": "Faculty of Science",
        "departments": [
          { "acronym": "CSC", "name": "Computer Science" },
          { "acronym": "PHY", "name": "Physics" }
        ]
      }
    ]
  }
]
```

---


#### **2. GET Universities by Type**
**Request:**
```http
GET {{baseURL}}?type=federal
```
**Response:**
```json
[
  {
    "logo": "https://university.edu.ng/logo.png",
    "current_vc": "Prof. Stephen Gbolagade",
    "name": "Obafemi Awolowo University",
    "acronym": "OAU",
    "location": { "city": "Ile-Ife", "state": "Osun" },
    "founded": 1961,
    "website": "https://oauife.edu.ng",
    "faculties": [
      {
        "acronym": "SCI",
        "name": "Faculty of Science",
        "departments": [
          { "acronym": "CSC", "name": "Computer Science" },
          { "acronym": "PHY", "name": "Physics" }
        ]
      }
    ]
  }
]
```

---

#### **3. GET Universities by City**
**Request:**
```http
GET {{baseURL}}?city=ile-ife
```
**Response:**
```json
[
  {
    "logo": "https://university.edu.ng/logo.png",
    "current_vc": "Prof. Stephen Gbolagade",
    "name": "Obafemi Awolowo University",
    "acronym": "OAU",
    "location": { "city": "Ile-Ife", "state": "Osun" },
    "founded": 1961,
    "website": "https://oauife.edu.ng",
    "faculties": [
      {
        "acronym": "SCI",
        "name": "Faculty of Science",
        "departments": [
          { "acronym": "CSC", "name": "Computer Science" },
          { "acronym": "PHY", "name": "Physics" }
        ]
      }
    ]
  }
]
```

---

#### **4. GET Universities by State**
**Request:**
```http
GET {{baseURL}}?state=osun
```
**Response:**
```json
[
  {
    "logo": "https://university.edu.ng/logo.png",
    "current_vc": "Prof. Stephen Gbolagade",
    "name": "Obafemi Awolowo University",
    "acronym": "OAU",
    "location": { "city": "Ile-Ife", "state": "Osun" },
    "founded": 1961,
    "website": "https://oauife.edu.ng",
    "faculties": [
      {
        "acronym": "SCI",
        "name": "Faculty of Science",
        "departments": [
          { "acronym": "CSC", "name": "Computer Science" },
          { "acronym": "PHY", "name": "Physics" }
        ]
      }
    ]
  }
]
```

---

#### **5. GET Universities by Acronym**
If you figured a university exists but the acronym is not correct, kindly open an issue for it so it can fixed as soon as possible.

**Request:**
```http
GET {{baseURL}}?acronym=OAU
```
**Response:**
```json
[
  {
    "logo": "https://university.edu.ng/logo.png",
    "current_vc": "Prof. Stephen Gbolagade",
    "name": "Obafemi Awolowo University",
    "acronym": "OAU",
    "location": { "city": "Ile-Ife", "state": "Osun" },
    "founded": 1961,
    "website": "https://oauife.edu.ng",
    "faculties": [
      {
        "acronym": "SCI",
        "name": "Faculty of Science",
        "departments": [
          { "acronym": "CSC", "name": "Computer Science" },
          { "acronym": "PHY", "name": "Physics" }
        ]
      }
    ]
  }
]
```

---

#### **6. Paginate Results**

Note that default limit is 20 but you can adjust it

**Request:**
```http
GET {{baseURL}}?page=2&limit=5
```
**Response:**
```json
[
  {
    "logo": "https://university.edu.ng/logo.png",
    "current_vc": "Prof. Jane Doe",
    "name": "University of Lagos",
    "acronym": "UNILAG",
    "location": { "city": "Lagos", "state": "Lagos" },
    "founded": 1962,
    "website": "https://unilag.edu.ng",
    "faculties": [
      {
        "acronym": "ENG",
        "name": "Faculty of Engineering",
        "departments": [
          { "acronym": "CIV", "name": "Civil Engineering" },
          { "acronym": "ELE", "name": "Electrical Engineering" }
        ]
      }
    ]
  }
]
```

---

### Error Handling
All errors return a JSON object with an error message.

| Status Code | Description                                                                 |
|-------------|-----------------------------------------------------------------------------|
| `500`       | Internal server error (e.g., issue loading university data).               |
| `405`       | Method not allowed (e.g., using a non-`GET` method).                       |

**Example:**
```json
{
  "message": "Error retrieving university data",
  "error": {}
}
```