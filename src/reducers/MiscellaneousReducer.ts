import {
  DISMISSED_NOTIFICATION,
  REQUESTED_NOTIFICATION,
  SAVED_REDIRECT,
} from '../events/MiscEvents';
import {FAILED_TO_UPLOAD_AVATAR, SELECTED_AVATAR, UPLOADED_AVATAR} from "../events/UserEvents";

export interface NotificationState {
  message: string;
  shown: boolean;
  type: string;
}


export enum UploadStatus {
  NOT_STARTED, UPLOADING, COMPLETED, FAILED
}
export interface AvatarUploadState {
  uploadStatus: UploadStatus;
}

export interface MiscellaneousState {
  notification: NotificationState;
  redirectPath: string;
  avatarUpload: AvatarUploadState;
}

export const INITIAL_MISC_STATE: MiscellaneousState = {
  notification: {
    message: 'We done goofed.',
    shown: false,
    type: 'warning',
  },
  avatarUpload: {
    uploadStatus: UploadStatus.NOT_STARTED
  },
  redirectPath: '',
};

const MiscellaneousReducer = (
  state: MiscellaneousState = INITIAL_MISC_STATE,
  action: any,
): MiscellaneousState => {
  switch (action.type) {
    case SELECTED_AVATAR:
      return {
        ...state,
        avatarUpload: {
          ...state.avatarUpload,
          uploadStatus: UploadStatus.UPLOADING,
        }
      }
    case UPLOADED_AVATAR:
      return {
        ...state,
        avatarUpload: {
          ...state.avatarUpload,
          uploadStatus: UploadStatus.COMPLETED,
        }
      }
    case FAILED_TO_UPLOAD_AVATAR:
      return {
        ...state,
        avatarUpload: {
          ...state.avatarUpload,
          uploadStatus: UploadStatus.FAILED,
        }
      }
    case DISMISSED_NOTIFICATION:
      return {
        ...state,
        notification: {
          ...state.notification,
          shown: false,
        },
      };
    case REQUESTED_NOTIFICATION:
      return {
        ...state,
        notification: {
          message: action.payload,
          shown: true,
          type: 'info',
        },
      };
    case SAVED_REDIRECT:
      return {
        ...state,
        redirectPath: action.payload,
      };
    default:
      return state;
  }
};

export default MiscellaneousReducer;
