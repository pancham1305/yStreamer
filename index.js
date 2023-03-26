import { Innertube, UniversalCache } from "youtubei.js";

import express from "express";
import { join } from "path";
import fs from "fs";
const app = express();
app.use(express.static(join(process.cwd(), "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  next();
});
app.set("view engine", "ejs");
app.set("views", join(process.cwd(), "views"));
let data = [];
const youtube = await Innertube.create();
const trending = await youtube.getTrending();
// const tabs = trending.tabs;

const now = await trending.getTabByName("Music");
for (let i = 0; i < now.videos.length; i++) {
  data.push(now.videos[i]);
  // console.log(now.videos[i].id);
  if (i >= 11) {
    break;
  }
}

// Thumbnails can be obtained using best_thumbnail.

app.get("/", (req, res) => {
  res.render("index", { data });
});

app.post("/", (req, res) => {
  const data = [];
  const { query } = req.body;
  let i = 0;
  youtube
    .search(query)
    .then((d) => {
      for (i = 0; i < d.videos.length; i++) {
        if (!d.videos[i].best_thumbnail) {
          continue;
        }
        data.push(d.videos[i]);
      }
      res.render("search", { data });
    })
    .catch((e) => {
      console.log(e);
      res.render("search", { data });
    });
});
app.get("/play/:id", (req, res) => {
  const { id } = req.params;

  const info = youtube
    .getBasicInfo(id)
    .then((e) => {
      // console.log(e);
      const format = e.chooseFormat({ type: "video+audio", quality: "best" });
      const url = format?.decipher(youtube.session.player);
      const base = e.basic_info;

      res.render("player", { url, base });
    })
    .catch((e) => {
      // console.log(e);
      res.send("error");
    });
});

app.get("/download/:id", (req, res) => {
  const { id } = req.params;
  const options = {
    type: "audio",
    quality: "best",
    format: "mp4",
  };
  let name;
  const info = youtube.getBasicInfo(id).then((e) => {
    name = e.basic_info.title;
  });

  const a = youtube.download(id, options).then((e) => {
    console.log("error");
    console.log(e);
    res.redirect("/");
  });
});

app.listen(process.env.PORT||44444, (e) => {
  if (e) throw e;
});
