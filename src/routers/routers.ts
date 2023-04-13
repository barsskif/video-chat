import { lazy } from 'react';

const MeetingPlannedForm = lazy(() =>
  import('pages/MeetingPlannedForm/MeetingPlannedForm').then(({ MeetingPlannedForm }) => ({
    default: MeetingPlannedForm,
  })),
);

const ErrorPage = lazy(() =>
  import('pages/ErrorPage/ErrorPage').then(({ ErrorPage }) => ({
    default: ErrorPage,
  })),
);

const GuestAccess = lazy(() =>
  import('pages/GuestAccess/GuestAccess').then(({ GuestAccess }) => ({
    default: GuestAccess,
  })),
);

const MeetingsPlanned = lazy(() =>
  import('pages/MeetingsPlanned/MeetingsPlanned').then(({ MeetingsPlanned }) => ({ default: MeetingsPlanned })),
);

const Registration = lazy(() =>
  import('pages/Registration/Registration').then(({ Registration }) => ({ default: Registration })),
);

const Rooms = lazy(() => import('pages/Rooms/Rooms').then(({ Rooms }) => ({ default: Rooms })));

const SingIn = lazy(() => import('pages/SingIn/SingIn').then(({ SingIn }) => ({ default: SingIn })));

const VideoMeeting = lazy(() =>
  import('pages/VideoMeeting/VideoMeeting').then(({ VideoMeeting }) => ({ default: VideoMeeting })),
);

const MeetingWaiting = lazy(() =>
  import('pages/MeetingWaiting/MeetingWaiting').then(({ MeetingWaiting }) => ({ default: MeetingWaiting })),
);

const OAuthPage = lazy(() => import('pages/OAuthPage/OAuthPage').then(({ OAuthPage }) => ({ default: OAuthPage })));

const ResetPasswordPage = lazy(() =>
  import('pages/ResetPasswordPage/ResetPasswordPage').then(({ ResetPasswordPage }) => ({ default: ResetPasswordPage })),
);

const UserProfilePage = lazy(() =>
  import('pages/UserProfilePage/UserProfilePage').then(({ UserProfilePage }) => ({ default: UserProfilePage })),
);

const MeetingRecords = lazy(() =>
  import('pages/MeetingRecords/MeetingRecords').then(({ MeetingRecords }) => ({ default: MeetingRecords })),
);

const UserChangePassword = lazy(() =>
  import('pages/UserChangePassword/UserChangePassword').then(({ UserChangePassword }) => ({
    default: UserChangePassword,
  })),
);

const UserProfileChange = lazy(() =>
  import('pages/UserProfileChange/UserProfileChange').then(({ UserProfileChange }) => ({ default: UserProfileChange })),
);

const PrivacyPolicy = lazy(() =>
  import('pages/PrivacyPolicy/PrivacyPolicy').then(({ PrivacyPolicy }) => ({ default: PrivacyPolicy })),
);

export const routers = [
  { path: '/', Element: SingIn },
  { path: '/registration', Element: Registration },
  { path: '/guest/:meetingHash', Element: GuestAccess },
  { path: 'meetingWaiting', Element: MeetingWaiting },
  { path: '/ErrorPage', Element: ErrorPage },
  { path: '/gauth', oAuthType: 'google', Element: OAuthPage },
  { path: '/yauth', oAuthType: 'yandex', Element: OAuthPage },
  { path: '/resetPassword', Element: ResetPasswordPage },
  { path: '/privacyPolicy', Element: PrivacyPolicy },
];

export const privateRouters = [
  { path: '/createPlannedMeeting', Element: MeetingPlannedForm },
  { path: '/editPlannedMeeting/:meetingHash', Element: MeetingPlannedForm },
  { path: '/room/:meetingHash', Element: VideoMeeting },
  { path: '/webinar-room/:meetingHash', Element: VideoMeeting },
  { path: '/rooms', Element: Rooms },
  { path: '/planned', Element: MeetingsPlanned },
  { path: '/userProfile', Element: UserProfilePage },
  { path: '/records', Element: MeetingRecords },
  { path: '/changePassword', Element: UserChangePassword },
  { path: '/changeProfile', Element: UserProfileChange },
];
