[![Stories in Ready](https://badge.waffle.io/Voracious-Harpsichord/voracious-harpsichord.png?label=ready&title=Ready)](https://waffle.io/Voracious-Harpsichord/voracious-harpsichord)
# Beauty Stack

> A dashboard for your beauty products


## Table of Contents

1. [Team](#team)
1. [Roadmap](#roadmap)
1. [Contributing](#contributing)
1. [Development](#development)
    1. [Requirements](#requirements)
    1. [Installing Dependencies](#installing-dependencies)
1. [Usage](#Usage)
    1. [API](#api)
    1. [Database](#database) 

## Team

  - __Product Owner__: Cynthia Chen, Laura Weaver
  - __Scrum Master__: JT Knox
  - __Development Team Members__: Cynthia Chen, JT Knox, Michael Sova, Laura Weaver

## Roadmap

View the project roadmap [here](https://github.com/Voracious-Harpsichord/voracious-harpsichord/issues)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.


## Development

### Requirements

- Python 3.5.x
- Postgresql 9.1.x
- Bower

### Installing Dependencies

From within the root directory:

```bash
pip3 install -r application/requirements.txt
bower install
```

## Usage

To run locally:
(from *application* folder)

```bash
python3 server.py
```

Go to `localhost:8080`

### API

#### /api/**user**

##### GET

Verify that user is logged in through cookie data, and respond with user info.

##### POST

Verify that user is logged in by checking username and password, and respond with user info

**Request Body:**

```application/json
{   
    "username": <required>,
    "password": <required>
}
```

##### DELETE

Destroy user session for logging out.

#### /api/**newUser**

##### POST

Create new user account.

**Request Body:**

```application/json
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

#### /api/**profile**/<user_id>

##### GET

Retrieve simplified info about `<user_id` to display on a profile other than the logged in user's.

#### /api/**follow**/<user_id>

##### GET

Retrieve users that `<user_id>` is following and a follower of. 

##### POST

Add `<user_id>` as a follower of the user passed in request body.

**Request Body:**
```application/json
{   
    "userid": <required>,
}
```

##### DELETE

Remove `<user_id>` as of follower of the user passed in request body.

**Request Body:**
```application/json
{   
    "userid": <required>,
}
```

#### /api/**userProducts**/<user_id>

##### GET
Retrieve all the products in `<user_id`'s collection, with user specific information included.

##### POST

Add a product to `<user_id`'s collection.

**Request Body:**
```application/json
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

##### PUT

Edit a product in `<user_id>`'s collection.

**Request Body:**
```application/json
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
##### DELETE

Remove a product from `<user_id>`'s collection.

**Request Body:**
```application/json
{
    "prdouct_id" <required>
}
```

#### /api/**products**/<product_id>

##### GET

Retrieve non-user-specfic information about a specific product.

#### /api/**sites**/<user_id>

##### GET

Retrieve articles and blogs in `<user_id>`'s collection.

##### POST

Add an article or blog to `<user_id>`'s collection. 

**Request Body:**
```application/json
{
    "url": <required>,
    "comment": <optional>
}
```

##### PUT

Edit comment on an article or blog to `<user_id>`'s collection.

**Request Body:**
```application/json
{
    "user_site_id": <required>,
    "comment": <optional>
}
```

##### DELETE

Remove an article or blog to `<user_id>`'s collection.

**Request Body:**
```application/json
{
    "user_site_id": <required>
}
```

#### /api/**recommendations**/<user_id>

##### GET

Retrive recommendend products for `<user_id>`.

##### POST

Recommend products from `<user_id>` to user in request body.

**Request Body:**
```application/json
{
    "to_user_id": <required>,
    "product_id": <required>
}
```

#### /api/**events**

##### GET

Retrieve 100 most recent events from all user activities

#### /api/**brands**/<first_letter>

##### GET

Retrieve a list of product names and brand names based on the `<first_letter>` of a brand for auto-completes.

### Database Controls

#### Events

##### Schema

**Event**

* *user_id*: ID of user who performed an action
* *action*: Action that was performed
* *view_type*: Type of data being stored for event
* *data_id*: ID to lookup data with
* *time_stamp*: When the action took place

##### Methods

#### Products

##### Schema

**Product**

* *name*: Name of product
* *brand*: Brand of product
* *category*: Makeup, Skincare, Hair...
* *price*: Price of product from sephora
* *sephora_id*: ID of product in sephora's DB
* *image_url*: URL for image of product
* *description*: Description of product

**User_product**

* *user_id*: ID of user with product in their collection
* *product_id*: ID of product
* *size*: Travel, Full...
* *status*: Completed, Wishlist...
* *color*: Color of product
* *stars*: User's numeric rating of product
* *review*: User's text review of product
* *user_product_image_url*: User uploaded image of product to be shown instead of default from Product table

##### Methods

#### Recommendations

##### Schema

**Recommendation**

* *user_id*: User whom recommendation is for
* *product_id*: Product being recommended
* *rank*: 1 through 5 with 1 being the best

**Personal_Rec**

* *from_user_id*: User making the recommendation
* *to_user_id*: User whom recommendation is for
* *product_id*: Product being recommended

##### Methods

#### Sites

##### Schema

**Article**

* *site_name*: Host name of site
* *article_name*: Name of article 
* *author_name*: Name of author for article
* *url*: Full URL for the page
* *image*: URL for image to displayed with the article
* *description*: Descripton of the article

**Blog**

* *site_name*: Host name of site
* *url*: Full URL for the blog
* *imaage*: URL for image to displayed with the blog
* *description*: Descripton of the blog

**User_site**

* *user_id*: User who added article/blog
* *site_id*: ID of article/blog
* *site_type*: article/blog
* *comment*: User created comment about article/blog

##### Methods

#### Users

##### Schema

**User**

* *created_at*: When user created account
* *username*
* *email*
* *name_title*: Mr, Ms...
* *name_first*: Proper first name
* *name_last*: Proper last name
* *profile_pic*: URL for profile image
* *gender*: (optional, to improve recommendations)
* *location*: (optional, to improve recommendations)
* *birthday*: (optional, to improve recommendations)
* *skin_tone*: (optional, to improve recommendations)

**Follower**

* *user_id*: ID of user who is following
* *is_following*: ID of user being followed

##### Methods

### Front-end Code

**TBD**