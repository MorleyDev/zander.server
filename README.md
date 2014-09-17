# Zander C++ Dependency Management Server - Rest API Documentation

## Downloading & Installing Server
The server can be downloaded either via a git clone at "http://github.com/MorleyDev/zander.server" or by downloading from https://github.com/MorleyDev/zander.server/archive/master.zip and unzipping to the desired location.

After downloading the server, the Node Package Manager is required to finish installation. Install the npm if you haven’t already from http://npmjs.org, and then run "npm install" from the cloned/unzipped directory.

## Configuration
Configuration file, config.json, is loaded from the server installed directory. This file is in JSON format, and is used to specify several aspects of the server’s behaviour.


| JSON Value Name | Description  | Default |
|------|-----|------|
| port | The port for the rest server to listen. | 1337 |
| host | The host to use for the base of the links returned by the API. | "127.0.0.1" |
| goduser | If specified, enable superusers. A superuser is required to create regular users. | null |
| goduser.name | The password to use for the superuser. If goduser is specified, must also be specified and should be larger than 20 characters to prevent overlap with regular users. | null
| goduser.password | The password to use for the superuser. If goduser is specified, must also be specified. | null
| hashAlgorithm | The hash algorithm to use when hashing the user’s password for storage via the node.js crypto algorithm. This value is passed to the crypto.createHash function so must be a valid value for that function. http://nodejs.org/api/crypto.html | "sha256"
| throttle | The settings to use when throttling requests, used to configure restify and as such the specific values are listed in the restify documentation http://mcavage.me/node-restify/ | { "burst" : 100, "rate" : 50, "ip" : true }
| mysql | If specified, will use the specified mysql connection settings via the node-mysql plugin. The required configuration options are those passed to mysql.createConnection https://www.npmjs.org/package/mysql | null
| sqlite | If specified, will use the specified sqlite file for as the database backing. Uses memory by default, so if you want to use a sqlite file to persist data to then it must be manually specified. | ":memory:"

## Launching Server
The server can be ran via npm or node. Simply launching server.js via node server.js in the root install directory will launch the server. Likewise, npm start from the root install directory will install the server.

If you wish to use a tool like forever or pm2 to run the server, then server.js in the root directory is the target server file to specify to run.

## API

### User Endpoint
#### Create User
* Url: /user
* Expected Headers:
 * Authorization: [Base64 Username:Password]
 * Content-Type: application/json
* Http Method: POST

Expected Request Body: 

    {
        "username" : "[username]",
        "password" : "[password]",
        "email" : "[email]"
    } 

Success Response Body: 

    {
        "username" : "[username]",
        "email" : "[email]",
        "_href" : "$(serverhost)/user/[username]"
    }

Possible Status Codes 


|Code | Description |
|------|-----|------|
| 201 CREATED | Successfully retrieved the user |
| 400 BAD REQUEST | Failed to specify username, password and/or email address, or the username or password were invalid. Username must be between 3 and 20 characters. Username must only contain alphanumeric characters, - and  _. Password must be 3 or more characters long. |
| 401 UNAUTHORIZED | Failed to specify the authorization header |
| 403 FORBIDDEN |Authenticated user does do not have permission to create a user Notes: Only god user can create users.

#### Get User
* Url: /user/[name] 
* Expected Headers:
 * Authorization: [Base64 Username:Password]
* Http Method: GET

Success Response Body: 

    {
        "email" : "[email]"
    }

Possible Status Codes


| Code | Description |
|------|-----|------|
| 200 OK | Successfully retrieved the user |
| 401 UNAUTHORIZED | Failed to specify the authorization header |
| 404 NOT FOUND | User did not exist, or the authenticated user does not have write access to that user. Notes: Only god users can access any user, others can only access themselves. |

#### Update User
* Url: /user/[name]
* Expected Headers:
 * Authorization: [Base64 Username:Password]
 * Content-Type: application/json
* Http Method: PUT

Expected Request Body: 

    {
        "email" : "[email]",
        "password" : "[password]"
    }

Success Response Body: 

    {
        "email" : "[email]"
    }

Possible Status Codes


| Code | Description |
|------|-----|------|
| 200 OK | Successfully updated the user |
| 400 BAD REQUEST | Failed to specify the email and/or password in the request body |
| 401 UNAUTHORIZED | Failed to specify the authorization header |
| 404 NOT FOUND | User did not exist, or the authenticated user does not have write access to that user. Notes: Only god users can update any user, others can only update themselves. |

#### Delete User
* Url: /user/[name]
* Expected Headers:
 * Authorization: [Base64 Username:Password]
* Http Method: DELETE

Possible Status Codes


| Code | Description |
|------|-----|------|
| 204 NO CONTENT | Successfully deleted the user |
| 401 UNAUTHORIZED | Failed to specify the authorization header |
| 404 NOT FOUND | User did not exist, or the authenticated user does not have write access to that user. |

Notes: Deleting a user also deletes all projects created by that user. Only god users can delete any user, others can only update themselves.

### Project Endpoint
####Create Project
* Url: /project
* Expected Headers:
 * Authorization: [Base64 Username:Password]
 * Content-Type: application/json
* Http Method: POST

Expected Request Body: 

    {
    	"name" : "[name]",
    	"git" : "[git url]"
    }

Success Response Body:

    {
    	"name" : "[name]",
    	"git" : "[git url]",
    	"_href" : "$(serverhost)/project/[name]"
    }

Possible Status Codes


| Code | Description |
|------|-----|------|
| 201 CREATED | Successfully created the project |
| 400 BAD REQUEST | Failed to specify the name or git url, or project name was invalid. Project name must be between 3 and 20 characters long, and only contain alphanumeric characters, - and _ |
| 401 UNAUTHORIZED | Failed to specify the authorization header |
Notes: Any user can create a project.

####Get Projects
* Url: /project
* Query string values: start (default: 0), count (default: 100)
* Expected Headers:
 * Content-Type: application/json
* Http Method: GET

Success Response Body:

    {
    	"_count" : "[<= count]",
    	"_total" : "[total number of projects in server]",
    	"projects": [
    	    {
    	        "name": "[name]",
    	        "_href" : "$(serverhost)/project/[name]"
    	    }, ...
    	]
    }

| Code | Description |
|------|-----|------|
| 200 OK | Successfully retrieved the projects |

#### Get Project
* Url: /project/[name]
* Http Method: GET

Success Response Body: 

    {
        "git" : "[git url]"
    }

Possible Status Codes


| Code | Description |
|------|-----|------|
| 200 CREATED | Successfully retrieved the project |
| 404 NOT FOUND | The specified project does not exist |

Notes: Authentication is not needed to read project details.

#### Update Project
* Url: /project/[name]
* Expected Headers:
 * Authorization: [Base64 Username:Password]
 * Content-Type: application/json
* Http Method: PUT

Expected Request Body: 

    {
        "git" : "[git url]"
    }
    
Success Response Body: 

    {
            "git" : "[git url]"
    }
    
Possible Status Codes

| Code | Description |
|------|-----|------|
| 200 OK | Successfully updated the project |
| 400 BAD REQUEST | Did not specify the git url in the request body |
| 401 UNAUTHORIZED | Failure to specify the Authorization header |
| 403 FORBIDDEN | The authenticated user does not have permission to write to this project |
| 404 NOT FOUND | The specified project does not exist |

Notes: Only super users can update any project, other users can only update projects they created.

#### Delete Project
* Url: /project/[name]
* Expected Headers:
 * Authentication: [Base64 Username:Password]
* Http Method: DELETE

Possible Status Codes


| Code | Description |
|------|-----|------|
| 204 NO CONTENT | Successfully deleted the project |
| 401 UNAUTHORIZED | Failure to specify the Authorization header |
| 403 FORBIDDEN | The authenticated user does not have permission to write to this project |
| 404 NOT FOUND | The specified project does not exist |

Notes: Only super users can delete any project, other users can only delete projects they created.
