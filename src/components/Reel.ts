import { Container, Sprite, Texture } from "pixi.js";
import { CONFIG } from "../config";

export class Reel extends Container {
    private symbols: Sprite[] = [];
    private band: string[];

    constructor(band: string[], textures: Record<string, Texture>) {
        super();
        this.band = band;

        for(let i = 0; i<CONFIG.ROW_COUNT; i++){
            const symbol = new Sprite();
            symbol.y = i * (CONFIG.SYMBOL_SIZE + CONFIG.REEL_SPACING);
            symbol.anchor.set(0.5);
            symbol.scale.set(0.5);
            this.addChild(symbol);
            this.symbols.push(symbol);
        }
    }

    updateSymbols(position: number, textures: Record<string, Texture>) {
        for(let i = 0; i<CONFIG.ROW_COUNT; i++){
            const symbolIndex = this.band[(position + i) % this.band.length];
            this.symbols[i].texture = textures[symbolIndex];
        }
    }
}