import { COLORS_BADGE } from './global-constants.util';

export function getStateBadge(label: string, tooltip?: string) {
  let generalCss =
    'max-w-26 overflow-hidden truncate text-center font-medium p-1.5 rounded-lg text-xs border m-auto ';

  if (label === 'PENDIENTE POR DIRECTOR') {
    label = 'P. POR DIRECTOR';
  }

  let badge = {
    tooltip,
    label,
    css: generalCss + COLORS_BADGE.main,
  };

  if (['ACTIVO', 'FINALIZADO'].includes(label)) {
    badge.css = generalCss + COLORS_BADGE.custom4;
  }

  if (['INACTIVO', 'PENDIENTE'].includes(label)) {
    badge.css = generalCss + COLORS_BADGE.gray;
  }

  if (label == undefined) {
    badge.css = 'hidden';
  }

  return badge;
}

export function getIcon(
  iconName: string,
  tooltip: string,
  permission: boolean
  // action?: string
) {
  let generalCss = 'flex justify-center items-center p-1.5 w-fit rounded-full ';

  let iconObj: any = {
    tooltip: null,
    icon: null,
    css: null,
    // action: null,
  };

  if (permission) {
    iconObj = {
      tooltip,
      icon: iconName,
      css: generalCss + COLORS_BADGE.main,
      // action: action ? action : null,
    };
    if (['edit'].includes(iconName)) {
      iconObj.css = generalCss + COLORS_BADGE.main;
    }

    if (['icDownload', 'icCloudDownload'].includes(iconName)) {
      iconObj.css = generalCss + COLORS_BADGE.green;
    }

    if (['icSchedule', 'icSettingsBackupRestore'].includes(iconName)) {
      iconObj.css = generalCss + COLORS_BADGE.teal;
    }

    if (['icFlight'].includes(iconName)) {
      iconObj.css = generalCss + COLORS_BADGE.purple;
    }

    if (['visibility', 'icChatBubble', 'icContentCopy'].includes(iconName)) {
      iconObj.css = generalCss + COLORS_BADGE.orange;
    }

    if (['icRemoveCircleOutline', 'icReport', 'delete'].includes(iconName)) {
      iconObj.css = generalCss + COLORS_BADGE.red;
    }

    if (['icFileCopy'].includes(iconName)) {
      iconObj.css = generalCss + COLORS_BADGE.yellow;
    }

    if (['icWhatsapp'].includes(iconName)) {
      iconObj.css = generalCss + COLORS_BADGE.whatsapp;
    }
  }

  return iconObj;
}
