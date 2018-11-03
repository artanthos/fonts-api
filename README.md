Wanted to use images, instead of loading the css files directly, but renaming the files was a chore in itself

Here's the link to a repo that has images corresponding to each google font: https://github.com/getstencil/GoogleWebFonts-FontFamilyPreviewImages

---

Run ```npm install```.

Then ```npm start```.

---

```/getFontsFromGoogleApi``` fetches fonts from the google api
```/paginate``` breaks the json file into separate json files, with 10 entries each 
```/api/getJson``` enpoint that fetches a json each time the scroll reaches the end
```/api/filter``` endpoint for filtering fonts
