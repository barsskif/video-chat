import { DifferentStatesSlice } from 'store/reducers/DifferentStatesSlice';
import { MeetingSlice } from 'store/reducers/MeetingSlice';
import { VideoSettingsSlice } from 'store/reducers/VideoSettingsSlice';
import { useAppDispatch } from './redux';

export const useResetGlobalState = () => {
  const dispatch = useAppDispatch();

  const { reset } = VideoSettingsSlice.actions;
  const { reset: MeetingSliceReset } = MeetingSlice.actions;
  const { reset: DifferentStatesSliceReset } = DifferentStatesSlice.actions;

  const resetGlobalState = async () => {
    await dispatch(reset());
    await dispatch(MeetingSliceReset());
    await dispatch(DifferentStatesSliceReset());
  };
  return [resetGlobalState];
};
