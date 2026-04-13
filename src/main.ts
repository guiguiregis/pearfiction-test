import { Application, Assets, Sprite, Text, Container } from "pixi.js";
import { Reel } from "./components/Reel";
import { CONFIG } from "./config";

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
          { alias: "spin_button", src: "/assets/spin_button.png" },
        ],
      },
    ],
  };

  await Assets.init({
    manifest: assets,
  });

  const textures = await Assets.loadBundle("game-assets", (progress) => {
    loadingText.text = `${Math.round(progress * 100)}%`;
  });
  //wait for 1 second before removing the loading text and starting the game
  
  container.removeChild(loadingText);
  startGame(app, textures);
})();

function startGame(app: any, textures: any) {

  const gameContainer = new Container();
  app.stage.addChild(gameContainer);

  const reels: Reel[] = [];
  const reelGroup = new Container();
  gameContainer.addChild(reelGroup);

  for(let i = 0; i<CONFIG.REEL_COUNT; i++){
    const reel = new Reel(CONFIG.BANDS[i], textures);
    reel.x = i * (CONFIG.SYMBOL_SIZE + CONFIG.REEL_SPACING);
    reelGroup.addChild(reel);
    reels.push(reel);
  }

  const spinButton = new Sprite(textures.spin_button);
  spinButton.x = app.screen.width / 2;
  spinButton.y = app.screen.height / 2.5;
  spinButton.interactive = true;
  spinButton.cursor = "pointer";
  gameContainer.addChild(spinButton);

  const winText = new Text({
    text: "",
    style: { fill: '#ffffff', fontSize: 18, align: 'center', wordWrap: true, wordWrapWidth: 500 }
  });
  winText.anchor.set(0.5, 0);
  gameContainer.addChild(winText);


  const updateLayout = () => {
    gameContainer.x = app.screen.width / 2;
    gameContainer.y = app.screen.height / 5;

    reelGroup.x = -((CONFIG.REEL_COUNT - 1) * (CONFIG.SYMBOL_SIZE + CONFIG.REEL_SPACING)) / 2;
    spinButton.y = reelGroup.height + 20;
    spinButton.x = reelGroup.x + reelGroup.width / 2;
    //spinButton.anchor.set(0.5, -1.5);
    winText.y = spinButton.y + 20;
  };

  const spinReels = () => {
    const newPositions = CONFIG.BANDS.map((band) => Math.floor(Math.random() * band.length));
    newPositions.forEach((position, index) => {
      reels[index].updateSymbols(position, textures);
    });
  };

  spinButton.on("pointerdown", spinReels);
  window.addEventListener("resize", updateLayout);

  // Set initial position 0,0,0,0,0 as required
  [0, 0, 0, 0, 0].forEach((pos, i) => reels[i].updateSymbols(pos, textures));
  updateLayout();

  //add a scrollable area to the game container
  const scrollArea = new Container();
  scrollArea.x = 0;
  scrollArea.y = 0;
  scrollArea.width = app.screen.width;
  scrollArea.height = app.screen.height;
  gameContainer.addChild(scrollArea);

  //add a scrollbar to the scrollable area
  const scrollbar = new Sprite(textures.scrollbar);
  scrollbar.x = scrollArea.width - 10;
  scrollbar.y = 0;
  scrollbar.width = 10;
  scrollbar.height = scrollArea.height;
  scrollArea.addChild(scrollbar);

}
