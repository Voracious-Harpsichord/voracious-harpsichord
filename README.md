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

**Description:**
Verify that user is logged in through cookie data, and respond with user info.

###### POST

**Description:**

Verify that user is logged in by checking username and password, and respond with user info

**Request Body:**

```json
{   
    "username": <required>,
    "password": <required>
}
```

###### DELETE

**Description:**
Destroy user session for logging out.

##### /api/newUser

###### POST

**Description:**
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

**Description:**
Retrieve simplified info about non-logged in users for viewing profiles.

##### /api/follow/<user_id>

###### GET

**Description:**
Retrieve users that `<user_id>` is following and a follower of. 

###### POST

**Description:**
Add `<user_id>` as a follower of the user passed in request body.

**Request Body:**
```json
{   
    "userid": <required>,
}

###### DELETE

**Description:**

**Request Body:**

##### /api/userProducts

###### GET

**Description:**

**Request Body:**

###### POST

**Description:**

**Request Body:**

###### PUT

**Description:**

**Request Body:**

###### DELETE

**Description:**

**Request Body:**

##### /api/products

###### GET

**Description:**

**Request Body:**

##### /api/sites

###### GET

**Description:**

**Request Body:**

###### POST

**Description:**

**Request Body:**

###### PUT

**Description:**

**Request Body:**

###### DELETE

**Description:**

**Request Body:**

##### /api/recommendations

###### GET

**Description:**

**Request Body:**

###### POST

**Description:**

**Request Body:**

##### /api/events

###### GET

**Description:**

**Request Body:**

##### /api/brands

###### GET

**Description:**

**Request Body:**

#### Database



### Front-end Code

### Roadmap

View the project roadmap [here](https://github.com/Voracious-Harpsichord/voracious-harpsichord/issues)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
