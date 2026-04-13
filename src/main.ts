import { Application, Assets, Sprite, Text, Container } from "pixi.js";

(async () => {
  // Create a new application
  const app = new Application();

  await app.init({ background: "#1a1a1a", resizeTo: window });

  //document.body.appendChild(app.canvas);
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  const container = new Container();

  app.stage.addChild(container);

  const loadingText = new Text({
    text: "0%",
    style: {
      fontSize: 40,
      fill: "#ffffff",
      fontWeight: "bold",
    },
  });
  loadingText.x = app.screen.width / 2;
  loadingText.y = app.screen.height - 100;

  container.addChild(loadingText);

  const assets = {
    bundles: [
      {
        name: "game-assets",
        assets: [
          { alias: "hv1", src: "/assets/hv1_symbol.png" },
          { alias: "hv2", src: "/assets/hv2_symbol.png" },
          { alias: "hv3", src: "/assets/hv3_symbol.png" },
          { alias: "hv4", src: "/assets/hv4_symbol.png" },
          { alias: "lv1", src: "/assets/lv1_symbol.png" },
          { alias: "lv2", src: "/assets/lv2_symbol.png" },
          { alias: "lv3", src: "/assets/lv3_symbol.png" },
          { alias: "lv4", src: "/assets/lv4_symbol.png" },
          { alias: "spin-button", src: "/assets/spin_button.png" },
        ],
      },
    ],
  };

  await Assets.init({
    manifest: assets,
  });

  const bundle = await Assets.loadBundle("game-assets", (progress) => {
    loadingText.text = `${Math.round(progress * 100)}%`;
  });
  //wait for 1 second before removing the loading text and starting the game
  
  app.stage.removeChild(loadingText);
  startGame(app, bundle.textures);
})();

function startGame(app: any, textures: any) {
  console.log("assets loaded");
}
