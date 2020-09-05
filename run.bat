#ECHO off
start cmd /c mongod --dbpath=%cd%/data
IF _%1 == _dev ( npm run dev_ ) ELSE IF _%1 == _start ( npm run start_ ) ELSE ( ECHO %1 is not an argument )