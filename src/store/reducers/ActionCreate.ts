/* eslint-disable */
import api from '../../configs/axios.interceptor';

import { AppDispatch } from '../store';
import { SingInSlice } from 'store/reducers/SingInSlice';
import { RegistrationSlice } from 'store/reducers/RegistrationSlice';
import { MeetingSlice } from 'store/reducers/MeetingSlice';
import { PlannedMeetingSlice } from 'store/reducers/PlannedMeetingSlice';

import { enumLocalStorage, IEditPlannedMeeting, IFetchPlanningMeeting, IPlannedMeeting } from 'types/share';
import { IAddMeeting } from './modelActionCreate';
import { TurnServerSlice } from './TurnServerSlice';
import { errorProcessing } from 'utils/errorProcessing';
import { AxiosError } from 'axios';
import { UserMeetingsRecordsReducer } from './UserMeetingRecordsSlice';

const URL_SSO: string | undefined = import.meta.env.REACT_APP_SSO_SERVER;

const {
  singInFetching,
  singInSuccess,
  singInError,
  guestSingInFetching,
  guestSingInSuccess,
  guestSingInError,
  userFetchSuccess,
  editUserData,
  editAvatar,
  editFetching,
} = SingInSlice.actions;

const { registrationFetching, registrationSuccess, registrationError } = RegistrationSlice.actions;

const {
  meetingFetching,
  meetingFetchSuccess,
  meetingError,
  meetingDeleteSuccess,
  meetingCreateSuccess,
  meetingExistsSuccess,
  guestSubscription,
} = MeetingSlice.actions;

const { MeetingsFetchError, MeetingsFetchSuccess } = UserMeetingsRecordsReducer.actions;

const { turnServerFetching, turnServerError, turnServerSuccess } = TurnServerSlice.actions;

const { fetchAwait, createSuccess, fetchError, editSuccess, fetchOneSuccess, fetchSuccess, deleteSuccess } =
  PlannedMeetingSlice.actions;

export const turnServerFetchingData = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(turnServerFetching());

    const { data } = await api.get('/user/turn');

    dispatch(turnServerSuccess(data.data));
  } catch (error) {
    dispatch(turnServerError(error));
  }
};

export const oAuth = (locale: string, provider: string) => async (dispatch: AppDispatch) => {
  console.log('locale ==> ', locale)
  try {
    dispatch(singInFetching());
    // @ts-ignore
    const data = await api.get(`${URL_SSO}/Auth/${provider}/connect/authorize${locale}`, { disableSendToken: true });
    localStorage.setItem(enumLocalStorage.ACCESS_TOKEN, data.data.data.tokens.accessToken);

    if (data.data.statusCode === 200) {
      const postDataWriterToken = await api.post('/user/login/token', {
        firstname: data.data.data.user.firstname,
      });

      if (postDataWriterToken.data.statusCode === 200) {
        dispatch(singInSuccess(data.data));
      }
    }
  } catch (err) {
    dispatch(singInError(err));
  }
};

export const authorize =
  ({ email, password }: { email: string; password: string }) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(singInFetching());

      // @ts-ignore
      const { data } = await api.post('/user/login', { email, password }, { disableSendToken: true });

      localStorage.setItem(enumLocalStorage.ACCESS_TOKEN, data.data.tokens.accessToken);

      //TODO: Удалить когда появится эндпоинт на получение userData по hash
      localStorage.setItem(
        enumLocalStorage.USER_DATA,
        JSON.stringify({
          userEmail: data.data.user.email,
          userName: data.data.user.userName,
          userId: data.data.user.userId,
        }),
      );

      dispatch(singInSuccess(data.data.user));
    } catch (error: any) {
      const msgError = errorProcessing(error.response.data.description);

      dispatch(singInError(msgError));
    }
  };

export const putEditUserData = (newUserData: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(guestSingInFetching());
    const { data } = await api.put('/user/put', {
      email: newUserData.email,
      firstname: newUserData.name,
      surName: newUserData.surName,
      phoneNumber: newUserData.phoneNumber,
    });

    dispatch(editUserData(data.data.data));
  } catch (error: any) {
    dispatch(singInError(error.message));
  }
};

export const putUploadAvatar = (fomData: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(editFetching());

    // @ts-ignore
    const data = await api.put('/user/put/avatar', { file: fomData }, { formData: true });
    dispatch(editAvatar(data.data));
  } catch (error) {
    console.log('🚀 =====> error', error);
  }
};

export const putEditPassword = async (dataParams: { oldPassword: string; newPassword: string }) => {
  try {
    const data = await api.put('/user/put/password', dataParams);
    return data.data;
  } catch (error) {
    return (error as AxiosError).response?.data;
  }
};

export const loginGuest = (guestName: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(guestSingInFetching());
    // @ts-ignore
    const data = await api.post('/user/login/guest', { guestName }, { disableSendToken: true });

    localStorage.setItem(enumLocalStorage.ACCESS_TOKEN, data.data.data.tokens.accessToken);

    dispatch(guestSingInSuccess(data.data.data));
  } catch (error) {
    dispatch(guestSingInError(error));
  }
};

export const registration =
  ({ name, email, password }: { name: string; email: string; password: string }) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(registrationFetching());

      const data = await api.post(
        '/user/registration',
        { firstname: name, email, password },
        // @ts-ignore
        { disableSendToken: true },
      );
      if (data.status === 200) {
        dispatch(registrationSuccess(data.status));
        window.location.href = '/';
      }
    } catch (error) {
      dispatch(registrationError(error));
    }
  };

export const userFetch = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(singInFetching());

    const response = await api.get('user/info');
    console.log("response", response.headers)
    const {data} = response
    localStorage.setItem(enumLocalStorage.GUEST_NAME, data.firstname);
    dispatch(userFetchSuccess(data));
  } catch (error: any) {
    localStorage.clear();
    sessionStorage.clear();
    const cookieList = document.cookie.split(';');

    for (let i = 0; i < cookieList.length; i++) {
      const cookie = cookieList[i].trim();
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.slice(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
    dispatch(singInError(error.message));
  }
};

//////////////////////////////MeetingSlice////////////////////////////////////////////////////////

export const meetingExists = (hash: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(meetingFetching());

    // @ts-ignore
    const { data } = await api.get(`/meeting/exists?hash=${hash}`, { disableSendToken: true });

    dispatch(meetingExistsSuccess(data.data ? hash : false));
  } catch (error: any) {
    if (error.response.status === 400) {
      const { data } = error.response;
      dispatch(meetingError(data));
      return;
    }

    dispatch(meetingError(error.message));
  }
};

export const meetingConnectWaiting = (hash: string, connectionId: string) => async (dispatch: AppDispatch) => {
  try {
    const { data } = await api.post('/meeting/connect', { hash, connectionId });

    if (data.statusCode === 200) {
      dispatch(guestSubscription(true));
    }
  } catch (error) {
    dispatch(guestSubscription(false));
  }
};

export const meetingFetch = (hash: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(meetingFetching());

    const { data } = await api.get(`/meeting/${hash}`);

    dispatch(meetingFetchSuccess(data.data));
  } catch (error: any) {
    dispatch(meetingError(error.message));
  }
};

export const meetingDelete = (hash: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(meetingFetching());

    const { data } = await api.delete(`/meeting/delete?hash=${hash}`);
    console.log('delete-meeting', data);
    dispatch(meetingDeleteSuccess());
  } catch (error: any) {
    dispatch(meetingError(error.message));
  }
};

export const resetPasswordByMail = async (userEmail: string | undefined) => {
  try {
    const dataToken = await api.post(
      '/user/login/guest',
      // @ts-ignore
      { guestName: userEmail },
      { disableSendToken: true },
    );

    await localStorage.setItem(enumLocalStorage.ACCESS_TOKEN, dataToken.data.data.tokens.accessToken);

    const dataResetPassword = await api.post('/user/forgot');
    if (dataResetPassword.status === 200) {
      localStorage.clear();
      return true;
    }
  } catch (err) {
    return 'Error';
  }
};

export const putNewPasswordByEmail = async (email: string, newPassword: string, code: string) => {
  console.log('new password', newPassword, 'email', email, 'code', code);

  // @ts-ignore
  const dataToken = await api.post('/user/login/guest', { guestName: email }, { disableSendToken: true });

  await localStorage.setItem(enumLocalStorage.ACCESS_TOKEN, dataToken.data.data.tokens.accessToken);

  return await api.put('/user/reset', { newPassword, email, code });
};

export const meetingCreate =
  ({ meetingName, publishers }: IAddMeeting) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(meetingFetching());

                const { data } = await api.post('/meeting/create', {
                    meetingName,
                    publishers,
                    "audiocodec": "opus,isac32"
                });

      dispatch(meetingCreateSuccess(data.data));
    } catch (error: any) {
      dispatch(meetingError(error.message));
    }
  };

///////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////PlannedMeetingSlice/////////////////////////////////////////////////

export const createPlanningMeeting = (data: IPlannedMeeting) => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchAwait());
    await api.post('/planning/create', data);
    dispatch(createSuccess());
  } catch (error: any) {
    dispatch(fetchError(error.message));
  }
};

export const editPlanningMeeting = (data: IEditPlannedMeeting) => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchAwait());
    await api.put('/planning', data);
    dispatch(editSuccess());
  } catch (error: any) {
    dispatch(fetchError(error.message));
  }
};

export const fetchOnePlanningMeeting = (hash: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchAwait());

    const { data } = await api.get(`/planning/${hash}`);

    dispatch(fetchOneSuccess(data.data));
  } catch (error: any) {
    dispatch(fetchError(error.message));
  }
};

export const fetchPlanningMeetings =
  ({ countDay, startDate }: IFetchPlanningMeeting) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(fetchAwait());

      const { data } = await api.get('/planning', { params: { countDay, startDate } });

      return dispatch(fetchSuccess({ ...data, startDate, countDays: countDay }));
    } catch (error: any) {
      dispatch(fetchError(error.message));
    }
  };

export const deletePlanningMeetings = (hash: string) => async (dispatch: AppDispatch, getState: any) => {
  try {
    dispatch(fetchAwait());
    await api.delete(`/planning/delete?hash=${hash}`);

    const { startDate, countDays } = getState().PlannedMeetingReducer;
    const { data } = await api.get('/planning', { params: { countDay: countDays, startDate } });

    return dispatch(deleteSuccess(data.data));
  } catch (error: any) {
    dispatch(fetchError(error.message));
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////////
export const getMeetingRecord = (feedId: number, pageNumber: number) => async (dispatch: AppDispatch) => {
  try {
    const { data } = await api.get(`/meeting/records?userId=${feedId}&pageNumber=${pageNumber}&pageSize=3`);
    if (data.statusCode === 200) {
      dispatch(MeetingsFetchSuccess(data.data));
    }
  } catch (error) {
    dispatch(MeetingsFetchError(error));
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////////

// TODO" сделать для обновления аватарки через гугл
// export const putExternalAvatar = () => async (dispatch: AppDispatch) => {
//   try {
//     const { data } = await api.put('/user/external-avatar');
//     if (data.data.externalAvatarUrl !== null) {
//       dispatch(MeetingsFetchSuccess(data.data));
//     }
//   } catch (error) {
//     dispatch(MeetingsFetchError(error));
//   }
// };

///////////////////////////////////////////////////////////////////////////////////////////////////

// TODO: сделать отправку на почту
// export const postModalForm = (nameUser: string, emailUser: string, commentUser: string) => async () =>{
//   try{

//   }
//   catch(error){

//   }
// }
