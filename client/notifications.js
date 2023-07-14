import * as alt from 'alt';
import * as native from 'natives';

alt.onServer('notifications:show', show);
alt.onServer('notifications:showWithPicture', showWithPicture);

export function show(
	message,
	flashing = false,
	textColor = -1,
	bgColor = -1,
	flashColor = [0, 0, 0, 50]
) {
	native.beginTextCommandThefeedPost('STRING');

	if (textColor > -1) native.setColourOfNextTextComponent(textColor);
	if (bgColor > -1) native.thefeedSetNextPostBackgroundColor(bgColor);
	if (flashing) {
		native.thefeedSetAnimpostfxColor(
			flashColor[0],
			flashColor[1],
			flashColor[2],
			flashColor[3]
		);
	}

	native.addTextComponentSubstringPlayerName(message);

	native.endTextCommandThefeedPostTicker(flashing, true);
}

export function showWithPicture(
	title,
	sender,
	message,
	notifPic,
	iconType = 0,
	flashing = false,
	textColor = -1,
	bgColor = -1,
	flashColor = [0, 0, 0, 50]
) {
	native.beginTextCommandThefeedPost('STRING');

	if (textColor > -1) native.setColourOfNextTextComponent(textColor);
	if (bgColor > -1) native.thefeedSetNextPostBackgroundColor(bgColor);
	if (flashing) {
		native.thefeedSetAnimpostfxColor(
			flashColor[0],
			flashColor[1],
			flashColor[2],
			flashColor[3]
		);
	}

	native.addTextComponentSubstringPlayerName(message);

	native.endTextCommandThefeedPostMessagetext(
		notifPic,
		notifPic,
		flashing,
		iconType,
		title,
		sender
	);

	native.endTextCommandThefeedPostTicker(flashing, true);
}
