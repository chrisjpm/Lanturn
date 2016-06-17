# LanPlan Application Structure
## 'bin' folder
The first folder (bin) contains a www file which is used to start the web server (put the website online).
This code should NOT need to be modified.

## 'models' folder
This folder contains the structures of the tables from our database (the database is hosted on a third-party site). The models are used to tell the program/app/website what the database table looks like, so that it knows what information to send and read from the database.If you open the user.js file you will see all the columns in the table structure, e.g username, email, full_name. 
This folder will only need to be modified if you want to modify the structure of the database!


## 'public' folder
The public folder contains all the assets that can be seen when you access the website. It contains javascript files that run when you enter the website aswell as any images used on the website.
If you are working with CSS and front-end JS files then put them in these folders.

## 'queries' folder
Contains some database queries that are used by the application, e.g getParties.js will find nearby parties from the database.
If you are working on the back-end code and with databases you will probably use this folder.

## 'routes' folder
Contains most of the back-end code (tasks that are performed in the background based on what the user has asked for). This code decides what happens when you type lanplan.herokuapp.com/[insert path here]. E.g in home.js, if you go to the homepage of LanPlan (lanplan.herokuapp.com/) then it will send the index.ejs file to the users screen, which is basically the home html file with the map.
If you are working with front-end and need to add a NEW page then you will have to make sure that the routes to the page are set up.

## 'views' folder
This folder contains all the HTML code in ejs files. EJS files are basically HTML, but allows you to do logical operations, e.g show the user's image only if they are logged in.
Another important point is that any html code that can be re-used throughout the site such as the header, is stored separately in the partials folder. These partials can then be added to any new page with one-line, saving us from having to type out the whole thing again. For the most part, partials do not need to be modified.
This folder will contain all HTML code, so will be used when working on the front-end.



##

