import {
  Application,
  Assets,
  Container,
  Sprite,
  Text,
  type Texture,
} from "pixi.js";
import { Reel } from "./components/Reel";
import { CONFIG } from "./config";
import { evaluateSpin, type WinDetail } from "./utils";

(async () => {
  const pixiContainer = document.getElementById("pixi-container")!;
  // Create a new application
  const app = new Application();

  await app.init({ background: "#1a1a1a", resizeTo: pixiContainer });
  pixiContainer.appendChild(app.canvas);

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
  loadingText.anchor.set(0.5);

  const layoutLoadingText = () => {
    loadingText.x = app.screen.width / 2;
    loadingText.y = app.screen.height / 2;
    loadingText.style.fontSize = Math.min(
      48,
      Math.max(24, app.screen.width * 0.06),
    );
  };
  layoutLoadingText();
  window.addEventListener("resize", layoutLoadingText);

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

  window.removeEventListener("resize", layoutLoadingText);
  container.removeChild(loadingText);
  startGame(app, textures);
})();

function startGame(app: Application, textures: Record<string, Texture>) {
  const gameRoot = new Container();
  app.stage.addChild(gameRoot);

  const content = new Container();
  gameRoot.addChild(content);

  const reels: Reel[] = [];
  const reelGroup = new Container();
  content.addChild(reelGroup);

  for (let i = 0; i < CONFIG.REEL_COUNT; i++) {
    const reel = new Reel(CONFIG.BANDS[i]);
    reel.x = i * (CONFIG.SYMBOL_SIZE + CONFIG.REEL_SPACING);
    reelGroup.addChild(reel);
    reels.push(reel);
  }

  const spinButton = new Sprite(textures.spin_button);
  spinButton.anchor.set(0.5);
  spinButton.interactive = true;
  spinButton.cursor = "pointer";
  content.addChild(spinButton);

  const winText = new Text({
    text: "",
    style: {
      fill: "#ffffff",
      fontSize: 18,
      align: "center",
      wordWrap: true,
      wordWrapWidth: 560,
    },
  });
  winText.anchor.set(0.5, 0);
  content.addChild(winText);

  const SPIN_GAP = 24;
  const WIN_TEXT_GAP = 16;
  const VIEW_MARGIN = 0.92;

  const updateLayout = () => {
    const step = CONFIG.SYMBOL_SIZE + CONFIG.REEL_SPACING;
    reelGroup.x = -((CONFIG.REEL_COUNT - 1) * step) / 2;
    reelGroup.y = 0;

    const reelsCenterX = reelGroup.x + reelGroup.width / 2.5;
    spinButton.x = reelsCenterX;
    spinButton.y =
      reelGroup.y + reelGroup.height + SPIN_GAP + spinButton.height / 4;

    winText.x = reelsCenterX;
    winText.y = spinButton.y + spinButton.height / 2 + WIN_TEXT_GAP;
  };

  const fitToScreen = () => {
    updateLayout();
    const lb = content.getLocalBounds();
    if (lb.width <= 0 || lb.height <= 0) {
      return;
    }
    const sw = app.screen.width;
    const sh = app.screen.height;
    const scale = Math.min(
      (sw * VIEW_MARGIN) / lb.width,
      (sh * VIEW_MARGIN) / lb.height,
    );
    content.position.set(-(lb.x + lb.width / 2), -(lb.y + lb.height / 2));
    gameRoot.scale.set(scale);
    gameRoot.position.set(sw / 2, sh / 2);
    const logicalW = sw / scale;
    winText.style.wordWrapWidth = Math.min(560, Math.max(160, logicalW * 0.88));
  };

  const updateWinDisplay = (result: {
    totalWins: number;
    winDetails: WinDetail[];
  }) => {
    if (result.totalWins > 0) {
      let winDetails = `Total wins: ${result.totalWins}`;
      result.winDetails.forEach((detail) => {
        winDetails += `\n- payline ${detail.paylineId}, ${detail.symbolId} x${detail.count}, ${detail.payout}`;
      });
      winText.text = winDetails;
    } else {
      winText.text = "Total wins: 0";
    }
  };

  const spinReels = () => {
    const newPositions = CONFIG.BANDS.map((band: string[]) =>
      Math.floor(Math.random() * band.length),
    );
    newPositions.forEach((position: number, index: number) => {
      reels[index].updateSymbols(position, textures);
    });
    const result = evaluateSpin(newPositions);
    updateWinDisplay(result);
    fitToScreen();
  };

  spinButton.on("pointerdown", spinReels);
  const onResize = () => fitToScreen();
  window.addEventListener("resize", onResize);
  app.renderer.on("resize", onResize);

  const startWithInitialState = (initialPositions: number[]) => {
    initialPositions.forEach((pos, i) => reels[i].updateSymbols(pos, textures));

    const result = evaluateSpin(initialPositions);
    updateWinDisplay(result);
  };

  startWithInitialState([0, 0, 0, 0, 0]);
  fitToScreen();
}
