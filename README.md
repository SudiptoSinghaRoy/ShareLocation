# Share Location

### Prerequisite
* [Ruby 2.7.2]
* [Rails 6.1.1]
* [Postgres]
* [Node 12.19.0]
* npm 6.14.8

### About the project
This project is about sharing location in the map. A user need to login first. Then the user will be landing in his dashboard, where he can see the user list and a map.

The user list consist of all the users using the application. A search bar is provided to search users in the list. 

The map will show markers of the locations that the login user shared either publicly or to any other users, also the location shared to him by other users will be shown. The login user can click on the marker to get all information about who share the locations with him, or to whome he has shared.On the map if the login user click other location except the marked one, a popup comes out, where the user is asked to share the location either publicly or to one/multiple users.

In the user list there is a "View" link across every user (except the login user). If the link is clicked, it will redirect to the desire user page having a map. In that map the login user can see the marker for locations that the desire user shared publicly.

In the top portion of the page there is a navigation bar, where if in the dashboard of the loging user it will show "My Dashboard" and on right side a dropdown with login username and when clicked "Logout" option is present.

In desire user page the same navigation bar present, having "<username> Sharing" as title, and another link is present for loging user to go to his dashboard.

### How to run the project

 - Clone the project from  <https://github.com/SudiptoSinghaRoy/ShareLocation.git> to your location
 - Run the terminal from your project location
 - Now run 
```sh
$ bundle install
```
 - Now in the config/database.yml, give username, password, host of your postgres sever
 - Now run
```sh
$ rake db:create
$ rake db:migrate
$ rake db:seed
$ npm install
```
 - A seed file is already present having five users and some share locations of them

| Username | User Email | Password |
| ------ | ------ | ------ |
| user1 | user1@test.com | 12345678 |
| user2 | user2@test.com | 12345678 |
| user3 | user3@test.com | 12345678 |
| user4 | user4@test.com | 12345678 |
| user5 | user5@test.com | 12345678 |

 - You can either login by username or useremail and password in the application
 - Now run the application
```sh
$ thin start -p <your desire port>
```
OR
```sh
$ rails s
```
This will run the application on port 3000


Hope you will enjoy   :)


[Ruby 2.7.2]: <https://www.ruby-lang.org/en/news/2020/10/02/ruby-2-7-2-released/>
[Rails 6.1.1]: <https://weblog.rubyonrails.org/2021/1/7/Rails-6-1-1-has-been-released/>
[Postgres]: <https://www.postgresql.org/>
[Node 12.19.0]: <https://nodejs.org/uk/blog/release/v12.19.0/>
