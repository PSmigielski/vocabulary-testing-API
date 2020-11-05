# Vocabulary testing platfom API

To get words to the database i've used this [web scraper](https://github.com/PSmigielski/english-words-webscraper)


## Getting started

To get a local copy up and running follow these simple example steps.


#### Prerequisites

  - [NodeJS](https://nodejs.org/en/)
  - npm
  - mysql server 

## Installation
1. Clone this repo
``` bash 
    git clone git@github.com:PSmigielski/vocabulary-testing-API.git API && cd APi
```
2. install the required npm packages

```bash
    npm install
```
3. import sql file from /database directory to your database

4. create .env file with this scaffold

```
    PORT= # port where api is to work
    USER= # database user name
    PASSWORD= # database user password
    DB= # database name
    HOST= # your host eg.localhost
```
5. run api
```bash
    npm run start
```
    or
```bash
    npm run dev
```

## Technologies used in this project
 - [NodeJS](https://nodejs.org/en/docs/)
 - [express.js](https://expressjs.com/en/api.html)
 - [mysql](https://dev.mysql.com/doc/)