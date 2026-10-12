import { world, system } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { ChestFormData } from "./extensions/forms.js";
import "./index.js";

system.run(() => {
    world.sendMessage("Reload成功！");
})
world.afterEvents.itemUse.subscribe((event) => {
    const player = event.source;
    const item = event.itemStack;
    if (item.typeId === "minecraft:stick"){
        const form = new ActionFormData()
            .title("Mode Changer")
            .body("§l選擇切換：")
            .button("創造")
            .button("生存")
            .button("冒險")
            .button("旁觀");
        form.show(player).then((response) => {
            if (response.canceled) return;
            switch (response.selection){
                case 0:
                    player.runCommand("gamemode creative");
                    break;
                case 1:
                    player.runCommand("gamemode survival");
                    break;
                case 2:
                    player.runCommand("gamemode adventure");
                    break;
                case 3:
                    player.runCommand("gamemode spectator");
                    break;
            }
        })
    }
    
    // 點擊時鐘叫出chest UI
    if (item.typeId === "minecraft:clock"){
        const form = new ChestFormData()
            .title("選單")
        form.button(12, "生存模式", ["§o切換到生存模式喔喔喔"], "minecraft:wooden_pickaxe");
        form.button(13, "創造模式", ["§o成為創造模式！！"], "minecraft:command_block", 1, 0, true);
        form.button(14, "冒險模式", ["§o欸得分戳莫得ouo"], "textures/items/adventure");
        form.button(21, "2048", [], "textures/items/2048_2048");
        form.button(22, "圈圈叉叉", ["§oTic-Tac-Toe"], "textures/items/tic-tac-toe");
        form.button(23, "踩地雷", ["§oMinesweeper"], "textures/items/minesweeper_landmine");

        form.show(player).then((res) => {
            if (res.canceled) return;
            switch (res.selection){
                case 12:
                    player.runCommand("gamemode survival");
                    break;
                case 13:
                    player.runCommand("gamemode creative");
                    break;
                case 14:
                    player.runCommand("gamemode adventure");
                    break;
                case 21:
                    if (!game2048.active) init2048();
                    open2048(player);
                    break;
                case 22:
                    showTicTacToe(player);
                    break;
                case 23:
                    initMinesweeper();
                    showMinesweeper(player);
            }
        })
    }

    // 飛刀
    if (item.typeId === "minecraft:iron_sword"){
        player.runCommand("tag @p add flyKnifeUser");
        player.runCommand("setblock 239 -60 -38 redstone_block");
        player.runCommand("clear @p iron_sword");
    }
})

// 圈圈叉叉
let TicTacToeBoard = Array(9).fill(0);
let isOTurn = true;
function showTicTacToe(player) {
    const form = new ChestFormData()
        .title("圈圈叉叉盤面")
    for (let i = 0; i < 3; i++){
        for (let j = 0; j < 3; j++){
            const idx = i * 3 + j;
            const slot = i * 9 + j + 3;

            let woolType = "textures/items/background";
            let label = " ";
            if (TicTacToeBoard[idx] === 1) {
                woolType = "textures/items/O";
                label = "O"
            }
            if (TicTacToeBoard[idx] === 2) {
                woolType = "textures/items/X";
                label = "X";
            }

            form.button(slot, label, [], woolType);
        }
    }
    form.button(26, "重製", ["§o重新開始遊戲"], "textures/items/reset");

    form.show(player).then(res => {
        if (res.canceled) return;

        if (res.selection === 26){
            TicTacToeBoard = Array(9).fill(0);
            isOTurn = true;
            showTicTacToe(player);
            return;
        }

        const sel = res.selection;
        const row = Math.floor(sel / 9);
        const col = sel % 9 - 3;
        const idx = row * 3 + col;

        if (idx >= 0 && idx < 9) {
            if (TicTacToeBoard[idx] === 0){
                if (isOTurn){
                    TicTacToeBoard[idx] = 1;
                } else {
                    TicTacToeBoard[idx] = 2;
                }
                isOTurn = !isOTurn;
            } else {
                showTicTacToe(player);
                return;
            }
        }

        const winner = checkWinTicTacToe();
        if (winner !== 0) {
            if (winner === 1){
                player.runCommand("title @p title §l§b恭喜O獲勝!!");
                player.runCommand("title @p subtitle §bO WIN");
            } else if (winner === 2) {
                player.runCommand("title @p title §l§c恭喜⨉獲勝!!");
                player.runCommand("title @p subtitle §c⨉ WIN");
            } else {
                player.runCommand("title @p title 平手");
                player.runCommand("title @p subtitle Tie");
            }
            TicTacToeBoard = Array(9).fill(0);
            isOTurn = true;
            return;
        }
        showTicTacToe(player);
    });
}
function checkWinTicTacToe(){  // 判斷圈圈叉叉勝利
    for (let i = 0; i < 3; i++) {
        if (TicTacToeBoard[i*3] !== 0 &&
            TicTacToeBoard[i*3] === TicTacToeBoard[i*3+1] &&
            TicTacToeBoard[i*3+1] === TicTacToeBoard[i*3+2]){
            return TicTacToeBoard[i*3];
        }
    }
    for (let j = 0; j < 3; j++) {
        if (TicTacToeBoard[j] !== 0 &&
            TicTacToeBoard[j] === TicTacToeBoard[j+3] &&
            TicTacToeBoard[j+3] === TicTacToeBoard[j+6]){
            return TicTacToeBoard[j];
        }
    }
    if (TicTacToeBoard[0] !== 0 && TicTacToeBoard[0] === TicTacToeBoard[4] && TicTacToeBoard[4] === TicTacToeBoard[8]){
        return TicTacToeBoard[0];
    }
    if (TicTacToeBoard[2] !== 0 && TicTacToeBoard[2] === TicTacToeBoard[4] && TicTacToeBoard[4] === TicTacToeBoard[6]){
        return TicTacToeBoard[2];
    }
    if (!TicTacToeBoard.includes(0)){
        return -1;
    }
    return 0;
}

//踩地雷
const MS_grid_w = 12;
const MS_total_w = 13;
const MS_grid_h = 9;
const mineCount = 20;
let MS_mines = [];
let MS_revealed = [];
let MS_flags = [];
let isFlagMode = false;
let MS_startTime = 0;
let MS_gameActive = false;
function initMinesweeper(){
    MS_mines = [];
    MS_revealed = Array(MS_total_w * MS_grid_h).fill(false);
    MS_flags = Array(MS_total_w * MS_grid_h).fill(false);
    MS_startTime = Date.now()
    MS_gameActive = true;
}
function showMinesweeper(player){
    const form = new ChestFormData("117")
        .title(isFlagMode ? "§l§g踩地雷：插旗模式" : "§l§2踩地雷：挖掘模式")
    for (let i = 0; i < (MS_total_w * MS_grid_h); i++){
        const col = i % MS_total_w;
        if (col === 12){
            if (i === 12){
                form.button(i, "重製", ["§o重新開始遊戲"], "textures/items/reset");
            } else if (i === 25){
                form.button(i, isFlagMode ? "§e插旗" : "§a挖掘", ["§7點擊切換模式"], "minecraft:lever");
            }
        } else {
            if (MS_revealed[i]){
                if (MS_mines.includes(i)){
                    form.button(i, "§c地雷", [], "textures/items/minesweeper_landmine");
                } else {
                    const count = getAdjacentMines(i);
                    form.button(i, `§r${count}`, [], `textures/items/minesweeper_${count}`);
                }
            } else if (MS_flags[i]){
                form.button(i, "§e旗子", [], "textures/items/minesweeper_flag");
            } else {
                form.button(i, "未探索", [], "textures/items/minesweeper_empty");
            }
        }
    }

    form.show(player).then(response => {
        if (response.canceled) return;
        const slot = response.selection;
        const col = slot % 13;
        if (col === 12){
            if (slot === 12){
                initMinesweeper();
                player.sendMessage("§a遊戲已重製");
            } else if (slot === 25){
                isFlagMode = !isFlagMode;
            }
            showMinesweeper(player);
            return;
        } else {
            if (isFlagMode){
                if (!MS_revealed[slot]) MS_flags[slot] = !MS_flags[slot];
            } else {
                if (!MS_flags[slot]) handleMove(player, slot);
            }
        }
        showMinesweeper(player);
    });
}
// 計算周圍地雷數
function getAdjacentMines(index) {
    let count = 0;
    const row = Math.floor(index / 13);
    const col = index % 13;

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const r = row + i;
            const c = col + j;
            if (r >= 0 && r < 9 && c >= 0 && c < 12) {
                if (MS_mines.includes(r * 13 + c)) count++;
            }
        }
    }
    return count;
}
function handleMove(player, index){
    if (!MS_gameActive) return;

    if (MS_mines.length === 0){
        const row = Math.floor(index / 13);
        const col = index % 13;

        const safeZone = [];
        for (let i = -1; i <= 1; i++){
            for (let j = -1; j <= 1; j++){
                const r = row + i;
                const c = col + j;
                if (r >= 0 && r < 9 && c >= 0 && c < 12){
                    safeZone.push(r * 13 + c);
                }
            }
        }
        while (MS_mines.length < mineCount){
            let r = Math.floor(Math.random() * (MS_total_w * MS_grid_h));
            let c = r % MS_total_w;
            if (c < MS_grid_w && !safeZone.includes(r) && !MS_mines.includes(r)){
                MS_mines.push(r);
            }
        }
    }

    if (MS_mines.includes(index)){
        MS_gameActive = false;
        MS_revealed.fill(true);
        player.runCommand("title @p title §l§cBOOM!");
        player.playSound("random.explode");
        return;
    }
    revealRecursive(index);
    checkWinMS(player);
}
function revealRecursive(index){
    if (index < 0 || index >= 117 || MS_revealed[index] || (index % 13 === 12)) return;
    MS_revealed[index] = true;
    MS_flags[index] = false;

    // 連鎖展開
    if (getAdjacentMines(index) === 0){
        const row = Math.floor(index / 13);
        const col = index % 13;
        // 八方位
        for (let i = -1; i <= 1; i++){
            for (let j = -1; j <= 1; j++){
                const r = row + i;
                const c = col + j;
                if (r >= 0 && r < 9 && c >= 0 && c < 12){
                    revealRecursive(r * 13 + c);
                }
            }
        }
    }
}
// 判斷踩地雷勝利
function checkWinMS(player){
    const hasWon = MS_revealed.every((isRevealed, i) => {
        const col = i % 13
        if (col === 12) return true;
        if (MS_mines.includes(i)) return true;
        return isRevealed;
    });

    if (hasWon && MS_gameActive){
        MS_gameActive = false;
        const MS_endTime = Date.now();
        const MS_timeUsed = ((MS_endTime - MS_startTime) / 1000).toFixed(2);
        
        player.playSound("random.levelup");
        player.runCommand("title @p title §l§a恭喜完成踩地雷！");
        player.runCommand(`title @p actionbar §e共花費：§f${MS_timeUsed}§e秒`);
        player.sendMessage("§e[踩地雷] §f遊戲結束！已清除所有地雷");
        player.sendMessage(`§e> 結算時間：§f${MS_timeUsed}§e秒`);
        MS_revealed.fill(true);
    }
}

// 雷射激光發射器
const laser_speed = 3.0;
const max_laser_lifetime = 100;
const laser_particle_type = "minecraft:endrod";
world.afterEvents.itemUse.subscribe((event) => {
    const { source: player, itemStack } = event;
    if (itemStack?.typeId === "minecraft:blaze_rod" && player.getTags().includes("laser_wand")){
        spawnLaser(player);
    } 
})
function spawnLaser(player){
    let location = player.getHeadLocation();
    let direction = player.getViewDirection();
    let lifetime = 0;

    const interval = system.runInterval(() => {
        lifetime++;
        if (lifetime > max_laser_lifetime){
            system.clearRun(interval);
            return;
        }

        let remainingDist = laser_speed;
        let safetyCounter = 0;

        while (remainingDist > 0.01 && safetyCounter < 5){
            safetyCounter ++;
            
            const ray = player.dimension.getBlockFromRay(location, direction, { maxDistance: remainingDist });

            if (ray){
                const hitLoc = {
                    x: ray.block.location.x + ray.faceLocation.x,
                    y: ray.block.location.y + ray.faceLocation.y,
                    z: ray.block.location.z + ray.faceLocation.z
                };

                const distToHit = Math.sqrt(
                    Math.pow(hitLoc.x - location.x, 2) +
                    Math.pow(hitLoc.y - location.y, 2) +
                    Math.pow(hitLoc.z - location.z, 2)
                );

                const pCount = Math.max(1, Math.floor(distToHit / 0.15));
                for (let j = 0; j <= pCount; j++) {
                    const t = j / pCount;
                    player.dimension.spawnParticle(laser_particle_type, {
                        x: location.x + (hitLoc.x - location.x) * t,
                        y: location.y + (hitLoc.y - location.y) * t,
                        z: location.z + (hitLoc.z - location.z) * t
                    });
                }

                const normal = getNormal(ray.face);  // 法向量
                const dot = direction.x * normal.x + direction.y * normal.y + direction.z * normal.z;  // 內積

                direction = {
                    x: direction.x - 2 * dot * normal.x,
                    y: direction.y - 2 * dot * normal.y,
                    z: direction.z - 2 * dot * normal.z
                };

                let offset = 0.1;
                location = {
                    x: (ray.face === "West") ? Math.floor(hitLoc.x) + offset : (ray.face === "East" ? Math.ceil(hitLoc.x) - offset : hitLoc.x + normal.x * offset),
                    y: (ray.face === "Down") ? Math.floor(hitLoc.y) + offset : (ray.face === "Up" ? Math.ceil(hitLoc.y) - offset : hitLoc.y + normal.y * offset),
                    z: (ray.face === "North") ? Math.floor(hitLoc.z) + offset : (ray.face === "South" ? Math.ceil(hitLoc.z) - offset : hitLoc.z + normal.z * offset)
                };

                remainingDist -= distToHit;
            } else {
                const nextLoc = {
                    x: location.x + direction.x * remainingDist,
                    y: location.y + direction.y * remainingDist,
                    z: location.z + direction.z * remainingDist
                };

                const pCount = Math.max(1, Math.floor(remainingDist / 0.15));
                for (let j = 0; j <= pCount; j++) {
                    const t = j / pCount;
                    player.dimension.spawnParticle(laser_particle_type, {
                        x: location.x + (nextLoc.x - location.x) * t,
                        y: location.y + (nextLoc.y - location.y) * t,
                        z: location.z + (nextLoc.z - location.z) * t
                    });
                }

                location = nextLoc;
                remainingDist = 0;
            }
        }
    }, 1);
}
function getNormal(face){
    const normals = {
        "Up": { x: 0, y: 1, z: 0 },
        "Down": { x: 0, y: -1, z: 0 },
        "North": { x: 0, y: 0, z: -1 },
        "South": { x: 0, y: 0, z: 1 },
        "East": { x: 1, y: 0, z: 0 },
        "West": { x: -1, y: 0, z: 0 }
    };
    return normals[face] || { x: 0, y: 1, z: 0 };
}

// 2048
let game2048 = {
    board: Array(16).fill(0),
    score: 0,
    active: false,
    history: [],
    slots: [
        10, 11, 12, 13,
        19, 20, 21, 22,
        28, 29, 30, 31,
        37, 38, 39, 40
    ]
};
function init2048(){ // 初始化
    game2048.board = Array(16).fill(0);
    game2048.score = 0;
    game2048.active = true;
    game2048.startTime = Date.now();
    addRandomB();
    addRandomB();
}
function addRandomB(){
    const emptyCells = game2048.board.map((v, i) => v === 0 ? i : null).filter(v => v !== null); //謝謝AI
    if (emptyCells.length > 0){
        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        game2048.board[randomIndex] = Math.random() < 0.9 ? 2 : 4;
    }
}
function slide(row){
    let arr = row.filter(val => val !== 0);
    for (let i = 0; i < arr.length - 1; i++){
        if (arr[i] === arr[i+1]){
            arr[i] *= 2;
            game2048.score += arr[i];
            arr.splice(i+1, 1);
        }
    }
    while (arr.length < 4) arr.push(0);
    return arr;
}
function checkWin2048(player){
    if (game2048.board.includes(2048)){
        if (game2048.active){
            open2048(player);
            const timeUsed = ((Date.now() - game2048.startTime) / 1000).toFixed(2);
            player.playSound("random.levelup");

            player.runCommand(`title @p title §l§g恭喜通關！`);
            player.runCommand(`title @p subtitle §e達成2048，用時${timeUsed}秒`);
            player.sendMessage(`§e[2048] §f遊戲結束！`);
            player.sendMessage(`§e> 最終分數：§f${game2048.score}`);
            player.sendMessage(`§e> 總共耗時：§f${timeUsed}§e秒`);

            game2048.active = false;
        }
        return true;
    }
    return false;
}
function move(dir, player){
    let preBoard = JSON.stringify(game2048.board);
    for (let i = 0; i < 4; i++){
        let row = [];
        if (dir === "left" || dir === "right"){
            row = [game2048.board[i*4], game2048.board[i*4 + 1], game2048.board[i*4 + 2], game2048.board[i*4 + 3]];
              //AI太神了這個思路整個大優化
            if (dir === "right") row.reverse();
            row = slide(row)
            if (dir === "right") row.reverse();
            for (let j = 0; j < 4; j++) game2048.board[i*4 + j] = row[j]
        } else {
            row = [game2048.board[i], game2048.board[i+4], game2048.board[i+8], game2048.board[i+12]];
            if (dir === "down") row.reverse();
            row = slide(row);
            if (dir === "down") row.reverse();
            for (let j = 0; j < 4; j++) game2048.board[i + j*4] = row[j];
        }
    }
    if (preBoard !== JSON.stringify(game2048.board)){
        addRandomB();
    }
    if (checkWin2048(player)) return;
    open2048(player);
}
function open2048(player){
    const form = new ChestFormData("large")
        .title(`§l2048 - 分數: §1${game2048.score}`)

    for (let i = 0; i < 16; i++){
        const val = game2048.board[i];
        const slot = game2048.slots[i];
        if (val === 0){
            form.button(slot, " ", [], "textures/items/2048_background");
        } else {
            form.button(slot, `${val}`, [], `textures/items/2048_${val}`);
        }
    }

    form.button(8, "重製", [], "textures/items/reset");
    form.button(15, "§l§b上", [], "textures/items/up");
    form.button(23, "§l§b左", [], "textures/items/left");
    form.button(25, "§l§b右", [], "textures/items/right");
    form.button(33, "§l§b下", [], "textures/items/down");
    form.button(53, "返回上一步", [], "textures/items/undo");

    form.show(player).then(res => {
        if (res.canceled) return;
        switch (res.selection){
            case 8:
                init2048();
                open2048(player);
                break;
            case 15:
                saveHistory();
                move("up", player);
                break;
            case 23:
                saveHistory();
                move("left", player);
                break;
            case 25:
                saveHistory();
                move("right", player);
                break;
            case 33:
                saveHistory();
                move("down", player);
                break;
            case 53:
                undo(player);
        }
    });
}
function saveHistory(){
    if (game2048.history.length > 1){
        game2048.history.shift()
    }
    game2048.history.push({
        board: JSON.parse(JSON.stringify(game2048.board)),
        score: game2048.score
    });
}
function undo(player){
    if (game2048.history.length > 0){
        const lastState = game2048.history.pop();
        game2048.board = lastState.board;
        game2048.score = lastState.score;
        open2048(player)
    } else {
        open2048(player);
    }
}