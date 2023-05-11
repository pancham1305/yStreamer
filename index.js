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
    .then(async (e) => {
      // console.log(e);
      const format = e.chooseFormat({ type: "video+audio", quality: "best" });
      const url = format?.decipher(youtube.session.player);
      const base = e.basic_info;
      const channel_id = base.channel_id;
      const channelInfo = await youtube.getChannel(channel_id);
      const videos = await channelInfo.getVideos();
      const array_of_videos = videos.current_tab.content.contents;
      res.render("player", { url, base, array_of_videos });
    })
    .catch((e) => {
      // console.log(e);
      res.send("error");
    });
});

app.listen(process.env.PORT || 44444, (e) => {
  if (e) throw e;
});
