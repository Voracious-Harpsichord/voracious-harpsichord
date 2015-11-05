[![Stories in Ready](https://badge.waffle.io/Voracious-Harpsichord/voracious-harpsichord.png?label=ready&title=Ready)](https://waffle.io/Voracious-Harpsichord/voracious-harpsichord)
# Beauty Stack

> A dashboard for your beauty products

## Team

  - __Product Owner__: Cynthia Chen, Laura Weaver
  - __Scrum Master__: JT Knox
  - __Development Team Members__: Cynthia Chen, JT Knox, Michael Sova, Laura Weaver

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Team](#team)
1. [Contributing](#contributing)


## Requirements

- Python 3.4.x
- Postgresql 9.1.x
- Bower

## Development

To run locally:
(from *application* folder)

```bash
python3 server.py
```

Go to `localhost:5000`

### Installing Dependencies

From within the root directory:

```bash
pip3 install -r application/requirements.txt
bower install
```

### Back-end Code

#### API End-points

##### /api/user

###### GET

Verify that user is logged in through cookie data, and respond with user info.

###### POST

Verify that user is logged in by checking username and password, and respond with user info

**Request Body:**

```json
{   
    "username": <required>,
    "password": <required>
}
```

###### DELETE

Destroy user session for logging out.

##### /api/newUser

###### POST

Create new user account.

**Request Body:**

```json
{   
    "username": <required>,
    "password": <required>,
    "email": <optional>,
    "name_title": <optional>,
    "name_first": <optional>,
    "name_last": <optional>,
    "gender": <optional>,
    "location": <optional>,
    "birthday": <optional>,
    "skin_tone": <optional>
}
```

##### /api/profile/<user_id>

###### GET

Retrieve simplified info about `<user_id` to display on a profile other than the logged in user's.

##### /api/follow/<user_id>

###### GET

Retrieve users that `<user_id>` is following and a follower of. 

###### POST

Add `<user_id>` as a follower of the user passed in request body.

**Request Body:**
```json
{   
    "userid": <required>,
}
```

###### DELETE

Remove `<user_id>` as of follower of the user passed in request body.

**Request Body:**
```json
{   
    "userid": <required>,
}
```

##### /api/userProducts/<user_id>

###### GET
Retrieve all the products in `<user_id`'s collection, with user specific information included.

###### POST

Add a product to `<user_id`'s collection.

**Request Body:**
```json
{   
    "product_name": <required>,
    "brand_name": <required>,
    "product_category": <optional>,
    "product_size": <optional>,
    "product_status": <optional>,
    "product_notes": <optional>,
    "product_color": <optional>
}
```

###### PUT

Edit a product in `<user_id>`'s collection.

**Request Body:**
```json
{   
    "product": {
        "product_name": <required>,
        "brand_name": <required>,
    },
    "product_category": <optional>,
    "product_size": <optional>,
    "product_status": <optional>,
    "product_notes": <optional>,
    "product_color": <optional>
}
```
###### DELETE

Remove a product from `<user_id>`'s collection.

**Request Body:**
```json
{
    "prdouct_id" <required>
}
```

##### /api/products/<product_id>

###### GET

Retrieve non-user-specfic information about a specific product.

##### /api/sites

###### GET

**Request Body:**

###### POST

**Request Body:**

###### PUT

**Request Body:**

###### DELETE

**Request Body:**

##### /api/recommendations

###### GET

**Request Body:**

###### POST

**Request Body:**

##### /api/events

###### GET

**Request Body:**

##### /api/brands

###### GET

**Request Body:**

#### Database



### Front-end Code

### Roadmap

View the project roadmap [here](https://github.com/Voracious-Harpsichord/voracious-harpsichord/issues)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
