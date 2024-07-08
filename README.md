# urls-to-opml
Convert a list of URLs in a text file to an OPML subscription list using code from ChatPGT

## Required applications

This app requires that Node.js and NPM are installed on the computer running the app.

## Setup instructions
Download zip file of this repo and unzip into a directory

Start Node.js in a command prompt and change directories to where the repo resides

At the directory root, enter the following command:

   npm install

Copy a file to the directory with a set of feed URLs, each one on a single line, make sure the file is named urls.txt.

## Usage

Enter the following command at the directory root

   node index.js

The app will run until all feed URLs have been read and processed. For a file of 170 URLs, this took 2-3 minutes. Some debug print will be output during execution.

When the app has completed, the cursor will return to the command line. The output file will be named feeds.opml.

## References

[AndySylvester.com] (https://andysylvester.com/2024/07/08/using-chatgpt-to-convert-a-list-of-feed-urls-to-opml/) = weblog post about this app



