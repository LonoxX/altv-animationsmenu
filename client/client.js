import * as alt from 'alt-client';
import * as game from 'natives';
import * as notifications from './notifications.js';
import * as NativeUI from './includes/NativeUI/NativeUi.js';
import {AvailableDances, Actions, AvailableWalkstyles, Surrender, standingleaning, Sit, Lay, Sports, Aggressive, Greet} from './includes/emotes.js';
let lastOpenMenu = null;
let selectedItem;
let animation;


const menu = new NativeUI.Menu("Animationsmenü", "", new NativeUI.Point(70, 70));
var banner = new NativeUI.ResRectangle(new NativeUI.Point(0, 0), new NativeUI.Size(0,0), new NativeUI.Color(26, 38, 61, 200)); 
menu.SetRectangleBannerType(banner);
menu.GetTitle().Scale = 0.9;
menu.GetTitle().DropShadow = true;
menu.AddItem(new NativeUI.UIMenuItem("Stop Animation", ""));
menu.ItemSelect.on((item, selectedItemIndex) => {
	if (item instanceof NativeUI.UIMenuItem && item.Text == "Stop Animation") {
		game.clearPedTasks(alt.Player.local.scriptID);
	}
});

function createSubMenu(menuTitle, menuItems) {
  const menuItem = new NativeUI.UIMenuItem(menuTitle, "");
  menu.AddItem(menuItem);
  const subMenu = new NativeUI.Menu(menuTitle, "", new NativeUI.Point(70, 70));
  subMenu.SetRectangleBannerType(banner);
  subMenu.Visible = false;
  subMenu.GetTitle().Scale = 0.9;
  menu.AddSubMenu(subMenu, menuItem);
  menuItems.forEach(element => {
    const subMenuItem = new NativeUI.UIMenuItem(element.name, "");
    subMenu.AddItem(subMenuItem);
  });
  return subMenu;
}

const SurrenderMenu = createSubMenu("Surrender", Surrender);
const GreetMenu = createSubMenu("Greet", Greet);
const ActionsMenu = createSubMenu("Actions", Actions);
const AggressiveMenu = createSubMenu("Aggressive", Aggressive);
const standingleaningMenu = createSubMenu("Stand & Lean", standingleaning);
const SitMenu = createSubMenu("Sit", Sit);
const LayMenu = createSubMenu("Lay", Lay);
const DanceMenu = createSubMenu("Dances", AvailableDances);
const SportsMenu = createSubMenu("Sports", Sports);

//  Gehstile
let menuWalkItem = new NativeUI.UIMenuItem("Walkstyles", "");
menu.AddItem(menuWalkItem);
const WalkMenu = new NativeUI.Menu("Walkstyles", "", new NativeUI.Point(70, 70));
WalkMenu.SetRectangleBannerType(banner);
WalkMenu.Visible = false;
WalkMenu.GetTitle().Scale = 0.9;
menu.AddSubMenu(WalkMenu, menuWalkItem);
AvailableWalkstyles.forEach(element => {
	let WalkItem = new NativeUI.UIMenuItem(element.name, "");
	WalkMenu.AddItem(WalkItem);
});

WalkMenu.ItemSelect.on((item, selectedItemIndex) => {
  if (item instanceof NativeUI.UIMenuItem && selectedItemIndex < AvailableWalkstyles.length) {
    let SelectedWalk = AvailableWalkstyles[selectedItemIndex];
    playWalking(SelectedWalk.anim);
  }
  });


const optionMenu = new NativeUI.Menu("Option Menu", "", new NativeUI.Point(70, 70));
optionMenu.SetRectangleBannerType(banner);
optionMenu.Visible = false;
optionMenu.GetTitle().Scale = 0.9;
optionMenu.AddItem(new NativeUI.UIMenuItem("Play", ""));
optionMenu.AddItem(new NativeUI.UIMenuItem("Save", ""));
optionMenu.AddItem(new NativeUI.UIMenuItem("Return", ""));
optionMenu.ItemSelect.on((item, selectedItemIndex) => {
  if (item.Text === "Play") {
    if (animation === undefined) return notifications.show('Error: Animation not defined', false, 134) ;
    playAnimation(animation.dict, animation.anim, animation.animFlag, animation.duration);
  }else if (item.Text === "Save") {
    optionMenu.Visible = false;
    hotkeyMenu.Visible = true;
  }else if (item.Text === "Return") {
    optionMenu.Visible = false;
    if (lastOpenMenu != null) lastOpenMenu.Visible = true;
  }
});


const hotkeyMenu = new NativeUI.Menu("Hotkeys", "", new NativeUI.Point(70, 70));
hotkeyMenu.SetRectangleBannerType(banner);
hotkeyMenu.Visible = false;
hotkeyMenu.GetTitle().Scale = 0.9;
hotkeyMenu.AddItem(new NativeUI.UIMenuItem("Return", ""));
for (let i = 1; i <= 9; i++) {
  hotkeyMenu.AddItem(new NativeUI.UIMenuItem(`NumPad ${i}`, "Save Animation"));
}

hotkeyMenu.ItemSelect.on((item, selectedItemIndex) => {
  switch (item.Text) {
    case "Return":
      hotkeyMenu.Visible = false;
      if (lastOpenMenu != null) lastOpenMenu.Visible = true;
      break;
    default:
      const numpadKey = parseInt(item.Text.replace("NumPad ", ""));
      alt.LocalStorage.set(`Num${numpadKey}AnimDict`, animation.dict);
      alt.LocalStorage.set(`Num${numpadKey}AnimName`, animation.anim);
      alt.LocalStorage.set(`Num${numpadKey}AnimDuration`, animation.duration);
      alt.LocalStorage.set(`Num${numpadKey}AnimFlag`, animation.animFlag);
      alt.LocalStorage.save();
      notifications.show(`Animation ${animation.name} was saved (NumPad ${numpadKey})`, false, 18);
      break;
  }
  lastOpenMenu = menu;
});

//  Settings
let allMenus = [SurrenderMenu, GreetMenu, AggressiveMenu, SportsMenu, LayMenu, SitMenu, standingleaningMenu, WalkMenu, ActionsMenu, DanceMenu];

alt.on('keyup', (key) => {
  if (key === 114) {
    if (menu.Visible) {
      menu.Close();
      DanceMenu.Close();
      ActionsMenu.Close();
      SurrenderMenu.Close();
      WalkMenu.Close();
      standingleaningMenu.Close();
      SitMenu.Close();
      LayMenu.Close();
      SportsMenu.Close();
      AggressiveMenu.Close();
      GreetMenu.Close();
      optionMenu.Close();
      hotkeyMenu.Close();
    } else {
      menu.Open();
    }
  }
});

alt.on('keyup', (key) => {
  const animationKey = `Num${key - 96}Anim`;
  const animDict = alt.LocalStorage.get(`${animationKey}Dict`);
  const animName = alt.LocalStorage.get(`${animationKey}Name`);
  const animFlag = alt.LocalStorage.get(`${animationKey}Flag`);
  const animDuration = alt.LocalStorage.get(`${animationKey}Duration`);

  switch (key) {
    case 96:
      game.clearPedTasks(alt.Player.local.scriptID);
      break;
    default:
      if (animDict && animName && animFlag && animDuration) {
        game.clearPedTasks(alt.Player.local.scriptID);
        playAnimation(animDict, animName, animFlag, animDuration);
      }
      break;
  }
});

allMenus.forEach(menu => {
	registerItemSelectEvent(menu);
});

function registerItemSelectEvent(menu) {
	menu.ItemSelect.on((item, selectedItemIndex) => {
    switch (menu.Title) {
        case "Surrender":
            animation = Surrender[selectedItemIndex];
            break;
        case "Greet":
            animation = Greet[selectedItemIndex];
            break;
        case "Aggressive":
            animation = Aggressive[selectedItemIndex];
            break;
        case "Sports":
            animation = Sports[selectedItemIndex];
            break;
        case "Lay":
            animation = Lay[selectedItemIndex];
            break;
        case "Sit":
            animation = Sit[selectedItemIndex];
            break;
        case "Stehen & Anlehen":
            animation = standingleaning[selectedItemIndex];
            break;
        case "Dances":
            animation = AvailableDances[selectedItemIndex];
            break;
        case "Actions":
            animation = Actions[selectedItemIndex];
            break;
        case "Sports":
            animation = Sports[selectedItemIndex];
            break;
             
    }

    selectedItem = item;
    lastOpenMenu = menu;
    menu.Visible = false;
    optionMenu.Visible = true;
	});
}

function playAnimation(animDict, animName, animFlag, animDuration) {
    if (animDict == undefined || animName == undefined || animFlag == undefined || animDuration == undefined) return;
    game.requestAnimDict(animDict);
    let interval = alt.setInterval(() => {
        if (game.hasAnimDictLoaded(animDict)) {
            alt.clearInterval(interval);
            game.taskPlayAnim(alt.Player.local.scriptID, animDict, animName, 8.0, 1, animDuration, animFlag, 1, false, false, false);
        }
    }, 0);
}



function playWalking(anim) {
  if (anim == undefined) return;
  if (anim == "normal") {
      game.resetPedMovementClipset(alt.Player.local.scriptID, 0);
      return;
  }
  game.requestAnimSet(anim);
  let interval = alt.setInterval(() => {
      if (game.hasAnimDictLoaded(anim)) {
          alt.clearInterval(interval);
          game.setPedMovementClipset(alt.Player.local.scriptID, anim, 0.2);
      }
  }, 0);
}