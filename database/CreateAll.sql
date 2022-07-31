CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL
);
CREATE TABLE skinTypes(
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL
);
CREATE TABLE countries(
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL
);
CREATE TABLE cities(
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL
);
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    country_id INT REFERENCES countries (id) ON UPDATE CASCADE ON DELETE CASCADE,
    city_id INT REFERENCES cities (id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(30) NOT NULL,
    birthday DATE NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    image VARCHAR(256) NULL,
    skin_type_id INT REFERENCES skinTypes (id) ON UPDATE CASCADE ON DELETE CASCADE,
    location_id INT REFERENCES locations (id) ON UPDATE CASCADE ON DELETE CASCADE,
    email VARCHAR(256) NOT NULL,
    email_confirmed boolean NOT NULL,
    password_hash TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    isCosmeticBagAvailable boolean NOT NULL
);

CREATE TABLE userRoles (
    userId INT NOT NULL,
    roleId INT NOT NULL,
    CONSTRAINT PK_UserRoles PRIMARY KEY (UserId, RoleId),
    CONSTRAINT FK_UserRoles_Roles_RoleId FOREIGN KEY (RoleId) REFERENCES Roles (Id) ON DELETE CASCADE,
    CONSTRAINT FK_UserRoles_Users_UserId FOREIGN KEY (UserId) REFERENCES Users (Id) ON DELETE CASCADE
); 

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL
);

CREATE TABLE categoriesskintypes(
    category_id INT REFERENCES categories (id) ON UPDATE CASCADE ON DELETE CASCADE,
    skintype_id INT REFERENCES skintypes (id)ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT PK_categories_skintypes PRIMARY KEY (category_id, skintype_id)
);

CREATE TABLE brands (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    image VARCHAR(256) NULL,
    price decimal NOT NULL,
    storageDuration INT NOT NULL,
    category_id INT REFERENCES categories (id) ON UPDATE CASCADE ON DELETE CASCADE,
    brand_id INT REFERENCES brands (id) ON UPDATE CASCADE ON DELETE CASCADE,
    numberOfRatings INT NOT NULL,
    rating INT NOT NULL,
    isAvailable boolean NOT NULL,
    code VARCHAR(256) NULL
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products (id)ON UPDATE CASCADE ON DELETE CASCADE,
    user_id INT REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
    rating DECIMAL NOT NULL,
    comment varchar(1000) NULL,
    rateDate date not null
);

CREATE TABLE cosmeticBags (
    user_id INT REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
    product_id INT REFERENCES products (id)ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT PK_cosmeticBag PRIMARY KEY (user_id, product_id)
);

CREATE TABLE subscriptions (
    user_id INT REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
    subscriber_id INT REFERENCES users (id)ON UPDATE CASCADE ON DELETE CASCADE,
    becameDate date NOT NULL,
    CONSTRAINT PK_subscriptions PRIMARY KEY (user_id, subscriber_id)
);

DROP TABLE subscriptions;
DROP TABLE cosmeticBag;
DROP TABLE comments;
DROP TABLE products;
DROP TABLE brands;
DROP TABLE categories;
DROP TABLE categoriesskintypes;
DROP TABLE userroles;
DROP TABLE users;
DROP TABLE locations;
DROP TABLE countries;
DROP TABLE cities;
DROP TABLE roles;
DROP TABLE skinTypes;