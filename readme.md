## NODE STORE API

A simple Node Js API e-commerce project using Express framework, JSON Web token, and Sequelize ORM

### Prerequisites
You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with npm)
### Quickstart

* Clone the project: `git clone https://github.com/mimidotsuser/node-store.git`

* Navigate into the `node-store` folder by running `cd node-store` on the terminal

* Run `npm install` to install the dependencies

* Rename [sample.env.json](sample.env.json) located in the project root  to ``.env.json``

* Replace the database credentials inside the ``.env.json``. Refer to [sequelize docs](https://sequelize.org/v5/manual/dialects.html) for more info.

* Run `` npm run start``. to start nodemon server on default port ``3000``

* Refer to the docs for the available API end points

### Linting

* `npm run lint`

### Building

* `npm run build` (outputs in the [dist](dist) folder)


#### N.B. 
1)  Tables will be created automatically by Sequelize ORM if the database connection is established

2)  Swagger API Docs and Insomina environment export can be found in the [docs](docs) folder

### License
[MIT License](LICENSE.md).
