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
*add_event(user_id, action, view_type, data_id)*
*get_events()*

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

**get_brands***(first_letter)*

Returns minimal list of brands and associative products to help auto-complete forms.

**get_products_by_user_id***(user_id)*

Returns a list of product objects with both user specific and universal product information.

**get_product_as_dictionary***(product_id)*

Returns non-user-specific product information as a key-value store.

**get_product_by_product_id***(product_id)*

Returns a query object of size 1 or less.

**get_product_id_by_sephora_product_id***(sephora_product_id)*

Returns a product ID number.

**verify_product_by_name_and_brand***(product_name, product_brand)*

Returns a boolean if product already exists in database.

**verify_product_by_id***(product_id)*

Returns a boolean if product already exists in database.

**add_product_to_products***(name, brand, category='', price='', sephora_id='', image_url='', description='')*

Creats a new entry in Product table.

**add_user_to_product***(user_id, product_id, size='Full', status='Own', notes='', color='', stars='', review='', user_product_image_url='')*

Creates a new entry in User_product table

**edit_user_to_product***(user_id, product_id, size='full', status='own', notes='', color='', stars='', review='', user_product_image_url='')*

Updates an entry in User_product table

**get_notes***(user_id, product_id)*

Retuns user-specific comments about a product from the User_product table.

**remove_user_from_product***(product_id)*

Removes an entry from the User_product table.

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

**get_recommendation_by_user_id***(user_id)*

Returns a list of product objects from the top 5 ranked entries in the universal (non-user-generated) Recommendation table.

**add_recommendation***(user_id, product_id, rank)*

Creates a new entry in the Recommendation table.

**populate_new_user_recommendations***(user_id)*

Used for when a new user signs up. Pseudo-randomly picks product ID numbers and create entries in the Recommendation table.

**remove_recommendation***(user_id)*

Remove all entries in Recommendation table for user.

**get_personal_recs***(user_id)*

Returns from Personal_Rec table a list of recommendation objects indluding user who gave recommendation and a nested product object.

**add_personal_rec***(from_user_id, to_user_id, product_id)*

Create a new entry in Personal_Rec table.

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

**remove_protocol***(full_url)*

Returns URL string without the 'http://' if one existed. 

**get_protocol***(full_url)*

Returns string of either 'http://' or 'https://'.

**add_protocol***(unsure_url)*

Retusn url string with 'http://' prepended, if it was not already.

**type_of***(full_url)*

Returns string 'article' or 'blog' depending on length of path of the URl given.

**make_absolute***(full_url, partial_url)*

Converts a relative path into an absolute path.
Example:
```python

make_absolut('http://www.sephora.com/productInfo/P1234', '/images/P1234')
# >> 'http://www.sephora.com/images/P1234'
```

**fetch_html***(full_url)*

Returns string of full page source for given URL.

**get_host***(full_url)*

Returns URL string minus the protocol and path
Example:
```python
get_host('https://www.google.com/webhp?ie=UTF-8#q=something')
# >> 'www.google.com'
```

**get_description***(html)*

Returns string for site description (from meta tag) if one exists, or empty string.

**get_image_ref***(html, full_url)*

Returns string for image source URL (from meta tag) if one exists, or empty string.

**get_author***(html)*

Returns string for author of article (from meta tag) if one exists, or empty string.

**get_article_title***(html)*

Returns string for article title (from meta tag) if one exists, or empty string.

**get_site_info***(url)*

Returns object containing information about website scraped from meta tags.

**query_by_id_and_type***(site_id, site_type)*

Returns query object.

**get_id_from_url***(url)*

Returns ID of site (in either Article or Blog table) or None.

**get_sites_by_user_id***(user_id)*

Returns a list of sites objects from User_site table, populated with fields from either Blog or Article table.

**add_or_update_site***(info)*

Creates a new entry in Article or Blog table or updates (determined by properties in info object) existing entry.

**add_user_to_site***(user_id, site_id, site_type, comment)*

Creates entry in User_site table.

**edit_user_to_site***(id, comment)*

Updates an entry in User_site table.

**remove_user_from_site***(id)*

Deletes an entry in User_site table.

**get_comments***(user_id, site_type, site_id)*

Retuns user-specific comments about an article/blog from the User_site table.

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

**make_new_user***(u)*

Crates new entry in User table with properties in u object.

**verify_user***(username, password)*

Returns user object or False.

**username_exists***(username)*

Returns boolean if username is already in User table.

**userid_exists***(userid)*

Returns boolean, verifying if userid is in User table.

**get_user_id***(username)*

Returns unique ID for username.

**get_user_as_dictionary***(id)*



**create_session***(response, user_id)*
**verify_session***(request)*

**destroy_session***(response)*

**get_followings***(user_id)*

**get_followers***(user_id)*

### Front-end Code

**TBD**