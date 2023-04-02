import { Innertube, UniversalCache, YTNodes } from "youtubei.js";

import express from "express";
import { join } from "path";
import fs from "fs";
const app = express();
app.use(express.static(join(process.cwd(), "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", join(process.cwd(), "views"));

const youtube = await Innertube.create();
// const trending = await youtube.getTrending();
// const tabs = trending.tabs;
const trending = await youtube.getHomeFeed();
const now = trending.contents.contents;
// console.log(now);

// for (let i = 0; i < now.videos.length; i++) {
//   const info = await youtube
//     .getBasicInfo(now.videos[i].id)
//     .catch((e) => undefined);

//   const format = info.chooseFormat({ type: "video+audio", quality: "best" });
//   let url = format?.decipher(youtube.session.player);
//   now.videos[i].streamURL = url;
//   // console.log({ url });

//   data.push(now.videos[i]);
//   // console.log(now.videos[i].id);
//   if (i >= 11) {
//     break;
//   }
// }

// Thumbnails can be obtained using best_thumbnail.
// for (let i = 0; i < now.length; i++) {
console.log(now[0].type);
// }
app.get("/", (req, res) => {
  res.render("index", { now });
});

app.post("/", (req, res) => {
  const data = [];
  const { query } = req.body;
  let i = 0;
  youtube
    .search(query)
    .then(async (d) => {
      for (i = 0; i < d.videos.length; i++) {
        if (!d.videos[i].best_thumbnail) {
          continue;
        }
        if (d.videos[i] instanceof YTNodes.Video) {
          const url = (await youtube.getStreamingData(now.videos[i].id)).url;
          now.videos[i].streamURL = url;
          data.push(d.videos[i]);
        }
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
// Future Ideas
// app.get("/download/:id", async (req, res) => {
//   const { id } = req.params;
//   const options = {
//     type: "audio",
//     quality: "best",
//     format: "mp4",
//   };
//   let name;
//   const info = await youtube.getBasicInfo(id).catch(e => undefined);
//   if (!info) return;

//   const format = info.chooseFormat({ type: "video+audio", quality: "best" });
//   let url = format?.decipher(youtube.session.player);
//   console.log(info.basic_info.title)
//   console.log(url)
//   const fetchData = await fetch(url).then(d => d.blob());
//   url = URL.createObjectURL(new Blob([fetchData]));
//   res.render("download",{url:url,info:info.basic_info})
// });

app.listen(process.env.PORT || 44444, (e) => {
  if (e) throw e;
});
