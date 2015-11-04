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

**Description**
Verify that user is logged in through cookie data, and return user info.

###### POST

**Description**
Verify that user is logged in by checking username and password
**Request Body**
```json
{
	"username": "<required>",
	"password": "<required>"
}
```

###### DELETE

##### /api/newUser

###### POST

**Description**

**Params**

**Request Body**

##### /api/profile

###### GET

**Description**

**Params**

**Request Body**

##### /api/follow

###### GET

**Description**

**Params**

**Request Body**

###### POST

**Description**

**Params**

**Request Body**

###### DELETE

**Description**

**Params**

**Request Body**

##### /api/userProducts

###### GET

**Description**

**Params**

**Request Body**

###### POST

**Description**

**Params**

**Request Body**

###### PUT

**Description**

**Params**

**Request Body**

###### DELETE

**Description**

**Params**

**Request Body**

##### /api/products

###### GET

**Description**

**Params**

**Request Body**

##### /api/sites

###### GET

**Description**

**Params**

**Request Body**

###### POST

**Description**

**Params**

**Request Body**

###### PUT

**Description**

**Params**

**Request Body**

###### DELETE

**Description**

**Params**

**Request Body**

##### /api/recommendations

###### GET

**Description**

**Params**

**Request Body**

###### POST

**Description**

**Params**

**Request Body**

##### /api/events

###### GET

**Description**

**Params**

**Request Body**

##### /api/brands

###### GET

**Description**

**Params**

**Request Body**

#### Database



### Front-end Code

### Roadmap

View the project roadmap [here](https://github.com/Voracious-Harpsichord/voracious-harpsichord/issues)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
