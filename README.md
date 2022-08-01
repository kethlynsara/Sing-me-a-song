# <p align = "center"> SingMeASong </p>

<br>
<br>

##  :clipboard: Description

- Allows the user to register song recommendations.

***

## :computer:	 Technologies and Concepts

<div align="center">
	<img src="https://img.shields.io/badge/Node.js-E90000?style=for-the-badge&logo=nodedotjs&logoColor=white" >
  <img src="https://img.shields.io/badge/git-000000.svg?style=for-the-badge&logo=git&logoColor=white" >
	<img src="https://img.shields.io/badge/TypeScript-E90000?style=for-the-badge&logo=typescript&logoColor=white" >
	<img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" >
	<img src="https://img.shields.io/badge/PostgreSQL-E90000?style=for-the-badge&logo=postgresql&logoColor=white" >
  <img src="https://img.shields.io/badge/Prisma-000000?style=for-the-badge&logo=prisma&logoColor=white" >
</div>

***

## :rocket: API

```yml
POST /recommendations
    - Route to register a new recommendation
    - headers: {}
    - body: {
        "name": "Falamansa - Xote dos Milagres",
        "youtubeLink": "https://www.youtube.com/watch?v=chwyjJbcs1Y"
}
```
    
```yml 
POST /recommendations/:id/upvote
    - Route to add one point to the recommendation
    - headers: {}
    - body: {}
```
    
```yml 
POST /recommendations/:id/downvote
    - Route to remove one point from the recommendation
    - headers: {}
    - body: {}
```

```yml
GET /recommendations
    - Route to list recommendations
    - headers: {}
    - body: {}
``` 

```yml
GET /recommendations/:id
    - Route to list recommendations by id
    - headers: {}
    - body: {}
``` 

```yml
GET /recommendations/random
    - Route to get random recommendation
    - headers: {}
    - body: {}
``` 

```yml
GET /recommendations/top
    - Route to get top recommendations
    - headers: {}
    - body: {}
``` 

***

## 🏁 Running the application

Make sure you have the latest stable version of [Node.js](https://nodejs.org/en/download/) e [npm](https://www.npmjs.com/) running locally.

First, clone this repository on your machine:

```
git clone https://github.com/kethlynsara/Sing-me-a-song.git
```

Then, inside the folder, run the following command to install the dependencies.

```
npm install
```

Finished the process, just start the server.
```
npm start
```