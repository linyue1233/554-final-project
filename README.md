<h1>Final Project</h1>
22F CS554A Group3

# PS
In the dev brach, our auto emailAddress prefix is AWS address which we have published, and in main branch, it is localhost address and the port is 4000.

If you use windows and throw errors when run, you can use npm run dev.
# Background
Nowadays, there are many video websites that users can use, but the websites currently used have many functions, which make the website bloated. Therefore, the video website we developed is to allow users to see the videos they want directly according to the classification or search, and they can also interact in the chat room in real time.

# How to run
Before run the code, you should run "npm install" or "npm i" to download packages in client and server folder.
If you have the versons conflicts, you can run npm i --legacy-peer-deps
We have seed file to initialize database. So then you should "npm run seed" in server folder.
At last, you can run "npm start" in two folder terminal to start the project. And input the url of "http://localhost:4000/" in the browse.

**Now we have pushed the war package into AWS, and you can visit the link: http://cs554.ggsddup.xyz .**

## entry_page
Our website doesn't login so that you can watch videos, but if you want add comment or other operations, you can click the login button. 
Our homePage is the classification of different videos. And in the top of page, we show the most popular videos.

## Register
In the register page, you will input some information about you, remember your emailAddress is very important!!!
Remember your emailAddress, beacuse when you forget password, it will help you reset.
And you can upload you avatar image. We will use sharp to resize it to make storage smaller.

## After login
After login, you will enter the homepage as we said before. And now you can watch your account, add comment under each video.

### Video
In each signal video page, it shows the information of this video and you can interact with other users who are watching the same video real time. You can see the rate and view count of this video, and add like for this video so that you can see it quickly in your profile.

### Disscusion
If you have questions when visitng this site. You can contact us, and our admin will reply you asap.

## Admin
As the admin, you can upload the video and edit the information of video. And if someone wrote some unhealthy or bad comments, you can delete this comment to protect a good community.


# Contributors
Cheng Chen, Feiyu Chen, Jiakang Liang, Yue Lin, Oukan Xu
We wish you can enjor our project.
